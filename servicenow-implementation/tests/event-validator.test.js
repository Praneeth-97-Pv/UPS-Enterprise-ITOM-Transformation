const test = require('node:test');
const assert = require('node:assert/strict');
const { validateEvent } = require('../script-includes/ITOMEventPayloadValidator');
const valid = require('../samples/azure-monitor-event.synthetic.json');
const invalid = require('../samples/azure-monitor-event.invalid.json');
test('accept synthetic Azure monitoring payload', () => {
  const result = validateEvent(valid);
  assert.equal(result.ok, true);
  assert.equal(result.event.severity, 'major');
});
test('reject untrusted fields, invalid severity, and bad resource ID', () => {
  const result = validateEvent(invalid);
  assert.equal(result.ok, false);
  assert.ok(result.errors.length >= 4);
});
test('reject missing event fields', () => {
  assert.equal(validateEvent({}).ok, false);
  assert.equal(validateEvent(null).ok, false);
});
test('reject huge description and nonfinite metric', () => {
  const result = validateEvent({...valid, description:'a'.repeat(501), metricValue:Infinity});
  assert.equal(result.ok, false);
});
