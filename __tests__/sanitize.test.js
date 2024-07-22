// __tests__/sanitize.test.js
const { sanitizeInput } = require('../src/utils/sanitize');

test('Sanitizes input to remove script tags', () => {
  const maliciousInput = '<script>alert("Hacked!")</script>';
  const sanitizedOutput = sanitizeInput(maliciousInput);
  expect(sanitizedOutput).toBe('');
});
