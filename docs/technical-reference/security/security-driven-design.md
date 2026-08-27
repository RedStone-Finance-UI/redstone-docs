---
sidebar_position: 1
sidebar_label: "Security driven design"
---

# Security driven design

The RedStone architecture implements a distributed system design pattern with modular components interconnected through standardized interfaces, eliminating single points of failure through strategic redundancy and component isolation. This approach mirrors high-reliability engineering practices employed in critical sectors such as medical devices and aviation systems, where redundant subsystems and fault isolation are essential for maintaining operational safety. Just as aircraft employ multiple independent flight control computers and medical devices utilize redundant monitoring systems, RedStone's architecture ensures system integrity through similar principles of component independence and fail-safe design.

## Decoupling data production and consumption

The system employs cryptographically signed data units with verifiable attestation chains, enabling independent validation of data provenance and authenticity. This architectural approach creates logical separation between data production, transmission, and consumption layers, allowing autonomous operation and redundant implementation of each system component by independent entities.

## Redundant data sources

Data production reliability is achieved through source diversification and redundant processing pipelines. The system integrates direct exchange feeds alongside aggregator services, implementing multiple concurrent aggregation methodologies as detailed in the Data Aggregation section. This multi-methodology approach ensures that potential vulnerabilities in any single data processing algorithm cannot compromise system integrity.

## Distributed Node Security

The distributed node network architecture enhances security through operational decentralization, mitigating risks associated with private key compromise or economic coercion attempts. Geographic distribution of nodes provides additional resilience against infrastructure-level failures, including regional network disruptions or data center outages.

The system maintains heterogeneous node implementations with specialized optimizations: high-throughput nodes designed for processing numerous on-chain data sources, and low-latency nodes optimized for centralized exchange data processing. These implementations adhere to standardized data exchange protocols, enabling seamless interoperability while protecting against vulnerabilities specific to any particular technology stack or architectural pattern.

## Data availability

Data transmission reliability is achieved through a four-redundant distribution infrastructure comprising enterprise-grade web gateways, lightweight open-sourced p2p nodes, MQTT message brokers. This architecture ensures continuous data availability through protocol-level failover mechanisms.

## Failover System Architecture

On-chain data submission implements a multi-tiered failover system to maintain operational continuity. The primary relay network operates in conjunction with a shadow network that activates automatically upon detection of performance degradation. Additional resilience is provided through integration with third-party relay services such as Gelato. The system's trustless architecture enables permissionless operation by external entities utilizing public data submission protocols as an ultimate failover mechanism.
