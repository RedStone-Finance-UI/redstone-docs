---
sidebar_position: 3
sidebar_label: "BTCFI (Lombard LBTC feed)"
---

# Lombard LBTC feed

The document below explains how RedStone calculates and delivers the on-chain fundamental value of the LBTC token.

## Lombard protocol and LBTC

### Overview

Lombard BTC Staking Protocol is a platform that allows users to stake Bitcoin (BTC) in a trustless and secure manner. This process is powered by the Babylon Network, which integrates Bitcoin's security with the flexibility of Proof-of-Stake (PoS) systems. The Lombard protocol introduces LBTC, a liquid staking token (LST) that is backed 1:1 by BTC on the Bitcoin blockchain. The LBTC token is designed as an omni-chain token, meaning it can be minted and transferred across multiple EVM chains. Currently, LBTC minting is enabled on the Ethereum network, and the Lombard team is actively working to expand support for new chains.

### Minting LBTC

To mint LBTC, a user first stakes BTC by sending it to a specific address on the Bitcoin blockchain controlled by the Lombard protocol. At this stage, the BTC is locked, but LBTC is not yet minted. After the required blockchain confirmations (typically six, which takes about an hour), the user submits cryptographic proof with the target chain (currently Ethereum) and the amount of LBTC to mint. Finally, the LBTC is minted directly into the user's wallet on the selected EVM chain.

### Burning LBTC

To burn LBTC and unstake BTC, a user initiates the burn by sending LBTC back to the Lombard protocol on the EVM chain. Once burned, the BTC on the Bitcoin blockchain enters a 7-day withdrawal period for security reasons. After this period, the unstaked BTC is released and transferred to the user's designated Bitcoin address​.

## How RedStone delivers LBTC/BTC fundamental price

### Overview

RedStone delivers LBTC/BTC fundamental price using both [pull](/docs/stage1-market-data/price-feeds/pull-model) and [push](/docs/stage1-market-data/price-feeds/push-model) models. The price is calculated as a ratio between BTC controlled by the Lombard protocol and the total supply of LBTC tokens across all supported chains. There are also adjustments for **total_unclaimed_lbtc** (LBTC tokens that are not yet minted but already have correlated BTC tokens deposited to the Lombard protocol) and **total_btc_unstakes_pending** (BTC tokens in the 7-day withdrawal period).

Currently, the value has an upper cap of 1, meaning a healthy value is 1, indicating the protocol’s stability. A value of 1 also signifies that there are as many or more BTC held by the protocol than there are LBTC tokens in circulation, ensuring full or over-collateralization. For example, if half of the BTC tokens disappear from wallets controlled by Lombard, but the LBTC supply remains the same, the ratio would drop to 0.5.

### Calculating LBTC/BTC fundamental price (pull model)

The following algorithm runs on each oracle node independently, every 20 minutes:

1. Fetch the list of BTC addresses from the Lombard API
1. For each new (not processed by RedStone previously) address
   1. Verify the ownership of the address using Lombard’s root public key
   1. Save the address in the oracle-node persistent storage
1. Calculate **total_btc_balance**, by summing up Bitcoin balances for all the addresses from the oracle-node persistent storage
1. Calculate **total_btc_unstakes_pending** using the Lombard API. If the value is negative, 0 is used
1. Calculate **total_supply_on_evms**, by summing up total supplies of the LBTC token on all supported EVM chains
1. Calculate **total_unclaimed_lbtc** using the Lombard API. If the value is negative, 0 is used
1. Calculate the final ratio using the following formula: **(total_btc_balance - total_btc_unstakes_pending) / (total_supply_on_evms + total_unclaimed_lbtc)**
1. Save the value with the timestamp to persistent oracle node storage
1. Calculate median of the values saved in the persistent oracle node storage within the last 6 hours. This step is important to increase robustness and security and ignore temporary spikes caused by delays between chains.
1. Sign the value using private key and broadcast it to the RedStone distributed data layer (DDL)

### Saving LBTC fundamental price on Ethereum (push model)

The value from the pull model is saved on the Ethereum network. It’s available in the following contract: [0xb415eAA355D8440ac7eCB602D3fb67ccC1f0bc81](https://etherscan.io/address/0xb415eAA355D8440ac7eCB602D3fb67ccC1f0bc81) through the standard AggregatorV3Interface interface. It's being updated at least every 24 hours or more often, if the on-chain value deviates from current value by more than 1%.

- [Link to the feed details in the RedStone App](https://app.redstone.finance/app/feeds/ethereum-mainnet/lbtc_fundamental/)
