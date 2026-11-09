# UPS Enterprise ITOM Modernization

**ServiceNow IT Operations Management (ITOM) — Enterprise Logistics Reference Architecture**

A reference project illustrating how ServiceNow **MID Server**, **Discovery**, **Identification and Reconciliation Engine (IRE)**, **CMDB**, **Service Mapping**, **Event Management**, and **ITSM** can be combined to improve infrastructure visibility, configuration accuracy, service-impact analysis, and incident response in a logistics environment.

> **Reference-design disclaimer:** This is a synthetic, educational enterprise architecture using UPS-style logistics scenarios. It is **not** a verified description of UPS production infrastructure, internal integrations, or an actual UPS deployment. Code and configuration samples, where present, should be reviewed, secured, and tested before use.

## 📌 Project objectives

- Discover approved on-premises and cloud-connected infrastructure through supported discovery methods.
- Maintain accurate configuration items (CIs) and relationships in the CMDB, using IRE to prevent unintended duplicates.
- Map technical dependencies to business-facing services such as Package Tracking and Sort Facility Operations.
- Ingest monitoring notifications, associate them with CIs, correlate alerts, and reduce event noise.
- Create or update incidents **only when alert-management criteria are met**, with service context and appropriate assignment.
- Measure coverage, data quality, operational response, and release readiness.
- Introduce controlled remediation only after authorization, testing, auditability, and rollback safeguards.

## 🏗️ Architecture overview

```text
Approved Infrastructure / Cloud Resources
                 |
     MID Server + Discovery
                 |
       IRE -> Governed CMDB
                 |
       Service Mapping
                 |
    Service / CI Impact Context
                 |
                 +-------------------------+
                                           |
Azure Monitor / Network Monitoring        |
                 |                         |
      Approved Event Integration           |
                 |                         |
     Event Management (CI binding) <-------+
                 |
    Correlation / Alert Qualification
                 |
       ITSM Incident Workflow
                 |
       Assigned Support Team
                 |
     Verified Recovery / Closure
```

**Important architectural distinction:** Discovery runs on approved schedules or changes to maintain CI data. Event Management processes monitoring events independently and continuously; Discovery itself does **not** create incidents.

## 🧩 Core components

| Component | Responsibility |
| --- | --- |
| **MID Server** | Secure bridge to approved infrastructure, using outbound HTTPS/TLS to ServiceNow and the ECC Queue. |
| **Discovery** | Collect supported host, network, and technology data from authorized targets; use supported cloud/API discovery for managed Azure resources. |
| **IRE / CMDB** | Identify, reconcile, and govern CIs, their attributes, owners, and dependencies. |
| **Service Mapping** | Connect infrastructure/application dependencies to logistics services. |
| **Event Management** | Normalize incoming events, bind them to CIs, correlate related alerts, and assess impact. |
| **ITSM** | Create or update qualifying incidents, route work to support teams, and track recovery. |
| **Flow Designer / Runbooks** | Support optional, preapproved, auditable remediation with fallback and verification. |

## 🚚 Illustrative logistics services

- **Package Tracking:** Tracking API and database dependencies supporting package-status visibility.
- **Sort Facility Operations:** Warehouse/sorting network infrastructure, gateways, and scanner intake.
- **Delivery Management:** Related logistics service context for downstream operational impact.

## 🔍 MID Server, Discovery, and CMDB implementation

| Step | Implementation | Validation |
| --- | --- | --- |
| **A1** | Install MID Server on an approved Windows/Linux host with required outbound connectivity. | MID Server is Up; capabilities and ECC Queue are healthy. |
| **A2** | Confirm target scopes, firewall rules, credential permissions, and schedules. | Authorized ranges and least-privilege access are documented. |
| **A3** | Run supported infrastructure Discovery; use cloud/API integrations for managed Azure resources. | Discovery Status and resource identifiers are available. |
| **A4** | Collect process, technology, and dependency evidence using patterns. | Host/application evidence is reviewable. |
| **A5** | Send identification data through IRE, honoring source precedence. | Repeated scans resolve to the intended CI. |
| **A6** | Review CI owners, environment, lifecycle, freshness, and relationships. | CMDB health checks pass. |
| **A7** | Define service entry points and validate mapped dependency paths with owners. | Business service-to-CI topology is verified. |

## 🚨 Primary use case: Package Tracking database degradation

1. **Detect:** Azure Monitor detects sustained database latency or errors.
2. **Bind:** Event Management associates the Azure resource identifier with the governed database CI.
3. **Correlate:** Related notifications are grouped or suppressed to reduce duplicate noise.
4. **Assess impact:** Service relationships indicate potential impact to the Tracking API and Package Tracking.
5. **Decide:** Alert rules inspect severity, exclusions, ownership, and existing incidents.
6. **Respond:** A qualifying incident is created or updated with CI, business service, priority, and support assignment (for example, Database Support).
7. **Recover:** The support team validates restoration; monitoring clears and closure follows approved procedures.

**Secondary use case:** A sort-facility network gateway becomes unreachable. The network event is associated with the relevant CI, evaluated for scanner-intake/service impact, and routed to Network Operations or site IT when incident criteria are met.

## 🔐 Security and operational controls

- Limit Discovery to **approved targets** and least-privilege credentials.
- Keep secrets in approved credential-management systems; do not commit credentials, access tokens, or personal data to GitHub.
- Use authenticated, authorized, and auditable monitoring integrations.
- Deduplicate events and avoid creating an incident for every notification.
- Review CI ownership and relationship direction before relying on impact analysis.
- Require change approval, execution audit trails, human fallback, and post-action validation before enabling remediation.

## 📊 Operational measurements

| Area | Sample measures |
| --- | --- |
| Discovery | Coverage, unreachable targets, authentication failures, stale CIs |
| CMDB | Duplicate rate, required-field completion, orphan relationships, owner coverage |
| Event Management | Event-to-alert conversion, CI-binding rate, noise reduction |
| Incident operations | Time to acknowledge/restore, assignment accuracy, SLA risk |
| Release controls | Change approvals, test evidence, smoke tests, rollback readiness |

## ✅ Acceptance criteria

- [ ] MID Server and Discovery can reach **only approved** targets.
- [ ] IRE updates existing CIs idempotently rather than creating unintended duplicates.
- [ ] Package Tracking and Sort Facility Operations dependency maps are validated by owners.
- [ ] A **synthetic** Azure database alert binds to the correct CI and creates/updates a qualifying incident once.
- [ ] A synthetic network outage is correlated to the appropriate sort-facility service and support team.
- [ ] Remediation remains disabled until approved, tested, audited, and protected by fallback/rollback.
- [ ] Dashboard values are traceable to actual event, alert, CI, and incident records.

## 🗓️ Delivery phases

1. **Foundation:** Security/network prerequisites, MID Server, and Discovery.
2. **Data and topology:** IRE, CMDB governance, and service dependencies.
3. **Operations:** Monitoring integration, alert rules, and incident/SLA workflows.
4. **Expansion:** Sort-facility scenarios, dashboards, and support handover.
5. **Optional automation:** Approved remediation with safe recovery validation.

## 📂 Documentation and repository use

The accompanying project documentation is available in [`index.html`](index.html). It includes detailed implementation steps, architecture figures, operational scenarios, troubleshooting guidance, and acceptance criteria.

If the repository includes its corresponding image assets, the HTML references figures under `assets/images/`.

**To view the documentation locally:**

1. Clone or download this repository.
2. Open `index.html` in a browser.
3. Use the document sidebar to navigate the sections; the **Print / Save PDF** control provides a print-friendly view.

```bash
git clone https://github.com/Praneeth-97-Pv/UPS-Enterprise-ITOM-Transformation.git
cd UPS-Enterprise-ITOM-Transformation
```

> Configuration files or example scripts in the repository, if any, are references only. Do not assume they are deployable without adapting instance scope, roles, table permissions, integrations, and credentials.

## 🛠️ Troubleshooting quick reference

| Symptom | First checks |
| --- | --- |
| MID Server Down | Service process, outbound TLS/proxy, credentials, validation, ECC Queue |
| Discovery incomplete | Approved IP ranges, access, patterns, logs, target reachability |
| Duplicate CIs | IRE identification rules, source precedence, stable identifiers |
| Event cannot bind to CI | Azure resource ID mapping, CI freshness, normalization rules |
| No incident created | Alert eligibility, suppression, existing incident, permission/error logs |
| Incorrect service impact | Service entry points, dependency direction, owner-approved topology |

## 📄 License and attribution

No license is asserted by this README. Add an appropriate `LICENSE` file if you intend to grant others reuse rights. “ServiceNow,” “Azure,” and “UPS” are names of their respective owners and are used descriptively in this illustrative reference project.
