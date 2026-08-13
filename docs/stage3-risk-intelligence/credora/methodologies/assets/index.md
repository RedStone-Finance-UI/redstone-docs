# Assets

_Last updated:_ June 2, 2026

The **Asset Rating Framework** is a layered, integrated set of methodologies that captures the unique characteristics and risks of each asset's structure across a wide range of asset types. Outputs from anchoring methodologies serve as inputs to subsequent layers, ensuring foundational risk evaluations propagate consistently through the broader assessment.

**Default definition.** Probability of Default (PD) is the likelihood that an asset fails to meet its redemption or reserve commitments. In Credora's framework, a default occurs when a token fundamentally fails to maintain necessary reserves or ensure redemption, tied to its Redemption Price. Either of the following qualifies as a default event:

- **Redemption Failure:** eligible holders cannot redeem for a sustained period; two weeks qualifies as default.
- **Reserve Insolvency:** the fair value of reserves is at least 1% below outstanding issuance (circulating supply × Redemption Price) for seven or more consecutive days.

**Loss Definition.** Probability of Significant Loss (PSL) is an annualized probability of a product to experience a loss of 1% or more of principal. PSL is expressed as a percentage and serves as the quantitative basis for Credora's DeFi Rating Scale. A lower PSL indicates a lower likelihood of meaningful capital impairment within a given year. The rating scale is designed to maximize differentiation across DeFi products while remaining easy to read and interpret. As benchmarks, stablecoins such as USDC are assigned an A+ rating, while as of the date of the document Morpho vaults and markets begin at an A rating.

## Asset Categories

Assets are grouped into two primary categories, **Derivative Assets** and **Stablecoins**, with risk methodologies tailored to the structural features of each.

### Derivative Assets

- **Wrapped Tokens** are digital assets pegged to the value of another cryptocurrency, often issued on a different blockchain to enable cross-chain interoperability. WTs are backed by collateral held in custody via smart contracts or centralized entities; the key risks arise from the security and integrity of this custodial structure.
- **Liquid Staking Tokens** represent ownership claims on staked digital assets that support network operations such as transaction validation in exchange for rewards. Beyond smart contract custody risk, LSTs expose holders to validator performance and slashing risk. Slashing, a protocol-enforced penalty for validator misconduct or downtime, can directly reduce the collateral backing the token.
- **Liquid Restaking Tokens** represent ownership claims on Liquid Staking Tokens that have been re-staked across additional protocols to generate incremental yield. LRTs inherit validator and smart contract risks from underlying LSTs while introducing additional layers of complexity. By extending staking across multiple protocols, LRTs compound both reward potential and slashing exposure, heightening sensitivity to validator performance, coordination failures, and governance vulnerabilities.
- **Index Tokens** represent a weighted basket of underlying assets, providing diversified exposure within a single instrument. Examples include cryptocurrency index funds and sector-specific baskets. Key risks arise from rebalancing mechanics, the volatility and liquidity of the underlying constituents, the integrity of the index methodology, and the smart contracts implementing the rebalancing logic.

### Stablecoins

Stablecoins are designed to maintain a stable value, typically pegged to a fiat currency. Their risk profile depends on the mechanism used to preserve price stability, including fiat-backed reserves, tokenized cash equivalents, and alternative collateral structures. Key risks include reserve adequacy, peg maintenance, and resilience under stress.

- **Fiat-Backed Stablecoins** are fully or predominantly backed by reserves held directly in cash and cash-equivalent instruments denominated in the reference fiat currency (e.g., Circle's USDC). Their stability depends on the quality, liquidity, and transparency of these reserves, as well as the operational integrity of the issuing entity.
- **RWA-Backed Stablecoins** are backed by tokenized real-world assets, typically tokenized U.S. Treasury Bills, money market fund shares, or similar instruments, held by the issuer rather than the underlying cash or paper directly. The wrapping layer introduces additional structural considerations: the custodian of the underlying RWA, the redemption mechanics of the wrapper, and the transferability constraints of the held tokens.
- **Active Strategy Stablecoins** maintain price stability while generating yield through actively managed strategies, often delta-neutral positions across decentralized or centralized venues (e.g., Ethena's USDe). Risk exposures arise from strategy execution and the operational soundness of associated trading and custody arrangements.
- **Alternative Asset Stablecoins** are primarily collateralized by non-fiat assets, typically crypto assets held within collateralized debt positions or comparable structures (e.g., Sky's USDS). Their stability relies on loan parameters, liquidation mechanisms, and underlying smart contract infrastructure.

### Tokenized Funds

Tokenized Funds are on-chain representations of pooled investment vehicles, where token holders own beneficial interests in the underlying portfolio. The token represents a pro-rata claim on the fund's net asset value, distinguishing it from stablecoins (which target a 1:1 NAV). Risk profile depends on the asset class held, the legal structure of the fund (registered fund, SPV, trust), and the on-chain wrapper enforcing transfer restrictions and redemption mechanics.

- **Sovereign Debt / Cash Funds** hold U.S. Treasury Bills, repurchase agreements, or government money market fund shares (e.g., BlackRock BUIDL, Franklin Templeton FOBXX). Key risks arise from the regulatory framework of the underlying fund, the bankruptcy-remoteness of the issuer, and the operational reliability of the transfer agent.
- **Fixed Income Funds** hold corporate bonds, mortgage-backed securities, or other fixed-income instruments beyond sovereign debt. Risk exposure includes credit risk of the underlying issuers, interest rate risk, and the liquidity of the portfolio under redemption pressure.
- **Private Credit Funds** deploy capital into off-chain private credit positions — direct lending, asset-backed lending, or trade finance. Key risks arise from underwriting quality, borrower concentration, recovery procedures in default, and the credit risk manager's track record.
- **Active DeFi Yield Strategies** deploy capital across DeFi yield sources (lending markets, liquidity provision, curator-managed vaults). Risk exposure includes strategy execution risk, smart contract risk across the integrated protocols, curator misalignment, and contagion through downstream protocol exposure.
