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
2. [Adjust Javascript code of your dApp](#2-adjust-javascript-code-of-your-dapp) to inject the additional payload with data feeds (otherwise you will get smart contract errors).

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

Then you can wrap your ethers contract pointing to the selected [RedStone data service id.](https://app.redstone.finance/#/app/data-services) You can (optionally) specify a number of unique signers and data feed identifiers. You must also pass `authenticatedGateways` (see [below](#authenticated-gateways)) - if this code runs in your dApp's frontend, point it at your own proxy rather than at RedStone directly (see the warning below).

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
- `url` - for a private use case where this code never reaches end users (a backend, a script, a bot), set this to the actual gateway address RedStone gives you. If this code runs in a dApp's frontend (public), set it to your own proxy's address instead (see below).
- Rate limit on RedStone's own gateway: **1 request/second per API key**.
- You can list more than one entry to query multiple gateways for better availability, each with its own key.

:::warning Don't call RedStone's gateway directly from a dApp's frontend
A dApp's frontend runs in every visitor's browser, so anything in it - including an API key - is public: readable from the page source, the JS bundle, or the network tab. It also means every visitor's browser would be hitting RedStone under the same key, which blows past the 1 request/second limit almost instantly. Repeated or sustained rate limit violations can get the key blocked for a longer period, or permanently.

Instead, run a small proxy/cache backend that you control:

- It holds your real API key and fetches data packages from RedStone's authenticated gateway on your behalf, caching the response for a few seconds - this is what keeps you within the rate limit no matter how much traffic your dApp gets.
- It re-serves that cached response in the same shape as RedStone's gateway (see [Building your own proxy](#building-your-own-proxy) below), at a URL you control.
- Your dApp's frontend then points `authenticatedGateways` at *your* proxy's URL with `apiKey: ""` - the real key is never sent from the browser, since your proxy doesn't need to check it.

If your calling code instead runs somewhere trusted that never reaches end users (a backend relayer, a bot, a script), you can skip the proxy and pass your real API key directly, the same way as in the example above.
:::

##### Building your own proxy

Your proxy just needs to sit in front of RedStone's authenticated gateway: forward incoming requests to it with your real API key attached, then pass the response straight back - publicly, with no API key required from the caller. There's no need to pick and reimplement individual endpoints; simply forward everything through as-is.

Cache the response for a few seconds instead of forwarding every single request 1:1 - that's what keeps one proxy comfortably under RedStone's rate limit no matter how many end users your dApp has.

To get an API key (and, for a private/backend use case, the gateway `url` to pair it with), reach out to the RedStone team on Telegram: **TODO: add Telegram handle**.

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

The manual payload could be obtained using the following code. As with the wrapper above, `authenticatedGateways` is required here too - see [Authenticated gateways](#authenticated-gateways). If this code runs in a dApp's frontend, point it at your own proxy the same way as above rather than passing your real API key.

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

Off-chain functions such as `requestDataPackages` also require the `authenticatedGateways` parameter described in [Authenticated gateways](#authenticated-gateways) above. If the code calling them is only reachable from your own backend, you can pass your real API key directly; if it's reachable by end users, point it at your own proxy instead (see [Building your own proxy](#building-your-own-proxy)).
