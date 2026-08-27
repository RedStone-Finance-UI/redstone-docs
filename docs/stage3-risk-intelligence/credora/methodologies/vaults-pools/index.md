# Vaults / Pools Methodology

_These constructs can be described as portfolios representing collections of loans across multiple markets, or simply as funds. Vaults are "yield aggregators" that focus on optimizing returns across multiple markets. These constructs allow users to gain exposure to multiple lending positions through a single interface, effectively creating a managed portfolio of lending activities._

Vaults are automated smart contract systems that aggregate user deposits and deploy capital across multiple lending markets or yield-generating strategies according to predefined allocation rules. These systems enable users to access diversified exposure to DeFi yields while benefiting from professional risk management and automated rebalancing. Vaults can vary significantly in their structure and governance mechanisms across different protocols. It is important to note that certain modifiers in this methodology may not be applicable to all protocols, as some governance constructs or operational features are protocol-specific. In cases where a particular modifier is not relevant to a vault's architecture (for example, protocols that do not implement guardian systems or timelock mechanisms), the corresponding adjustment is set to neutral (0) to ensure it does not impact the final rating calculation.

![Final rating calculation](/img/markets-methodology-2.svg)

## Vault Rating Methodology

The Vault Rating Methodology determines the Anchor Vault PSL by calculating a weighted average PSL of the markets utilized in the vault. This approach reflects proportional risk contributions of each market based on the vault’s asset allocations. By weighing the PSL of individual markets according to their relative share in the vault’s portfolio, the methodology provides a comprehensive view of the vault’s overall risk profile. This calculation accounts for active allocations and unallocated markets, ensuring potential shifts in exposure are incorporated into the risk assessment.

To refine the Anchor Vault PSL and arrive at the Final Vault PSL and implied rating, two modifiers are applied. The Curator Modifier assesses the curator’s track record, expertise, and operational effectiveness, while the Governance Modifier evaluates the robustness of protective mechanisms, such as guardians and timelocks. These refinements ensure that the final assessment accounts for aggregated market risks and vault-specific management and governance factors.

### Anchor PSL

The Anchor PSL of a vault is calculated as a weighted average of the underlying markets the vault is exposed to, assigning weights based on the relative allocation of the vault’s assets. This approach provides a portfolio view of the vault’s overall risk profile by capturing the contributions of each market.

### Modifiers

After determining the **Anchor Vault PSL**, two modifiers are applied to refine the PSL further, capturing unique characteristics of the vault that are not directly tied to individual market exposures.

### Curator

The curator modifier evaluates the track record and expertise of the vault’s manager. Similar to risk assessments for asset managers in traditional finance, this modifier quantifies the curator’s experience and track record. It evaluates their decision-making ability, expertise in configuring a bug-free vault, and capability to manage the vault's overall risk profile. This adjustment reflects the premise that well-managed vaults with experienced curators demonstrate stronger risk mitigation practices, and adaptability to market conditions, while being less prone to allocating capital into misconfigured markets.

This modifier incorporates multiple factors, as outlined in the table below.

| **Metric**                        | **Description**                                                                                                                                                                                                                                           |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Track Record (Months)**         | The length of time the curator has actively managed vaults on the protocol. A longer track record indicates greater experience, credibility, and competence in managing vaults, navigating market conditions, and implementing risk management practices. |
| **Assets Under Management (AUM)** | The total value of assets managed by the curator across vaults in the protocol. Higher AUM reflects stronger market confidence, operational capacity, and the ability to manage risks effectively while optimizing performance.                           |
| **Number of Active Pools**        | The number of active markets or pools managed by the curator, representing operational breadth. A larger number of pools indicates the curator's ability to configure and manage tailored vaults effectively.                                             |

These factors are used as inputs to calculate an index score, which is a composite score calculated by weighing the above factors (track record, AUM, and active pools) to quantify the curator’s experience and risk management capabilities.

The index score is then categorized into the following tiers, each with its respective notch adjustment:

| **Tier**   | **Notch Adjustment** | **Description**                                                                              |
| ---------- | -------------------- | -------------------------------------------------------------------------------------------- |
| **Tier 1** | **0.25**             | Curators with exceptional track records, large AUM, and significant vault management volume. |
| **Tier 2** | **0**                | Curators with moderate scores, demonstrating adequate experience and capacity.               |
| **Tier 3** | **-0.25**            | Curators with lower scores, reflecting limited experience and operational capability.        |

## Governance

The Governance Modifier serves to refine the outputs by assessing the protective mechanisms embedded in its operational structure, specifically focusing on the guardian type and timelock features. These mechanisms are evaluated for their effectiveness in mitigating operational risks and enhancing the security of vault suppliers' funds.

### Guardian

The type of guardian mechanism employed by the vault plays a critical role in ensuring oversight and security. The assessment includes:

| **Guardian Type**               | **Notch Adjustment** | **Description**                                                                                                                                                                  |
| ------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No Guardian**                 | **-0.5**             | Vaults without a dedicated guardian face higher operational risks due to the absence of oversight mechanisms.                                                                    |
| **Multi-Sig Guardian Contract** | **0**                | A multi-signature contract requires approval from multiple parties for critical decisions, ensuring accountability and reducing the risk of unilateral actions.                  |
| **DAO Structure**               | **0.25**             | Vaults governed by a DAO benefit from transparent, distributed oversight involving multiple stakeholders, enhancing governance strength and minimizing single points of failure. |

### Timelock

The timelock feature further enhances security by introducing a delay in the execution of critical actions, providing a buffer to address potential vulnerabilities or unauthorized activities. The timelock adjustment is determined as follows:

| **Timelock Duration**    | **Notch Adjustment** | **Description**                                                                                                              |
| ------------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **24 Hours to 48 Hours** | **-0.25**            | Shorter timelocks provide limited protection against abrupt changes, as the response window for stakeholders is constrained. |
| **48 Hours to 72 Hours** | **0**                | A moderate timelock offers balanced protection, allowing stakeholders sufficient time to respond.                            |
| **72 Hours to 7 Days**   | **0.25**             | Longer timelocks enhance security by extending the response window.                                                          |

The governance adjustment is calculated as the average of the guardian and timelock adjustments.  
This approach ensures a balanced consideration of both governance mechanisms and their collective impact on the overall risk profile of the vault.

Example (Moonwell Flagship ETH vault):

- **Guardian Type:** Multi-Sig Guardian Contract (0 Notch Adjustment)
- **Timelock:** 96 Hours (+0.25 Notch Adjustment)
- **Governance Adjustment:** (0 + 0.25) / 2 = +0.125

If the Governance Adjustment results in a negative score, the magnitude of the adjustment is reduced by half for Tier 1 curators to account for their track record to manage vault allocations effectively. This ensures that experienced curators are not excessively penalized for governance structures that, while less restrictive, may be strategically advantageous in certain conditions.

## Final Vault Adjustment

After evaluating each modifier, the total vault adjustment is determined by summing up the notch adjustment calculated for each modifier.  
The total is used to adjust the Anchor Vault PSL to determine the Final PSL and implied rating.
