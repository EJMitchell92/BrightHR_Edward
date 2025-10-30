import { test } from "@playwright/test";
import { LoginPage } from "../pageObjects/login.page.js";
import { DashboardPage } from "../pageObjects/dashboard.page.js";
import { ENV } from "../fixtures/enviromentVariables.js";

test.describe("admin login", async () => {
  test("successful login of an admin user to sandbox enviroment", async ({
    page,
  }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await login.actions.visitURL();
    await login.actions.enterLoginDetail("username", ENV.adminUsername);
    await login.actions.enterLoginDetail("password", ENV.adminPassword);
    await login.actions.clickLoginButton();
    await dashboard.assertions.isPageVisible();
  });
});
