---
sidebar_position: 2
sidebar_label: "Types of data"
---

# Types of data

Oracles deliver data feeds directly to dApps or blockchains for the correct execution of transactions in smart contracts. Throughout the past years, the DeFi market has shown various expectations and needs towards the setup of oracle feeds. RedStone is at the forefront of innovation answering the needs of developers in that sector. Therefore, we identify the following types of data feeds:

1. **Market Feed**

   The regular market price derived from centralized and decentralized exchanges based on the current supply and demand for a given asset, i.e., ETH / USD spot price.

1. **Fundamental feed**

   The fundamental price represents an estimate of the fair market value of an asset, based on its exchange rate to other assets or its underlying reserves.

   :::warning

   The fundamental feed provides a less volatile price but often introduces additional trust assumptions related to the structure and liquidity of the underlying reserves.

   :::

   a) **Contract Rate Feed**

   A ratio between the underlying asset and its derivative derived from the smart contract of a protocol, i.e., wstETH / stETH rate derived from Lido contract or weETH / eETH derived from Ether.fi contract.

   b) **Net Asset Value (NAV) Feed**

   A data feed based on institutional API (i.e., CESR or SOFR) or another source that informs about the value of assets backing tokens issued against it, i.e., Blackrock BUIDL.

   c) **Proof of Reserve Feed**

   The custom implementation of logic supporting a particular oracle, i.e., Bitcoin Staking oracle. For example: LBTC / BTC price feed, derived based on the number of LBTC minted and the total amount of BTC deposited into Lombard's system on the Bitcoin chain. Detailed description [here](./3-lombard.md).

| Feed Type                 | Denomination                                                              | Deviation Comes From                          | Complexity of Delivery                                   |
| :------------------------ | :------------------------------------------------------------------------ | :-------------------------------------------- | :------------------------------------------------------- |
| **Market Feed**           | Mainly USD, can also be another currency i.e., ETH / BTC                  | Market trading                                | Relatively simple                                        |
| **Contract Rate Feed**    | Underlying asset i.e., ETH for Ethereum LSTs                              | Specified ratio changes in the smart contract | Requires understanding of edge cases and on-chain source |
| **Net Asset Value Feed**  | Custom, i.e., for CESR it's a % yield from ETH staking, usually USD value | Custom, usually every 24 hours from an API    | Depends on the source, usually medium difficulty         |
| **Proof of Reserve Feed** | Custom, i.e., BTC in the case of Lombard internal oracle                  | Custom, i.e., each X minutes for Lombard      | Usually work-intensive                                   |
