import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

type LoginField = "username" | "password";

export class LoginPage {
  constructor(private page: Page) {}

  private readonly loginSelectors: Record<LoginField, string> = {
    username: "#username",
    password: "#password",
  };

  public readonly actions = {
    visitURL: async () => {
      await this.page.goto("/login");
      await this.assertions.isPageVisible();
      return this.actions;
    },

    enterLoginDetail: async (field: LoginField, value: string) => {
      const selector = this.loginSelectors[field];
      const input = this.page.locator(selector);

      await input.click();
      await input.fill("");
      await input.pressSequentially(value, { delay: 20 });

      return this.actions;
    },

    clickLoginButton: async () => {
      await this.page.getByTestId("login-button").click();
      return this.actions;
    },
  };

  public readonly assertions = {
    isPageVisible: async () => {
      await expect(this.page).toHaveURL(/\/login/i);

      const username = this.page.locator(this.loginSelectors.username);
      const password = this.page.locator(this.loginSelectors.password);

      await expect(username, "Username should be visible").toBeVisible();
      await expect(password, "Password should be visible").toBeVisible();

      return this.actions;
    },
  };
}
