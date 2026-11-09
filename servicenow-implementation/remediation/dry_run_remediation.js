/* Safe Script Include example: logs dry-run remediation decision, does nothing to infrastructure. */
var ITOMRemediationDryRun = Class.create();
ITOMRemediationDryRun.prototype = {
    initialize: function() {},
    evaluate: function(alertSysId, approvedRunbookId) {
        if (!/^[0-9a-f]{32}$/.test(alertSysId || '') || approvedRunbookId !== 'SYNTHETIC_LOW_RISK_REVIEW')
            return {authorized: false, executed: false, reason: 'Not allowlisted'};
        gs.info('[ITOM DRY RUN] Alert ' + alertSysId + '; simulated runbook review only; NO changes executed.');
        return {authorized: true, executed: false, reason: 'Dry run only; manual recovery confirmation required'};
    },
    type: 'ITOMRemediationDryRun'
};
