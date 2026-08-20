---
sidebar_position: 3
sidebar_label: "How to use in TypeScript"
---

# How to use in TypeScript

1. Read firstly the docs from [How to start](../) section
2. See how to [connect to the contract/component](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/stellar-connector#-connecting-to-the-contract) in the TypeScript layer
3. The full source of the package is available [here](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/stellar-connector/src)

The **info described there** is mostly **NOT REPEATED below**.

## Dependencies

1. Use the following dependencies to embed _RedStone Stellar Connector_ into TypeScript.

```json
{
  dependencies: {
     ...
    "@redstone-finance/stellar-connector": "0.9.0",
     ...
  }
}
```

## Using the PriceAdapter package with `@redstone-finance/stellar-connector`

Use the `.env.example` file to create your `.env` file.

### Deploying contracts

```shell
yarn sample-deploy
```

1. The contract can be deployed by using the above command, defined [here](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/stellar-connector/scripts/sample-deploy.ts).
2. The deployed `redstone_adapter-id.testnet` and/or `redstone_price_feed-XXX-id.testnet` addresses can be found in the `stellar` directory.

### Sample run

```shell
yarn sample-run
```

1. The sample scenario can be run by using the above command, defined [here](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/stellar-connector/scripts/sample-run.ts).
2. The script uses [`PriceAdapterStellarContractConnector`](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/stellar-connector/src/adapters/PriceAdapterStellarContractConnector.ts).
