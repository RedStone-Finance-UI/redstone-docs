---
sidebar_position: 2
sidebar_label: "Development process"
---

# Development process

RedStone implements a comprehensive security-driven development lifecycle that prioritizes system integrity through rigorous process controls and multi-layer validation procedures. The development workflow begins with design documentation subject to cross-functional peer review, ensuring architectural decisions are thoroughly evaluated for potential security implications before implementation commences.

The code development process enforces a strict multi-tier review policy where changes undergo sequential validation: an initial review focusing on technical implementation, followed by a security review examining potential attack vectors and edge cases. Critical components require additional review from external security specialists, providing independent validation of security-critical implementations.

The continuous integration pipeline implements automated security controls including static code analysis, dependency vulnerability scanning, and smart contract-specific security tooling. These automated checks are complemented by property-based testing suites that validate system behavior under randomized inputs, and integration test suites that verify cross-component security properties. The testing framework includes dedicated security test suites that simulate various attack scenarios and validate system resilience.

Deployment procedures follow a blue-green methodology with an emphasis on security verification at each stage. New deployments are first released to a parallel infrastructure stack where they undergo comprehensive security validation including penetration testing and automated security scanning. The deployment process includes automated rollback triggers that activate upon detection of security-relevant anomalies. Production transitions occur only after successful completion of all security validation stages and manual approval from the security team.

The development culture emphasizes security awareness through regular training sessions, incident response drills, and post-mortem analysis of security events across the broader blockchain ecosystem. Team members are encouraged to approach every development decision through a security-first lens, considering potential attack vectors and abuse scenarios during the earliest stages of feature design. This cultural focus is reinforced through recognition of proactive security contributions and regular security-focused brainstorming sessions that challenge team members to identify and address potential vulnerabilities.
