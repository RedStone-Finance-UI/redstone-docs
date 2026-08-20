---
sidebar_position: 1
sidebar_label: "Introduction"
---

# Introduction

RedStone is one of the leading blockchain oracle providers on the market, but with great power comes great responsibility. In order to minimize the (already small) risk of price manipulation RedStone is allowing other, verified and trusted companies to send oracle data to its gateways. This way we increase safety, transparency and improve data quality.

We call those companies **External oracle providers** (EOP).

## Becoming External oracle provider

Not every company may become an External oracle provider (EOP). Institutions need to meet some legal and technical conditions. The whole process may be divided into 3 steps - legal analysis, joining staging and joining production environments.

### Legal Analysis

At the end of this stage EOP understands what are the legal consequences of malicious manipulation of rates. EOP also knows how the compensation mechanism works.

### Staging

Now that all legal matters are out of the way EOP will start setting up its own oracle node. At this point RedStone’s and EOP’s dev ops contact and set it all up.
First EOP connects to staging environment where we monitor in detail how stable is the deployment. We record downtime as well as the provided prices - we do everything we can to catch problems before EOP is moved to production.

This stage lasts for as long as it is needed, at least 30 days. RedStone will be in constant contact with EOP's team to inform them about the problems so they may be fixed right away.

### Production

After EOP runs on Staging and both parties agree that it's ok - we move to Production. RedStone continues to monitor EOP, but now data is available in our production gateways.

:::info Data availability
RedStone consumers will be able to use the data published by your node on all supported chains.
You can learn more about the RedStone oracles architecture [here.](../architecture.md)
:::
