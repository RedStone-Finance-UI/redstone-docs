---
sidebar_position: 2
sidebar_label: "Positions API"
---

# RedStone OEV Positions API

The Positions API is a read-only HTTP service that exposes the indexed Morpho markets, oracle data and borrower
positions that back the OEV auctions. Solvers can use it to inspect the tracked markets, look up a borrower's positions,
and simulate the effect of a hypothetical feed price on position health before an auction happens.

## 1. Connection Requirements

**Base URL**: `https://<url>.oev.a.redstone.finance/morpho/v1`

### Authentication

Every request requires an `x-api-key` HTTP header.

- If the `x-api-key` is missing or unauthorized, the server replies with `401 Unauthorized`.

:::info
Both the base URL and the `x-api-key` are provided by the RedStone team for your concrete integration.
:::

All examples below use the placeholders `<url>` and `<your-api-key>` — replace them with the values supplied by
RedStone.

## 2. Endpoints

### 2.1 Health check

`GET /health`

A simple liveness probe. Returns `200 OK` when the service is up.

```bash
curl -s https://<url>.oev.a.redstone.finance/morpho/v1/health \
  -H "x-api-key: <your-api-key>"
```

**Response:**

```json
{ "status": "ok" }
```

### 2.2 At-risk positions

`GET /positions/at-risk`

Returns the tracked positions with an open borrow, ranked by `current_ltv` descending (closest to liquidation first).
The number of results is capped by the service configuration (100 by default).

```bash
curl -s https://<url>.oev.a.redstone.finance/morpho/v1/positions/at-risk \
  -H "x-api-key: <your-api-key>"
```

**Response:**

```json
{
  "positions": [
    {
      "market_unique_key": "0x6209dbd022c20923c071d7183d7a9729a75596136540d474a27d08ef31f440a5",
      "collateral_symbol": "wstETH",
      "loan_symbol": "USDC",
      "borrower_address": "0x629d764ec8563afa701709b52c1a215e865632de",
      "current_ltv": 108.83183870604022,
      "lltv": "860000000000000000",
      "health_factor": "0.918",
      "collateral_usd": "1800.94",
      "borrow_usd": "1685.60",
      "updated_at": "2026-07-24T09:41:12.512Z"
    }
  ]
}
```

`current_ltv` is expressed as a percentage of the market's LLTV — a value `>= 100` means the position is liquidatable.

### 2.3 Markets

`GET /markets`

Returns every tracked market together with its full oracle configuration (feeds, vaults, cached feed values and the
`convertToAssets` vault values used to reconstruct the oracle price).

```bash
curl -s https://<url>.oev.a.redstone.finance/morpho/v1/markets \
  -H "x-api-key: <your-api-key>"
```

**Response:**

```json
{
  "markets": [
    {
      "uniqueKey": "0x6209dbd022c20923c071d7183d7a9729a75596136540d474a27d08ef31f440a5",
      "id": "0x6209dbd022c20923c071d7183d7a9729a75596136540d474a27d08ef31f440a5",
      "lltv": "860000000000000000",
      "collateralSymbol": "wstETH",
      "collateralAddress": "0x17e892d4E802B01d7DA49Ca3542560f6851AA4D3",
      "loanSymbol": "USDC",
      "loanAddress": "0x468BB3245BF520a0CD030BDE029c98aCEAF84C9d",
      "collateralDecimals": 18,
      "loanDecimals": 6,
      "oracleAddress": "0xfED5bC312C7139743bc3ab21Ef92f5AeB353339D",
      "oracle": {
        "address": "0xfED5bC312C7139743bc3ab21Ef92f5AeB353339D",
        "baseFeed1": {
          "address": "0x6beE2D4dC04afb93b8117849138aA4fCa300c788",
          "symbol": "ETH",
          "value": "180094362010"
        },
        "baseFeed2": {
          "address": "0x0000000000000000000000000000000000000000",
          "symbol": null,
          "value": "1"
        },
        "quoteFeed1": {
          "address": "0x0000000000000000000000000000000000000000",
          "symbol": null,
          "value": "1"
        },
        "quoteFeed2": {
          "address": "0x0000000000000000000000000000000000000000",
          "symbol": null,
          "value": "1"
        },
        "baseVault": "0x0000000000000000000000000000000000000000",
        "baseVaultConversionSample": "1",
        "quoteVault": "0x0000000000000000000000000000000000000000",
        "quoteVaultConversionSample": "1",
        "baseVaultAssets": null,
        "quoteVaultAssets": null,
        "scaleFactor": "10000000000000000"
      }
    }
  ]
}
```

:::info
A feed's `symbol` is the RedStone data-feed id (e.g. `ETH`) for RedStone feeds. Non-RedStone feeds are keyed by their
on-chain address instead, and a zero-address feed slot has a `null` symbol. `baseVaultAssets` / `quoteVaultAssets` are
`null` when the corresponding vault is the zero address (the oracle price then uses the conversion sample directly).
:::

### 2.4 Markets by borrower

`GET /markets/borrower/{borrower}`

Returns every market in which the given borrower currently holds a position, with the market and oracle metadata plus
the borrower's own position (collateral, borrow, current LTV).

| Path parameter | Description                                   |
| -------------- | --------------------------------------------- |
| `borrower`     | Borrower wallet address (case-insensitive)    |

```bash
curl -s https://<url>.oev.a.redstone.finance/morpho/v1/markets/borrower/0x629d764ec8563afa701709b52c1a215e865632de \
  -H "x-api-key: <your-api-key>"
```

**Response:**

```json
{
  "borrower": "0x629d764ec8563afa701709b52c1a215e865632de",
  "markets": [
    {
      "market_unique_key": "0x6209dbd022c20923c071d7183d7a9729a75596136540d474a27d08ef31f440a5",
      "borrower_address": "0x629d764ec8563afa701709b52c1a215e865632de",
      "current_ltv": 108.83183870604022,
      "oracle_address": "0xfED5bC312C7139743bc3ab21Ef92f5AeB353339D",
      "lltv": "860000000000000000",
      "collateral_decimals": 18,
      "loan_decimals": 6,
      "collateral_address": "0x17e892d4E802B01d7DA49Ca3542560f6851AA4D3",
      "loan_address": "0x468BB3245BF520a0CD030BDE029c98aCEAF84C9d",
      "collateral_symbol": "wstETH",
      "loan_symbol": "USDC",
      "base_feed_1_address": "0x6beE2D4dC04afb93b8117849138aA4fCa300c788",
      "base_feed_2_address": "0x0000000000000000000000000000000000000000",
      "quote_feed_1_address": "0x0000000000000000000000000000000000000000",
      "quote_feed_2_address": "0x0000000000000000000000000000000000000000",
      "base_vault": "0x0000000000000000000000000000000000000000",
      "base_vault_conversion_sample": "1",
      "quote_vault": "0x0000000000000000000000000000000000000000",
      "quote_vault_conversion_sample": "1",
      "base_vault_assets": null,
      "quote_vault_assets": null,
      "scale_factor": "10000000000000000",
      "collateral_assets": "1000000000000000000",
      "borrow_assets": "1685600048",
      "borrow_shares": "1685600000000000"
    }
  ]
}
```

An empty `markets` array means the borrower has no tracked positions.

### 2.5 Simulate a feed price

`POST /simulate`

Recomputes position health for a hypothetical feed value and returns the affected positions ranked by their
**simulated** LTV. This mirrors what the OEV auction does internally, letting you preview which positions a given feed
move would put at risk — without waiting for a live auction.

**Request body:**

| Field       | Type       | Required | Description                                                                           |
| ----------- | ---------- | -------- | ------------------------------------------------------------------------------------- |
| `feedId`    | `string`   | yes      | RedStone feed id / symbol to override (e.g. `ETH`).                                    |
| `value`     | `string`   | yes      | Raw feed value as an integer string, same units as the stored feed values (8 decimals). Must be `> 0`. |
| `borrowers` | `string[]` | no       | Restrict the simulation to these borrower addresses.                                  |

```bash
curl -s -X POST https://<url>.oev.a.redstone.finance/morpho/v1/simulate \
  -H "x-api-key: <your-api-key>" \
  -H "content-type: application/json" \
  -d '{
    "feedId": "ETH",
    "value": "150000000000"
  }'
```

**Response:**

```json
{
  "feedId": "ETH",
  "value": "150000000000",
  "positions": [
    {
      "market_unique_key": "0x6209dbd022c20923c071d7183d7a9729a75596136540d474a27d08ef31f440a5",
      "borrower_address": "0x629d764ec8563afa701709b52c1a215e865632de",
      "current_ltv": 108.83183870604022,
      "simulated_ltv": 131.42
    }
  ]
}
```

- `current_ltv` is the last indexed LTV; `simulated_ltv` is the LTV recomputed with the supplied `feedId`/`value`.
- Positions are sorted by `simulated_ltv` descending and capped by the service result limit.
- If no oracle uses `feedId`, an empty `positions` array is returned.

**Error responses:**

```json
{ "statusCode": 400, "message": "feedId and a positive value are required" }
```

```json
{ "statusCode": 400, "message": "value must be an integer string (raw feed value, same units as stored feed values)" }
```

## 3. Field reference

Position/market payloads share the same underlying fields as the `oev/liquidations` WebSocket payload documented in the
[Integration guide](./1-integration.md). In short:

- `lltv` — market liquidation LTV, WAD-scaled (`860000000000000000` = `86%`).
- `current_ltv` / `simulated_ltv` — position LTV as a percentage of the market LLTV; `>= 100` is liquidatable.
- `*_address`, `*_decimals`, `*_symbol` — collateral / loan token metadata.
- `base_feed_*`, `quote_feed_*`, `base_vault*`, `quote_vault*`, `scale_factor` — oracle parameters used to reconstruct
  the Morpho oracle price.
- `collateral_assets`, `borrow_assets`, `borrow_shares` — the borrower's raw on-chain position amounts.
