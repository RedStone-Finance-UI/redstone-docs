---
sidebar_position: 1
sidebar_label: "Overview"
---

# RedStone Live

RedStone Live is an off-chain market data streaming service that delivers cryptographically verifiable price data via WebSocket. It is designed for protocols and applications that need real-time data before it touches a blockchain such as perpetual exchanges, centralized exchanges, options protocols, market makers, prediction markets, synthetic asset platforms, off-chain risk engines, and institutional trading systems.

Unlike on-chain price feeds (push or pull), Live delivers data to your backend directly. Your system consumes it in real time and decides when and how to use it whether that's powering mark prices and funding rates, triggering liquidation logic, or driving a frontend chart.

---

## Who It's For

**Perpetual exchanges** are the primary use case. Perps require continuous pricing across asset classes that include equities, commodities, FX, and indices alongside crypto — assets with market hours, contract expiries, corporate actions, and complex sourcing requirements. Live is built to handle all of that. Both for DEXes and CEXes.

**Options protocols** — RedStone Live provides institutional-grade options data on major US equities and commodities. Options data covers the pricing, volume, and open interest of derivative contracts. Live is uniquely positioned to power options protocols expanding into RWAs.

Other use cases include synthetic spot token platforms that need 24/7 pricing for minting and redemption, off-chain risk management and liquidation engines, real-time analytics pipelines, and institutional portfolio and monitoring dashboards.

Any use case requiring instant access to a broad spectrum of pricing data across jurisdictions and asset classes (for example, for the sake of spinning up new markets quickly) can benefit from RedStone Live integration.

---

## Asset Coverage

Live covers a broad range of asset classes. Coverage spans the classes below; specific tickers and licensing are confirmed during integration scoping, and new assets are added on request.

**Equities** — US (large-cap and mid-cap) and non-US stocks (Japan, Taiwan, Europe, Hong Kong, Korea and others)

**Commodities** — hard, soft, and metals

- Hard: oil, natural gas, uranium
- Soft: corn, soy, wheat, cattle
- Metals: gold, silver, copper, platinum, mining indices

**FX** — major pairs and emerging market currencies (KRW, JPY, EUR, and more)

**Indices** — S&P 500, NASDAQ, NIKKEI 225, KOSPI, HK50, and others

**Crypto** — top 20 assets by market cap

**Custom baskets** — weighted composites of any combination of the above

Browse the full list of tickers in the [Assets Explorer](https://app.redstone.finance/assets).

---

## What Makes Live Different

### Sourced from where your market makers hedge

Basis risk on a perp DEX is usually an oracle problem. If your market makers hedge on a specific venue and your oracle sources from a different one, the spread between those prices shows up as funding volatility, arbitrage exposure, or unexplained P&L noise.

Live lets you configure feeds to source from the venue your market makers actually use, whether that's a TradFi futures exchange, a broker, an ATS, or a crypto venue. The data tracks where your market actually lives.

### Custom rollover methodology, built into the feed

For any asset with contract expiries (futures on commodities, equities, rates), rollovers are where naive oracles create the most damage. A rollover at the wrong time or using the wrong contract month generates temporary price dislocations that can trigger phantom liquidations or open arbitrage windows.

RedStone builds the rollover methodology directly into the feed configuration. Options include front-month, second-month, volume-weighted, and open-interest-weighted rollovers. You define what makes sense for your protocol and market structure; we implement and maintain it. Your protocol never has to absorb rollover risk because an oracle treated a futures market like a spot market.

### 24/7 continuous coverage

TradFi markets close. Most oracle systems either freeze, degrade, or require manual intervention when they do. Live continues pricing from the most liquid available venue using a pre-configured off-hours methodology. No gaps, no scripts, no operational decisions left to your team.

### End-to-end integration

Other providers hand off a data stream and stop there. RedStone operates the full pipeline: relayer operation, data source sanitization, methodology configuration, uptime monitoring, and custom signing schemes. If something goes wrong upstream, we handle it. Your team builds the product; we handle the oracle infrastructure.

---

## Perpetuals: Specialized Integration

Perps have requirements that are meaningfully different from other oracle integrations, and RedStone treats them accordingly. Beyond data delivery, a production-ready perps oracle needs:

- **Continuous 24/7 pricing** — including synthetic prices during closed or thin-liquidity periods so the market stays functional at all hours
- **Corruption-resistant aggregation** — multi-source with filtering that rejects bad ticks, stale data, and manipulation attempts before they reach your mark price
- **Smoothed mark price evolution** — spot prices can move abruptly; a perps engine cannot. RedStone applies smoothing, clamps, and transition logic so sudden regime changes don't cascade into unnecessary liquidations
- **Event-aware handling** — stock splits, reverse splits, mergers, and tender offers all change the economic meaning of a price. RedStone detects and adjusts for these so your market continues functioning normally
- **Redundant infrastructure** — multiple relayers, redundant transmission paths, and robust key management so the oracle layer doesn't become the single point of failure for your protocol

RedStone approaches perps integration as ongoing engineering collaboration, instead of a one-time product delivery. The oracle and the protocol are co-developed, tested, and maintained together.

---

## Get Access

Live is available via API key. To discuss an integration, including asset coverage, rollover methodology, sourcing configuration, and latency requirements, [contact RedStone](https://redstone.finance/contact).

→ For technical integration details, see the [API Reference](./api-reference.md).
