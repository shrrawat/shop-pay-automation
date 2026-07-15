const { Before, After, BeforeAll, AfterAll, AfterStep, setDefaultTimeout } = require('@cucumber/cucumber');
// CRITICAL FIX: Use the core 'playwright' library, not the test runner '@playwright/test'
const { chromium } = require('playwright');
const { LoginPage } = require('../pages/LoginPage');
const { ProductPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

setDefaultTimeout(180 * 1000);

let browser;
const screenshotsDir = process.env.SCREENSHOTS_DIR
  ? path.normalize(process.env.SCREENSHOTS_DIR)
  : path.join(process.cwd(), 'reports', 'screenshots');

function sanitizeForFileName(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 80);
}

async function captureAndAttachScreenshot(world, label, options = {}) {
  const targetPage = options.page || world.page;
  if (!targetPage || targetPage.isClosed()) {
    return null;
  }

  const safeLabel = sanitizeForFileName(label || 'checkpoint');
  const stamp = Date.now();
  const fileName = `${safeLabel}--${stamp}.png`;
  const screenshotPath = path.join(screenshotsDir, fileName);

  const image = await targetPage.screenshot({
    path: screenshotPath,
    fullPage: Boolean(options.fullPage),
  });

  await world.attach(image, 'image/png');
  return screenshotPath;
}

BeforeAll(async function () {
  browser = await chromium.launch({
    headless: false,
    slowMo: 2000, 
    args: ['--start-maximized']
  });
});

Before(async function () {
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  this.context = await browser.newContext({
    viewport: null,
    httpCredentials: {
      username: process.env.SITE_USERNAME,
      password: process.env.SITE_PASSWORD,
    }
  });
  this.page = await this.context.newPage();

  this.captureScreenshot = async (label, options = {}) => {
    try {
      return await captureAndAttachScreenshot(this, label, options);
    } catch (error) {
      await this.attach(`Screenshot capture failed (${label}): ${error.message}`, 'text/plain');
      return null;
    }
  };
  
  
  this.loginPage = new LoginPage(this.page);
  this.productPage = new ProductPage(this.page);
  this.cartPage = new CartPage(this.page);
  this.checkoutPage = new CheckoutPage(this.page);

  this.productPage.captureScreenshot = this.captureScreenshot;
  this.cartPage.captureScreenshot = this.captureScreenshot;
  this.checkoutPage.captureScreenshot = this.captureScreenshot;
});

AfterStep(async function ({ pickle, pickleStep, result }) {
  if (!this.page || this.page.isClosed()) {
    return;
  }
  const scenarioName = sanitizeForFileName(pickle.name || 'scenario');
  const stepName = sanitizeForFileName(pickleStep.text || 'step');
  const stepStatus = sanitizeForFileName(result?.status || 'UNKNOWN').toLowerCase();
  const stamp = Date.now();
  const fileName = `${scenarioName}--${stepName}--${stepStatus}--${stamp}.png`;
  const screenshotPath = path.join(screenshotsDir, fileName);

  try {
    const activePage = (this.checkoutPage?.shopPayPopup && !this.checkoutPage.shopPayPopup.isClosed())
      ? this.checkoutPage.shopPayPopup
      : this.page;
    const image = await activePage.screenshot({ path: screenshotPath });
    await this.attach(image, 'image/png');
  } catch (error) {
    await this.attach(`Screenshot capture failed: ${error.message}`, 'text/plain');
  }
});

After(async function () {
  await this.page.close();
  await this.context.close();
});

AfterAll(async function () {
  await browser.close();
});
