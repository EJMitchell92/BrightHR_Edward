import { test } from '@playwright/test';
import { LoginPage } from '../pageObjects/login.page.js';
import { DashboardPage } from '../pageObjects/dashboard.page.js';

test('successful login', async ({ page }) => {
  const login = new LoginPage(page);
  const dashboard = new DashboardPage(page);

  await login.actions.visitURL();
  await login.actions.enterLoginDetail('username', process.env.ADMIN_EMAIL!);
  await login.actions.enterLoginDetail('password', process.env.ADMIN_PASSWORD!);
  await login.actions.clickLoginButton();
  await dashboard.actions.isPageVisible();

});