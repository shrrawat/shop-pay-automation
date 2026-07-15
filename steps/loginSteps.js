const { Given } = require('@cucumber/cucumber');

Given('I am signed in as a valid customer on the SFCC website', async function () {
  await this.loginPage.completeLogin();
});

