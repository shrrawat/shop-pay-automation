/**
 * Helper utility functions used across step definitions
 */

function isTruthy(value) {
  return /^(true|1|yes|y)$/i.test(String(value || '').trim());
}

module.exports = { isTruthy };
