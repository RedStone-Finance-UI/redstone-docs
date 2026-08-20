# Ratings

## Overview

The Ratings API provides comprehensive rating information for DeFi vaults, derived from Credora's proprietary risk assessment methodology. This endpoint gives all publicly available credora ratings, including commissioned and indicative ratings.

## Definitions

- **ID**: Unique identifier for the vault
- **Address**: On-chain address of the rated product
- **Chain ID**: Standard chain identifier (e.g., `1` for Ethereum, `8453` for Base)
- **Curator**: Name of the Vault curator (if applicable)
- **Name**: Human-readable name of the rated product
- **Rating Type**: Internal Type of Rating (“indicative” or “commissioned”)
- **Product**: Product category within the protocol (e.g., "Vaults")
- **Protocol**: Protocol name (e.g., "Morpho", "Spark")
- **Metrics**: Rating metrics and risk assessment data
  - **Rating**: Rating output on the DeFi scale, designed to be more intuitive for all users
  - **Publish Date**: The date on which the Vault Rating was last updated, formatted as `YYYY-MM-DD`
  - **PSL**: Probability of Significant Loss — annualized probability of a 1% loss on market supply

---

## Available Queries

---

### Unified Ratings

The Unified Ratings API provides access to Credora's comprehensive DeFi credit ratings across all supported protocols and product types. This query enables flexible filtering to retrieve ratings for vaults, isolated lending pools, stablecoins, and other rated DeFi products.

#### Pagination

The ratings endpoint supports pagination through the optional query parameters `page` and `limit`.

- **page**: Zero-indexed page number. The default is 0.
- **limit**: Number of results per page. The default is 10 (Must be between 1 and 1000)

#### Query: Get Ratings (No Filter)

Retrieve all ratings across all protocols and products

```graphql
query GetAllRatings {
  ratings(page: 0, limit: 1) {
    totalCount
    items {
      id
      address
      name
      chainId
      protocol
      ratingType
      product
      curator {
        name
      }
      Metrics {
        rating
        psl
        publishDate
      }
    }
  }
}
```

##### Example response

```json
{
  "data": {
    "ratings": {
      "totalCount": 16,
      "items": [
        {
          "id": "12377",
          "address": "0x551232fdee08e272e929034a8f26f7ca34b1ebe364b275391169b28c6d7db24dbc8",
          "name": "testMarket",
          "chainId": 1,
          "protocol": "morpho",
          "ratingType": "indicative",
          "product": "markets",
          "curator": {
            "name": "testCurator"
          },
          "Metrics": {
            "rating": "B",
            "psl": 0.002,
            "publishDate": "2025-11-30"
          }
        }
      ]
    }
  }
}
```

#### Query: Get Ratings by Protocol

Filter ratings to a specific protocol or multiple protocols.

```graphql
query GetSparkRatings {
  ratings(filter: { protocol: ["spark"] }, page: 0, limit: 10) {
    totalCount
    items {
      id
      address
      name
      chainId
      protocol
      ratingType
      product
      curator {
        name
      }
      Metrics {
        rating
        psl
        publishDate
      }
    }
  }
}
```

##### Example response

```json
{
  "data": {
    "ratings": {
      "totalCount": 16,
      "items": [
        {
          "id": "12377",
          "address": "0x1111111111111111111111111",
          "name": "testMarket",
          "chainId": 1,
          "protocol": "spark",
          "ratingType": "indicative",
          "product": "markets",
          "curator": {
            "name": "testCurator"
          },
          "Metrics": {
            "rating": "B",
            "psl": 0.002,
            "publishDate": "2025-11-30"
          }
        }
      ]
    }
  }
}
```

#### Available Filters

All filters accept arrays. Multiple values within a filter use OR logic; multiple filters use AND logic.

| Filter     | Type     | Example Values                               |
| ---------- | -------- | -------------------------------------------- |
| protocol   | [String] | "spark", "morpho"                            |
| product    | [String] | "vaults", "markets"                          |
| ratingType | [String] | "Indicative", "commissioned"                 |
| chainId    | [Int]    | 1, 8453                                      |
| curator    | [String] | "Gauntlet", "Steakhouse"                     |
| address    | [String] | "0x0D05e6ec0A10f9fFE9229EAA785c11606a1d13Fb" |

**Filter Logic Example:**

```graphql
filter: { protocol: ["Morpho", "Spark"], product: ["Vaults"] }
```

Returns: (protocol = "Morpho" OR protocol = "Spark") AND product = "Vaults"

---

### Get Single Morpho Vault Rating

:::caution Legacy Endpoint
This endpoint is deprecated. Use the unified `ratings` query with address filter instead.
:::

Retrieve detailed rating information for a specific vault by its ID or address.

#### Query

```graphql
query GetVaultRating {
  getVaultRating(id: "id") {
    id
    address
    chainId
    protocol
    Metrics {
      rating
      psl
      publishDate
    }
    curator {
      name
    }
  }
}
```

##### Example response

```json
{
  "data": {
    "getVaultRating": {
      "id": "cd8b167e-dc4c-475b-9265-429b2c197bb9",
      "address": "0x0D05e6ec0A10f9fFE9229EAA785c11606a1d13Fb",
      "chainId": 8453,
      "name": "Gauntlet LBTC Core",
      "protocol": "Morpho",
      "curator": {
        "name": "Curator Name"
      },
      "Metrics": {
        "rating": "A-",
        "psl": 0.00428,
        "publishDate": "2025-19-09"
      }
    }
  }
}
```

---

### Get All Morpho Vault Ratings

:::caution Legacy Endpoint
This endpoint is deprecated. Use the unified `ratings` query instead.
:::

Retrieve a paginated list of all available vault ratings.

#### Pagination

The getVaultRatings endpoint supports pagination through the optional query parameters `page` and `limit`.

- **page**: Zero-indexed page number. The default is 0.
- **limit**: Number of results per page. The default is 10 (Must be between 1 and 1000)

#### Query

```graphql
query {
  getVaultRatings(page: 0, limit: 2) {
    totalCount
    items {
      id
      address
      chainId
      name
      protocol
      Metrics {
        rating
        psl
        publishDate
      }
      curator {
        name
      }
    }
  }
}
```

##### Example response

```json
{
  "data": {
    "getVaultRatings": {
      "totalCount": 70,
      "items": [
        {
          "id": "cd8b167e-dc4c-475b-9265-429b2c197bb9",
          "address": "0x059Fc6723b9bF77DbF4283C8d7C90eA8Af44EF10",
          "chainId": 1,
          "name": "SwissBorg tBTC",
          "protocol": "Morpho",
          "Metrics": {
            "rating": "A+",
            "psl": 0.0011200000000000001,
            "publishDate": "2025-19-09"
          },
          "curator": {
            "name": "Gauntlet"
          }
        },
        {
          "id": "f238d012-1c90-42e4-b6d1-612dbc735947",
          "address": "0x0D05e6ec0A10f9fFE9229EAA785c11606a1d13Fb",
          "chainId": 8453,
          "name": "Gauntlet LBTC Core",
          "protocol": "Morpho",
          "Metrics": {
            "rating": "A-",
            "psl": 0.00428,
            "publishDate": "2025-19-09"
          },
          "curator": {
            "name": "Gauntlet"
          }
        }
      ]
    }
  }
}
```
