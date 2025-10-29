import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

type EmployeeTab =
  | "manage-employees"
  | "permissions"
  | "teams"
  | "whos-in"
  | "recruitment";

export class EmployeePage {
  constructor(private page: Page) {}

  private readonly employeeTabs: Record<EmployeeTab, string> = {
    "manage-employees": 'a[href="/employee-hub/manage-employees"]',
    permissions: 'a[href="/employee-hub/permissions"]',
    teams: 'a[href="/employee-hub/teams"]',
    "whos-in": 'a[href="/upgrade/whos-in"]',
    recruitment: 'a[href="/upgrade/recruitment"]',
  };

  public readonly actions = {
    visitURL: async () => {
      await this.page.goto("/employee-hub");
      return this.actions;
    },

    clickEmployeeTab: async (tab: EmployeeTab) => {
      const selector = this.employeeTabs[tab];
      const element = this.page.locator(selector);

      await expect(
        element,

        `Employee hub tab "${tab}" should be visible`
      ).toBeVisible();

      await Promise.all([this.page.waitForURL(`**/${tab}**`), element.click()]);

      return this.actions;
    },
  };

  public readonly assertions = {
    isPageVisible: async () => {
      await expect(this.page).toHaveURL(/\/employee-hub/i);
      const sidebar = this.page.getByTestId("sideBar");
      await expect(
        sidebar,
        "Sidebar must be visible shortly after login"
      ).toBeVisible();
      return this.actions;
    },
  };
}
