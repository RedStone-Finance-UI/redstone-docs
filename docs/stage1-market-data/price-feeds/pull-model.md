---
sidebar_position: 2
sidebar_label: "Pull model"
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Real-time Data from Diverse Sources

RedStone's Pull Model injects data directly into user transactions, maximizing gas efficiency while simplifying dApp data access.
This streamlined approach handles the entire process in a single transaction, significantly reducing costs.

Best suited for dApps that require low-latency data.

## Installation

Install [@redstone-finance/evm-connector](https://www.npmjs.com/package/@redstone-finance/evm-connector) and [@redstone-finance/sdk](https://www.npmjs.com/package/@redstone-finance/sdk) from NPM registry

### Hardhat

<Tabs>
  <TabItem value="Yarn">

```bash
yarn add @redstone-finance/evm-connector @redstone-finance/sdk
```

  </TabItem>
  <TabItem value="NPM">

```bash
npm install @redstone-finance/evm-connector @redstone-finance/sdk
```

  </TabItem>
</Tabs>

### Foundry

Foundry installs dependencies using git submodules. Thus additional steps are needed to [install dependencies](https://book.getfoundry.sh/projects/dependencies).

In foundry project:

1. Install `@redstone-finance/evm-connector` - it will install current code from main branch

   ```bash
   forge install redstone-finance/redstone-oracles-monorepo
   ```

2. Install `@OpenZeppelin` contracts (dependency of `@redstone-finance/evm-connector`) - it will install current code from main branch

   ```bash
   forge install OpenZeppelin/openzeppelin-contracts@v4.9.5
   ```

3. Add libraries to `remappings.txt`

   ```bash
   echo "@redstone-finance/evm-connector/dist/contracts/=lib/redstone-oracles-monorepo/packages/evm-connector/contracts/
   @openzeppelin/contracts=lib/openzeppelin-contracts/contracts/" >> remappings.txt
   ```

## Usage

:::tip TLDR;
You need to do 2 things:

1. [Adjust your smart contracts](#1-adjust-your-smart-contracts) to include the libraries responsible for data extraction and verification
2. [Adjust Javascript code of your dApp](#2-adjust-javascript-code-of-your-dapp) to inject the additional payload with data feeds, using API key(s) from RedStone - if this code runs in your dApp's frontend, you'll also need a proxy in front of RedStone's gateway (otherwise you will get smart contract errors).

:::

### 1. Adjust your smart contracts

:::caution Heads up

1. Our contracts require `solidity > 0.8.4`. If your code is written in an older version please use the [Manual Payload](#manual-payload).
2. If you work with 3rd party aggregators, make sure that they also support passing the additional payload.
3. Please don't use Remix to test RedStone, as Remix does not support modifying transactions in the way that the evm-connector does
4. We strongly recommend having some upgradability mechanism for your contracts (it can be based on multisig or DAO). This way, you can quickly replace data providers in case of any issues.

:::

You need to apply a minimum change to the source code to enable smart contract to access data. Your contract needs to extend one of our [base contracts](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/evm-connector/contracts/data-services), depending on which data service are you going to use.

<details>
    <summary> List of base contracts with data services </summary>

| Base Contract                                                                                                                                                                                           | Data service with the list of feeds                                                             | Status     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------- |
| [PrimaryProdDataServiceConsumerBase.sol](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/evm-connector/contracts/data-services/PrimaryProdDataServiceConsumerBase.sol) | [redstone-primary-prod](https://app.redstone.finance/#/app/data-services/redstone-primary-prod) | Production |

💡 Note: Services with `Production` status have got multiple nodes deployed and are professionally monitored.

  </details>

```sol
import "@redstone-finance/evm-connector/contracts/data-services/MainDemoConsumerBase.sol";

contract YourContractName is MainDemoConsumerBase {
  ...
}
```

You should pass the data feed id converted to `bytes32`.

<Tabs>
  <TabItem value="Getting a single value">

```sol
  uint256 ethPrice = getOracleNumericValueFromTxMsg(bytes32("ETH"));
```

  </TabItem>
  <TabItem value="Getting several values">

```sol
  bytes32[] memory dataFeedIds = new bytes32[](2);
  dataFeedIds[0] = bytes32("ETH");
  dataFeedIds[1] = bytes32("BTC");
  uint256[] memory values = getOracleNumericValuesFromTxMsg(dataFeedIds);
  uint256 ethPrice = values[0];
  uint256 btcPrice = values[1];
```

  </TabItem>
</Tabs>

For all the supported feeds we provide [UI with charts and historical data](https://app.redstone.finance)

💡 Note: You can also override the following functions (do it at your own risk):

- `isTimestampValid(uint256 receivedTimestamp) returns (bool)` - to enable custom logic of timestamp validation. You may specify a shorter delay to accept only the most recent price fees. However, on networks with longer block times, you may extend this period to avoid rejecting too many transactions.

- `aggregateValues(uint256[] memory values) returns (uint256)` - to enable custom logic of aggregating values from different providers (by default this function takes the median value). For example, you may request values from providers to be strictly equal while dealing with discrete numbers.

- `getAuthorisedSignerIndex(address _signerAddress) returns (uint256)` - to whitelist additional signers or remove corrupted ones.

- `getUniqueSignersThreshold() returns (uint256)` - to modify number of required signers. The higher number means greater reliability but also higher gas costs.

### 2. Adjust Javascript code of your dApp

You should also update the code responsible for submitting transactions. If you're using [ethers.js](https://github.com/ethers-io/ethers.js/), we've prepared a dedicated library to make the transition seamless.

#### Contract object wrapping

First, you need to import the wrapper code to your project

<Tabs>
  <TabItem value="Javascript">

```js
const { WrapperBuilder } = require("@redstone-finance/evm-connector");
```

  </TabItem>
  <TabItem value="Typescript">

```js
import { WrapperBuilder } from "@redstone-finance/evm-connector";
```

  </TabItem>
</Tabs>

Then you can wrap your ethers contract pointing to the selected [RedStone data service id.](https://app.redstone.finance/#/app/data-services) You can (optionally) specify a number of unique signers and data feed identifiers, and must also pass `authenticatedGateways` (see [below](#authenticated-gateways)).

```js
import { getSignersForDataServiceId } from "@redstone-finance/sdk";

const yourEthersContract = new ethers.Contract(address, abi, provider);

const wrappedContract = WrapperBuilder.wrap(contract).usingDataService({
  dataPackagesIds: ["ETH", "BTC"],
  authorizedSigners: getSignersForDataServiceId(DATA_SERVICE_ID),
  authenticatedGateways: [{ url: "<your-proxy-url>", apiKey: "" }],
});
```

Now you can access any of the contract's methods in exactly the same way as interacting with the ethers-js code:

```js
wrappedContract.executeYourMethod();
```

#### Authenticated gateways

Fetching data packages (both for contract wrapping and for the [manual payload](#manual-payload) flow) requires an `authenticatedGateways` parameter: a list of gateways to query, each with its own API key.

```ts
authenticatedGateways: { url: string; apiKey: string }[];
```

- `apiKey` - sent as an `x-api-key` header on every request to that gateway.
- `url` - the gateway address to call. For backend/script/bot code, use the authenticated gateway URL RedStone gives you (see below); frontend code must instead point it at your own proxy.
- Rate limit on RedStone's own gateway: **1 request/second per API key**.
- For better availability, use both (gateway, API key) pairs RedStone gives you - the second one serves as a fallback.

:::warning Don't call RedStone's gateway directly from a dApp's frontend
A frontend runs in every visitor's browser, so any API key embedded in it is exposed - readable straight from the page source, the JS bundle, or a network inspector. Anyone can extract it and hammer RedStone's gateway with it directly, exhausting your 1 request/second limit and getting the key rate-limited or blocked for every legitimate user of your dApp.

Instead, run a small proxy/cache backend that you control: it holds your real API key, fetches from RedStone's gateway, and caches the response for a few seconds so you stay within the rate limit regardless of traffic. Point your frontend's `authenticatedGateways` at *your* proxy's URL with `apiKey: ""`.

Backend code that never reaches end users (a relayer, a bot, a script) can skip the proxy and pass the real API key directly, as in the example above.
:::

##### Proxy setup

Put a proxy in front of RedStone's gateway that caches responses and attaches your API key on the way through, so callers never see it.

A CDN like AWS CloudFront can do this directly - just add your API key as a custom origin request header and enable caching, no custom backend or edge functions needed.

To get an API key (and, for backend/script/bot use, the gateway `url` to pair it with), reach out to the RedStone team on Telegram: **TODO: add Telegram handle**.

#### Testing

##### Hardhat

If you'd like to use the wrapper in a test context, we recommend using a mock wrapper so that you can easily override the oracle values to test different scenarios. To use the mock wrapper just use the `usingMockData(signedDataPackages)` function instead of the `usingDataService` function.

```js
const {
  SimpleNumericMockWrapper,
} = require("@redstone-finance/evm-connector/dist/src/wrappers/SimpleMockNumericWrapper");

const wrappedContract = WrapperBuilder.wrap(
  yourContract,
).usingSimpleNumericMock({
  mockSignersCount: 10,
  dataPoints: [{ dataFeedId: "ETH", value: 1000 }],
});
await wrappedContract.yourMethod();
```

You can see more examples of mocking data [here.](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/evm-connector/test/mock-wrapper)

##### Foundry

To use RedStone with Foundry in test context, we recommend using foundry `vm.ffi` function to generate mocked dataPackages.
We have prepared [repository](https://github.com/redstone-finance/minimal-foundry-repo) showing how we can integrate foundry with redstone.

- [consuming redstone payload in foundry contract](https://github.com/redstone-finance/minimal-foundry-repo/blob/main/test/Counter.t.sol)
- [generating mock redstone payload](https://github.com/redstone-finance/minimal-foundry-repo/blob/main/getRedstonePayload.js)

## Manual payload

This approach is helpful if you need to pass the pricing data from one contract to another in your protocol.

It's also a solution for a case, where your contracts are written in solidity in a version lower than `0.8.4` it could be problematic to extend from the `RedstoneConsumerBase` contract.
In that case, we recommend to deploy a separate `Extractor` contract that will contain the verification logic:

```sol
pragma solidity 0.8.4;

import "@redstone-finance/evm-connector/contracts/mocks/RedstoneConsumerNumericMock.sol";

contract RedstoneExtractor is RedstoneConsumerNumericMock {

  function extractPrice(bytes32 feedId, bytes calldata redstonePayload) public view returns(uint256) {
      return getOracleNumericValueFromTxMsg(feedId);
  }
}
```

and proxy the payload from your originating contract

```sol
function getPriceFromRedstoneOracle(bytes32 feedId, bytes calldata redstonePayload) public view returns(uint256) {
  return redstoneExtractor.extractPrice(feedId, redstonePayload);
}
```

The manual payload could be obtained using the following code. `authenticatedGateways` is required here too - see [Authenticated gateways](#authenticated-gateways).

```js
const redstonePayload = await new DataServiceWrapper({
  dataServiceId: "redstone-primary-demo",
  dataFeeds: ["ETH"],
  authenticatedGateways: [{ url: "<your-proxy-url>", apiKey: "" }],
}).getRedstonePayloadForManualUsage(yourContract);

// Interact with the contract (getting oracle value securely)
const price = await yourContract.getPriceFromRedstoneOracle(redstonePayload);
```

## Working demo

You can see examples of the `@redstone-finance/evm-connector` usage in our [dedicated repo with examples](https://github.com/redstone-finance/redstone-evm-examples).

## RedStone SDK

Even though the most popular way of using RedStone data is to pass it on-chain one may want to consume it off-chain.
For this scenario we created [@redstone-finance/sdk](https://www.npmjs.com/package/@redstone-finance/sdk).

Off-chain functions such as `requestDataPackages` also require the `authenticatedGateways` parameter - see [Authenticated gateways](#authenticated-gateways).
