import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

type MenuItem =
  | "dashboard"
  | "rotas"
  | "employees"
  | "resources"
  | "reports"
  | "upgrade"
  | "productsButton";

export class SidebarUtility {
  constructor(private page: Page) {}

  private readonly menuConfig: Record<
    MenuItem,
    { selector: string; route?: string }
  > = {
    dashboard: { selector: '[data-e2e="dashboard"]', route: "/dashboard" },
    rotas: { selector: '[data-e2e="rotas"]', route: "/rota-planner" },
    employees: { selector: '[data-e2e="employees"]', route: "/employee-hub" },
    resources: { selector: '[data-e2e="resources"]', route: "/resources" },
    reports: { selector: '[data-e2e="reports"]', route: "/reports" },
    upgrade: { selector: '[data-e2e="upgrade"]', route: "/upgrade" },
    productsButton: { selector: '[data-testid="productsButton"]' },
  };

  public readonly actions = {
    clickMenuItem: async (item: MenuItem) => {
      const { selector, route } = this.menuConfig[item];
      const link = this.page.locator(selector);

      await expect(link, `Nav item ${item} should be visible`).toBeVisible();

      if (item === "productsButton") {
        await link.click();
        await expect(
          this.page.getByLabel("Close side draw"),
          "Products drawer should appear after clicking productsButton"
        ).toBeVisible();
      } else if (route) {
        await Promise.all([
          this.page.waitForURL(`**${route}**`, { timeout: 10_000 }),
          link.click(),
        ]);
      } else {
        await link.click();
      }

      return this.actions;
    },

    closeSideDraw: async () => {
      const closeButton = this.page.getByLabel("Close side draw");
      await expect(
        closeButton,
        "Close drawer button must be visible"
      ).toBeVisible();
      await closeButton.click();
      return this.actions;
    },
  };

  public readonly assertions = {
    isSidebarVisible: async () => {
      await expect(this.page.getByTestId("sidebar")).toBeVisible();
      return this.actions;
    },
  };
}
