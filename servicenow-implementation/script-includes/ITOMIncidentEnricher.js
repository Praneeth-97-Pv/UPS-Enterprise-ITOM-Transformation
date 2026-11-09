/* ServiceNow Script Include - illustrative, enrich an existing incident only.
 * Alert Management creates/links incidents; this helper does NOT bypass that policy.
 */
var ITOMIncidentEnricher = Class.create();
ITOMIncidentEnricher.prototype = {
    initialize: function() {},
    addAlertContext: function(incidentSysId, ciSysId, alertSysId) {
        if (!/^[0-9a-f]{32}$/.test(incidentSysId || '') ||
            !/^[0-9a-f]{32}$/.test(ciSysId || '') ||
            !/^[0-9a-f]{32}$/.test(alertSysId || ''))
            return { status: 'invalid_identifier' };
        var incident = new GlideRecordSecure('incident');
        if (!incident.get(incidentSysId) || !incident.canWrite())
            return { status: 'incident_not_accessible' };
        var ci = new GlideRecordSecure('cmdb_ci');
        if (!ci.get(ciSysId)) return { status: 'ci_not_found' };
        var alert = new GlideRecordSecure('em_alert');
        if (!alert.get(alertSysId)) return { status: 'alert_not_found' };
        // Only update fields authorized by ACLs; never override impact, urgency,
        // assignment group, priority, or SLA as part of generic enrichment.
        if (!incident.isValidField('cmdb_ci') || !incident.cmdb_ci.canWrite())
            return { status: 'ci_field_not_writable' };
        incident.setValue('cmdb_ci', ciSysId);
        if (incident.isValidField('work_notes') && incident.work_notes.canWrite())
            incident.work_notes = 'ITOM correlation: linked to monitored alert ' + alert.getDisplayValue('number') +
                ' (alert sys_id ' + alertSysId + '). Confirm affected business services in the validated service map.';
        incident.update();
        return { status: 'updated', incident_sys_id: incidentSysId };
    },
    type: 'ITOMIncidentEnricher'
};
