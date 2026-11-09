# Controlled automated remediation — DRY-RUN ONLY

1. Trigger on *qualifying*, correlated alert with approved runbook identifier.
2. Check explicit allowlist for service, CI class, environment, change approval and permitted action.
3. Confirm maintenance window / approval and execution identity. Fail closed if metadata missing.
4. Invoke the `remediation/dry_run_remediation.js` example to log *proposed* action only.
5. In production, only after formal security/change authorization, replace dry run with a supported integration action, timeouts and verified rollback.
6. Independently verify service health. Failed verification → human escalation; **never auto-close**.
7. Record alert, executor, decision, change reference, runbook version, result, and fallback in audit record.

Failover, service restart and any action with material blast radius are **intentionally not implemented** here.
