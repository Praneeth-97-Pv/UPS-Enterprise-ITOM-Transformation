# MID Server / Discovery configuration checklist

A1. Install and validate MID Server on approved internal Windows/Linux host; outbound TLS and ECC Queue healthy.
A2. Approve IP ranges, credentials, access paths, firewall rules, behavior and schedules.
A3. Run supported host/network Discovery patterns; for Azure managed PaaS use supported cloud/API discovery, not assumed host-level SSH.
A4. Confirm pattern execution results, process/port observations and errors.
A5. Review identified CIs through IRE and CMDB; no unintended duplicates.
A6. Check owner, lifecycle, source and stale-data governance.
A7. Configure and review service entry points and paths with service owners.

**Never commit credential values, passwords, tokens, internal IP ranges or screenshots containing these into a public GitHub repo.**
