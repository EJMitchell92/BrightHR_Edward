import { test } from "@playwright/test";
import { LoginPage } from "../pageObjects/login.page.js";
import { DashboardPage } from "../pageObjects/dashboard.page.js";
import { EmployeeHubPage } from "../pageObjects/employeeHub.page.js";
import { EmployeeProfilePage } from "../pageObjects/employeeProfile.page.js";
import { HeaderUtility } from "../pageUtilities/header.utility.js";
import { SidebarUtility } from "../pageUtilities/sidebar.utility.js";
import { ENV } from "../fixtures/enviromentVariables.js";
import { employee1, employee2 } from "../fixtures/employees.js";

test.describe("Adding new users", () => {
  const employeesCreated: Array<{ firstName: string }> = [];

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await login.actions.visitURL();
    await login.actions.enterLoginDetail("username", ENV.adminUsername);
    await login.actions.enterLoginDetail("password", ENV.adminPassword);
    await login.actions.clickLoginButton();
    await dashboard.assertions.isPageVisible();

    employeesCreated.length = 0;
  });

  test.afterEach(async ({ page }) => {
    // Clear down of any added users.
    const employeeHub = new EmployeeHubPage(page);
    const employeeProfile = new EmployeeProfilePage(page);
    const sidebar = new SidebarUtility(page);

    await sidebar.actions.clickMenuItem("employees");
    await employeeHub.assertions.isPageVisible();

    for (const emp of employeesCreated) {
      try {
        await employeeHub.actions.clickEditButtonForEmployee(emp.firstName);
      } catch (err) {
        continue;
      }

      await employeeProfile.actions.clickProfileTab("delete");
      await employeeProfile.actions.deleteEmployeeCheckbox();
      await employeeProfile.actions.clickDeleteButton();
      await employeeProfile.actions.clickReturnToEmployeeHub();
      await employeeHub.assertions.isPageVisible();
    }
  });

  test("Navigate to Employee Tab > Add new employee > Add second employee > Check employees exist in Employee tab ", async ({
    page,
  }) => {
    const employeeHub = new EmployeeHubPage(page);
    const employeeProfile = new EmployeeProfilePage(page);
    const header = new HeaderUtility(page);
    const sidebar = new SidebarUtility(page);

    await sidebar.actions.clickMenuItem("employees");
    await employeeHub.actions.verifyEmployeeCount(1);
    await employeeHub.actions.clickAddEmployeeButton();

    await employeeHub.addEmployeeActions.enterEmployeeDetail(
      "firstName",
      employee1.firstName
    );
    await employeeHub.addEmployeeActions.enterEmployeeDetail(
      "lastName",
      employee1.lastName
    );
    await employeeHub.addEmployeeActions.enterEmployeeDetail(
      "email",
      employee1.email
    );
    await employeeHub.addEmployeeActions.enterEmployeeDetail(
      "phoneNumber",
      employee1.phoneNumber
    );
    await employeeHub.addEmployeeActions.enterEmployeeDetail(
      "jobTitle",
      employee1.jobTitle
    );
    await employeeHub.addEmployeeActions.openDatePicker();
    await employeeHub.addEmployeeActions.pickDayByNumber(15);
    await employeeHub.addEmployeeActions.clickFormAction("save");
    await employeeHub.successEmployeeAssertions.successModalVisible();
    await employeeHub.successEmployeeActions.clickSuccessModalAction(
      "addAnother"
    );

    employeesCreated.push({ firstName: employee1.firstName });

    await employeeHub.addEmployeeEmployeeAssertions.addModalVisible();
    await employeeHub.addEmployeeActions.enterEmployeeDetail(
      "firstName",
      employee2.firstName
    );
    await employeeHub.addEmployeeActions.enterEmployeeDetail(
      "lastName",
      employee2.lastName
    );
    await employeeHub.addEmployeeActions.enterEmployeeDetail(
      "email",
      employee2.email
    );
    await employeeHub.addEmployeeActions.enterEmployeeDetail(
      "phoneNumber",
      employee2.phoneNumber
    );
    await employeeHub.addEmployeeActions.enterEmployeeDetail(
      "jobTitle",
      employee2.jobTitle
    );
    await employeeHub.addEmployeeActions.openDatePicker();
    await employeeHub.addEmployeeActions.pickDayByNumber(10);
    await employeeHub.addEmployeeActions.clickFormAction("save");
    await employeeHub.successEmployeeAssertions.successModalVisible();
    await employeeHub.successEmployeeActions.clickSuccessModalAction("close");

    employeesCreated.push({ firstName: employee2.firstName });

    await sidebar.actions.clickMenuItem("employees");
    await employeeHub.actions.verifyEmployeeCount(3);
    await employeeHub.actions.verifyEmployeeDetails(employee1.firstName);
    await employeeHub.actions.verifyEmployeeDetails(employee2.firstName);
  });
});
