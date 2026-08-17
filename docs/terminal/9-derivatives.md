# Hyperliquid Derivatives

## Overview

Hyperliquid derivatives data captures real-time perpetual futures contract information including funding rates, open
interest, prices, and volume metrics. Data is stored in Apache Parquet format for efficient querying and storage.

## Supported Assets

#### Provider: FLX (6 pairs)

| Symbol                | Asset          |
| --------------------- | -------------- |
| `perp:flx:coin_usd`   | Coinbase Stock |
| `perp:flx:crcl_usd`   | Circle         |
| `perp:flx:gold_usd`   | Gold           |
| `perp:flx:silver_usd` | Silver         |
| `perp:flx:tsla_usd`   | Tesla Stock    |
| `perp:flx:xmr_usd`    | Monero         |

#### Provider: HYNA (10 pairs)

| Symbol                  | Asset        |
| ----------------------- | ------------ |
| `perp:hyna:bnb_usd`     | Binance Coin |
| `perp:hyna:btc_usd`     | Bitcoin      |
| `perp:hyna:doge_usd`    | Dogecoin     |
| `perp:hyna:eth_usd`     | Ethereum     |
| `perp:hyna:hype_usd`    | Hyperliquid  |
| `perp:hyna:lighter_usd` | Lighter      |
| `perp:hyna:lit_usd`     | LIT          |
| `perp:hyna:sol_usd`     | Solana       |
| `perp:hyna:xrp_usd`     | XRP          |
| `perp:hyna:zec_usd`     | Zcash        |

#### Provider: VNTL (7 pairs)

Venture/thematic indices and pre-IPO exposure:

| Symbol                    | Asset                        | Category        |
| ------------------------- | ---------------------------- | --------------- |
| `perp:vntl:anthropic_usd` | Anthropic (Pre-IPO)          | Private Company |
| `perp:vntl:infotech_usd`  | Information Technology Index | Index           |
| `perp:vntl:mag7_usd`      | Magnificent 7 Index          | Index           |
| `perp:vntl:openai_usd`    | OpenAI (Pre-IPO)             | Private Company |
| `perp:vntl:robot_usd`     | Robotics & AI Index          | Index           |
| `perp:vntl:semis_usd`     | Semiconductors Index         | Index           |
| `perp:vntl:spacex_usd`    | SpaceX (Pre-IPO)             | Private Company |

#### Provider: XYZ (30 pairs)

Traditional assets including stocks, commodities, and forex:

**Stocks (22 pairs):**

| Symbol               | Asset | Company                |
| -------------------- | ----- | ---------------------- |
| `perp:xyz:aapl_usd`  | AAPL  | Apple                  |
| `perp:xyz:amd_usd`   | AMD   | Advanced Micro Devices |
| `perp:xyz:amzn_usd`  | AMZN  | Amazon                 |
| `perp:xyz:baba_usd`  | BABA  | Alibaba                |
| `perp:xyz:coin_usd`  | COIN  | Coinbase               |
| `perp:xyz:cost_usd`  | COST  | Costco                 |
| `perp:xyz:crcl_usd`  | CRCL  | Circle                 |
| `perp:xyz:googl_usd` | GOOGL | Alphabet               |
| `perp:xyz:hood_usd`  | HOOD  | Robinhood              |
| `perp:xyz:intc_usd`  | INTC  | Intel                  |
| `perp:xyz:lly_usd`   | LLY   | Eli Lilly              |
| `perp:xyz:meta_usd`  | META  | Meta Platforms         |
| `perp:xyz:msft_usd`  | MSFT  | Microsoft              |
| `perp:xyz:mstr_usd`  | MSTR  | MicroStrategy          |
| `perp:xyz:mu_usd`    | MU    | Micron Technology      |
| `perp:xyz:nflx_usd`  | NFLX  | Netflix                |
| `perp:xyz:nvda_usd`  | NVDA  | NVIDIA                 |
| `perp:xyz:orcl_usd`  | ORCL  | Oracle                 |
| `perp:xyz:pltr_usd`  | PLTR  | Palantir               |
| `perp:xyz:rivn_usd`  | RIVN  | Rivian                 |
| `perp:xyz:skhx_usd`  | SKHX  | SK Hynix               |
| `perp:xyz:sndk_usd`  | SNDK  | SanDisk/WD             |
| `perp:xyz:tsla_usd`  | TSLA  | Tesla                  |
| `perp:xyz:tsm_usd`   | TSM   | Taiwan Semiconductor   |

**Commodities (3 pairs):**

| Symbol                | Asset           |
| --------------------- | --------------- |
| `perp:xyz:gold_usd`   | Gold            |
| `perp:xyz:silver_usd` | Silver          |
| `perp:xyz:cl_usd`     | Crude Oil (WTI) |

**Forex (2 pairs):**

| Symbol             | Asset        |
| ------------------ | ------------ |
| `perp:xyz:eur_usd` | Euro         |
| `perp:xyz:jpy_usd` | Japanese Yen |

**Indices (1 pair):**

| Symbol                | Asset        |
| --------------------- | ------------ |
| `perp:xyz:xyz100_usd` | XYZ100 Index |
