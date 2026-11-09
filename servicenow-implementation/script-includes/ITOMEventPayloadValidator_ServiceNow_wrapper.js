/* ServiceNow Script Include: paste as a scoped server-side Script Include.
 * Wrapper for ITOMEventPayloadValidator.js pure function.
 * Keep the pure validation source aligned with this wrapper.
 */
var ITOMEventPayloadValidator = Class.create();
ITOMEventPayloadValidator.prototype = {
    initialize: function() {},
    validateEvent: function(body) {
        function isString(value, max) {
            return typeof value === 'string' && value.length > 0 && value.length <= max && value.trim() === value;
        }
        var errors = [];
        if (!body || typeof body !== 'object' || Array.isArray(body))
            return {ok: false, errors: ['A JSON object is required']};
        if (body.source !== 'AzureMonitor') errors.push('Unsupported source');
        if (!isString(body.resourceId, 512) || body.resourceId.charAt(0) !== '/') errors.push('Invalid resourceId');
        if (!isString(body.alertId, 128) || !/^[A-Za-z0-9._:-]+$/.test(body.alertId)) errors.push('Invalid alertId');
        if (!isString(body.description, 500)) errors.push('Invalid description');
        if (['critical','major','minor','warning','clear'].indexOf(body.severity) < 0) errors.push('Invalid severity');
        if (!isString(body.occurredAt, 40) || isNaN(Date.parse(body.occurredAt))) errors.push('Invalid occurredAt');
        var allowed = ['source','resourceId','alertId','description','severity','occurredAt','metricName','metricValue'];
        Object.keys(body).forEach(function(k) {if (allowed.indexOf(k) < 0) errors.push('Unexpected field: ' + k);});
        if (body.metricName !== undefined && !isString(body.metricName, 100)) errors.push('Invalid metricName');
        if (body.metricValue !== undefined && (typeof body.metricValue !== 'number' || !isFinite(body.metricValue))) errors.push('Invalid metricValue');
        if (errors.length) return {ok: false, errors: errors};
        return {ok: true, event: {
            source: body.source, resourceId: body.resourceId,
            alertId: body.alertId, description: body.description,
            severity: body.severity, occurredAt: body.occurredAt,
            metricName: body.metricName || '',
            metricValue: body.metricValue === undefined ? null : body.metricValue
        }};
    },
    type: 'ITOMEventPayloadValidator'
};
