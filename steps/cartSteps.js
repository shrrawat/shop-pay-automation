const { When, Then } = require('@cucumber/cucumber');

Then('I should be on the cart page', async function () {
  await this.cartPage.verifyOnCartPage();
});
When('I add gift wrap to all products', async function () {
  await this.cartPage.addGiftWrapToAllItems();
});

When('I open the GWP selection modal if gifts are available', async function () {
  this.gwpModalOpened = await this.cartPage.openGwpSelectionModalIfAvailable();
});

When('I choose available GWP items', async function () {
  if (!this.gwpModalOpened) {
    return;
  }
  await this.cartPage.chooseAvailableGwpItems();
});

When('I add selected GWP gifts to the tote', async function () {
  if (!this.gwpModalOpened) {
    return;
  }
  await this.cartPage.addSelectedGwpToTote();
});

When('I select available GWP gifts', async function () {
  await this.cartPage.selectGWP();
});
