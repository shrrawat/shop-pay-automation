const path = require('path');

const date = new Date();
const timestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
const cucumberJsonPath = process.env.CUCUMBER_JSON_PATH
  ? path.normalize(process.env.CUCUMBER_JSON_PATH)
  : `reports/cucumber-report_${timestamp}.json`;

module.exports = {
  default: {
    require: ['steps/**/*.js', 'support/hooks.js'], 
    paths: ['Features/**/*.feature'],
    format: [
      'summary', 
      `json:${cucumberJsonPath}`
    ],
  }
}
