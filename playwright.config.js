const { defineConfig, devices } = require('@playwright/test');

require('dotenv').config(); // Loads variables from .env into process.env

module.exports = defineConfig({
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL,
    httpCredentials: {
      username: process.env.SITE_USERNAME,
      password: process.env.SITE_PASSWORD,
    },
    screenshot: 'on',
    trace: 'on',
  },
});
