# Framework Architecture

The framework accommodates the evaluation of a broad spectrum of assets, recognizing that risk exposures differ significantly based on each token's structural components and foundational risks.

**Anchor Methodologies** establish the starting point of each asset assessment in **Probability of Default (PD)** terms. The Anchor PD is then adjusted through a series of modifiers selected based on the asset type. Each metric below is presented with a brief definition, a description of how it is measured, and a tier table containing both the reasoning that supports each tier definition and the empirical evidence that backs the reasoning and the tiering thresholds.

![How an asset's rating is built](/img/howAssetIsBuilt.jpeg)

The framework is structured in three steps:

1. **Asset Categories** — what is being rated. Risk methodologies are tailored to each structure across three families and twelve sub-types (Derivative Assets, Stablecoins, Tokenized Funds).
2. **Anchor Methodologies** — four metrics (Asset Quality, Custody Risk, Audit Quality, Contract Maturity) establish the starting assessment in Probability of Default terms, producing the **Anchor PD**.
3. **Modifiers** — selected by asset type, each adjusts the Anchor PD up or down based on the asset's profile. The result maps to a credit rating.
