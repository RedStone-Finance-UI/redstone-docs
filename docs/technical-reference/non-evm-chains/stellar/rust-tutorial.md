---
sidebar_position: 3
sidebar_label: "How to use in Rust/Soroban"
---

# Soroban contract—how it is built

1. Read firstly the docs from [How to start](../) section
2. Read the [general philosophy of the on-chain components](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/stellar-connector/stellar/contracts/README.md)
3. The full source of the component is available [here](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/stellar-connector)
4. See the [docs of the _RedStone Rust SDK_](https://docs.redstone.finance/rust/redstone/rust_sdk_3/redstone/index.html)—the component is built on

The **info described there** is mostly **NOT REPEATED below**.

## Dependencies

1. Use the following dependencies to embed _RedStone Rust SDK_ with _soroban_ feature.

```toml
[dependencies]
soroban-sdk = { version = "23.0.3", features = ["alloc"] }
redstone = { git = "https://github.com/redstone-finance/rust-sdk", tag = "3.0.0", default-features = false, features = ["soroban"] }
```

## Using the _RedStone Rust SDK_

### Payload processing

1. The payload bytes should be defined as described [here](https://docs.redstone.finance/img/payload.png).
2. The payload can be generated as described [here](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/radix-connector/scrypto/README.md#preparing-sample-data).

To process the payload data, the following command should be used inside the `#[contractimpl]`.

```rust
use redstone::{
    contract::verification::UpdateTimestampVerifier, core::process_payload,
    network::error::Error as RedStoneError, soroban::helpers::ToBytes, TimestampMillis,
};
```

The function processes on-chain the `payload` passed as an argument and returns an array of aggregated values of each feed passed as an identifier inside `feed_ids`, and a `timestamp` related to the payload data packages.

```rust
fn get_prices_from_payload(
    env: &Env,
    feed_ids: &Vec<String>,
    payload: &Bytes,
) -> Result<(u64, Vec<U256>), RedStoneError> {
    let feed_ids: StdVec<_> = feed_ids
        .into_iter()
        .map(|id| ToBytes::to_bytes(&id).into())
        .collect();
    let block_timestamp = now(env);

    let feed_ids_length = feed_ids.len();
    let mut config = STELLAR_CONFIG.redstone_config(env, feed_ids, block_timestamp)?;
    let result = process_payload(&mut config, payload.to_alloc_vec())?;

    assert!(result.values.len() == feed_ids_length);

    let prices = Vec::from_iter(
        env,
        result.values.iter().map(|feed_value| {
            U256::from_be_bytes(env, &Bytes::from_array(env, &feed_value.value.0))
        }),
    );

    Ok((result.timestamp.as_millis(), prices))
}
```

#### Config

The `Config` structure is described [here](https://docs.redstone.finance/rust/redstone/rust_sdk_3/redstone/core/config/struct.Config.html).
For safety reasons, the allowed `signers` and `signer_count_threshold` are embedded in the `STELLAR_CONFIG` as constants.

Example configs can be found here: https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/stellar-connector/stellar/contracts/redstone-adapter/src/config/mod.rs

#### Current timestamp

Also, the current timestamp in milliseconds is necessary to be passed as the `block timestamp` parameter:

```rust
use redstone::TimestampMillis;
use soroban_sdk::Env;

fn now(env: &Env) -> TimestampMillis {
    TimestampMillis::from_millis(env.ledger().timestamp() * 1000)
}
```

#### Errors

The possible errors thrown during the payload processing can be found [here](https://docs.redstone.finance/rust/redstone/rust_sdk_3/redstone/network/error/enum.Error.html).

By default, the `RedStoneError` doesn't implement `Into<soroban_sdk::Error>`, so the following function is implemented:

```rust
fn error_from_redstone_error(error: RedStoneError) -> Error {
    Error::from_contract_error(error.code().into())
}
```

## Pull model

To use the Pull model, just invoke the `process_payload` function and return values.

```rust
pub fn get_prices(
    env: &Env,
    feed_ids: Vec<String>,
    payload: Bytes,
) -> Result<(u64, Vec<U256>), Error> {
    let (timestamp, prices) =
        get_prices_from_payload(env, &feed_ids, &payload).map_err(error_from_redstone_error)?;

    Ok((timestamp, prices))
}
```

## Push model

### Example storage data

The following `PriceData` struct can be stored for storage keys representing the feed ids:

```rust
#[derive(Debug, Clone)]
#[contracttype]
pub struct PriceData {
    pub price: U256,
    pub package_timestamp: u64,
    pub write_timestamp: u64,
}
```

For the Push model, invoke the `process_payload` function and save the value inside storage.

```rust
pub fn write_prices(
    env: &Env,
    updater: Address,
    feed_ids: Vec<String>,
    payload: Bytes,
) -> Result<(), Error> {
    updater.require_auth();

    // Extend ttl if needed
    // env.storage().instance().extend_ttl(
    //     CONTRACT_TTL_THRESHOLD_LEDGERS,
    //     CONTRACT_TTL_EXTEND_TO_LEDGERS,
    // );

    let verifier =
        UpdateTimestampVerifier::verifier(&updater, &STELLAR_CONFIG.trusted_updaters(env));

    let (package_timestamp, prices) =
        get_prices_from_payload(env, &feed_ids, &payload).map_err(error_from_redstone_error)?;
    let write_timestamp = now(env);

    let db = env.storage().persistent();

    let mut updated_feeds = Vec::new(env);

    for (feed_id, price) in feed_ids.iter().zip(prices.iter()) {
        let price_data = PriceData {
            price,
            package_timestamp,
            write_timestamp: write_timestamp.as_millis(),
        };

        if update_feed(&db, &verifier, &feed_id, &price_data) {
            updated_feeds.push_back(price_data.clone());
        }
    }

   // Process or return updated_feeds, for example by emitting an event

    Ok(())
}
```

We recommend the value verification to be done before updating, by a provided `UpdateTimestampVerifier`:

```rust
fn update_feed(
    db: &Persistent,
    verifier: &UpdateTimestampVerifier,
    feed_id: &String,
    price_data: &PriceData,
) -> bool {
    let old_price_data: Option<PriceData> = db.get(feed_id);

    if verifier
        .verify_timestamp(
            price_data.write_timestamp.into(),
            old_price_data.as_ref().map(|pd| pd.write_timestamp.into()),
            STELLAR_CONFIG.min_interval_between_updates_ms.into(),
            old_price_data
                .as_ref()
                .map(|pd| pd.package_timestamp.into()),
            price_data.package_timestamp.into(),
        )
        .is_err()
    {
        return false;
    }

    db.set(feed_id, price_data);

    // Extend ttl if needed
    // db.extend_ttl(feed_id, FEED_TTL_THRESHOLD, FEED_TTL_EXTEND_TO);

    true
}
```

Then the values can be read by using:

```rust
pub fn read_prices(env: &Env, feed_ids: Vec<String>) -> Result<Vec<U256>, Error> {
    let mut prices = Vec::new(env);

    let db = env.storage().persistent();
    for feed_id in feed_ids {
        let feed_data: PriceData = db.get(&feed_id).unwrap();

        prices.push_back(feed_data.price);
    }

    Ok(prices)
}
```
