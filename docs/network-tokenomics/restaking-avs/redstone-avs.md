---
sidebar_position: 2
sidebar_label: "RedStone AVS"
---

# RedStone AVS

RedStone AVS is an innovative solution that leverages the concept of restaking to create a decentralized process for delivering price data to the blockchain.
This system is built on the [Othentic](https://www.othentic.xyz/) framework, ensuring that the price feeds are both reliable and secure.

The process begins with the collection of price data from multiple oracle nodes.
These collected data points are then subjected to a series of verifications, including checks for accuracy, consistency, and the validity of digital signatures.
Once the data passes these initial checks, the median price and the corresponding timestamp are calculated from the gathered information.
This calculated result is then verified by the AVS operators.
If the operators confirm the correctness of the result, it is subsequently transmitted to the blockchain.
This method ensures that the price data reaching the blockchain is both accurate and verified, providing a high level of trust and security in decentralized financial applications.

## Implementation of the Push Model with AVS

The RedStone AVS solution represents a novel implementation of the [Push](/docs/stage1-market-data/price-feeds/push-model) model for delivering data to the blockchain.
In the Push model, an off-chain relayer collects data and sends it to the blockchain, where the validation process takes place.
This method, while effective, often resulted in higher data usage on-chain due to the need for comprehensive validation processes.

In contrast, the new implementation through AVS moves the validation of data off-chain, significantly reducing on-chain gas consumption.
In this model, the price data collected from oracle nodes undergo rigorous off-chain validation to ensure its accuracy and consistency.
This validation process also includes checking digital signatures to confirm the authenticity of the data.
Once this off-chain validation is complete, the results — specifically the median price and timestamp — are then verified by AVS operators. These operators ensure that the off-chain calculations have not been tampered with.
After validation, the results, along with signed confirmations of their accuracy, are sent to the blockchain.

On-chain, the system verifies only the aggregated BLS signature from the AVS operators.
This streamlined process greatly enhances the scalability of the solution, as it allows data to be gathered from an unlimited number of oracle nodes.
In the traditional implementation, the relayer typically selects a specific subset of prices closest to the median and transmits only that subset to the blockchain.
However, with the AVS approach, only the final median price and timestamp are directly submitted to the blockchain, meaning the gas consumption does not scale with the number of oracle nodes used to calculate the median.
This approach not only reduces the cost associated with on-chain operations but also enables the system to handle a larger volume of data inputs without compromising efficiency.
