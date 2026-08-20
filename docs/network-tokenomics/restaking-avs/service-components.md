---
sidebar_position: 3
sidebar_label: "Service Components"
---

# Service Components

The AVS operates through several key components, each playing a crucial role in the validation and aggregation process.

![RedStone AVS diagram](/img/avs.png)

## Task Performer

The Task Performer is responsible for fetching data from multiple oracle nodes using a DDL (Data Distribution Layer).
It then verifies the retrieved data for correctness, consistency, and proper signing.
Subsequently, it extracts the timestamp and calculates the median price from the data obtained from various nodes.
Simultaneously, it checks the current price and timestamp returned by the smart contract.
If the price has changed by more than a predefined deviation or if more than a specified time has passed since the last update, the calculated result is sent to the aggregator.

## Attester

Attesters are responsible for verifying the result calculated by the Performer and casting a vote either in favor or against based on this verification.
Each such vote must be signed by the Attester.
The verification process is carried out using the Validation API.

## Validation API

The Validation API is a service that verifies the accuracy of the result calculated by the Task Performer.
The API verifies the data returned by the oracle nodes.
For each node, it checks if its public key is included in a predetermined whitelist.
Additionally, the median and timestamp calculated by the Performer are verified.
The verification result, a Boolean value, is returned to the Attester.

## Aggregator

The Aggregator acts as a hub, receiving results computed by the Task Performer.
These results are sent to a pool of Attesters, who have previously registered with the AVS network through the Aggregator.
The Aggregator then monitors for events originating from Attesters, specifically signed votes indicating their approval or disapproval of the verified result.
These votes are aggregated into a collective BLS signature.
Finally, the consolidated result from the Task Performer, accompanied by the BLS signature, is transmitted to the corresponding smart contract deployed on the blockchain.

## Smart contracts

After being verified by Attesters, the Task Performer's result is sent to the blockchain.
Smart contracts do not need to re-verify the received data.
It is sufficient for them to check if the data has been signed by a sufficient number of Attesters.
This approach significantly saves on gas fees.
If the new price receives enough votes, it is saved in the contract along with a new timestamp.
Additionally, the Attesters are credited with an appropriate reward in the contract for their work, which can be claimed later.

:::info
The address of the `AttestationCenter` contract, where the calculation result is sent:

- Testnet: [0x6af9B9272fc72CaC55ccDF6c2BC2c5703a65a187](https://sepolia.basescan.org/address/0x6af9B9272fc72CaC55ccDF6c2BC2c5703a65a187)
- Mainnet: [0x2B766957ce3dbab9eC4b227f5086855CeE7a1ad6](https://basescan.org/address/0x2B766957ce3dbab9eC4b227f5086855CeE7a1ad6)

:::

## Network Participation and Roles

RedStone will kickstart the network by managing the Task Performer and Aggregator.
However, we encourage external operators to join and contribute to the network's decentralization.
To participate, operators need to set up an Attester and a corresponding Validation API.
For detailed instructions on how to configure, register, and run an operator, please refer to our [guide](/docs/network-tokenomics/restaking-avs/running-avs-operator-mainnet).
