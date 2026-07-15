const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;

    // --- LOGIN PAGE LOCATORS ---
    this.acceptCookiesButton = this.page.locator('#onetrust-accept-btn-handler');
    this.closePromoPopupButton = this.page.getByRole('button', { name: 'Close Email Sign-up Dialog' });
    this.accountSidebar = this.page.locator('div.popover', { hasText: /Hi .*/ });
    this.postLoginSheet = this.page.locator('#postLoginSheet');
    this.accountIcon = this.page.locator('#myaccount');
    this.signInMenuOption = this.page.locator('.js-login-link', { hasText: /Sign in or create account/i }).last();
    this.emailInput = this.page.locator('#login-form-email');
    this.passwordInput = this.page.locator('#login-form-password');
    this.submitSignInButton = this.page.locator('button[form="login-sheet-form"]');
  }

  async clearScreen() {
    console.log('Clearing screen of popups or sidebars...');
    if (await this.accountSidebar.isVisible()) {
      console.log('Closing account sidebar...');
      await this.page.keyboard.press('Escape');
      await this.accountSidebar.waitFor({ state: 'hidden', timeout: 5000 });
    }
    if (await this.postLoginSheet.isVisible()) {
      console.log('Closing post-login sheet...');
      await this.page.keyboard.press('Escape');
      await this.postLoginSheet.waitFor({ state: 'hidden', timeout: 5000 });
    }
    try { await this.acceptCookiesButton.click({ timeout: 1000 }); } catch (e) { /* ignore if not present */ }
    try { await this.closePromoPopupButton.click({ timeout: 1000 }); } catch (e) { /* ignore if not present */ }
    await this.page.keyboard.press('Escape');
  }

  async navigateToSite() {
    const siteUrl = process.env.BASE_URL || 'https://dev-test.lillypulitzer.com/new/';
    await this.page.goto(siteUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.clearScreen();
  }

  async openSignInPage() {
    await this.clearScreen();
    const baseUrl = process.env.BASE_URL || 'https://dev-test.lillypulitzer.com/new/';
    const loginUrl = new URL('/login/', baseUrl).toString();
    await this.page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.passwordInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async loginAsCustomer(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    let submitButton = this.submitSignInButton;

    if (await submitButton.count() === 0) {
      submitButton = this.page.getByRole('button', { name: /sign in/i }).first();
    }

    await expect(submitButton).toBeEnabled();
    await submitButton.click();
  }

  async completeLogin() {
    const email = process.env.CUSTOMER_EMAIL;
    const password = process.env.CUSTOMER_PASSWORD;

    if (!email || !password) {
      throw new Error('CUSTOMER_EMAIL and CUSTOMER_PASSWORD must be set in environment variables.');
    }

    await this.navigateToSite();
    await this.openSignInPage();
    await this.loginAsCustomer(email, password);
    await this.verifySuccessfulLogin();
  }

  async verifySuccessfulLogin() {
    await expect(this.page).toHaveURL(/loginSuccess=true/, { timeout: 15000 });
    await this.clearScreen();
  }
}

module.exports = { LoginPage };