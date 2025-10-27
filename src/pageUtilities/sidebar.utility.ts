import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

type LoginField = 'username' | 'password';

interface LoginActions {
  visitURL(): Promise<LoginActions>;
  isPageVisible(): Promise<LoginActions>;
  enterLoginDetail(field: LoginField, value: string): Promise<LoginActions>;
  clickLoginButton(): Promise<LoginActions>;
}

export class LoginPage {
  constructor(private page: Page) {}

  private readonly loginSelectors: Record<LoginField, string> = {
    username: '#username',
    password: '#password',
  };

  public readonly actions: LoginActions = {
    visitURL: async () => {
      await this.page.goto('/login');
      await this.actions.isPageVisible();
      return this.actions;
    },

    isPageVisible: async () => {
      await expect(this.page).toHaveURL(/\/login/i);

      const username = this.page.locator(this.loginSelectors.username);
      const password = this.page.locator(this.loginSelectors.password);

      await expect(username, 'Username should be visible').toBeVisible();
      await expect(password, 'Password should be visible').toBeVisible();

      return this.actions;
    },

    enterLoginDetail: async (field, value) => {
      const selector = this.loginSelectors[field];
      const input = this.page.locator(selector);

      await input.click();
      await input.fill(''); 
      await input.pressSequentially(value, { delay: 20 });

      return this.actions;
    },

    clickLoginButton: async () => {
      await this.page.getByTestId('login-button').click();
      return this.actions;
    },
  };
}
