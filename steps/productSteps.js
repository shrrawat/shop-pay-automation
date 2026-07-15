const { When, Then } = require('@cucumber/cucumber');
const { isTruthy } = require('../support/helpers');

When('I search for product {string}', async function (itemId) {
  await this.productPage.searchForItem(itemId);
});

When('I open the product details page for {string}', async function (itemId) {
  await this.productPage.verifyProductPageReached(itemId);
});

// For single item
When('I add the product to the tote', async function () {
  await this.productPage.clickAddToTote();
  
  await this.productPage.waitForAddToToteSuccess(false);
});

// For Multiple Items (No Qty column)
When('I search and add the following products to the tote:', async function (dataTable) {
  await this.productPage.searchAndAddMultipleProducts(dataTable.hashes());
});

// For Multiple Items (With Qty column)
When('I search and add the following products with quantities to the tote:', async function (dataTable) {
  await this.productPage.searchAndAddMultipleProductsWithQty(dataTable.hashes());
});

When('I proceed to checkout from the mini cart', async function () {
  await this.productPage.viewTote();
});