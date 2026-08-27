---
sidebar_position: 1
sidebar_label: "Overview"
---

# Stage 3: Risk Intelligence

Stage 1 provides prices. Stage 2 makes the collateral liquid. Stage 3 answers the question neither addresses: how creditworthy is the collateral itself?

Overcollateralization is DeFi's primary risk management mechanism. A borrower posting 150% collateral against a loan creates a buffer against price swings, but the underlying credit quality of the collateral is not assessed. A private credit fund accepted at 70% LTV may have deteriorating underlying loans. A tokenized bond backed by a single issuer may carry concentration risk. Price feeds do not deliver credit signals. Stage 3, the risk intelligence layer, does.

---

## Products

### [Credora](./credora/overview.md)

Credora monitors the credit quality of underlying portfolios continuously, publishes ratings onchain, and updates them as conditions change. Ratings are built on methodologies that translate to traditional equivalents, giving risk curators and lending protocols an independent, verifiable signal about what they are lending against.

For curators listing a new RWA as collateral, Credora provides the due diligence signal that a NAV or price feed alone cannot. For liquidity providers deciding whether to participate in a Settle auction, it provides an independent assessment of asset quality. For the DeFi ecosystem broadly, it introduces ongoing credit underwriting as a native component of the lending stack.

---

## Where Stage 3 Fits in the RedStone Stack

Credora ratings become most useful when combined with the rest of the RedStone infrastructure. A PoR feed confirms that backing exists. A price feed values the asset. A Credora rating assesses the credit quality of what is behind it. Settle provides the exit mechanism if a position needs to be liquidated. Each layer depends on the others; the risk intelligence layer is what allows the full stack to support institutional-grade collateral at appropriate risk parameters.

[Contact RedStone](https://redstone.finance/contact) to discuss integration.
