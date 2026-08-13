---
sidebar_position: 1
sidebar_label: "What is Atom?"
---

# RedStone Atom

When an oracle update triggers a liquidation on a lending market, in the standard model, MEV bots race to capture the liquidation bonus. The protocol and its users see none of it. Over time, this leakage adds up: liquidation MEV has extracted over $500 million from DeFi lending markets cumulatively. Fixed liquidation bonus size is also dangerous especially for looped Real World Assets (RWAs), limiting the market potential.

RedStone Atom changes the model. Instead of publishing a price update and letting bots compete for what follows, it runs an offchain auction before the price goes onchain. The winning solver gets the exclusive right to execute the liquidation atomically when the price is published, and the auction proceeds flow back to the protocol.

---

## The Problem

Every oracle update that triggers a liquidation creates an extractable value event. In the standard model:

* The oracle publishes a price
* MEV bots race to liquidate, burning gas in the process
* The winner captures the full liquidation bonus
* Failed bids waste gas
* The protocol and its users receive nothing

Most lending protocols accept this as the cost of doing business. Atom treats it as a solvable infrastructure problem.

---

## How Atom Works

Atom intercepts the value before it can leak.

1. **Price change detected.** RedStone oracle identifies a price movement that would trigger one or more liquidations before publishing it onchain.
2. **Offchain auction opens.** Atom triggers a sealed-bid auction among whitelisted solvers. The auction completes in under 300ms.
3. **Solvers compete.** Each solver bids for the exclusive right to execute the liquidation.
4. **Atomic settlement.** The winning solver's bid, the price update, and the liquidation execute in a single atomic transaction onchain. There is no gap between the price change and the settlement, making front-running structurally impossible.
5. **Fallback guarantee.** If no solver submits a valid bid, the standard price update proceeds immediately avoiding any delay in the oracle feed update.

The value that was previously captured by MEV bots is now captured by the oracle and returned to the protocol. The protocol decides how to use it: subsidizing borrower rates, boosting supplier yields, or funding development.

---

## Who Benefits

**Borrowers** benefit indirectly: when protocols earn more from liquidations, they can reinvest that revenue to subsidize lower borrow rates or offer better terms.

**Lenders** benefit from auction proceeds redistributed as yield enhancement, getting the value that would otherwise have left the ecosystem entirely.

**Asset issuers** benefit because protocols and curators using Atom can safely offer higher LTV ratios, making a tokenized asset more competitive as collateral.

**Risk curators and protocols** receive auction proceeds and control how that revenue is deployed: as yield, incentives, or protocol reserves.

---

## Integration

Atom requires **zero code changes** to existing protocol or lending market contracts. Protocols do not even need to change the contract address they use for the existing RedStone feed. There are no re-audits and no new trust assumptions beyond those already present in an existing RedStone integration.

To activate RedStone Atom on a feed:

1. Connect it to an Atom-integrated feed, compatible with standard price feed interfaces.
2. Supply an address to receive the captured OEV.

RedStone deploys the necessary contracts on the designated chain and notifies your team when the upgrade is live.

**Requirements:**

* RedStone must be the primary oracle for the market
* The specific market where Atom is to be enabled needs to have $5M TVL or more

**Who can be a solver:** bot operators, MEV and quant teams, in-house liquidation teams, vault curators with liquidation rights, and any entity that can profitably execute a liquidation after a price update.

→ For solver integration details, see the [Integration Guide](./integration-guide.md).

---

## Security

Security is a common concern for protocols evaluating services capturing Oracle Extractable Value such as Atom. The below questions come up most frequently.

**Does the auction slow down price updates?**
The auction runs off-chain and completes in under 300ms; if no valid bid is received within that window, the standard price update proceeds immediately, identical to the protocol's behavior before Atom was activated. On chains where Atom is live, liquidation speed can actually improve relative to standard push feeds, because Atom monitors prices continuously off-chain and triggers updates the moment a liquidation becomes possible, rather than waiting for a scheduled heartbeat or deviation threshold to be crossed.

**What happens if the service goes down?**
RedStone maintains the traditional price update stream in parallel with the auction infrastructure; if the auction service is unavailable, the protocol falls back to standard oracle behavior automatically, with no action required from the protocol team. The only effect of a service interruption is that OEV is not captured on that transaction — the feed continues to function exactly as it did before Atom was enabled.

Atom also introduces no new security assumptions at the protocol level: there are no code changes to lending market contracts, no re-audits required, and no new external dependencies. Activation requires only whitelisting a new oracle-updater address.

---

## Real-World Results

RedStone Atom is live in production across multiple chains. In one deployment on HyperEVM, Atom recaptured hundreds of thousands of dollars in OEV across more than 2,400 liquidation events, achieving a 73% average recapture rate. Value that would otherwise have leaked to unaligned MEV bots was returned to the protocol and its users.

---

## Supported Chains

Atom is currently live on: Monad, MegaETH, Unichain, BNB Chain, Base, Berachain, and HyperEVM.

It's currently being deployed on: Ethereum mainnet, Arbitrum, and Sei.

Atom can be deployed on any EVM chain where RedStone is already deployed.

---

## Get Access

Atom is deployed alongside the RedStone Oracle Integration. [Contact RedStone](https://redstone.finance/contact) to discuss deployment.
