---
sidebar_position: 2
sidebar_label: "How to use in TypeScript"
---

# How to use in TypeScript

1. Read firstly the docs from [How to start](../) section
2. The full source of the package is available [here](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/sui-connector/src)

The **info described there** is mostly **NOT REPEATED below**.

## Dependencies

Use the following dependency to embed the _RedStone Sui Connector_ into TypeScript.

```json
{
  "dependencies": {
    "@redstone-finance/sui-connector": "1.0.0"
  }
}
```

## Reading Prices

Reads go through `SuiContractAdapter`, which wraps a [`SuiPricesContractReader`](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/sui-connector/src/adapter/SuiPricesContractReader.ts) pointed at the deployed `PriceAdapter` object:

```ts
import { SuiClientBuilder, SuiContractAdapter, readSuiConfig } from "@redstone-finance/sui-connector";

const suiClient = new SuiClientBuilder().withSuiNetwork(network).withRpcUrls(rpcUrls).build();

const adapter = new SuiContractAdapter(suiClient, readSuiConfig(network));

const prices = await adapter.readContractData(["BTC", "ETH"]);
```

See the [RedStone App](https://app.redstone.finance/push-feeds?networks=sui) for the full list of feeds currently supported on Sui and their update parameters.

Feed IDs are passed as plain strings (`"BTC"`) — the connector zero-pads them to 32 bytes internally (`makeFeedIdBytes` in [`util.ts`](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/sui-connector/src/util.ts)) before matching them against the on-chain key. This is the same encoding a Move caller has to replicate by hand — see the [Move tutorial](./move-tutorial.md#contract-interface).

Two things the snippet above glosses over, both of which matter to get a working call:

- **`rpcUrls` must select the gRPC client.** Public JSON-RPC fullnodes have deprecated the batched `multiGetObjects` method the connector relies on, so a plain `https://fullnode.mainnet.sui.io:443` URL fails with `Method not found`. Force gRPC by appending `#type=grpc` to the URL — see [`SuiApi.parseUrl`](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/sui-connector/src/client/SuiApi.ts).
- **`readSuiConfig(network)` needs `DEPLOY_DIR` set** to the `suiMultiFeed` deployment. Its default (`sui/contracts/price_adapter`) points at an older, single-feed deployment and won't resolve the mainnet addresses listed in the [Move tutorial](./move-tutorial.md#deployed-addresses-suimultifeed-mainnet).

## Example

A minimal script that connects to mainnet and reads the BTC and ETH prices:

```ts
import { SuiClientBuilder, SuiContractAdapter, readSuiConfig } from "@redstone-finance/sui-connector";

const NETWORK = "mainnet";
// #type=grpc forces the gRPC client — the JSON-RPC path is deprecated on public fullnodes
const RPC_URLS = ["https://fullnode.mainnet.sui.io:443#type=grpc"];

async function main() {
  const suiClient = new SuiClientBuilder()
    .withSuiNetwork(NETWORK)
    .withRpcUrls(RPC_URLS)
    .build();

  const adapter = new SuiContractAdapter(suiClient, readSuiConfig(NETWORK));

  const prices = await adapter.readContractData(["BTC", "ETH"]);

  console.log(prices);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

## Testing

Reading prices is a plain RPC call against the already-deployed `PriceAdapter` object — no wallet, gas, or publishing needed. Install the dependency and run the script directly, with `DEPLOY_DIR` pointed at the `suiMultiFeed` deployment:

```bash
yarn add @redstone-finance/sui-connector
DEPLOY_DIR="sui/deployments/suiMultiFeed/price_adapter" yarn tsx read-prices.ts
```

This returns the raw on-chain values (`lastValue` is `u256`, 8 decimals — divide by `1e8`), for example:

```
{
  BTC: { lastDataPackageTimestampMS: ..., lastBlockTimestampMS: ..., lastValue: 7935541000000n },
  ETH: { lastDataPackageTimestampMS: ..., lastBlockTimestampMS: ..., lastValue: 248793355693n }
}
```

To cross-check a value returned here against the raw on-chain call, use the Move-side `dev-inspect` recipe in the [Move tutorial](./move-tutorial.md#testing-without-publishing) — both read the same `PriceAdapter` object and should agree.
