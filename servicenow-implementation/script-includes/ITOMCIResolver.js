/* ServiceNow Script Include - example, not an exported customer artifact.
 * This assumes a reviewed custom field u_cloud_resource_id exists on cmdb_ci.
 * Change only after your CMDB governance team approves the correlation key.
 */
var ITOMCIResolver = Class.create();
ITOMCIResolver.prototype = {
    initialize: function() {},
    resolveByAzureResourceId: function(resourceId) {
        if (!resourceId || typeof resourceId !== 'string' || resourceId.length > 512)
            return { status: 'invalid', sys_id: '' };
        var ci = new GlideRecordSecure('cmdb_ci');
        if (!ci.isValidField('u_cloud_resource_id'))
            return { status: 'configuration_missing', sys_id: '' };
        ci.addQuery('u_cloud_resource_id', resourceId);
        ci.setLimit(2);
        ci.query();
        var ids = [];
        while (ci.next()) ids.push(ci.getUniqueValue());
        if (ids.length === 1) return { status: 'matched', sys_id: ids[0] };
        return { status: ids.length ? 'ambiguous' : 'unmatched', sys_id: '' };
    },
    type: 'ITOMCIResolver'
};
