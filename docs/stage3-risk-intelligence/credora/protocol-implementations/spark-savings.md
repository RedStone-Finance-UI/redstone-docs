---
sidebar_label: "Spark Savings"
sidebar_position: 3
---

# Spark Savings Implementation

Credora publishes live Spark Savings ratings that reflect the current state of collateral composition and market conditions. The latest rating report, including product-level PD/PSL estimates, collateral breakdowns, and risk modifier assessments, is available here:

**Latest Rating Report:** [Spark Savings Rating Report](https://reports.credora.io/spark/latest.pdf)

:::info Live Data Notice
Credora monitors collateral composition and market parameters on a continuous basis. The ratings and PD/PSL figures in this report reflect conditions as of the effective date stated in the report. Reports and API ratings are updated as needed when there are meaningful changes in the underlying factors. Data feeds are controlled internally and ratings may be updated within 24 hours of any material exposure change.
:::

Spark Savings is a suite of yield-generating products from the Spark Protocol that enables users to deposit stablecoins and ETH into **savings vaults**, receiving yield-bearing tokens, such as sUSDS or spETH, that accrue value over time. Yields derive from deploying assets across diversified DeFi strategies, including crypto lending protocols, Real-World Asset (RWA) products, and yield-bearing stablecoins. Allocations managed by the Spark Liquidity Layer (SLL) and separate SubDAOs, which dynamically deploy capital across protocols and blockchains based on predefined strategies and risk parameters approved by Sky Governance.

![Spark risk types](/img/risk-types-spark.png)

Four of the six rated savings products, sUSDS, spUSDC, spUSDT, and spPYUSD, share the same underlying credit exposure, as **user deposits are pooled and deployed through a common collateral portfolio** regardless of entry asset. spETH and stUSDS carry distinct risk profiles and are assessed independently.

## Rating Framework Structure

Credora's Spark Savings rating system employs a bottom-up assessment approach that combines static and dynamic analysis across four hierarchical levels:

1. **Collateral Assets Positions** — evaluated using the [Asset Methodology](/docs/stage3-risk-intelligence/credora/methodologies/assets/)
2. **Lending Markets & Liquidity Pools Positions** — evaluated using the [Lending Markets Methodology](/docs/stage3-risk-intelligence/credora/methodologies/loans_pairs_with/isolated_collateral/) and [Liquidity Pool Methodology](/docs/stage3-risk-intelligence/credora/methodologies/liquidity-pools/)
3. **USDS** — aggregated exposure across all collateral positions
4. **Savings Products** — final product ratings with entry asset and notch adjustments (e.g. liquidity buffer)

To generate a savings product rating, we must first complete the foundational work: rating USDS by assessing the quality of its underlying collateral positions across stablecoins, lending markets, liquidity pools, private credit, and T-bills. Risk modifiers are then applied to the aggregated collateral PD to arrive at the final USDS rating. Finally, product-level adjustments such as idle liquidity buffers and entry asset treatment are applied to produce individual savings product ratings.

Ratings can be updated daily as collateral composition changes.

## Products Overview

There are currently six active Spark Savings products:

| Symbol      | Address                                                | Description                                                                                      |
| ----------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| **sUSDS**   | USDS collateral backing                                | Accrues the Spark Savings Rate, derived from yields generated across Spark's deployed strategies |
| **spUSDC**  | USDS collateral backing with idle USDC buffer          | Same underlying USDS exposure; a portion held idle in USDC to facilitate withdrawals             |
| **spUSDT**  | USDS collateral backing with idle USDC buffer          | Same underlying USDS exposure; a portion held idle in USDT to facilitate withdrawals             |
| **spPYUSD** | USDS collateral backing with idle USDT buffer          | Same underlying USDS exposure; a portion held idle in PYUSD to facilitate withdrawals            |
| **spETH**   | Exposure to ETH market on SparkLend                    | Earns yield by supplying ETH to SparkLend's lending market                                       |
| **stUSDS**  | USDS collateral backing + SKY/USDS lending market risk | Earns interest from an isolated market where SKY holders borrow against staked positions         |

Four of the six savings products derive their risk profile from USDS collateral backing, making the quality of that collateral the central input to the framework.

## USDS Rating

![USDS rating calculation](/img/rating-calc.png)

USDS is a decentralized stablecoin issued by Sky Protocol and **backed by a diversified portfolio of positions** spanning stablecoins, lending markets, private credit, and tokenized real-world assets. Because this collateral composition changes continuously, Credora sources real-time position-level data from the BlockAnalitica API and monitors it daily, automatically recalculating ratings within 24 hours of any material exposure change.

**Data Source:** [BlockAnalitica — Spark Collateral Data](https://open.data.blockanalitica.com/v1/backed/details/)

The assessment begins with an **Anchor Probability of Default (PD)** derived from the credit quality of the collateral portfolio. Then, risk modifiers are added to capture structural and qualitative risks not reflected in the underlying positions alone.

### Collateral Analysis (Anchor PD)

Collateral positions are classified into four categories (Stablecoins, Lending Markets, Private Credit, and T-Bills) and each is assessed using the methodology most appropriate to its structure.

Stablecoins are assessed using the [Asset Methodology](/docs/stage3-risk-intelligence/credora/methodologies/assets/). Liquidity pool positions within this category are assessed using the [Liquidity Pool Methodology](/docs/stage3-risk-intelligence/credora/methodologies/liquidity-pools/), which evaluates smart contract risk, impermanent loss, and the default risk of each underlying asset in the pair. Lending Markets encompass both on-chain positions (SparkLend, Morpho, Aave) and OTC lending positions, assessed using the [Lending Markets Methodology](/docs/stage3-risk-intelligence/credora/methodologies/loans_pairs_with/isolated_collateral/). When Spark supplies assets to external markets, the credit risk of the loan asset is incorporated into the assessment. Private Credit and T-Bills are tokenized real-world asset positions held in custody, both assessed using the Asset Methodology.

![USDS backing categories](/img/spark-chart.png)

The Anchor PD is calculated as the union probability of PSLs across all rated collateral positions, combining the composite credit quality of the underlying portfolio with smart contract custody risk assessed via the Smart Contract Sub-Methodology.

### Risk Modifiers

Notch-based adjustments are applied to the Anchor PD to capture risks not reflected in the collateral assessment itself. These modifiers evaluate the regulatory standing of the issuer, the transparency and governance of reserve management, the legal rights of token holders, the historical stability of the peg, the relative market capitalization of the stablecoin, and the structure of protocol governance and upgrade mechanisms. The full modifier framework is detailed in the [Asset Methodology](/docs/stage3-risk-intelligence/credora/methodologies/assets/).

## Savings Product Ratings

### sUSDS, spUSDC, spUSDT, spPYUSD

The four stablecoin savings products share the same underlying USDS collateral exposure, as deposits are pooled into a common collateral portfolio regardless of entry asset. Each product holds a portion of assets as idle liquidity in the deposited currency to facilitate withdrawals — the size of this buffer varies across products, resulting in slightly different degrees of net exposure to USDS backing risk. Additionally, for lending positions denominated in the user's entry stablecoin, the loan asset PD is excluded from the assessment, since that default risk is already assumed at the point of deposit.

:::note
This assessment does not incorporate the probability of default of the deposited asset itself. Holders of spUSDC, spUSDT, or spPYUSD retain exposure to their single deposited asset. For USDS we assume that users who enter with USDS retain the flexibility to redeem into multiple supported assets on exit.
:::

### spETH

spETH is an ETH-based savings vault. Approximately 90% of deposited assets are supplied to SparkLend's ETH lending market for yield generation, with the remaining 10% held idle for liquidity and redemptions. The risk of spETH derives primarily from the SparkLend ETH lending market, assessed using the [Lending Markets Methodology](/docs/stage3-risk-intelligence/credora/methodologies/loans_pairs_with/isolated_collateral/).

The rating measures the incremental credit risk of holding spETH relative to holding ETH directly and does not incorporate ETH price depreciation risk.

![spETH final rating](/img/final-rating-spark.png)

### stUSDS

stUSDS earns enhanced yield by depositing USDS into an isolated lending market where SKY governance token holders borrow against their staked positions. The rating measures the incremental credit risk of this lending market exposure; it does not incorporate USDS default risk.

The market simulation incorporates the following inputs:

- **Collateral asset characteristics** — price volatility and on-chain liquidity available for liquidation execution
- **Market parameters** — LLTV, Liquidation Incentive Factor (LIF), and oracle type
- **Borrower position distribution** — allocation of debt across LTV bands, determining exposure to liquidation cascades
- **DEX liquidity** — available depth across venues, assessed against the scale of positions that may require liquidation

stUSDS earns enhanced yield by depositing USDS into an isolated lending market where SKY governance token holders borrow against their staked positions. The rating measures the incremental credit risk of this lending market exposure and does not incorporate USDS default risk.

The market simulation incorporates collateral asset characteristics including price volatility and available on-chain liquidity, alongside market parameters such as LLTV, Liquidation Incentive Factor (LIF), and oracle type. Borrower position distribution across LTV bands is analyzed to assess exposure to liquidation cascades, and DEX liquidity depth is evaluated against the scale of positions that may require simultaneous liquidation. Detailed information about the simulation methodology can be found in the [Lending Markets Methodology](/docs/stage3-risk-intelligence/credora/methodologies/loans_pairs_with/isolated_collateral/).

## Ratings Scale

Savings product ratings are expressed on Credora's standardized DeFi Rating Scale and reflect the annualized Probability of Significant Loss (PSL), defined as a 1% loss of principal. A higher rating indicates lower risk. Ratings are refreshed on a weekly basis and will be updated to refresh daily.

More details on the rating scale can be found at [DeFi Rating Scale](/docs/stage3-risk-intelligence/credora/methodologies/defi-rating-scale/).
