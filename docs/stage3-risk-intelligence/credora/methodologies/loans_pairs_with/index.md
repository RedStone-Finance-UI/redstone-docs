# Definition and Scope of Loan Pairs

**Represent the fundamental unit of credit exposure, defined as a discrete loan–collateral pair.**

A loan-pair is either explicitly structured by protocol design, where a single collateral type backs borrowing of a single asset over a market, or analytically segmented from multi-collateral systems into equivalent loan–collateral pairs for consistent risk assessment.

## Decomposing Pooled and Multi-Collateral Systems

Protocols like **Morpho** implement an isolated architecture, where each market operates as a self-contained pair with distinct collateral relationships and independent risk boundaries.
In contrast, **Aave** and its forks (including **SparkLend**) operate as pooled lending systems. In these systems, all deposits, withdrawals, borrows, and repayments for each asset occur within a single global pool. Unlike isolated markets, these actions are interconnected—occurring in the same pool as other users' activities—which enables efficient matching between lenders and borrowers. Similarly, **Euler** constructs interconnected Vault Networks that create comparable interdependencies.

Within these pooled systems, multiple loan-collateral relationships can exist. For analytical consistency, each position can be decomposed and grouped into virtual portfolios of loan-collateral exposures, creating a list of loan pairs according to Credora's definition.

To analyze these interconnected systems, the methodology constructs "virtual loan-pairs" - analytical constructs that aggregate all positions linking one borrowed asset to each collateral asset. For instance, all positions borrowing USDC against ETH collateral constitute one virtual pair, while USDC borrowed against wBTC forms another. Although these virtual pairs may not exist on-chain, they are essential for risk decomposition. Each pair captures aggregate exposure, weighted loan-to-value (LTV) distributions, and concentration risk for that specific borrow-collateral relationship. This decomposition transforms complex unified pools or vault networks into analyzable components while preserving the systemic interactions between them.
Furthermore, certain protocols support multi-collateral borrowing, where active loans can be attributed to multiple collateral assets. In these cases, positions can be decomposed into combinations of loan pairs.

_Across all implementations, pairs share common structural functions: they define collateralization requirements, govern interest rate mechanisms, set liquidation thresholds, and ultimately determine the credit and liquidity risk parameters of the lending portfolios they compose._

## Simulation Framework

To deliver comprehensive risk assessments across these constructs, Credora calculated the **collateral asset probability of default (PD)** and **outstanding loan risk** (for rehypothecated markets) as core inputs for **Pair Simulations**, which quantify liquidation and bad debt risks. The primary metric is the **Probability of Significant Loss (PSL)**, which measures the likelihood of a market experiencing bad debt exceeding 1% of principal. Bad debt occurs when liquidation leaves a borrower or account with residual debt but insufficient collateral to cover it.

_Conceptually, simulations establish the Anchor PSL for a specific market, after which a set of modifiers are applied to calculate a Final PSL and implied rating per market._
