---
sidebar_position: 3
sidebar_label: "Settle"
---

# RedStone Settle

Just in time liquidity for RWAs due to deep integration with lending protocols.

---

## The Problem

Tokenized doesn't mean liquid. Even a high-quality, fully-backed, publicly-traded asset can be unusable as collateral on a lending market, because of a single structural problem: its redemption window.

DeFi lending protocols liquidate positions in seconds, institutional funds redeem in 1 to 3 business days. Private credit vehicles redeem in 30 to 90 days, while tokenized real estate can take years.

That gap between a protocol's liquidation requirements and an asset's actual redemption timeline is what keeps curators from listing most institutional RWA collateral.

If a borrower defaults and there is no immediate buyer for the RWA, the protocol must hold the illiquid asset throughout the redemption window, exposing itself to potential bad debt. Beyond liquidations, the same gap affects anyone trying to exit a collateralized RWA position: without a mechanism that bridges the redemption window, the only path out is to wait.

As a result, only a fraction of the tokenized assets onchain today are actively used as DeFi collateral, dismissed for a lack of an efficient exit infrastructure.

RedStone Settle closes that gap, starting with protocol liquidations and expanding to direct instant redemptions, leveraging its deep integration with the biggest lending venues.

In traditional finance, illiquidity is priced. A repo desk applies a haircut, a distressed debt buyer bids a discount, a private equity secondary market clears at a spread to NAV. The market transacts at a price that compensates for the time and uncertainty of the redemption. Settle brings that same logic on-chain: an asset's redemption window no longer makes it categorically unusable as collateral. Instead, the redemption delay is priced into the auction-determined discount. Illiquidity becomes a quantifiable haircut, not a hard gate.

---

## How It Works

Settle is an auction-based instant liquidity mechanism. The core flow is the same whether the trigger is a protocol liquidation or a direct redemption request:

1. A position becomes eligible, either because a borrower's collateral ratio breaches the liquidation threshold or because a holder requests an instant exit.
2. Settle runs an offchain auction among a network of whitelisted liquidity providers. Each provider bids the discount they require to take the RWA position immediately. The provider offering the lowest discount wins.
3. The winning liquidity provider repays the debt and captures the collateral at a discounted price.
4. The liquidity provider receives the RWA at the discounted price and holds it through the issuer's redemption window, collecting the discount as yield.

The entire mechanism settles atomically for liquidations: the onchain price update and the settlement execute in the same transaction, which is what prevents front-running. There is no gap between the price change and the settlement for an MEV bot to exploit.

**Execution speed:** under 300ms for onchain capital.

**Current scope:** Settle is live for protocol liquidations. Instant redemption functionality allowing a holder to exit a collateralized RWA position directly, without waiting for the protocol's liquidation threshold, is on the near-term roadmap. Instant redemption works as a transfer of position, not a fund-level redemption: the liquidity provider acquires the holder's RWA at a discount and holds it through the redemption window. The fund issuer's TVL is unchanged, and the holder exits immediately.

---

## Why Settle Works Best with a RedStone Price Feed

Due to RedStone's deep integration with lending protocols as price feed provider, the infrastructure can instantly detect the need for additional liquidity and deliver it just in time.

When a price change triggers a potential liquidation, RedStone detects that change before publishing it onchain. The offchain auction runs in that window (under 300ms). The winning liquidity provider's settlement and the onchain price update are then submitted in the same transaction.

---

## Compliance and Permissioned Assets

Many institutional RWA tokens have transfer restrictions: only KYC-verified or KYB-verified holders are permitted to hold the asset. Standard permissionless liquidation cannot handle these assets because the liquidation bot or contract may not meet the transfer requirements.

Settle handles compliance natively: each asset's solver whitelist contains only entities that have been verified to meet the transfer requirements for that specific asset. When a liquidation is triggered, Settle matches the position to eligible liquidity providers within the whitelist. Permissioned assets, including KYC/KYB-restricted tokens, can be liquidated cleanly without protocol-level workarounds.

---

## The Liquidity Provider Network

Settle is built around an open, expanding network of liquidity providers. RedStone streams liquidation and redemption volume to this network; participating providers can either join an individual auction by submitting a bid or act as standing liquidity providers with pre-configured participation terms. The auction selects the best offer at the time of each event.

The network launched with Symbiotic as the infrastructure partner. Providers earn from two streams: the baseline yield on idle capital and the acquisition discount on each settlement event.

Solvers, the entities that submit bids in the auction, must post a deposit to participate. If a solver submits a winning bid and fails to deliver the capital, the settlement reverts and the solver is slashed. This eliminates the economic incentive for malicious or non-credible bidding.

---

## Where Settle Fits in the RedStone RWA Stack

Settle is the final component in a four-part stack for institutional RWA collateral:

1. **Proof of Reserve**: verifiable onchain evidence that offchain backing exists
2. **Price feed**: RedStone publishes the NAV or fundamental price onchain
3. **Credora rating**: risk rating for curator due diligence and LP confidence
4. **Settle**: instant liquidity layer that makes the asset viable as collateral and eventually enables direct instant redemptions

Settle resolves the curator's bad debt problem: if a position needs to be liquidated, there is a mechanism to resolve it instantly. With instant redemptions live, Settle will also resolve the holder's instant exit problem, sparing them the need to wait for the redemption window.

Settle is most effective when it is configured before an asset is listed on a lending market. The auction parameters, discount floor, and solver whitelist are set during the scoping phase. By the time capital is ready to move, the liquidation infrastructure is already in place, and the same infrastructure will support instant redemptions when that functionality goes live.

For asset issuers, this changes the fundamental value proposition of tokenization. In traditional markets, a private credit fund or alternatives vehicle carries a liquidity discount, and investors price in the redemption risk when they commit capital. With Settle providing a credible instant exit path, that discount compresses. The tokenized version of the asset offers investors something the traditional version cannot: liquidity optionality on an otherwise illiquid instrument. Tokenization, combined with Settle, produces a structurally better product instead of simply putting the original one into a digital wrapper.

---

## Get Started

Settle integration is scoped directly with the RedStone team in coordination with the relevant curator. Standard integrations typically take 2–3 weeks from initial scoping to live deployment; more complex or custom configurations may take longer.

[Contact RedStone](https://redstone.finance/contact) to discuss an integration.
