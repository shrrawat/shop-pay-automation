const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;

    // --- CART PAGE LOCATORS ---
    this.gwpModal = this.page.locator('#chooseBonusProductModal');
    this.giftWrapLabels = this.page.locator('label.gift-wrap-input-label:has-text("Gift wrap")');
    this.selectGiftsBtn = this.page.locator('.gwp-option-bonus-actions button:visible').first();
    this.addGwpToToteBtn = this.gwpModal.locator('.choose-gwp-sheet-footer-submit button').first();
  }

  async verifyOnCartPage() {
    await expect(this.page).toHaveURL(/.*\/cart/, { timeout: 15000 });
    console.log('Verified: On cart page.');
  }

  // --Gift Wrap Selection Method---
  async addGiftWrapToAllItems() {
    console.log('Checking for Gift Wrap options...');
    await this.giftWrapLabels.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => null);

    const count = await this.giftWrapLabels.count();
    if (count === 0) {
      console.log('No Gift Wrap options found. Skipping.');
      return;
    }

    console.log(`Found ${count} Gift Wrap option(s). Selecting each...`);
    for (let i = 0; i < count; i++) {
      const label = this.giftWrapLabels.nth(i);
      try {
        await label.scrollIntoViewIfNeeded().catch(() => { });
        await label.click();
        console.log(`Gift wrap ${i + 1}/${count} selected.`);
      } catch (error) {
        console.log(`Gift wrap ${i + 1}/${count} could not be selected. Skipping.`);
      }
    }
  }
  // --- GWP Selection Methods ---

  async openGwpSelectionModalIfAvailable() {
    await this.selectGiftsBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);

    if (!(await this.selectGiftsBtn.isVisible())) {
      console.log('No gifts available to select.');
      return false;
    }

    await this.selectGiftsBtn.click();
    console.log('Opened gift selection modal.');
    await this.page.waitForTimeout(500);
    await this.gwpModal.waitFor({ state: 'visible', timeout: 10000 });
    return true;
  }

  async chooseAvailableGwpItems() {
    if (!(await this.gwpModal.isVisible().catch(() => false))) {
      console.log('GWP modal is not visible. Skipping gift item selection.');
      return;
    }

    const giftItems = this.gwpModal.locator('.bonus-product-item');
    const itemCount = await giftItems.count();
    console.log(`Found ${itemCount} gift items in modal.`);

    // Parse per-section selection limits from the modal text (e.g. "(0/4)").
    const modalText = await this.gwpModal.textContent().catch(() => '');
    const allLimits = modalText.match(/\((\d+)\/(\d+)\)/g) || [];
    const sectionLimits = {};
    allLimits.forEach((match, idx) => {
      const parts = match.match(/\((\d+)\/(\d+)\)/);
      if (parts) sectionLimits[idx] = parseInt(parts[2]);
    });

    let itemToSection = await this.page.evaluate(() => {
      const modal = document.getElementById('chooseBonusProductModal');
      if (!modal) return {};

      const headerRegex = /Gift With Purchase\s+\d+/i;
      const headerEls = Array.from(modal.querySelectorAll('*')).filter((el) => {
        if (!headerRegex.test(el.textContent || '')) return false;
        return !Array.from(el.children).some((c) => headerRegex.test(c.textContent || ''));
      });
      const items = Array.from(modal.querySelectorAll('.bonus-product-item'));

      const markers = [];
      headerEls.forEach((el) => markers.push({ el, type: 'header' }));
      items.forEach((el, idx) => markers.push({ el, type: 'item', idx }));
      markers.sort((a, b) => {
        if (a.el === b.el) return 0;
        const pos = a.el.compareDocumentPosition(b.el);
        if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
      });

      const mapping = {};
      let currentSection = -1;
      for (const m of markers) {
        if (m.type === 'header') currentSection++;
        else mapping[m.idx] = Math.max(currentSection, 0);
      }
      return mapping;
    }).catch(() => ({}));

    const detectedSections = new Set(Object.values(itemToSection)).size;
    const sectionCount = Object.keys(sectionLimits).length || 1;
    if (Object.keys(itemToSection).length === 0 || detectedSections < sectionCount) {
      itemToSection = {};
      const totalLimits = Object.values(sectionLimits).reduce((a, b) => a + b, 0) || 1;
      let itemIdx = 0;
      for (let sectionIdx = 0; sectionIdx < sectionCount; sectionIdx++) {
        const itemsForSection = Math.round(((sectionLimits[sectionIdx] || 1) / totalLimits) * itemCount);
        for (let i = 0; i < itemsForSection && itemIdx < itemCount; i++) {
          itemToSection[itemIdx++] = sectionIdx;
        }
      }
      while (itemIdx < itemCount) itemToSection[itemIdx++] = sectionCount - 1;
    }

    const sectionSelections = {};
    for (let i = 0; i < itemCount; i++) {
      const item = giftItems.nth(i);
      const currentSection = itemToSection[i];
      const limit = sectionLimits[currentSection] || 999;
      const selected = sectionSelections[currentSection] || 0;

      if (selected >= limit) {
        continue;
      }

      const checkbox = item.locator('input[type="checkbox"]').first();
      if (await checkbox.isChecked().catch(() => false)) {
        sectionSelections[currentSection] = selected + 1;
        continue;
      }

      let checked = false;

      const enabledSizeButtons = item.locator('button.size-btn:not([disabled]):not(.not-available)');
      const enabledCount = await enabledSizeButtons.count().catch(() => 0);
      for (let sIdx = 0; sIdx < enabledCount && !checked; sIdx++) {
        await enabledSizeButtons.nth(sIdx).click({ force: true }).catch(() => { });
        await this.page.waitForTimeout(500);
        if (await checkbox.isChecked().catch(() => false)) {
          checked = true;
          sectionSelections[currentSection] = selected + 1;
        }
      }


      if (!checked) {
        try {
          await checkbox.check({ force: true });
          checked = true;
          sectionSelections[currentSection] = selected + 1;
        } catch (e) {
          // Item could not be selected; skip it.
        }
      }
    }
  }

  async addSelectedGwpToTote() {
    if (!(await this.gwpModal.isVisible().catch(() => false))) {
      console.log('GWP modal is not visible. Skipping add to tote.');
      return;
    }

    await this.addGwpToToteBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);

    for (let attempt = 0; attempt < 30; attempt++) {
      if (await this.addGwpToToteBtn.isEnabled().catch(() => false)) break;
      await this.page.waitForTimeout(500);
    }

    await this.addGwpToToteBtn.click({ force: true, timeout: 5000 });
    console.log('Clicked Add to Tote for gift.');

    try {
      await this.gwpModal.waitFor({ state: 'hidden', timeout: 20000 });
      console.log('Gift selection complete, modal closed.');
    } catch (e) {

      if (!(await this.gwpModal.isVisible().catch(() => false))) {
        console.log('Modal is hidden despite timeout. Continuing...');
        return;
      }
      throw e;
    }
  }

  async selectGWP() {
    try {
      const opened = await this.openGwpSelectionModalIfAvailable();
      if (!opened) {
        return;
      }

      await this.chooseAvailableGwpItems();
      await this.addSelectedGwpToTote();

    } catch (error) {
      console.error(`Gift selection error: ${error.message}`);
    }
  }
}
module.exports = { CartPage };
