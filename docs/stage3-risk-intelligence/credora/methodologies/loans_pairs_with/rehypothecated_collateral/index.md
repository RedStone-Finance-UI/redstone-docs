# Loan Pairs with Rehypothecated Collateral

_Markets with rehypothecated collateral include Loan-Collateral Pairs from SparkLend Liquidity Markets, AAVE Markets, and Euler vault clusters, among others. These markets feature rehypothecated collateral assets, where collateral deposited in one market can be reused elsewhere within the system._

This approach rates borrowable assets through position-level analysis and Monte Carlo simulations, with special consideration for rehypothecation effects and protocol-specific parameters such as efficiency modes (E-mode) or isolated lending pairs.

Pool-based lending protocols enable users to lend and borrow various crypto assets through features designed to enhance capital efficiency and risk management. Each position is decomposed and grouped into virtual portfolios of loan-collateral exposures, where the collateral can be rehypothecated. This methodology analyzes risk through a two-step simulation process that captures the recursive impact of Probabilities of Significant Loss (PSL) at the vault or pool level arising from rehypothecation risks.

## Risk Simulations in Rehypothecated Collateral

When evaluating risk in rehypothecated markets, we must consider both the direct risk of **collateral defaulting** and the **outstanding loan risk**, which represents cascading effects when that collateral is borrowed elsewhere in the system. When collateral serves as a borrowed asset for another position, we must incorporate the likelihood of that subsequent loan defaulting—which depends on its own collateral—creating recursive dependencies throughout the system.

### Step 1: Calculate Outstanding Loans Risk

The first simulation step calculates the Probability of Significant Loss (PSL) for each virtual loan pair under the assumption that collateral assets are “static”—temporarily disregarding their potential use as borrowed assets elsewhere. Monte Carlo simulations model price movements across all assets, determining when positions would be liquidated based on health factors.

For each virtual loan pair (such as USDC borrowed against ETH), the methodology quantifies both the probability and magnitude of losses from liquidation failures. This establishes a baseline risk assessment for each collateral–borrow pair in isolation and follows the same methodology described in [Loan Pairs without Rehypothecation](/docs/stage3-risk-intelligence/credora/methodologies/loans_pairs_with/isolated_collateral/).

### Step 2: Recursive Risk Integration

The second step captures rehypothecation effects by incorporating the PSLs calculated in Step 1 as enhanced **Probability of Default (PD)** inputs for collateral assets, then re-running loan pair simulations with these augmented collateral PDs.

#### Collateral Risk = Collateral Default Risk + Outstanding Loans Risk

For example, when ETH serves as collateral while simultaneously being borrowed elsewhere in the system, its effective risk extends beyond mere price volatility—it encompasses the risk that positions borrowing ETH might default, potentially making the ETH unavailable or impaired when needed for liquidations.

This step recalculates PSLs using these adjusted collateral risks, capturing how risk propagates throughout the entire chain. The recursive nature ensures that cascading effects are properly modeled: if heavy borrowing of ETH creates risk, and that ETH backs USDC loans, which in turn back DAI loans, the methodology traces this risk throughout the entire chain.

## Notch Modifiers

The methodology incorporates a series of notch modifiers to adjust final asset ratings based on qualitative and protocol-specific considerations.

### At the pair market level

- **Oracle Notch Adjustment:** Reflects the quality and reliability of price feeds
- **Protocol Adjustment:** Captures smart contract custody and operational risk specific to each protocol

### At the vault/pool level

- **Curator Adjustment:** Represents oversight and governance contribution from protocol DAOs or risk managers
- **Guardian and Governance Adjustment:** Accounts for protocol-level risk management and decision-making quality

## Final PSL

The final ratings for each borrowable asset emerge from aggregating risk across all virtual loan pairs where that asset is borrowed. For USDC lenders, the rating reflects the weighted risk across all collateral types backing USDC borrows, adjusted for rehypothecation effects discovered in Step 2.

This approach ensures that while protocols may operate as unified pools or interconnected vaults, the methodology can still provide asset-specific risk ratings that accurately reflect both direct exposure and systemic interconnection risks.
