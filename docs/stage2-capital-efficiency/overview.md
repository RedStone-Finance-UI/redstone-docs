---
sidebar_position: 1
sidebar_label: "Overview"
---

# Stage 2: Capital Efficiency

Stage 1 delivers price data. Stage 2 addresses what happens after that data arrives.

Two structural problems keep capital underutilized in DeFi lending. The first issue is value leakage: when a price update triggers a liquidation, the liquidation bonus is captured by MEV bots rather than the protocol that generated the oracle update. The second one is a settlement gap: tokenized real-world assets carry redemption windows ranging from 30 days to several years, while DeFi liquidations require instant settlement. As a result, most institutional RWA collateral cannot be listed on lending markets regardless of its credit quality.

Stage 2 addresses both problems.

---

## Products

### [RedStone Atom](./atom/what-is-atom.md)

Oracle Extractable Value (OEV) capture for DeFi-native collateral. Instead of publishing a price update and letting bots race to liquidate, Atom runs an offchain auction before the price goes onchain. The winning solver executes the liquidation atomically with the price update, and the auction proceeds flow back to the protocol. No contract changes required; activates on any existing RedStone feed.

### [RedStone Settle](./settle.md)

An auction-based instant liquidity mechanism for RWA collateral. When a position needs to be liquidated, Settle runs an offchain auction among whitelisted liquidity providers. The winner delivers liquid collateral to the protocol at T+0 and holds the RWA through its redemption window. Collateral that was previously unlistable due to redemption timeline constraints becomes viable for DeFi lending, without requiring changes to the underlying asset or its issuer's operations.

---

## How They Fit Together

Atom and Settle solve different parts of the same problem. Atom recovers value from DeFi-native liquidations. Settle makes RWA-backed positions liquidatable at all. Together they form the capital efficiency layer of the RedStone Stack.

RedStone Settle can work on any market regardless of its oracle setup. However, both products work better when RedStone is the price oracle for the market they operate on. This is architectural: both depend on the oracle controlling the timing of onchain price submission, which enables atomic settlement and eliminates front-running.

[Contact RedStone](https://redstone.finance/contact) to discuss integration.
