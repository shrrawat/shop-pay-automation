const { expect } = require('@playwright/test');
const path = require('path');

class CheckoutPage {

  constructor(page) {
    this.page = page;
    this.shopPayPopup = null;

    // --- CHECKOUT PAGE LOCATORS ---
    this.shopPayHost = this.page.locator('shop-pay-payment-request-button').first();
    this.confirmationHeader = this.page.locator('h1.receipt-title:has-text("Thank you for your order!")');
  }

  async capture(label, options = {}) {
    if (typeof this.captureScreenshot === 'function') {
      await this.captureScreenshot(`checkout-${label}`, { ...options, page: this.page });
    }
  }

  async captureScrollablePage(labelPrefix) {
    const viewportHeight = await this.page.evaluate(() => window.innerHeight || 900);
    const totalHeight = await this.page.evaluate(() => {
      const root = document.scrollingElement || document.documentElement;
      return Math.max(root.scrollHeight, document.body.scrollHeight, document.documentElement.scrollHeight);
    });

    const step = Math.max(300, Math.floor(viewportHeight * 0.85));
    const positions = [];

    for (let y = 0; y < totalHeight; y += step) {
      positions.push(y);
    }

    const bottomY = Math.max(0, totalHeight - viewportHeight);
    if (positions.length === 0 || positions[positions.length - 1] !== bottomY) {
      positions.push(bottomY);
    }

    const limitedPositions = positions.slice(0, 10);
    for (let i = 0; i < limitedPositions.length; i++) {
      const y = limitedPositions[i];
      await this.page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await this.page.waitForTimeout(250);
      await this.capture(`${labelPrefix}-scroll-${i + 1}`);
    }
  }


  async startShopPayCheckout() {
    await expect(this.page).toHaveURL(/cart/, { timeout: 15000 });
    console.log('Confirmed on cart page.');

    await this.shopPayHost.waitFor({ state: 'attached', timeout: 10000 });
    const shopPayBtn = this.shopPayHost.locator('button').first();
    await shopPayBtn.waitFor({ state: 'visible', timeout: 10000 });

    const popupPromise = this.page.context().waitForEvent('page');
    console.log('Clicking the Shop Pay button...');
    await shopPayBtn.click();

    this.shopPayPopup = await popupPromise;
    await this.shopPayPopup.waitForLoadState('domcontentloaded');
    console.log('Shop Pay popup successfully opened.');
  }


  async submitShopPayEmailIfPrompted() {
    if (!this.shopPayPopup || this.shopPayPopup.isClosed()) {
      throw new Error('Shop Pay popup is not available. Start Shop Pay checkout first.');
    }

    const shopPayFrame = this.shopPayPopup.frameLocator('iframe').first();
    const emailInput = shopPayFrame.locator('#IdentityEmailForm-email, input[type="email"]').first();

    try {
      await emailInput.waitFor({ state: 'visible', timeout: 15000 });
      console.log('Email screen detected. Clicking and entering email...');
      await emailInput.click();
      await emailInput.fill(process.env.CUSTOMER_EMAIL);
      await shopPayFrame.locator('button[type="submit"]').click();
      console.log('Email submitted.');
    } catch (emailError) {
      console.log('Email screen was skipped. Proceeding to OTP check.');
    }
  }

  getShopPayFrame() {
    return this.shopPayPopup.frameLocator('iframe').first();
  }

  async findShopPayText(text, exact = true) {
    const popupText = this.shopPayPopup.getByText(text, { exact }).first();
    if (await popupText.isVisible().catch(() => false)) {
      return popupText;
    }

    const frameText = this.getShopPayFrame().getByText(text, { exact }).first();
    if (await frameText.isVisible().catch(() => false)) {
      return frameText;
    }

    return null;
  }

  async clickVisibleText(text, exact = true) {
    const target = await this.findShopPayText(text, exact);
    if (!target) {
      return false;
    }

    await target.click({ force: true });
    return true;
  }

  async clickShopPayOptionByAliases(primaryText, aliases = []) {
    const candidates = [String(primaryText || '').trim(), ...aliases]
      .map((item) => String(item || '').trim())
      .filter(Boolean);

    const popupScope = this.shopPayPopup;
    const frameScope = this.getShopPayFrame();

    for (const text of candidates) {
      const safePattern = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*');
      const regex = new RegExp(safePattern, 'i');
      const locatorCandidates = [
        popupScope.getByRole('radio', { name: regex }).first(),
        popupScope.getByRole('button', { name: regex }).first(),
        popupScope.getByText(text, { exact: false }).first(),
        frameScope.getByRole('radio', { name: regex }).first(),
        frameScope.getByRole('button', { name: regex }).first(),
        frameScope.getByText(text, { exact: false }).first()
      ];

      for (const locator of locatorCandidates) {
        if (await locator.isVisible().catch(() => false)) {
          await locator.click({ force: true });
          return true;
        }
      }
    }

    return false;
  }

  async clickShopPayOptionByDomFallback(texts) {
    const candidates = (texts || [])
      .map((item) => String(item || '').trim().toLowerCase())
      .filter(Boolean);

    if (candidates.length === 0) {
      return false;
    }

    const clickInContext = async (context) => {
      return await context.evaluate((needles) => {
        const isVisible = (el) => {
          if (!el || !(el instanceof HTMLElement)) {
            return false;
          }
          const style = window.getComputedStyle(el);
          if (style.visibility === 'hidden' || style.display === 'none') {
            return false;
          }
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        };

        const clickableSelector = [
          'button',
          'label',
          '[role="button"]',
          '[role="radio"]',
          'input[type="radio"]',
          '[data-test]',
          '[data-testid]'
        ].join(',');

        const allElements = Array.from(document.querySelectorAll('body *'));
        for (const el of allElements) {
          if (!isVisible(el)) {
            continue;
          }

          const text = (el.innerText || el.textContent || '').toLowerCase().trim();
          if (!text) {
            continue;
          }

          if (!needles.some((needle) => text.includes(needle))) {
            continue;
          }

          const target = el.closest(clickableSelector) || el;
          if (target instanceof HTMLElement && isVisible(target)) {
            target.click();
            return true;
          }
        }

        return false;
      }, candidates);
    };

    if (await clickInContext(this.shopPayPopup).catch(() => false)) {
      return true;
    }

    const iframeHandle = await this.shopPayPopup.locator('iframe').first().elementHandle().catch(() => null);
    const frame = iframeHandle ? await iframeHandle.contentFrame().catch(() => null) : null;
    if (frame && await clickInContext(frame).catch(() => false)) {
      return true;
    }

    return false;
  }

  async expandSection(sectionLabel) {
    const sectionText = String(sectionLabel || '').trim();
    if (!sectionText) {
      throw new Error('Section label is required.');
    }

    console.log(`Expanding section: ${sectionText}`);
    const sectionAliases = {
      'ship to': ['ship to', 'shipping address', 'delivery address', 'address'],
      shipping: ['shipping', 'shipping method', 'delivery method', 'delivery']
    };

    const normalized = sectionText.toLowerCase();
    const candidateTexts = sectionAliases[normalized] || [sectionText];
    const popupLocators = [];
    const frameLocators = [];

    for (const text of candidateTexts) {
      const looseRegex = new RegExp(text.replace(/\s+/g, '\\s*'), 'i');
      popupLocators.push(this.shopPayPopup.getByRole('button', { name: looseRegex }).first());
      popupLocators.push(this.shopPayPopup.locator('[role="button"]', { hasText: looseRegex }).first());
      popupLocators.push(this.shopPayPopup.getByText(text, { exact: false }).first());

      const frame = this.getShopPayFrame();
      frameLocators.push(frame.getByRole('button', { name: looseRegex }).first());
      frameLocators.push(frame.locator('[role="button"]', { hasText: looseRegex }).first());
      frameLocators.push(frame.getByText(text, { exact: false }).first());
    }

    const allLocators = [...popupLocators, ...frameLocators];
    for (const locator of allLocators) {
      if (await locator.isVisible().catch(() => false)) {
        await locator.click({ force: true });
        return;
      }
    }

    throw new Error(`Section not found: ${sectionText}`);
  }

  async waitForShopPayPopupReady() {
    if (!this.shopPayPopup || this.shopPayPopup.isClosed()) {
      throw new Error('Shop Pay popup is not available. Start Shop Pay checkout first.');
    }

    await this.shopPayPopup.waitForLoadState('domcontentloaded').catch(() => null);
    await this.shopPayPopup.waitForLoadState('networkidle').catch(() => null);
    await this.shopPayPopup.locator('#checkout-pay-button').waitFor({ state: 'visible', timeout: 60000 }).catch(() => null);
  }

  async selectShippingAddress(addressLabel) {
    if (!this.shopPayPopup || this.shopPayPopup.isClosed()) {
      throw new Error('Shop Pay popup is not available. Start Shop Pay checkout first.');
    }

    const addressText = String(addressLabel || '').trim();

    if (!addressText) {
      throw new Error('Shipping address is required.');
    }

    await this.waitForShopPayPopupReady();
    await this.expandSection('Ship to');
    console.log(`Selecting shipping address: ${addressText}`);
    const addressSelected = await this.clickVisibleText(addressText, false);
    if (!addressSelected) {
      throw new Error(`Shipping address not found: ${addressText}`);
    }
  }

  async selectShippingMethod(shippingMethodLabel) {
    if (!this.shopPayPopup || this.shopPayPopup.isClosed()) {
      throw new Error('Shop Pay popup is not available. Start Shop Pay checkout first.');
    }

    const methodText = String(shippingMethodLabel || '').trim();

    if (!methodText) {
      throw new Error('Shipping method is required.');
    }

    await this.waitForShopPayPopupReady();
    await this.expandSection('Shipping');
    await this.shopPayPopup.waitForTimeout(1000);
    console.log(`Selecting shipping method: ${methodText}`);
    const methodAliases = [];
    if (/overnight/i.test(methodText)) {
      methodAliases.push('Overnight', 'Overnight delivery', 'Overnight shipping method', 'Express');
    }

    let methodSelected = await this.clickShopPayOptionByAliases(methodText, methodAliases);
    if (!methodSelected) {
      methodSelected = await this.clickShopPayOptionByDomFallback([methodText, ...methodAliases]);
    }
    if (!methodSelected) {
      throw new Error(`Shipping method not found: ${methodText}`);
    }
  }

  async selectShippingAddressAndMethod(addressLabel, shippingMethodLabel) {
    await this.selectShippingAddress(addressLabel);
    await this.selectShippingMethod(shippingMethodLabel);
  }


  async waitForManualCaptchaAndOtp() {
    if (!this.shopPayPopup || this.shopPayPopup.isClosed()) {
      throw new Error('Shop Pay popup is not available. Start Shop Pay checkout first.');
    }

    console.log('ACTION REQUIRED: Complete Captcha and then enter OTP in the popup.');
    const payNowBtn = this.shopPayPopup.locator('#checkout-pay-button');
    await payNowBtn.waitFor({ state: 'visible', timeout: 120000 });
    console.log('Pay Now button is visible.');
  }


  async confirmShopPayPayment() {
    if (!this.shopPayPopup || this.shopPayPopup.isClosed()) {
      throw new Error('Shop Pay popup is not available. Start Shop Pay checkout first.');
    }

    const payNowBtn = this.shopPayPopup.locator('#checkout-pay-button');
    console.log('Pausing for 3 seconds to allow backend processing...');
    await this.shopPayPopup.waitForTimeout(3000);
    console.log('Forcing the click on Pay Now...');
    await payNowBtn.click({ force: true });
    console.log('"Pay now" button clicked.');
    await this.shopPayPopup.waitForEvent('close', { timeout: 60000 });
    console.log('Shop Pay popup closed. Checkout complete.');
    this.shopPayPopup = null;
  }


  async clickShopPay() {
    try {
      await this.startShopPayCheckout();
      await this.submitShopPayEmailIfPrompted();
      await this.waitForManualCaptchaAndOtp();
      await this.confirmShopPayPayment();

    } catch (error) {
        if (this.page && !this.page.isClosed()) {
            const screenshotPath = process.env.SCREENSHOTS_DIR
              ? path.join(path.normalize(process.env.SCREENSHOTS_DIR), 'shop-pay-final-step-error.png')
              : 'shop-pay-final-step-error.png';
            await this.page.screenshot({ path: screenshotPath });
        }
        throw new Error(`An error occurred during the Shop Pay process. Check screenshot. Error: ${error.message}`);
    }
  }


  async verifyOrderConfirmationPage() {
    try {
      await this.confirmationHeader.waitFor({ state: 'visible', timeout: 30000 });
      console.log('Order confirmation page header is visible.');
      await this.captureScrollablePage('confirmation-page');
    } catch (e) {
      throw new Error('The order confirmation "Thank you" message was not found.');
    }
    console.log('Pausing for 3 seconds to let the page settle...');
    await this.page.waitForTimeout(3000);
  }
}

module.exports = { CheckoutPage };
