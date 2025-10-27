import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

type LoginField = 'username' | 'password';

interface DashboardActions {
  visitURL(): Promise<DashboardActions>;
  isPageVisible(): Promise<DashboardActions>;
}

export class DashboardPage {
  constructor(private page: Page) {}

  private async goto(path: string) {
    await this.page.goto(path);
  }

  byTestId(id: string): Locator {
    return this.page.getByTestId(id);
  }

  public readonly actions: DashboardActions = {
    visitURL: async () => {
      await this.goto('/dashboard');
      return this.actions;
    },

    isPageVisible: async () => {
      await expect(this.page).toHaveURL(/\/login/i);
      const sidebar = this.page.getByTestId('sideBar');
      await expect(sidebar, 'Sidebar must be visible shortly after login').toBeVisible();
      return this.actions;
    },
  };
}
