# CMDB and IRE configuration checklist

- Configure approved CI classes for Windows/Linux servers, databases, network equipment and applications.
- Inventory stable identification attributes for each class. For Azure resources, use supported discovery/API-sourced resource identifiers.
- Configure IRE identification rules and data-source precedence **in the platform**, not as arbitrary database inserts.
- Use verified CI relationship direction (`Depends on::Used by`, `Runs on::Runs`, etc.) appropriate to installed CMDB definitions.
- Record CI owner, support group, environment, lifecycle, last-discovered time and discovery source.
- Check duplicate and stale CI reports; rerunning discovery should be idempotent.
- Establish application service entry points and have app owners review CATS / Delivery Delay Tracking dependencies where appropriate.
- Scope the sample `u_cloud_resource_id` field in `ITOMCIResolver.js` only after data governance approval.

**Do not attempt to set IRE precedence with a custom script that circumvents the IRE engine.**
