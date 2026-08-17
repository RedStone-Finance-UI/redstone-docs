---
sidebar_position: 3
sidebar_label: "Bolt"
---

# RedStone Bolt

RedStone Bolt is a real-time push oracle purpose-built for blockchains where block times are measured in milliseconds.

Traditional price data architectures were designed when Ethereum blocks took 12 seconds to produce and prices got updated every few minutes. That design works on legacy chains but breaks on real-time ones.

When a chain produces blocks faster than an oracle can deliver data, the oracle becomes the bottleneck. Liquidations trigger late, high-frequency strategies break, protocols cannot safely tighten risk parameters, and real-time applications become impossible to build safely.

Bolt solves this at the architecture level.

---

## How RedStone Bolt Works

Bolt is built on two core design choices, with an optional third for integrations that demand the absolute minimum latency:

### 1. Direct CEX streaming

Instead of polling price aggregators, Bolt nodes monitor trade activity directly on major venues (Binance, Coinbase, OKX, Bitget, Kraken) and stream the results via high-speed gateways. This eliminates the batching overhead that gives most oracles their latency floor.

### 2. Push model: no contract changes required

This is the critical differentiator. Every other high-speed oracle uses a pull model, which is incompatible with most existing DeFi smart contracts and requires audits and code rewrites to integrate.

Bolt uses a push model, the same interface as any standard push feed. Protocols built on Aave, Compound, Morpho, Spark, Venus, Euler, Fluid, or any standard push interface integrate with **zero code changes**.

### Optional: Co-location with the sequencer

For integrations where every microsecond counts, RedStone can co-locate Bolt nodes in the same physical location as the chain's sequencer. Transmission delay drops to zero, the price data is already present when the block executes. This requires additional configuration work on RedStone's side and is evaluated on a case-by-case basis. RedStone has deployed this for select chains in the past.

---

## Performance

| Metric                 | Bolt                           | Standard Push Oracle    |
| ---------------------- | ------------------------------ | ----------------------- |
| Update interval        | **&lt;10ms**                   | 10 seconds – 24 hours   |
| Updates per second     | **400+**                       | &lt; 1                  |
| Model                  | Push                           | Push                    |
| Contract compatibility | Existing push contracts        | Existing push contracts |
| Oracle colocation      | Yes, with sequencer (optional) | No                      |

To put the speed difference in context: standard Ethereum push feeds deliver ETH/USD approximately 40–60 times in a 24-hour window. Bolt delivers over 400 updates per second, roughly 576,000× faster.

---

## Advanced: Custom Feed Types

Bolt's sub-second update cadence enables data primitives that are not possible with standard oracle architectures.

For protocols that require it, RedStone can produce dedicated feeds alongside the standard price feed, including deterministic OHLC (Open/High/Low/Close) data constructed at the oracle layer as opposed to being reconstructed post-factum from snapshots. These feeds are cryptographically signed, encoded as standardized payloads, and streamed in real time, with all outputs persisted for historical access.

This is particularly relevant for real-time trading applications where stale high/low values would create mispricing or execution risk.

Custom feed types are available on request.

---

## Integration

Bolt uses the same interface as any RedStone Push feed. If Bolt is deployed on your chosen chain and your protocol already integrates a push oracle, no changes are required.

→ See the [Push Model](./price-feeds/push-model.md) docs for the integration reference.

---

## Supported Chains

Bolt is currently live on MegaETH and Monad.

RedStone is highly selective about chain eligibility for a Bolt integration. Operating an oracle at sub-10ms cadence leaves very little margin for error. If a chain experiences downtime, faulty RPCs, or has other reliability issues, the consequences for protocols depending on real-time price data are severe. A stale feed at this speed is a significant risk event.

Before committing to a Bolt deployment, RedStone conducts deep technical due diligence on the chain, reviewing its infrastructure stability, sequencer architecture, historical uptime, and failure mode behavior. Many chains that request Bolt integrations do not meet the bar. This is by design.

If you represent a chain and want to discuss its eligibility, [contact RedStone](https://redstone.finance/contact).

---

## Get Access

Bolt is chain-facing infrastructure. RedStone works directly with chains and protocols to deploy and configure Bolt feeds for specific use cases.

To discuss a Bolt integration, [contact RedStone](https://redstone.finance/contact).
