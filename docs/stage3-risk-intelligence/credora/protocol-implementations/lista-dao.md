---
sidebar_label: "ListaDAO"
sidebar_position: 2
---

# Lista DAO Implementation

Lista DAO is a permissionless, non-custodial lending protocol deployed on the BNB Chain. The protocol employs a modular vault architecture centred on risk isolation and permissionless market creation. Each market independently configures its own parameters, enabling unconstrained strategy deployment and capital distribution across the protocol.

## Ratings Scale

Vault ratings are expressed on a scale that reflects the aggregate probability of significant loss across all underlying exposures. A higher rating indicates lower risk, with ratings adjusted to reflect both the weighted average risk of individual markets and concentration risk factors. More details on the rating scale can be found in the [DeFi Rating Scale](/docs/stage3-risk-intelligence/credora/methodologies/defi-rating-scale/).

![DeFi Ratins Scale](/img/defiRatingScale.png)

At launch, Vault Ratings are refreshed on a weekly basis and will be updated to refresh daily.

## Rating Framework Structure

Credora's rating framework for Lista DAO employs a bottom-up assessment approach that combines static and dynamic analysis across three hierarchical levels:

1. **Collateral Assets**
   - Simple collateral assets evaluated using the [Tokens Methodology](/docs/stage3-risk-intelligence/credora/methodologies/assets/)
   - LP positions evaluated using the [Liquidity Pools Methodology](/docs/stage3-risk-intelligence/credora/methodologies/liquidity-pools/)
2. **Markets** — evaluated using the [Loan Pairs with Isolated Collateral Methodology](/docs/stage3-risk-intelligence/credora/methodologies/loans_pairs_with/isolated_collateral/)
3. **Vaults** — aggregated exposure to underlying markets, evaluated using the [Vaults Methodology](/docs/stage3-risk-intelligence/credora/methodologies/vaults-pools/)

This modular approach means that vault ratings are a computationally efficient aggregation exercise that can be updated up to daily.

## Collateral Asset Ratings

The assessment of standalone collateral assets is conducted through the [Tokens Methodology](/docs/stage3-risk-intelligence/credora/methodologies/assets/). Asset ratings are published and maintained to ensure the most up-to-date information reflects current market conditions. In the event that Credora does not directly rate an asset, a proxy rating may be defined as an input.

The BNB Chain ecosystem presents a collateral universe materially distinct from Ethereum, with direct implications for oracle classification, volatility modelling, and liquidation liquidity assumptions. BNB functions as the primary base asset on the chain and the foundational collateral unit within the Lista DAO ecosystem. On-chain liquidity for BNB is deep relative to other BNB Chain-native assets; however, it remains shallower than ETH on Ethereum under stressed market conditions — a distinction captured explicitly in the liquidation liquidity curves used in the Probability of Significant Loss (PSL) calculation.

Certain Lista DAO markets, referred to as Smart Lending markets, accept liquidity pool tokens as collateral rather than single standalone assets. These LP positions are evaluated using the [Liquidity Pools Methodology](/docs/stage3-risk-intelligence/credora/methodologies/liquidity-pools/) and are treated distinctly from standalone collateral assets throughout the rating process. A full description of Smart Lending collateral valuation and its implications for market-level risk assessment is provided in the Smart Lending Markets section.

## Market Ratings

In order to deliver a holistic assessment of risk across Lista DAO, Credora utilizes collateral asset probability of default and implied ratings as core inputs into Loan Pair Simulations, which quantify the risk of a bad debt in a given market. Liquidation Simulations are subsequently applied to quantify the risk of loss. The core measurement is the Probability of Significant Loss (PSL), which quantifies the probability of a specific market experiencing bad debt in excess of 1% of principal. Bad debt occurs when a liquidation leaves a borrower with remaining debt and insufficient collateral to cover it. Detailed information about the simulation framework can be found in the [Loan Pairs Methodology](/docs/stage3-risk-intelligence/credora/methodologies/loans_pairs_with/isolated_collateral/).

### Fixed-Rate Markets

Certain Lista DAO markets implement fixed-rate, fixed-term loan structures, offering borrowers the ability to lock in a rate for terms of 7, 14, or 30 days. The fixed rate is priced relative to prevailing market conditions at origination rather than tracking the utilization-based Interest Rate Model dynamically. Early exit prior to term expiry incurs a charge equivalent to 50% of remaining interest on the repaid principal. Upon expiry, the position converts automatically to a flexible rate.

![DeFi Ratins Scale](/img/fixed-market.png)

Despite these structural differences in borrower terms, fixed-rate markets do not introduce a materially distinct risk profile at the vault level relative to their flexible equivalents. The core PSL drivers — collateral asset behaviour, oracle classification, liquidation mechanics, and liquidity depth — are identical across both market types for the same collateral pair. Fixed-rate and flexible markets sharing the same collateral pair are accordingly evaluated under the same methodology.

### Smart Lending Markets

Smart Lending is a structurally distinctive feature of Lista DAO that permits borrowers to use liquidity pool tokens as collateral. Rather than depositing a single asset, the borrower's collateral position is held within an AMM liquidity pool operated by Lista DAO's native DEX. Upon deposit, collateral is routed directly into the relevant pool, where it accrues trading fees. The LP token representing the resulting pool share is subsequently used as the collateral against which the borrower draws a loan.

![DeFi Ratins Scale](/img/dynamic-market.png)

The fundamental departure from standard Lista DAO lending markets lies in collateral valuation. In a standard market, collateral is a single asset with a price supplied by an oracle, and the simulation framework models price paths for that asset directly. In Smart Lending markets, collateral is a pool share whose instantaneous value is a function of both the prices of the underlying assets and the pool's composition at the moment of valuation.

Under the Credora framework, LP positions in Smart Lending markets are treated as a single synthetic token within the simulation process. Price is modeled based on the joint behavior of the two underlying assets. Simulation therefore concentrates on the tail scenario, the probability and severity of a depeg event affecting the asset. The depeg probability and loss-given-depeg distribution are derived using the [Liquidity Pools Methodology](/docs/stage3-risk-intelligence/credora/methodologies/liquidity-pools/), which models the correlation structure of the pair, the historical depth and resilience of the peg mechanism, and the pool's capacity to absorb one-sided outflows without triggering cascading liquidations.

## Vault Ratings

Vaults represent the highest level of the rating framework and are treated as aggregated exposures to underlying markets and assets. Ratings are obtained by applying the [Vaults Methodology](/docs/stage3-risk-intelligence/credora/methodologies/vaults-pools/).

The vault rating aggregation process weights each underlying market exposure based on the vault's allocation to that market. Markets with higher allocations have a proportionally greater impact on the overall vault rating. This determines the Anchor Vault PSL by calculating a weighted average PSL of the markets utilized in the vault.

Vault ratings are expressed on a scale that reflects the aggregate probability of significant loss across all underlying exposures. A higher rating indicates lower risk, with ratings adjusted to reflect both the weighted average risk of individual markets and concentration risk factors. Further detail on the rating scale can be found in the [DeFi Rating Scale](/docs/stage3-risk-intelligence/credora/methodologies/defi-rating-scale/).
