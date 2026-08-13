---
sidebar_position: 4
sidebar_label: "Rewards"
---

# Rewards

RedStone AVS rewards operators and stakers for participating in the decentralized validation of data.  
This page explains the mechanisms behind voting power, reward calculation and distribution, as well as the current status of slashing in the system.

## Voting Power

Voting power is a crucial concept within RedStone AVS, representing an operator's influence on the task validation process.
Every time a task containing the price of a given asset is submitted, multiple operators independently validate it.
To proceed and be committed to the smart contract, a task must receive positive validations from operators whose combined voting power exceeds **2/3 of the total voting power**.

An operator's voting power is calculated based on their shares in the staking contracts (also referred to as strategies) supported by the AVS. RedStone AVS currently supports the following staking strategies:

1. **RED Strategy**
   (staking contract: [0x903a1FF023a35EfeD333ee9D6bF30629A098B9ed](https://etherscan.io/address/0x903a1FF023a35EFeD333ee9D6bF30629A098B9ed))

2. **EIGEN Strategy**
   (staking contract: [0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7](https://etherscan.io/address/0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7))

3. **ether.fi Strategy**
   (staking contract: [0x7079A4277eAF578cbe9682ac7BC3EfFF8635ebBf](https://etherscan.io/address/0x7079A4277eAF578cbe9682ac7BC3EfFF8635ebBf))

Each strategy is assigned a specific weight.
An operator's total voting power is the sum of the products of these weights and their staked amount in each respective staking contract.
This can be expressed by the following formula:

<div style={{"text-align": "center"}}>
<img src="/img/avs-voting-power.svg" alt="Voting power formula"></img>
</div>

The weights are adjusted to favor RED stakers, ensuring they have the majority of the voting power and, consequently, the majority of the rewards.

To maintain a balanced network and prevent centralization, RedStone AVS enforces a **voting power cap** per operator. This means that an operator’s actual voting power is the minimum of:

- The value computed by the weighted staking formula above, and
- The predefined maximum voting power limit

This mechanism ensures that no single operator can dominate validation outcomes, even if they stake disproportionately large amounts.

:::tip
The voting power of a given operator can be found out using the function in the [`AttestationCenter`](/docs/network-tokenomics/restaking-avs/service-components#smart-contracts) contract:

```solidity
function votingPower(address _operator)
```

:::

## Reward calculation

In RedStone AVS, operators are rewarded for each validation they perform and each vote they cast on a task.
Once a task is finalized, the [Aggregator](/docs/network-tokenomics/restaking-avs/service-components#aggregator) sends the task result along with all operator votes to the smart contract called `AttestationCenter`.
At this point, each operator who participated in the validation by submitting a vote receives a reward.

:::important
Rewards for contributing to RedStone AVS are paid out in [RED](https://etherscan.io/address/0xc43c6bfeda065fe2c4c11765bf838789bd0bb5de) tokens.
:::

The actual reward amount for each operator is calculated by a separate smart contract called `FeeCalculator`.
This contract holds the reward value allocated for each task and distributes it among eligible operators based on their voting power at the time of voting.

The reward for each operator is calculated **proportionally to their voting power**, according to the formula:

<div style={{"text-align": "center"}}>
<img src="/img/avs-reward-calculation.svg" alt="Reward calculation formula"></img>
</div>

Operators run by RedStone are excluded from this reward calculation.

:::tip
Accumulated rewards for each operator are stored in the [`AttestationCenter`](/docs/network-tokenomics/restaking-avs/service-components#smart-contracts) contract. Operators can query their pending rewards using the following function:

```solidity
function getOperatorPaymentDetail(uint256 _operatorId)
```

The address of the current `FeeCalculator` can be found by searching for the `SetFeeCalculator` event (topic0: 0x83b9ee7f260088fdd4ee12aa07fa7daebc115d796b6bfb55bfb0fc839bccff2d).
:::

## Rewards distribution

Rewards accumulated in the AVS contracts are distributed **weekly** to both operators and their stakers.
This distribution is handled through the [EigenLayer Rewards v2](https://docs.eigenlayer.xyz/eigenlayer/concepts/rewards/rewards-concept) mechanism, as specified in [ELIP-001](https://github.com/eigenfoundation/ELIPs/blob/main/ELIPs/ELIP-001.md).

This process involves integrating with EigenLayer's [Rewards Coordinator](https://github.com/Layr-Labs/eigenlayer-contracts/blob/main/docs/core/RewardsCoordinator.md) contract, to which the following data is submitted:

- The rewards collected by individual operators.
- A list of supported strategies with their associated weights.
- The time period over which the rewards were earned.

Based on this data, the following steps are performed:

1. **Operator fee deduction**:  
   Each operator can define a margin percentage (from 0% to 100%) that determines how much of their total reward they retain. By default, this margin is 10%. The deducted portion goes directly to the operator as their service fee.

2. **Staker reward distribution**:  
   The remaining reward amount is distributed among the stakers of that operator. This includes the operator themselves, if they have their own stake. The distribution is proportional to each staker’s stake amount and the weight of the strategy they staked through.

The actual reward computations are performed off-chain, then submitted on-chain where they can be verified before becoming claimable. For a detailed breakdown of this process, refer to the EigenLayer [guide](https://docs.eigenlayer.xyz/developers/HowTo/build/submit-rewards-submissions).

After distribution, operators and stakers can [claim their rewards](https://docs.eigenlayer.xyz/restakers/restaking-guides/claim-rewards-app) using the EigenLayer UI.

## Slashing

Currently, **RedStone AVS does not implement any slashing mechanism**.

If slashing is introduced in the future, it will initially be limited to the correctness of data validation performed by operators, rather than their availability or uptime.

Any changes related to slashing policies or enforcement will be **announced well in advance** to ensure transparency and allow all participants to prepare accordingly.
