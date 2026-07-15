const { When, Then } = require('@cucumber/cucumber');

When('I start Shop Pay checkout', async function () {
  await this.checkoutPage.startShopPayCheckout();
});

When('I submit my Shop Pay email if prompted', async function () {
  await this.checkoutPage.submitShopPayEmailIfPrompted();
});
When('I complete captcha and OTP in the Shop Pay popup', async function () {
  await this.checkoutPage.waitForManualCaptchaAndOtp();
});

When('I confirm payment in the Shop Pay popup', async function () {
  await this.checkoutPage.confirmShopPayPayment();
});

When('I select the Colorado shipping address in the Ship to section on the Pay now popup', async function () {
  await this.checkoutPage.selectShippingAddress('Test Colorado');
});

When('I select the Overnight shipping method in the Shipping section on the Pay now popup', async function () {
  await this.checkoutPage.selectShippingMethod('Overnight shipping');
});

When('I choose Shop Pay at checkout', async function () {
  await this.checkoutPage.clickShopPay();
});

Then('I should return to the order confirmation page', async function () {
  await this.checkoutPage.verifyOrderConfirmationPage();
});


