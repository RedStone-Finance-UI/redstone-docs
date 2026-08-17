---
sidebar_position: 1
sidebar_label: "Overview"
---

# Stage 1: Market Data

Every protocol in DeFi (lending markets, perpetual exchanges, structured products, prediction markets) needs reliable price data before anything else can work. A lending market that can't determine the value of its collateral cannot safely liquidate. A perp DEX without continuous pricing cannot maintain a mark price. A tokenized asset without verifiable backing cannot be accepted by a risk curator.

Market data is the base layer. Getting it wrong propagates through every other part of the stack.

Different use cases have genuinely different requirements. A lending protocol on Ethereum needs reliable, tamper-resistant prices at regular intervals. A perpetual exchange on MegaETH needs prices arriving faster than blocks are produced. An off-chain risk engine needs a stream it can consume before anything touches a chain. A tokenized gold fund needs proof that the gold actually exists.

A single delivery model cannot serve all of these. RedStone's Stage 1 Stack is a set of distinct products, each designed for a specific class of requirement.

---

## Products

### [Push Model](./price-feeds/push-model.md)

Price data stored on-chain by a relayer, updated on a configured heartbeat and deviation threshold. Compatible with the Chainlink aggregator interface. The standard integration path for lending markets, vaults, and protocols that need always-available onchain prices without modifying transaction logic.

### [Pull Model](./price-feeds/pull-model.md)

Price data injected into the user's transaction at execution time. More gas-efficient than push for protocols where prices don't need to be on-chain continuously. Suitable for applications where the user or protocol triggers price delivery as part of their own transaction.

### [RedStone Bolt](./bolt.md)

A push oracle delivering a new price update every 10ms. Built for high-throughput blockchains where block times fall below the cadence of standard push oracles. Bolt uses the same push interface as standard push feeds, requiring no contract changes. Currently live on MegaETH and Monad.

### [RedStone Live](./live/overview.md)

An off-chain WebSocket data stream covering equities, commodities, FX, indices, and crypto. Designed for perpetual exchanges, synthetic asset platforms, off-chain risk engines, and any use case where real-time data is consumed before it reaches a blockchain. Configurable per feed: rollover methodology, data sourcing, off-hours pricing, custom signing.

### [Proof of Reserve](./proof-of-reserve.md)

Onchain cryptographic verification that a tokenized asset's offchain backing exists and matches the claimed amount. Used by tokenized commodities, stablecoins, private credit funds, and any RWA that needs to be accepted as collateral by a lending market or risk curator. Supports a wide range of attestation methods, including TEE-based computation for privacy-sensitive assets.

---

## How RedStone selects the right product

Prospective integrators are not expected to determine the appropriate product configuration before engaging RedStone. That determination is made collaboratively, based on a technical assessment of the protocol's architecture, target chain, data requirements, risk model, and deployment timeline.

Every integration begins with a scoping conversation. RedStone's team works through the parameters established in the process and designs the configuration accordingly. In many cases, the optimal solution involves multiple products. A tokenized asset, for instance, may require a Proof of Reserve feed for fundamental valuation, a Push feed for the lending market accepting it as collateral, and a Live stream for the offchain risk engine monitoring positions.

Once the appropriate configuration is established, RedStone manages the setup, methodology implementation, infrastructure monitoring, and ongoing maintenance. The integrating team is responsible for the protocol-side integration; RedStone operates the data infrastructure end-to-end.

To begin the scoping process, [contact RedStone](https://redstone.finance/contact) with a description of your integration.
