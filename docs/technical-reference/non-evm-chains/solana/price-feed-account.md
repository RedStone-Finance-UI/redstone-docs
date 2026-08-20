---
sidebar_position: 1
sidebar_label: "Price Feed Account"
---

# RedStone Price Feed Account

## Structure

The structure of each Price Feed Account is defined as follows:

```rust
#[account]
pub struct PriceData {
    pub feed_id: [u8; 32], // right-zero-padded byte-list representing the feed-id ascii bytes
    pub value: [u8; 32], // big-endian encoded byte-list representing the u256-value (multiplied by 10^decimals)
    pub timestamp: u64, // in milliseconds - represents the unified RedStone data timestamp
    pub write_timestamp: Option<u64>, // in milliseconds - the timestamp of the slot the data is written in
    pub update_slot: u64, // slot number the data is written in
    pub decimals: u8, // for now, for RedStone prices, it's equal to 8
    _reserved: [u8; 64] // reserved structure bytes
}
```

## Reading

### Deserializing

The following generic method can be used for deserializing any Solana account, as the `PriceData`:

```rust
use anchor_lang::prelude::*;
use anchor_lang::Discriminator;

pub fn account_deserialize<T: AccountDeserialize + Discriminator>(
    account: &AccountInfo<'_>,
) -> T {
    let data = account.clone().data.borrow().to_owned();
    let discriminator = data.get(..8).unwrap();
    if discriminator != T::discriminator() {
        panic!(
            "Expected discriminator for account {:?} ({:?}) is different from received {:?}",
            account.key(),
            T::discriminator(),
            discriminator
        );
    }
    let mut data: &[u8] = &data;

    T::try_deserialize(&mut data).unwrap()
}
```

### Reading Price Value

The value of the price is encoded as a BigEndian byte list of length 32.
Example conversion to `u64` (which can overflow for huge values) is described below.

```rust
fn redstone_value_to_price(raw_be_value: [u8; 32]) -> Result<u64> {
    if !raw_be_value.iter().take(24).all(|&v| v == 0) {
        warn!("Price overflow u64");
        return Err(...); // OVERFLOW
    }

    u64::from_be_bytes(raw_be_value[24..].try_into().unwrap())
}
```

> ⚠️ Remember, the value is multiplied by `10^decimals`.

### Example usage

```rust
#[program]
pub mod test_usage {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let price_data: PriceData = account_deserialize(&ctx.accounts.price_info);

        let value = redstone_value_to_price(price_data.value);
        msg!("FeedId: {:?}, {:?}", price_data.feed_id, value);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    /// CHECK: ...
    #[account()]
    pub price_info: AccountInfo<'info>,
}
```

## Deriving Account Addresses

To derive the public key of the account, use the following snippets.

### Rust

Use the following seeds representing `"price"`-constant string and the `feed_id`:

```rust
type FeedIdBs = [u8; 32];  // right-zero-padded byte-list representing the feed-id ascii bytes
const PROGRAM_ID: &str = "REDSTBDUecGjwXd6YGPzHSvEUBHQqVRfCcjUVgPiHsr";

fn make_price_seed() -> [u8; 32] {
    let mut seed = [0u8; 32];
    seed[0..5].copy_from_slice(b"price");

    seed
}

fn price_feed_account_pubkey(feed_id: &FeedIdBs) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[
        &make_price_seed(), feed_id
    ], &Pubkey::from_str(PROGRAM_ID).unwrap())
}
```

### TypeScript

```ts
const PROGRAM_ID = new PublicKey("REDSTBDUecGjwXd6YGPzHSvEUBHQqVRfCcjUVgPiHsr");
const FEED_ID = "ETH";

const makeFeedIdBytes = (feedId: string) => {
  return Buffer.from(feedId.padEnd(32, "\0"));
};

const makePriceSeed = () => {
  return Buffer.from("price".padEnd(32, "\0"));
};

const seeds = [makePriceSeed(), makeFeedIdBytes(FEED_ID)];

const address = PublicKey.findProgramAddressSync(seeds, PROGRAM_ID)[0];
```

## Price Feed Account List

The existing Price Feed Account list is available here:

https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/solana-connector/deployments/solanaMultiFeed/programs#feed-accounts
