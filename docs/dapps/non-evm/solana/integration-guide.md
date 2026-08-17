---
sidebar_position: 2
sidebar_label: "Integration Guide"
---

# How to use RedStone on Solana

1. Read firstly the docs from [How to start](../) section
2. See how to [connect to the price feeds](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/solana-connector) in the TypeScript layer
3. The full source of the package is available [here](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/solana-connector/src)

The **info described there** is mostly **NOT REPEATED below**.

## Integration Patterns

RedStone on Solana supports two integration patterns:

### 1. Price Adapter Pattern (Recommended)

Use pre-deployed price feed accounts that are automatically updated by RedStone relayers.

### 2. Pull Model Pattern

Fetch and verify price data off-chain, then pass it to your on-chain program.

---

## Dependencies

### For Rust Programs

Add to your `Cargo.toml`:

```toml
[dependencies]
anchor-lang = "0.30.1"
```

### For TypeScript

```bash
npm install @coral-xyz/anchor @solana/web3.js
```

---

## Using the Price Adapter (Rust)

### Reading Prices

```rust
use anchor_lang::prelude::*;

declare_id!("YourProgramIdHere");

#[program]
pub mod my_program {
    use super::*;

    pub fn use_price(ctx: Context<UsePrice>) -> Result<()> {
        // Read price data from RedStone price feed account
        let price_data = read_redstone_price(&ctx.accounts.price_feed)?;

        // Verify price is fresh (within 5 minutes)
        require!(
            is_price_fresh(&price_data, 300)?,
            ErrorCode::StalePrice
        );

        let price = extract_price_value(price_data.value)?;
        msg!("Current price: {}", price);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct UsePrice<'info> {
    /// CHECK: RedStone price feed account
    #[account(
        constraint = price_feed.owner.to_string() == "REDSTBDUecGjwXd6YGPzHSvEUBHQqVRfCcjUVgPiHsr"
    )]
    pub price_feed: AccountInfo<'info>,
    pub user: Signer<'info>,
}

// Use the helper functions from price-feed-account.md
fn read_redstone_price(account: &AccountInfo) -> Result<PriceData> {
    // Implementation as described in price-feed-account.md
    todo!("Use account_deserialize method from docs")
}

fn is_price_fresh(price_data: &PriceData, max_age_seconds: i64) -> Result<bool> {
    // Check timestamp against current time
    todo!("Compare price_data timestamp with Clock::get()")
}

fn extract_price_value(raw_value: [u8; 32]) -> Result<u64> {
    // Use redstone_value_to_price from price-feed-account.md
    todo!("Implement as shown in price-feed-account.md")
}

#[derive(Clone)]
pub struct PriceData {
    pub feed_id: [u8; 32],
    pub value: [u8; 32],
    pub timestamp: u64,
    pub _reserved: [u8; 64],
}

#[error_code]
pub enum ErrorCode {
    #[msg("Price data is too old")]
    StalePrice,
}
```

### Deriving Price Feed Addresses

```rust
// Use the method from price-feed-account.md
pub fn get_price_feed_address(feed_id: &str) -> Pubkey {
    // Implementation as described in price-feed-account.md
    todo!("Use make_price_seed and find_program_address")
}
```

---

## Using the Price Adapter (TypeScript)

### Reading Prices

```typescript
import { Connection, PublicKey } from "@solana/web3.js";

// Program addresses from price-adapter.md
const REDSTONE_PROGRAM_IDS = {
  mainnet: "REDSTBDUecGjwXd6YGPzHSvEUBHQqVRfCcjUVgPiHsr",
  devnet: "REDuYsnEucMweattdv4xQCYdU1i8Q2W92kdayrpY9rA",
  testnet: "rds8J7VKqLQgzDr7vS59dkQga3B1BotgFy8F7LSLC74",
};

class RedStonePriceReader {
  constructor(
    private connection: Connection,
    private cluster: "mainnet" | "devnet" | "testnet" = "mainnet",
  ) {}

  // Derive address using method from price-feed-account.md
  getPriceFeedAddress(feedId: string): PublicKey {
    // Implementation details in price-feed-account.md
    const programId = new PublicKey(REDSTONE_PROGRAM_IDS[this.cluster]);
    throw new Error("Implement using price-feed-account.md method");
  }

  async readPrice(feedId: string): Promise<number> {
    const address = this.getPriceFeedAddress(feedId);
    const accountInfo = await this.connection.getAccountInfo(address);

    if (!accountInfo) {
      throw new Error(`No price feed found for ${feedId}`);
    }

    // Deserialize using method from price-feed-account.md
    const priceData = this.deserializePriceData(accountInfo.data);
    return this.convertPrice(priceData.value);
  }

  private deserializePriceData(data: Buffer) {
    // Use the deserialization method from price-feed-account.md
    throw new Error("Implement using price-feed-account.md method");
  }

  private convertPrice(rawValue: number[]): number {
    // Use redstone_value_to_price conversion from price-feed-account.md
    throw new Error("Implement using price-feed-account.md method");
  }
}

// Usage
async function example() {
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  const reader = new RedStonePriceReader(connection, "mainnet");

  try {
    const ethPrice = await reader.readPrice("ETH");
    console.log(`ETH price: $${ethPrice}`);
  } catch (error) {
    console.error("Failed to read price:", error);
  }
}
```

---

## Pull Model Integration

For applications that need the freshest data or custom verification.

### TypeScript (Off-chain)

```typescript
import { RedstoneSDK } from "@redstone-finance/protocol";

class RedStonePullModel {
  async getVerifiedPrice(symbol: string) {
    throw new Error("Check GitHub repo for actual implementation");
  }
}
```

### Rust (On-chain)

```rust

pub fn process_redstone_payload(
    ctx: Context<ProcessPayload>,
    payload: Vec<u8>
) -> Result<()> {
    todo!("Check GitHub repo for payload processing")
}
```

---

## Testing

### Sample Deploy

```bash
# If using the redstone-solana-connector package
yarn sample-deploy
```

### Sample Run

```bash
yarn sample-run
```

The sample scripts are available in the [redstone-oracles-monorepo](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/solana-connector).

---

## Network Configuration

| Network | Program ID                                    |
| ------- | --------------------------------------------- |
| Mainnet | `REDSTBDUecGjwXd6YGPzHSvEUBHQqVRfCcjUVgPiHsr` |
| Devnet  | `REDuYsnEucMweattdv4xQCYdU1i8Q2W92kdayrpY9rA` |
| Testnet | `rds8J7VKqLQgzDr7vS59dkQga3B1BotgFy8F7LSLC74` |

For detailed account structure and address derivation, see:

- [Price Feed Account](./price-feed-account.md)
- [Price Adapter](./price-adapter.md)

---

**Last updated:** November 14, 2025
