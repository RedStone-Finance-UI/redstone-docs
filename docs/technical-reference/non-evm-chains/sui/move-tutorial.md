---
sidebar_position: 1
sidebar_label: "How to use in Move"
---

# Sui contract — how it is built

1. Read firstly the docs from [How to start](../) section
2. Read the [contract documentation](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/sui-connector/sui/contracts/price_adapter/README.md)
3. The full source of the component is available [here](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/sui-connector/sui/contracts)

The **info described there** is mostly **NOT REPEATED below**.

## How RedStone Works on Sui

RedStone uses an alternative design for providing oracle data to smart contracts. Instead of continuously persisting data in the contract's storage, data stays off-chain in RedStone's decentralized cache layer until it's needed. An off-chain relayer periodically writes the aggregated, signature-verified value for each feed into a shared `PriceData` object inside the `PriceAdapter` contract, which your contract then reads directly.

The list of feeds currently supported on Sui, together with their update parameters (heartbeat, deviation threshold), is available in the [RedStone App](https://app.redstone.finance/push-feeds?networks=sui).

## Contract Interface

The `PriceAdapter` module ([`price_adapter`](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/sui-connector/sui/contracts/price_adapter/sources)) exposes the following read-only view functions:

```move
public fun price(price_adapter: &PriceAdapter, feed_id: vector<u8>): u256
public fun timestamp(price_adapter: &PriceAdapter, feed_id: vector<u8>): u64
public fun price_and_timestamp(price_adapter: &PriceAdapter, feed_id: vector<u8>): (u256, u64)
public fun price_data(price_adapter: &PriceAdapter, feed_id: vector<u8>): &PriceData
```

None of these mutate the shared object — they return whatever RedStone last wrote for the given `feed_id`. Values are `u256`, encoded with 8 decimals.

> ⚠️ `feed_id` is passed as the byte-representation (`vector<u8>`) of the feed's string identifier — for example, `x"4254430000..."` for `BTC`.
>
> The identifier is **zero-padded on the right to 32 bytes** (this matches `makeFeedIdBytes` in [`@redstone-finance/sui-connector`](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/sui-connector/src/util.ts)) — passing the raw, unpadded string bytes will not match the stored key and the call will abort with `E_INVALID_FEED_ID`. For `"BTC"`, the correct literal is:
>
> ```move
> const BTC_FEED_ID: vector<u8> =
>     x"4254430000000000000000000000000000000000000000000000000000000000";
> ```

## Deployed Addresses (suiMultiFeed, mainnet)

- PriceAdapter object (shared, stable across upgrades): `0x22794c3a37c5320e5acb6b9cdba6e256bc08867e9de8afd2a4b5d8ea7061fea3`
- Current package ID: `0xbd6c028d49d92e7e7f5cf268a2c91c0551f20a3d1f79d27d02482a71a9eb6ac3`

The package ID changes across upgrades; the `PriceAdapter` object ID does not — always resolve feeds through the object ID.

Add the package as a dependency in your `Move.toml`:

```toml
[dependencies]
redstone_price_adapter = { git = "https://github.com/redstone-finance/redstone-oracles-monorepo", subdir = "packages/sui-connector/sui/deployments/suiMultiFeed/price_adapter", rev = "main" }
```

## Example

A minimal module that reads the BTC price and uses it as a guard condition:

```move
module example::price_consumer {
    use redstone_price_adapter::price_adapter::{Self, PriceAdapter};

    const BTC_FEED_ID: vector<u8> =
        x"4254430000000000000000000000000000000000000000000000000000000000";

    const EPriceTooLow: u64 = 0;

    public fun get_btc_price(price_adapter: &PriceAdapter): (u256, u64) {
        price_adapter::price_and_timestamp(price_adapter, BTC_FEED_ID)
    }

    public fun assert_btc_above(price_adapter: &PriceAdapter, threshold: u256) {
        let price = price_adapter::price(price_adapter, BTC_FEED_ID);
        assert!(price > threshold, EPriceTooLow);
    }
}
```

Since `redstone_price_adapter` is already published on mainnet, `Move.toml` links your package against the existing on-chain bytecode instead of redeploying it — `sui move build` only needs to compile your own module.

## Testing without publishing

View functions can be exercised against the live mainnet `PriceAdapter` object without publishing anything, using a dev-inspect (simulated, no gas spent, no state change):

```bash
sui client ptb --dev-inspect \
  --move-call 0xbd6c028d49d92e7e7f5cf268a2c91c0551f20a3d1f79d27d02482a71a9eb6ac3::price_adapter::price \
  @0x22794c3a37c5320e5acb6b9cdba6e256bc08867e9de8afd2a4b5d8ea7061fea3 \
  "vector[66,84,67,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]"
```

To call your own module's functions this way, you first need a package ID, which only exists once the package is published on-chain — `sui move build` alone does not produce one.
