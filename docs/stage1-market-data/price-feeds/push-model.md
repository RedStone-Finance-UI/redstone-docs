---
sidebar_position: 1
sidebar_label: "Push model"
---

import DocCardList from "@theme/DocCardList";

# Standardized Access for DeFi Interoperability

Ideal for dApps deeply integrated with existing protocols and traditional data consumption patterns

RedStone's Push Model stores data directly on-chain through periodic updates, following the traditional blockchain oracle approach. This model ensures constant data availability and gives applications full control over update conditions and data sources.

Here you can find the [**list of all the feeds**](https://app.redstone.finance/app/feeds/) available with update parameters.

:::info
RedStone Push has a significant advantage over traditional push oracles. Our modular design gives you a decisive voice on when and how the price is updated (with other oracles you have to accept dictated parameters).
:::

## How RedStone Push works

This approach is built on top of the [RedStone Pull](./pull-model.md) model maintaining the security of on-chain validation of data providers and timestamps.

The model consists of two main parts. The first one is the off-chain [relayer](#relayer) responsible for pushing data on-chain in a customized way using [environment variables](#environment-variables). The second part is the on-chain [contracts](#contracts) which enable storing prices and getting them through a familiar interface (e.g. the [Chainlink Aggregator](https://github.com/smartcontractkit/chainlink-evm/blob/0ef2acf189b8389d6921649ca7ca14f5cf85fd33/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol) ). RedStone Push can be used on all EVM-compatible L1s & L2s + Starknet + Fuel Network.

<!-- TODO: maybe we should update the text in the diagram (it has old "Classic" word)  -->

![RedStone push diagram](/img/redstone-push.png)

### Relayer

The relayer is a service that works in a customizable way based on [environment variables](#environment-variables). It periodically checks a defined set of conditions, pushing the prices when they are satisfied. It is possible to pass multiple conditions to the `UPDATE_CONDITIONS`, then the relayer will work in the manner that if any conditions are met prices will be updated. Currently, two conditions are implemented:

- a `time` condition described by `UPDATE_PRICE_INTERVAL` variable in milliseconds, which states how often prices should be updated (aka heartbeat), [code](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/on-chain-relayer/src/core/update-conditions/time-condition.ts)

- a `value-deviation` condition described by `MIN_DEVIATION_PERCENTAGE` variable which indicates how much value should change in order to trigger the price update, [code](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/on-chain-relayer/src/core/update-conditions/value-deviation-condition.ts).

:::info
Relayers are permissionless and anyone could run the service as the data is eventually validated on-chain using conditions defined by the protocol stakeholders. Moreover, the relayers are designed to work in parallel and we recommend having multiple (ideally independent) instances to mitigate the risks of a single point of failure and censorship.
:::

### Contracts

The on-chain relayer is based on the [PriceFeedsAdapter contract](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/on-chain-relayer/contracts/core/RedstoneAdapterBase.sol) which is responsible for:

- storing all price feeds' symbols (mappings to RedStone dataFeedId),
- storing price feeds values,
- updating price feeds values in batch,
- storing information regarding the round number and timestamp of the last update,
- getting prices for multiple feeds' values in a single call.

Additionally, if the protocol wants to be 100% compatible with the Chainlink PriceFeed architecture, it's possible to deploy additional [PriceFeed](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/on-chain-relayer/contracts/price-feeds/PriceFeedBase.sol) contracts to mimic this solution.

### Environment variables

| Variable                   | Description                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| RELAYER_ITERATION_INTERVAL | Time interval in which the relayer tries to update prices                                                                                  |
| UPDATE_CONDITIONS          | Array of parameters that describes what decides if prices can be updated, currently acceptable parameters are 'time' and 'value-deviation' |
| UPDATE_PRICE_INTERVAL      | Time interval that describes how often prices should be updated if UPDATE_CONDITIONS contains the "time" parameter                         |
| MIN_DEVIATION_PERCENTAGE   | Minimum deviation of the prices that triggers prices update if UPDATE_CONDITIONS contains "value-deviation"                                |
| RPC_URL                    | URL of RPC for interaction with blockchain                                                                                                 |
| CHAIN_NAME                 | Chain name of the blockchain relayer should work on                                                                                        |
| CHAIN_ID                   | Chain id of the blockchain relayer should work on                                                                                          |
| PRIVATE_KEY                | Private key of the wallet with funds on a proper network to push prices to the adapter contract                                            |
| ADAPTER_CONTRACT_ADDRESS   | Address of the adapter contract deployed on a proper network                                                                               |
| DATA_SERVICE_ID            | RedStone Wrapper parameter that describes what data services should be used to fetch the price                                             |
| UNIQUE_SIGNERS_COUNT       | RedStone Wrapper parameter that describes how many unique signers should sign price data                                                   |
| DATA_FEEDS                 | RedStone Wrapper parameter that describes what tokens will be used                                                                         |
| CACHE_SERVICE_URLS         | RedStone Wrapper parameter that describes what cache services URLs will be used to fetch the price                                         |
| GAS_LIMIT                  | Gas limit used to push data to the price feed contract                                                                                     |
