import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { LogoutPage } from "../pageObjects/logout.page.js";

type HeaderItem = "search" | "helpLink" | "feedback" | "logout" | "upgrade";

export class HeaderUtility {
  constructor(private page: Page) {}

  private readonly headerSelectors: Record<HeaderItem, string> = {
    search: '[data-testid="typeAhead"]',
    helpLink: '[data-testid="helpLink"]',
    feedback: '[data-testid="brightLiteFeedback"]',
    logout: '[data-testid="header"] [href="/logout"]',
    upgrade: '[data-testid="header"] [href="/upgrade"]',
  };

  public readonly actions = {
    clickHeaderItem: async (item: HeaderItem) => {
      const selector = this.headerSelectors[item];
      const element = this.page.locator(selector);

      await expect(
        element,
        `Header item ${item} should be visible`
      ).toBeVisible();

      if (item === "logout") {
        await Promise.all([
          this.page.waitForURL("**/logout**"),
          element.click(),
        ]);
        const logoutPage = new LogoutPage(this.page);
        await logoutPage.assertions.isPageVisible();
      } else if (item === "upgrade") {
        await Promise.all([
          this.page.waitForURL("**/upgrade**"),
          element.click(),
        ]);
      } else {
        await element.click();
      }

      return this.actions;
    },
  };

  public readonly assertions = {
    isHeaderVisible: async () => {
      await expect(this.page.getByTestId("header")).toBeVisible();
      await expect(this.page.getByTestId("typeAhead")).toBeVisible();

      return this.actions;
    },
  };
}
