# ServiceNow ITOM Reference Implementation

**Status: illustrative code, not deployed UPS source code.** These examples are derived from the supplied ITOM transformation architecture: MID Server/Discovery → CMDB/IRE → Service Mapping, with a separate Azure Monitor → Event Management → ITSM path. They are intended for a **personal development instance**, and require review, role assignment, scope checks, and validation before use.

## Repository contents

- `script-includes/ITOMEventPayloadValidator.js`: bounded, allowlisted monitoring input validator (pure JavaScript; unit-tested).
- `script-includes/ITOMCIResolver.js`: CI lookup by explicitly configured correlation attribute; no fuzzy matching.
- `script-includes/ITOMIncidentEnricher.js`: safe enrichment of an *existing* incident; avoids automatic incident creation bypassing alert rules.
- `scripted-rest/azure_monitor_event_resource.js`: example Scripted REST resource handler that validates a request and inserts a normalized `em_event` record, **only after your instance-specific table ACLs and event ingestion strategy are verified**.
- `flow-designer/`: step-by-step flows built in ServiceNow Studio/Flow Designer, not made-up importable JSON.
- `cmdb/`, `discovery/`: templates and owner checks (these are platform configuration, not arbitrary JavaScript jobs).
- `remediation/`: authorization policy and a *dry-run* action; no database failover or infrastructure restart.
- `samples/`: entirely synthetic payload and environment placeholders.
- `tests/`: offline tests for input validation; `node --test`.

## Deploy in a development instance

1. Create a scoped application in ServiceNow Studio, choose the appropriate application scope and cross-scope privileges.
2. Create a server-side Script Include named `ITOMEventPayloadValidator` by copying the source **after adapting the pure module export note** below. This module intentionally has no ServiceNow dependencies; use the function body in a Script Include wrapper if necessary.
3. Create `ITOMCIResolver` and `ITOMIncidentEnricher` Script Includes under an appropriate administrator-reviewed scope. Confirm access controls, CI match keys, permitted tables, and support group ownership.
4. If a custom ingestion endpoint is required, create a Scripted REST API resource and paste the handler from `scripted-rest/`. **Prefer a supported out-of-box Event Management connector/API where appropriate**. Require an authenticated integration identity with least-privilege rights. Never expose this publicly without controls.
5. Configure Event Management rules, CI binding, alert-management rules and Flow Designer in the instance using the documented recipes; do not assume committing these JavaScript files deploys ServiceNow configurations.
6. Simulate synthetic events in a nonproduction environment and verify CMDB binding, duplicate suppression, incident link, and recovery/closure policy.

### Script Include packaging note

`ITOMEventPayloadValidator.js` is a portable pure JS library with a CommonJS export for offline testing. **Do not paste `module.exports` into a ServiceNow server Script Include.** For ServiceNow use, copy the `validateEvent` function (and helpers) into your scoped Script Include wrapper or adjust the module to your supported release/runtime. The other files are classic ServiceNow Script Include patterns and require the actual scope names in references.

## Restrictions

- The documents describe **architecture / reference workflows**, not code actually exported from a UPS ServiceNow instance.
- No UPS hostnames, IPs, service account identities, credentials, tokens or secrets are included.
- `em_event` field names and supported ingestion methods can vary by release/plugins. Verify your release documentation.
- Generic incident creation is intentionally excluded from the REST resource: incidents should be produced only by approved Event Management alert rules.
- No real automated remediation is provided: the runbook is a safe dry-run example.

Run offline test suite: `node --test tests/*.test.js`.
