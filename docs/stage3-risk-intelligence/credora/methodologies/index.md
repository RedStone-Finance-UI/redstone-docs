# Methodologies

By publicizing and openly developing methodologies, Credora aims to foster industry collaboration and elevate market standards.

Credora plays a role in guiding the development of the methodologies and is committed to upholding the following best practices:

- Aim to establish consensus on methodology changes, considering a diverse range of views.
- Present analysis and evidence as required for community consideration.
- Guide the community towards measuring and prioritizing improvement in the performance of the outputs.

The documentation begins with the **Asset Rating Framework**, which establishes foundational risk assessments for individual assets—including derivative assets (wrapped, liquid staking, liquid restaking, and index tokens), various stablecoin types, and tokenized funds—by calculating a Probability of Default (PD) through anchor methodologies and risk modifiers.

Then framework then evaluates lending market constructs at increasing levels of complexity: **isolated collateral markets** (loan pairs) found in protocols like Morpho, which use Monte Carlo simulations to calculate Probability of Significant Loss (PSL) for single collateral-loan relationships; **rehypothecated markets** in unified lending pools like Aave and SparkLend, which employ two-step simulations to capture the recursive risk effects when collateral is reused across multiple positions; and finally **vaults or aggregator pools**, which function as managed portfolios deploying capital across multiple markets, incorporating curator expertise and governance quality into the risk assessment.
