import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class LogoutPage {
  constructor(private page: Page) {}

  public readonly actions = {
    visitURL: async () => {
      await this.page.goto("/logout");
      await this.assertions.isPageVisible();
      return this.actions;
    },
  };

  public readonly assertions = {
    isPageVisible: async () => {
      await expect(this.page).toHaveURL(/\/logout(?:$|\?)/i);
      await expect(
        this.page.getByRole("heading", { name: /^logout$/i })
      ).toBeVisible();
      await expect(
        this.page.getByText(/you've logged out successfully\./i)
      ).toBeVisible();
    },
  };
}
