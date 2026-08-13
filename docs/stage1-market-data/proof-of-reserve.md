---
sidebar_position: 5
sidebar_label: "Proof of Reserve"
---

# Proof of Reserve

A tokenized asset issuer claims a certain level of reserve backing. A Proof of Reserve feed makes that claim verifiable onchain, in real time, by any protocol or user who needs it.

Without onchain PoR, DeFi protocols accepting a tokenized asset as collateral are relying on periodic audit reports, transparency dashboards, or issuer trust. None of these are readable by a smart contract or update fast enough for a liquidation engine.

RedStone Proof of Reserve feeds bridge that gap, taking verified reserve data from the offchain world and publishing it onchain as a cryptographically verifiable price feed.

---

## When to Use a Proof of Reserve Feed

Not every RWA or yield-bearing token needs a PoR feed. RedStone supports three distinct feed types for this category of asset:

**Contract rate feeds** — If the asset's backing is fully onchain (example: stETH by Lido), the price can be derived directly from the asset's smart contract. No offchain attestation is required. This is the simplest and fastest integration path when applicable. Similar logic can also be applied to pricing ERC-4626 funds provided that they are composed entirely of crypto collateral (if they also include RWAs, an additional proof of reserve feed may be needed to arrive at the final price of the vault).

**Proof of Reserve feeds** — For assets with offchain backing (custodied gold, T-bills, bank deposits, exchange-held collateral, fund assets), PoR feeds are the right tool. The backing exists offchain; it needs to be attested and then published onchain.

**Market price feeds** — A secondary market price for an RWA token. Vulnerable to liquidity manipulation and generally not the preferred input for lending markets and risk curators assessing collateral value.

In practice, some assets use more than one feed type simultaneously: a primary PoR or smart contract feed for fundamental valuation and a secondary market feed as a redundancy signal.

---

## How It Works

Proof of Reserve is a two-layer system:

**Layer 1: Offchain attestation.** RedStone connects directly to custodian APIs, exchange APIs, bank statement or fund administrator feeds, and other data sources, or works with third-party attestation partners who do, to verify that the claimed reserves exist. This layer produces a verified reserve value, updated on a configured cadence. This layer can also include liabilities alongside reserves, turning a snapshot of assets into a real-time proof of solvency.

**Layer 2: Onchain publication.** RedStone pulls the verified data from the attestation endpoint and applies additional logic to make sure the data can be used as a price by smart contracts. It then publishes it onchain as a price feed, using the same push model infrastructure as other RedStone feeds. Onchain publication is triggered by a deviation threshold (configurable to fine granularity) and a heartbeat: the feed updates both on a schedule and when the value changes.

For contract rate feeds or pricing ERC4626 vaults with crypto collateral, the attestation layer is replaced by a direct smart contract read. RedStone calls the respective smart contract function and publishes the result on the target chain. No external data partner is needed.

---

## Supported Data Sources

RedStone can ingest reserve data from:

- Custodian and exchange APIs (e.g. for assets held on centralized venues)
- Fund administrator APIs and calculation agent feeds (e.g. CACEIS, third-party NAV services)
- Bank statements and reserve confirmation PDFs
- Exchange price feeds
- Smart contract reads

Integration time is typically under 10 days once the data source or smart contract is available. For more complex custodian or fund administrator setups, this may extend to 2–4 weeks.

---

## Supported Asset Types

RedStone has built PoR and NAV feeds for:

- Tokenized gold and other physical commodities
- Yield-bearing stablecoins backed by TradFi strategies
- Tokenized T-bills and government securities
- Tokenized real estate and infrastructure bonds
- Tokenized corporate bonds and fixed income
- Private credit vaults and bridge loan vehicles
- Quantitative trading strategy vaults (NAV + P&L attestation)
- ERC-4626 vault tokens
- Liquid staking and restaking tokens

---

## Technical Details

**Deviation threshold:** Onchain publication is triggered by price movement beyond a configurable threshold. For assets with irregular pricing patterns (e.g. bonds that move significantly on macro events), this ensures the feed reflects the market without unnecessary updates during stable periods.

**Update frequency:** Attestation partners can provide real-time solvency data updated as frequently as every 15 minutes, including both reserves and liabilities. Onchain publication cadence is configurable.

**Push model:** PoR feeds use RedStone's push architecture and are compatible with standard adapter interfaces.

---

## Privacy-Preserving PoR

Some assets require reserve verification while protecting sensitive underlying data, for example, a trading strategy that needs to prove NAV and exchange exposure to LPs without revealing the strategy logic or asset breakdown.

For these cases, RedStone can deploy computation inside a trusted execution environment (TEE), such as AWS Nitro Enclaves. Exchange API keys are injected into the secure enclave; calculations (NAV, P&L, exposure by exchange, long/short positions) happen inside the enclave without exposing sensitive data to any external party. The resulting attested metrics are then published onchain or delivered to a transparency dashboard.

This approach lets issuers provide verifiable, auditable reporting to LPs and protocols without disclosing proprietary strategy details.

---

## Connection to RedStone Settle

For RWA assets used as collateral in DeFi lending markets, a PoR or NAV feed is a prerequisite for [RedStone Settle](../stage2-capital-efficiency/settle.md). Settle provides an auction-based instant liquidity mechanism for assets with long redemption periods allowing protocols to prevent bad debt without waiting for the issuer's redemption window. The price feed published by RedStone is what triggers and settles the auction.

---

## Reference Implementation

See the [Lombard LBTC feed](../technical-reference/data-quality/lombard-lbtc.md) for a worked example of a continuous Proof of Reserve calculation for a Bitcoin liquid staking token.

---

## Get Started

PoR feed setup is handled directly with the RedStone team. The onboarding process starts with identifying the data source, configuring the attestation layer (or confirming the smart contract interface for Contract Rate feeds), and aligning on update parameters.

[Contact RedStone](https://redstone.finance/contact) to start the process.
