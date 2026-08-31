---
slug: /terminal
---

# Intro

Access to reliable historical cryptocurrency trade data is critical for research, analytics, and production systems.
RedStone Terminal provides raw, exchange-level trade data that enables users to analyze market behavior, backtest
trading strategies, study liquidity and volatility, and build high-quality datasets for quantitative and data science
workflows. The data reflects actual trades reported by exchanges, with precise timestamps and identifiers that allow for
accurate reconstruction of market activity.

RedStone is a proven blockchain data provider whose infrastructure secures over **$10bn** in value across multiple
protocols. The same engineering standards and validation pipelines used in RedStone’s oracle systems are applied to
RedStone Terminal. Data is collected directly from exchange feeds and processed with a strong emphasis on correctness,
completeness, and consistency, making it suitable for both exploratory analysis and institutional-grade use cases.

### Trades

Trade data is distributed in **[Apache Parquet](https://parquet.apache.org/)**, a columnar format designed for efficient
storage and analytics at scale. Files can be accessed via the **web interface** for manual downloads or through
the **command-line interface (CLI)** for automated workflows.

In the initial release, RedStone Terminal provides historical trade data starting from **2025**.

Coverage details for supported **[tokens](/terminal/6-tokens.md)** and **[exchanges](/terminal/4-exchanges.md)** are
documented separately and will expand over time.

### Derivatives Support: Hyperliquid

**[Hyperliquid Derivatices](/terminal/9-derivatives.md)**

RedStone Terminal now includes high-fidelity data from Hyperliquid, a high-performance L1 decentralized exchange. Unlike
standard CEX data, Hyperliquid data captures the dynamics of on-chain perpetual futures.

## Web Interface

To easily fetch single files, go to:
https://terminal.redstone.finance/

## Command-Line Interface

For faster and broader access to multiple files, please use the CLI:
https://github.com/redstone-finance/terminal-cli

## Trade File description

### File Format

| Property              | Value          |
| --------------------- | -------------- |
| **File Format**       | Apache Parquet |
| **Format Version**    | 1.0            |
| **Number of Columns** | 8              |

### File Metadata

| #   | Column Name       | Data Type     | Description                                                      |
| --- | ----------------- | ------------- | ---------------------------------------------------------------- |
| 1   | `exchange`        | string        | Exchange identifier (e.g., "binance")                            |
| 2   | `symbol`          | string        | Trading pair symbol (e.g., "BNBUSDT")                            |
| 3   | `timestamp`       | timestamp[ms] | Exchange-reported trade timestamp in UTC (millisecond precision) |
| 4   | `local_timestamp` | timestamp[ms] | Local capture timestamp in UTC (millisecond precision)           |
| 5   | `id`              | string        | Unique trade identifier from the exchange                        |
| 6   | `side`            | string        | Trade side: "buy" or "sell"                                      |
| 7   | `price`           | double        | Trade execution price                                            |
| 8   | `amount`          | double        | Trade quantity/volume                                            |

### File Naming Convention

**Pattern:**

`{exchange}_trades_{date}_{symbol}.parquet`

**Components:**

- `{exchange}`: Exchange identifier (lowercase, e.g., "kucoin")
- `{date}` : ISO 8601 date format (YYYY-MM-DD)
- `{symbol}`: Trading pair (lowercase, e.g., "bnb_usdt")

**Examples:**

- `kucoin_trades_2025-06-04_bnb_usdt.parquet`
- `binance_trades_2025-06-05_btc_usdt.parquet`

## Derivative File description

### File Format

| Property              | Value          |
| --------------------- | -------------- |
| **File Format**       | Apache Parquet |
| **Format Version**    | 1.0            |
| **Number of Columns** | 12             |

### File Naming Convention

**Pattern:**

`hyperliquid_derivative_{date}_{instrument_type}_{base_asset}_{quote_asset}.parquet`

### File Metadata

| #   | Column            | Type            | Description                                     |
| --- | ----------------- | --------------- | ----------------------------------------------- |
| 1   | `local_timestamp` | `timestamp[ms]` | Local capture timestamp (millisecond precision) |
| 2   | `funding`         | `double`        | Current funding rate                            |
| 3   | `open_interest`   | `double`        | Total open interest in base asset units         |
| 4   | `prev_day_px`     | `double`        | Previous day's closing price (USD)              |
| 5   | `day_ntl_vlm`     | `double`        | 24-hour notional volume (USD)                   |
| 6   | `premium`         | `double`        | Premium/discount to oracle price                |
| 7   | `oracle_px`       | `double`        | Oracle price (USD)                              |
| 8   | `mark_px`         | `double`        | Mark price used for liquidations (USD)          |
| 9   | `mid_px`          | `double`        | Mid price from order book (USD)                 |
| 10  | `impact_px_sell`  | `double`        | Impact price for sell orders                    |
| 11  | `impact_px_buy`   | `double`        | Impact price for buy orders                     |
| 12  | `day_base_vlm`    | `double`        | 24-hour volume in base asset units              |
