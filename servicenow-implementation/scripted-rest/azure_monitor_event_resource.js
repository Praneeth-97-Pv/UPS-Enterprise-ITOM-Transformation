/* Example ServiceNow Scripted REST resource script.
 * Method: POST, path: /azure-event. Secure with an authenticated integration user,
 * role/ACL checks, endpoint permissions, and infrastructure ingress controls.
 * Do NOT treat it as an unauthenticated webhook.
 * Prefer a supported Event Management ingestion connector when available.
 * Map Event Management fields to the installed plugin/release before activation.
 */
(function process(request, response) {
    var payload = request.body && request.body.data;
    if (!payload || typeof payload !== 'object') {
        response.setStatus(400);
        response.setBody({error: 'Expected JSON object'});
        return;
    }
    // Requires the pure validator function to be embedded in your scoped
    // Script Include or available via a tested, scope-qualified wrapper.
    var validator = new x_your_scope_ITOMEventPayloadValidator(); // REPLACE; not deployable as-is
    var check = validator.validateEvent(payload);
    if (!check.ok) {
        response.setStatus(400);
        response.setBody({error: 'Invalid event', details: check.errors});
        return;
    }
    var e = check.event;
    // Use explicit source + stable event correlation key. Platform alert rules
    // own event→alert→incident behavior; this resource never creates incidents.
    var eventGr = new GlideRecordSecure('em_event');
    if (!eventGr.canCreate()) {
        response.setStatus(403);
        response.setBody({error: 'Event insertion not permitted'});
        return;
    }
    eventGr.initialize();
    eventGr.setValue('source', e.source);
    eventGr.setValue('node', e.resourceId);
    eventGr.setValue('message_key', e.alertId);
    eventGr.setValue('description', e.description);
    var sev = { critical: '1', major: '2', minor: '3', warning: '4', clear: '0' };
    eventGr.setValue('severity', sev[e.severity]); // verify values against your release
    eventGr.setValue('additional_info', JSON.stringify({
        resourceId: e.resourceId, occurredAt: e.occurredAt,
        metricName: e.metricName, metricValue: e.metricValue
    }));
    var id = eventGr.insert();
    if (!id) {
        response.setStatus(500);
        response.setBody({error: 'Event not accepted'});
        return;
    }
    response.setStatus(202);
    response.setBody({status: 'accepted', event_sys_id: String(id)});
})(request, response);
