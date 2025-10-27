import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

interface DashboardActions {
  visitURL(): Promise<DashboardActions>;
}

interface DashboardAssertions {
  isPageVisible(): Promise<DashboardAssertions>;
}

export class DashboardPage {
  constructor(private page: Page) {}

  public readonly actions: DashboardActions = {
    visitURL: async () => {
      await this.page.goto('/dashboard');
      return this.actions; // chain actions
    },
  };

  public readonly assertions: DashboardAssertions = {
    isPageVisible: async () => {
      await expect(this.page).toHaveURL(/\/dashboard/i);
      const sidebar = this.page.getByTestId('sideBar');
      await expect(sidebar, 'Sidebar must be visible shortly after login').toBeVisible();
      await expect(this.page.getByTestId('Dashboard')).toBeVisible();
      return this.assertions; 
    },
  };
}
