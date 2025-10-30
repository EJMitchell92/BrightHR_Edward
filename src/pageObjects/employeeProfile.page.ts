import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class EmployeeProfilePage {
  constructor(private page: Page) {}

  public readonly actions = {
    clickProfileTab: async (
      tab: "view" | "terminate" | "delete" | "fullProfile"
    ) => {
      const tabPaths: Record<typeof tab, string> = {
        view: "/profile",
        terminate: "/terminate",
        delete: "/delete",
        fullProfile: "/full-profile",
      };

      const path = tabPaths[tab];
      const selector = `[href*="${path}"]`;
      const tabElement = this.page.locator(selector);

      await expect(tabElement, `Tab '${tab}' should be visible`).toBeVisible();

      await Promise.all([
        this.page.waitForURL(`**${path}**`, {
          timeout: 15_000,
        }),
        tabElement.click(),
      ]);

      return this.actions;
    },

    deleteEmployeeCheckbox: async () => {
      const checkbox = this.page.getByTestId("checkboxLabel");

      await checkbox.click();

      return this.actions;
    },

    clickDeleteButton: async () => {
      const deleteButton = this.page.getByRole("button", { name: /delete/i });

      await expect(
        deleteButton,
        "Delete button should be visible before clicking"
      ).toBeVisible();

      await deleteButton.click();

      return this.actions;
    },

    clickReturnToEmployeeHub: async () => {
      const returnButton = this.page.getByRole("button", {
        name: /return to employee hub/i,
      });

      await expect(
        returnButton,
        "'Return to employee hub' button should be visible before clicking"
      ).toBeVisible();

      await Promise.all([
        this.page.waitForURL("**/employee-hub**", { timeout: 15_000 }),
        returnButton.click(),
      ]);

      return this.actions;
    },
  };

  public readonly assertions = {
    isPageVisible: async () => {
      try {
        await this.page.waitForURL(/\/employee-profile\/.+/i, {
          timeout: 30_000,
        });
      } catch {
        throw new Error(
          "Test failed: Employee Profile page did not load within 30 seconds"
        );
      }

      await expect(
        this.page.getByRole("heading", {
          name: /View or edit employee profile/i,
        })
      ).toBeVisible();

      return this.assertions;
    },
  };
}
