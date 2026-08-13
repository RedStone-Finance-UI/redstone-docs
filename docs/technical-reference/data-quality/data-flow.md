---
sidebar_position: 1
sidebar_label: "Data flow"
---

# Data flow

## Data Sources

RedStone implements a distributed data sourcing framework ensuring operational continuity through strategic redundancy across multiple provider categories, protecting against both temporary outages and potential data manipulation.

### Source Categories

#### Centralized Exchange Integration

The system maintains direct integration with over 30 premier cryptocurrency exchanges and derivatives platforms, including industry leaders such as Binance, Coinbase, OKX, Bybit, and Kraken, facilitating comprehensive price discovery across established trading venues.

#### Decentralized Protocol Implementation

Integration with more than 50 on-chain trading protocol deployments spans multiple blockchain networks, incorporating major automated market makers and decentralized exchanges including Uniswap, Curve Finance, Balancer, Aerodrome, and Camelot, ensuring broad cross-chain price validation.

#### Aggregator Service Integration

The framework incorporates data from professional market intelligence providers specializing in cross-source data aggregation, including established entities such as Kaiko, CoinMarketCap, and trading venues, supplementing direct exchange feeds with consolidated market metrics.

#### Institutional Data Provider Network

The system maintains secure API connections with specialized off-chain institutions that provide pricing data for sophisticated financial instruments, including exchange-traded funds (ETFs) and tokenized traditional assets, ensuring comprehensive coverage of emerging digital asset classes.

## Data Fetching

The data is fetched through a distributed network of provider nodes maintained by independent organizations and entities, strategically positioned across multiple geographic locations. This multi-operator architecture establishes a resilient infrastructure that mitigates single points of failure, operator collusion risks, and regional network disruptions. Each logical node operates in a high-availability configuration, consisting of a master instance and synchronized shadow instances that seamlessly assume operations in case of any service interruptions.

### Cryptographic Attestation

Each provider node implements robust cryptographic signing protocols for all data transmissions, enabling verification of data provenance and maintaining an auditable record of operator reliability metrics.

### Quality Assurance Protocol

The system employs comprehensive monitoring mechanisms to evaluate node performance across the following parameters:

- Continuous monitoring of data consistency and operational uptime
- Real-time validation of data quality and transmission latency

### Economic Security Model

The network implements a dual-incentive structure to ensure operational excellence:

- Performance-based reward distribution for maintaining superior service quality
- Mandatory collateral requirements with programmatic slashing conditions for service level agreement violations

## Data Sanitization

The following validation mechanisms comprise a comprehensive framework for detecting and filtering anomalous or potentially manipulated price data to ensure service reliability:

### Anomaly Detection via Price Movement Analysis

The system implements asset class-specific threshold parameters to identify and exclude values that demonstrate statistically significant deviation from established price trajectories, utilizing relative measurement frameworks.

### Market Depth Validation

Real-time monitoring of slippage metrics across decentralized exchanges (DEXs) and market depth analysis on centralized exchanges (CEXs) enables automated filtering of price data from markets exhibiting insufficient liquidity conditions.

### Multi-Source Variance Analysis

The system employs statistical modeling to identify and exclude price inputs that demonstrate significant deviation from the cross-source median, ensuring data consistency and reliability across multiple price feeds.

### Peg Compliance Monitoring

Asset-specific peg references are maintained (e.g., USD for stablecoins, ETH for liquid staking derivatives, BTC for wrapped Bitcoin protocols), with automated filtering mechanisms for values exhibiting aberrant short-term deviation from established peg parameters.

## Data Aggregation

RedStone implements multiple aggregation strategies, each calibrated to specific asset characteristics and client requirements, ensuring optimal price accuracy and reliability.

### Median-Based Aggregation

A robust statistical methodology that effectively filters extreme outliers by selecting the central value from the ordered set of price inputs. This approach provides inherent resistance to price manipulation attempts and maintains accuracy even when a subset of sources reports anomalous values.

### Time-Weighted Average Price (TWAP)

An advanced temporal aggregation mechanism that computes weighted averages across configurable time windows, typically ranging from 30 seconds to 1 hour. This methodology effectively mitigates short-term price volatility and potential manipulation attempts, though it introduces a measured latency in reflecting rapid market movements.

### Liquidity-Weighted Average Price (LWAP)

A sophisticated liquidity-sensitive methodology that incorporates market depth metrics (slippage rates on DEXs and order book depth on CEXs) to compute weighted averages. The system dynamically adjusts price significance based on available liquidity at each venue, assigning higher weights to markets demonstrating superior depth and trading activity, ensuring price discovery accurately reflects executable market conditions.

## Data Availability

RedStone implements a sophisticated broadcasting infrastructure with redundant distribution pathways to ensure optimal data availability and transmission reliability.

### Distribution Channels

The system employs a hybrid distribution model combining enterprise-grade, geographically distributed gateway infrastructure with advanced caching capabilities and a decentralized node network utilizing gossip protocols.

### Relay Infrastructure

The system operates a network of relay services that facilitate seamless transaction processing through automated gas fee optimization, load-balanced interaction with redundant RPC endpoints, and high-availability deployment utilizing shadow instances for maximum reliability. The infrastructure also includes third-party transaction relay services, such as Gelato, providing additional redundancy through a fallback service.

## Data Verification

In the final stage, RedStone implements a comprehensive on-chain verification framework that leverages native blockchain security mechanisms to ensure data integrity and timeliness at the point of consumption.

### Temporal Validation

The system enforces strict timestamp verification within the smart contract layer, automatically rejecting data points that exceed configurable staleness thresholds. This mechanism ensures that only current market data influences protocol operations.

### Operator Authorization

Smart contracts maintain a registry of authorized node operators, validating each data point against cryptographic signatures from registered sources. This ensures that only data from operators maintaining required security deposits and service levels enters the system.

### Consensus-Based Price Formation

The protocol implements an on-chain medianization algorithm that processes multiple independent price feeds to produce a single reference value:

- Requirement for a minimum quorum of valid submissions
- On-chain median calculation to establish final price value
- Optional and customisable filtering of outlier submissions

This architecture ensures price manipulation would require coordinated action from a majority of independent, collateralized operators, significantly raising the security threshold of the system.
