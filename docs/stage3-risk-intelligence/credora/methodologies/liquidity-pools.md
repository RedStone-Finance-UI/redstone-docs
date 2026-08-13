---
sidebar_label: "Liquidity Pools Methodology"
sidebar_position: 5
---

# Liquidity Pools Risk Ratings Methodology

## How Liquidity Pools Work

A liquidity pool is a smart contract holding reserves of two or more tokens, enabling users to trade directly against those reserves at any time.

Liquidity pools became popular with the rise of automated market makers (AMMs) such as Uniswap, Curve, PancakeSwap, and Balancer. In an AMM, prices are determined algorithmically using a mathematical formula. The simplest version is the constant product formula:

<p align="center"><strong><em>x × y = k</em></strong></p>

where _x_ – amount of token _X_ in the pool; _y_ – amount of token _Y_ in the pool; _k_ – constant.

When a trader buys token Y, its quantity in the pool decreases while the quantity of X increases, keeping k constant. This shift in the ratio causes Y's price to rise and X's price to fall. The curve adjusts prices continuously as trades occur, meaning neither token can ever be fully drained, though trades at extreme ratios incur severe slippage.

## Methodology Basics

The core principle of LP methodology is that a liquidity pool LP position's risk is determined by the combined risk of its constituent tokens and the platform hosting the pool. This reflects a fundamental property of LP mechanics: a single default event, at the asset or platform level, is sufficient to trigger default of the LP position. For this reason, the Probability of Default (PD) of the underlying assets is calculated as a joint probability, with constituent PDs treated as independent unless a correlation between assets is identified. Once rated, an LP position serves as input for further analysis, such as modeling it as collateral in lending markets.

## Overlapping Risks

LP risk combines the individual risks of each token and the hosting platform. However, when these risks are correlated, meaning one default implies another, simply using the combined probabilities would overstate the true risk. This can occur in two scenarios:

1. **Both tokens in the pool share the same underlying asset:**
   - LP(WETH/wstETH) — native token and its liquid staked derivative
   - LP(WBTC/USDS) — an overcollateralized stablecoin with partial BTC backing paired with its primary collateral asset
2. **The liquidity pool platform is also the issuer of one of the pooled assets:**
   - LP(slisBNB/BNB) on ListaDAO — both the pool and the LST slisBNB are created by Lista DAO
   - LP(crvUSD/USDT) on Curve — both the pool and the stablecoin are created by the same entity

In these scenarios, overlapping risks are excluded to avoid overstating the LP position's PD.

## Example #1

To assess the risk of the USDC/USDe liquidity pool, which is composed of two assets: USDC and USDe. This assessment requires measuring three distinct risks (token and protocol PD percentages displayed are illustrative):

1. PD(USDC), estimated at 0.01% per the Credora Assets Methodology
2. PD(USDe), estimated at 1.00% per the Credora Assets Methodology
3. PD(Uniswap), estimated at 0.20%

From these inputs, we calculate the PD of the liquidity pool:

| PD(USDC) | PD(USDe) | PD(Uniswap) | PD(LP USDC/USDe) | DeFi Rating |
| -------- | -------- | ----------- | ---------------- | ----------- |
| 0.01%    | 1.00%    | 0.20%       | 1.21%            | B+          |

The resulting PD of 1.21% maps to a DeFi Rating of B+. The LP token rating can then be used as an input for further market risk assessment.

## Example #2

Now let's consider a Uniswap V2 sUSDe/USDe position. Since sUSDe is fully backed by USDe, the two assets share the same default risk: if USDe defaults, sUSDe defaults as well. Treating them as independent would double-count the same event. We therefore exclude USDe's standalone PD from the calculation (token and protocol PD percentages displayed are illustrative):

| PD(USDe) | PD(sUSDe) | PD(Uniswap) | PD(LP sUSDe/USDe) | DeFi Rating |
| -------- | --------- | ----------- | ----------------- | ----------- |
| 0.00%    | 1.00%     | 0.20%       | 1.19%             | B+          |

USDe's PD is set to zero here because its risk is already fully captured within sUSDe.
