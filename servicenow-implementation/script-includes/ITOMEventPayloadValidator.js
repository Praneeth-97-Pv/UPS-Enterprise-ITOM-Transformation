/*
 * Portable event input validator. Synthetic reference implementation.
 * CommonJS is included only for offline Node tests; remove module.exports
 * before adapting into a ServiceNow Script Include.
 */
function isString(value, max) {
    return typeof value === 'string' && value.length > 0 &&
        value.length <= max && value.trim() === value;
}
function validateEvent(body) {
    var errors = [];
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return { ok: false, errors: ['A JSON object is required'] };
    }
    if (body.source !== 'AzureMonitor') errors.push('Unsupported source');
    if (!isString(body.resourceId, 512) || body.resourceId.charAt(0) !== '/')
        errors.push('resourceId must be an Azure resource ID');
    if (!isString(body.alertId, 128) || !/^[A-Za-z0-9._:-]+$/.test(body.alertId))
        errors.push('alertId must be an identifier');
    if (!isString(body.description, 500)) errors.push('description is required');
    if (!['critical', 'major', 'minor', 'warning', 'clear'].includes(body.severity))
        errors.push('severity is not allowed');
    if (!isString(body.occurredAt, 40) || isNaN(Date.parse(body.occurredAt)))
        errors.push('occurredAt must be an ISO date-time');
    var allowed = ['source', 'resourceId', 'alertId', 'description', 'severity', 'occurredAt', 'metricName', 'metricValue'];
    Object.keys(body).forEach(function (key) {
        if (allowed.indexOf(key) < 0) errors.push('Unexpected field: ' + key);
    });
    if (body.metricName !== undefined && !isString(body.metricName, 100))
        errors.push('metricName must be a short string');
    if (body.metricValue !== undefined &&
        (typeof body.metricValue !== 'number' || !isFinite(body.metricValue)))
        errors.push('metricValue must be finite number');
    if (errors.length) return { ok: false, errors: errors };
    return {ok: true, event: {
        source: body.source,
        resourceId: body.resourceId,
        alertId: body.alertId,
        description: body.description,
        severity: body.severity,
        occurredAt: body.occurredAt,
        metricName: body.metricName || '',
        metricValue: body.metricValue === undefined ? null : body.metricValue
    }};
}
if (typeof module !== 'undefined' && module.exports) module.exports = { validateEvent: validateEvent };
