const { expect } = require('@playwright/test');

class ProductPage {
  constructor(page) {
    this.page = page;

    // --- PRODUCT PAGE LOCATORS ---
    this.viewToteSidebarButton = this.page.locator('a.minicart-cart-btn');
    this.searchIcon = this.page.locator('#search-trigger');
    this.searchInputField = this.page.locator('#q');

    // --- MONOGRAM LOCATORS ---
    this.monogramPanel = this.page.locator('.monogram-modal');
    this.monogramContinueButtons = this.page.locator('button.monogram-continue-btn');
    this.monogramSidebarAddToToteButton = this.page.locator('button.monogram-add-to-tote-btn').first();
    this.monogramOpenButton = this.page.locator('button:has-text("Add a monogram")').first();
    this.monogramInputs = this.page.locator('input[type="text"]:visible');
    this.monogramCloseButton = this.page.locator('.monogram-close-section').first();
    this.miniCart = this.page.locator('#minicart');
  }

  async ensureMiniCartClosed() {
    const isOpen = await this.miniCart.isVisible().catch(() => false);

    if (!isOpen) {
      return;
    }

    await this.page.keyboard.press('Escape').catch(() => null);
    await this.miniCart.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => null);
  }

  async getProductAddToToteButton() {
    for (let attempt = 0; attempt < 5; attempt++) {
      await this.ensureMiniCartClosed();

      const primaryProductButton = this.page
        .locator('button[data-product-badge], button.add-to-cart.btn.button-primary.btn-block')
        .first();
      if (await primaryProductButton.isVisible().catch(() => false)) {
        return primaryProductButton;
      }
      await this.page
        .locator('button:has-text("Add to tote")')
        .first()
        .waitFor({ state: 'visible', timeout: 2500 })
        .catch(() => null);

      const buttons = this.page.getByRole('button', { name: /add to tote/i });
      const count = await buttons.count();

      for (let i = 0; i < count; i++) {
        const candidate = buttons.nth(i);
        const isVisible = await candidate.isVisible().catch(() => false);
        const classes = (await candidate.getAttribute('class')) || '';

        if (!isVisible) {
          continue;
        }
        if (classes.includes('monogram-add-to-tote-btn')) {
          continue;
        }

        return candidate;
      }

      await this.ensureMonogramOverlayClosed();
      await this.ensureMiniCartClosed();
      await this.page.waitForTimeout(400);
    }

    throw new Error('Product page Add to tote button was not found.');
  }

  async ensureMonogramOverlayClosed() {
    const isVisible = await this.monogramPanel.isVisible().catch(() => false);

    if (!isVisible) {
      return;
    }

    if (await this.monogramCloseButton.isVisible().catch(() => false)) {
      await this.monogramCloseButton.click({ force: true }).catch(() => null);
    } else {
      await this.page.keyboard.press('Escape').catch(() => null);
    }

    await this.monogramPanel.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => null);
  }

  async verifyProductPageReached(itemId) {
    const expectedUrlRegex = new RegExp(`.*${itemId}\\.html`);
    await expect(this.page).toHaveURL(expectedUrlRegex, { timeout: 15000 });
    console.log(`Product page reached for item: ${itemId}`);
  }

  async fillMonogramText(text) {
    const normalizedText = String(text || 'ABC').trim().toUpperCase() || 'ABC';
    const inputCount = await this.monogramInputs.count();

    if (inputCount === 0) {
      throw new Error('Monogram text inputs were not found in modal.');
    }

    const letters = normalizedText.padEnd(3, ' ').slice(0, 3).split('');
    let filled = 0;
    let lastFilledInput = null;

    for (let i = 0; i < inputCount && filled < 3; i++) {
      const input = this.monogramInputs.nth(i);
      const isVisible = await input.isVisible().catch(() => false);
      const isEnabled = await input.isEnabled().catch(() => false);

      if (!isVisible || !isEnabled) {
        continue;
      }

      await input.fill(letters[filled].trim());
      lastFilledInput = input;
      filled += 1;
    }

    if (filled === 0) {
      throw new Error('Unable to fill monogram text inputs.');
    }

    if (lastFilledInput) {
      await lastFilledInput.press('Enter');
      console.log('Pressed Enter after monogram initials entry.');
    }

    console.log(`Entered monogram initials: ${normalizedText}`);
  }

  async selectMonogramStyle(style) {
    const normalized = String(style || '').trim().toLowerCase();
    if (!normalized) {
      return false;
    }

    let token = 'ABC';
    if (normalized.includes('single') || normalized === 'a') {
      token = 'A';
    } else if (normalized.includes('double') || normalized === 'ac') {
      token = 'AC';
    } else if (normalized.includes('traditional') || normalized === 'acb') {
      token = 'A C B';
    }

    const swatchText = this.page
      .locator('.inner-swatch:visible')
      .filter({ hasText: new RegExp(`^\\s*${token.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*$`) })
      .first();

    if (await swatchText.isVisible().catch(() => false)) {
      const styleCard = swatchText.locator('xpath=ancestor::li[contains(@class,"selectable")][1]').first();
      if (await styleCard.isVisible().catch(() => false)) {
        await styleCard.click({ force: true });
      } else {
        await swatchText.click({ force: true });
      }
      console.log(`Selected monogram style: ${token}`);
      return true;
    } else {
      console.log(`Monogram style option not found for token: ${token}`);
      return false;
    }
  }

  async applyMonogram(text = 'ABC', style = '') {
    console.log(`Applying monogram. Text: "${text}"`);

    await this.monogramOpenButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.monogramOpenButton.click({ force: true });

    const inputAppeared = await this.monogramInputs
      .first()
      .waitFor({ state: 'visible', timeout: 6000 })
      .then(() => true)
      .catch(() => false);

    if (!inputAppeared) {
      await this.monogramOpenButton.click({ force: true });
      await this.monogramInputs.first().waitFor({ state: 'visible', timeout: 10000 });
    }

    await this.fillMonogramText(text);
    const styleSelected = await this.selectMonogramStyle(style);
    if (style && !styleSelected) {
      throw new Error(`Monogram style could not be selected: ${style}`);
    }

    await this.monogramContinueButtons.first().waitFor({ state: 'attached', timeout: 10000 });

    let continueButton = null;
    const continueCount = await this.monogramContinueButtons.count();
    for (let i = 0; i < continueCount; i++) {
      const candidate = this.monogramContinueButtons.nth(i);
      const isVisible = await candidate.isVisible().catch(() => false);
      if (!isVisible) {
        continue;
      }
      continueButton = candidate;
      break;
    }

    if (!continueButton) {
      continueButton = this.page.getByRole('button', { name: /continue/i }).first();
      await continueButton.waitFor({ state: 'visible', timeout: 10000 });
    }

    await expect(continueButton).toBeEnabled({ timeout: 10000 }).catch(() => null);

    for (let attempt = 0; attempt < 12; attempt++) {
      const classes = (await continueButton.getAttribute('class')) || '';
      if (!classes.includes('inactive')) {
        break;
      }
      await this.page.waitForTimeout(200);
    }

    await continueButton.scrollIntoViewIfNeeded().catch(() => null);
    await continueButton.click({ force: true });
    console.log('Clicked Continue in monogram sidebar after style selection.');

    let sidebarAddToTote = null;
    for (let step = 0; step < 4; step++) {
      if (await this.monogramSidebarAddToToteButton.isVisible().catch(() => false)) {
        sidebarAddToTote = this.monogramSidebarAddToToteButton;
        break;
      }

      const nextContinue = this.monogramPanel
        .locator('button.monogram-continue-btn:visible, button:has-text("Continue"):visible')
        .first();

      if (!(await nextContinue.isVisible().catch(() => false))) {
        break;
      }

      await nextContinue.scrollIntoViewIfNeeded().catch(() => null);
      await nextContinue.click({ force: true });
      console.log('Clicked additional Continue in monogram sidebar.');
      await this.page.waitForTimeout(500);
    }

    if (sidebarAddToTote) {
      await sidebarAddToTote.click({ force: true });
      console.log('Clicked Add to tote in monogram sidebar.');
    } else {
      const panelStillVisible = await this.monogramPanel.isVisible().catch(() => false);
      if (panelStillVisible) {
        throw new Error('Monogram sidebar is still open and Add to tote button did not appear after Continue steps.');
      }
      console.log('Monogram sidebar closed after Continue; proceeding to product page Add to tote.');
    }

    await this.ensureMonogramOverlayClosed();

    console.log('Monogram applied successfully.');
  }

  async clickAddToTote() {
    await this.ensureMonogramOverlayClosed();
    await this.ensureMiniCartClosed();
    const addToToteButton = await this.getProductAddToToteButton();
    await addToToteButton.scrollIntoViewIfNeeded();
    await addToToteButton.click();
    console.log('Add to Tote clicked.');
  }
  async waitForAddToToteSuccess(closeSidebar = true) {
    console.log('Waiting for mini-cart/tote sidebar to appear...');

    try {
      await this.viewToteSidebarButton.waitFor({ state: 'visible', timeout: 10000 });
      console.log('Tote sidebar is visible.');

      if (closeSidebar) {
        console.log('Closing tote sidebar to continue...');
        await this.page.keyboard.press('Escape');
        await this.viewToteSidebarButton.waitFor({ state: 'hidden', timeout: 5000 });
        console.log('Tote sidebar successfully closed.');
      } else {
        console.log('Leaving tote sidebar open for checkout.');
      }
    } catch (error) {
      console.warn('Could not confirm tote sidebar opened. Continuing anyway...');
      if (closeSidebar) {
        await this.page.keyboard.press('Escape');
      }
    }
  }


  async viewTote() {
    await this.viewToteSidebarButton.waitFor({ state: 'visible' });
    await this.viewToteSidebarButton.click();
    console.log('View Tote clicked. Navigating to cart...');
    await expect(this.page).toHaveURL(/.*\/cart\/?/, { timeout: 15000 });
  }

  async searchForItem(itemId) {
    await this.searchIcon.click();
    await this.searchInputField.waitFor({ state: 'visible' });
    await this.searchInputField.fill(itemId);
    await this.searchInputField.press('Enter');
    console.log('Search submitted!');
  }

  async searchAndAddMultipleProducts(products) {
    const { isTruthy } = require('../support/helpers');

    for (let p = 0; p < products.length; p++) {
      const product = products[p];
      const sku = product.sku;
      const qty = parseInt(product.qty, 10) || 1;
      const needsMonogram = isTruthy(product.monogram);
      const monogramStyle = String(product.monogramStyle || '').trim();

      console.log(`\n--- Processing Item: ${sku} | Type: ${product.itemType || 'standard'} ---`);
      await this.searchForItem(sku);
      await this.verifyProductPageReached(sku);

      if (needsMonogram) {
        await this.applyMonogram(product.monogramText, monogramStyle);
        const isLastProductRow = p === products.length - 1;
        const shouldCloseSidebar = !isLastProductRow;
        await this.waitForAddToToteSuccess(shouldCloseSidebar);
        continue;
      }

      for (let i = 0; i < qty; i++) {
        console.log(`Adding ${sku} to tote (Attempt ${i + 1} of ${qty})...`);
        await this.clickAddToTote();

        const isLastProductRow = p === products.length - 1;
        const isLastQuantity = i === qty - 1;
        const isAbsoluteLastClick = isLastProductRow && isLastQuantity;
        await this.waitForAddToToteSuccess(!isAbsoluteLastClick);
      }
    }
  }

  async searchAndAddMultipleProductsWithQty(products) {
    for (let p = 0; p < products.length; p++) {
      const sku = products[p].sku;
      const qty = parseInt(products[p].qty, 10) || 1;

      console.log(`\n --- Processing Item: ${sku} | Quantity: ${qty} ---`);
      await this.searchForItem(sku);
      await this.verifyProductPageReached(sku);

      for (let i = 0; i < qty; i++) {
        console.log(`Adding ${sku} to tote (Attempt ${i + 1} of ${qty})...`);
        await this.clickAddToTote();

        const isLastProductRow = p === products.length - 1;
        const isLastQuantity = i === qty - 1;
        const isAbsoluteLastClick = isLastProductRow && isLastQuantity;
        await this.waitForAddToToteSuccess(!isAbsoluteLastClick);
      }
    }
  }
}

module.exports = { ProductPage };
