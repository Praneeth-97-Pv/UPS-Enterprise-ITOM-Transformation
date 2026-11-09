# Alert → Incident enrichment (Flow Designer configuration recipe)

This is a **recipe**, not importable Flow Designer JSON. Actual native workflows should be authored in the ServiceNow instance and versioned using supported application source control.

**Trigger**: after a qualifying `em_alert` is correlated and the platform has created/linked an incident. Configure exact trigger/condition according to your installed Event Management capabilities.

1. Check alert state, severity, CI binding and incident reference; stop if unqualified.
2. Confirm the CI matches an authoritative CMDB record; unresolved binding → manual triage queue.
3. Inspect validated service mapping relationships. Do not infer impact from mere name similarity.
4. If linked incident exists and writable, add alert ID, affected CI, service impact context, and a work note.
5. Do not overwrite assignment, impact, urgency, priority or SLA unless governed rules specify those changes.
6. Prevent duplicate work notes using the alert ID / record state decision logic.
7. On failure, capture failure status; notify operations and create follow-up task only if approved.

**Validation**: repeated alert doesn't create duplicate incident; incorrect CI binding blocked; qualifying alert enriches one incident; audit entries visible.
