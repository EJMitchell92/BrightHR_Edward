import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class DashboardPage {
  constructor(private page: Page) {}

  public readonly actions = {
    visitURL: async () => {
      await this.page.goto("/dashboard");
      return this.actions;
    },
  };

  public readonly assertions = {
    isPageVisible: async () => {
      try {
        await this.page.waitForURL(/\/dashboard/i, { timeout: 30_000 });
      } catch {
        throw new Error(
          "Test failed: Dashboard page did not load within 30 seconds"
        );
      }

      await expect(this.page.getByTestId("brightLogo")).toBeVisible();

      const sidebar = this.page.getByTestId("sideBar");
      await expect(
        sidebar,
        "Sidebar must be visible shortly after login"
      ).toBeVisible();

      await expect(this.page.getByTestId("Dashboard")).toBeVisible();

      return this.assertions;
    },
  };
}
