import { test } from "@playwright/test";
import { LoginPage } from "../pageObjects/login.page.js";
import { DashboardPage } from "../pageObjects/dashboard.page.js";
import { EmployeePage } from "../pageObjects/employeeHub.page.js";
import { HeaderUtility } from "../pageUtilities/header.utility.js";
import { SidebarUtility } from "../pageUtilities/sidebar.utility.js";
import { ENV } from "../fixtures/enviromentVariables.js";
import { employee1, employee2 } from "../fixtures/employees.js";

test.describe("authenticated area", () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await login.actions.visitURL();
    await login.actions.enterLoginDetail("username", ENV.adminUsername);
    await login.actions.enterLoginDetail("password", ENV.adminPassword);
    await login.actions.clickLoginButton();
    await dashboard.assertions.isPageVisible();
  });

  test("Navigate to Employee Tab > Add new employee > Add second employee > Check employees exist in Employee tab ", async ({
    page,
  }) => {
    const employee = new EmployeePage(page);
    const header = new HeaderUtility(page);
    const sidebar = new SidebarUtility(page);

    await sidebar.actions.clickMenuItem("employees");
    await employee.actions.verifyEmployeeCount(1);
    await employee.actions.clickAddEmployeeButton();
    await employee.addEmployeeActions.enterEmployeeDetail(
      "firstName",
      employee1.firstName
    );
    await employee.addEmployeeActions.enterEmployeeDetail(
      "lastName",
      employee1.lastName
    );
    await employee.addEmployeeActions.enterEmployeeDetail(
      "email",
      employee1.email
    );
    await employee.addEmployeeActions.enterEmployeeDetail(
      "phoneNumber",
      employee1.phoneNumber
    );
    await employee.addEmployeeActions.enterEmployeeDetail(
      "jobTitle",
      employee1.jobTitle
    );
    await employee.addEmployeeActions.pickDate({
      year: 2025,
      month: "Oct",
      day: 22,
    });
    await employee.addEmployeeActions.clickFormAction("save");
    await employee.successEmployeeAssertions.successModalVisible();
    await employee.successEmployeeActions.clickSuccessModalAction("addAnother");

    // Add second Employee
    await employee.addEmployeeEmployeeAssertions.addModalVisible();
    await employee.addEmployeeActions.enterEmployeeDetail(
      "firstName",
      employee2.firstName
    );
    await employee.addEmployeeActions.enterEmployeeDetail(
      "lastName",
      employee2.lastName
    );
    await employee.addEmployeeActions.enterEmployeeDetail(
      "email",
      employee2.email
    );
    await employee.addEmployeeActions.enterEmployeeDetail(
      "phoneNumber",
      employee2.phoneNumber
    );
    await employee.addEmployeeActions.enterEmployeeDetail(
      "jobTitle",
      employee2.jobTitle
    );
    await employee.addEmployeeActions.pickDate({
      year: 2025,
      month: "Oct",
      day: 22,
    });
    await employee.addEmployeeActions.clickFormAction("save");
    await employee.successEmployeeAssertions.successModalVisible();
    await employee.successEmployeeActions.clickSuccessModalAction("close");
    await sidebar.actions.clickMenuItem("employees");
    await employee.actions.verifyEmployeeCount(3);
  });
});
