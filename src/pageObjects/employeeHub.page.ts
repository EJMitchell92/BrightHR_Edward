import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

type EmployeeTab =
  | "manage-employees"
  | "permissions"
  | "teams"
  | "whos-in"
  | "recruitment";

type EmployeeField =
  | "firstName"
  | "lastName"
  | "email"
  | "phoneNumber"
  | "jobTitle";

type FormAction = "cancel" | "save";

type SuccessModalAction = "close" | "addAnother" | "goToProfile" | "goToRotas";

export class EmployeeHubPage {
  constructor(private page: Page) {}

  private readonly employeeTabs: Record<EmployeeTab, string> = {
    "manage-employees": 'a[href="/employee-hub/manage-employees"]',
    permissions: 'a[href="/employee-hub/permissions"]',
    teams: 'a[href="/employee-hub/teams"]',
    "whos-in": 'a[href="/upgrade/whos-in"]',
    recruitment: 'a[href="/upgrade/recruitment"]',
  };

  private readonly employeeFieldSelectors: Record<EmployeeField, string> = {
    firstName: "#firstName",
    lastName: "#lastName",
    email: "#email",
    phoneNumber: "#phoneNumber",
    jobTitle: "#jobTitle",
  };

  private readonly actionButtons: Record<FormAction, { label: RegExp }> = {
    cancel: { label: /^cancel$/i },
    save: { label: /save new employee/i },
  };

  private readonly successModalSelectors: Record<SuccessModalAction, Locator> =
    {
      close: this.page.getByRole("button", { name: /close modal/i }),
      addAnother: this.page.getByRole("button", {
        name: /add another employee/i,
      }),
      goToProfile: this.page.locator('a[href^="/employee-profile"]'),
      goToRotas: this.page.locator('a[href="/rota-planner"]'),
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

    clickAddEmployeeButton: async () => {
      await this.page
        .locator("#main-content")
        .getByRole("button", { name: /add employee/i })
        .click();
      await this.addEmployeeEmployeeAssertions.addModalVisible();
    },

    verifyEmployeeCount: async (expectedCount: number) => {
      const heading = this.page.locator('h3:text("Employees")');
      await expect(
        heading,
        "Employee count heading should be visible"
      ).toBeVisible();

      const text = await heading.textContent();
      if (!text) throw new Error("Employee heading has no text content");

      const match = text.match(/\((\d+)\)/);
      const actualCount = match && match[1] ? parseInt(match[1], 10) : 0;

      expect(
        actualCount,
        `Expected ${expectedCount}, but found ${actualCount}`
      ).toBe(expectedCount);

      // Added the ability to store in ENV for use in later validations if needed
      process.env.EMPLOYEE_COUNT = String(actualCount);

      return actualCount;
    },

    verifyEmployeeDetails: async (expectedHeading: string) => {
      const mainContent = this.page.locator("#main-content");
      await expect(mainContent).toBeVisible();
      const heading = mainContent.getByRole("heading", {
        level: 1,
        name: new RegExp(expectedHeading, "i"),
      });
      await expect(heading).toBeVisible();

      return this.actions;
    },

    clickEditButtonForEmployee: async (employeeName: string) => {
      const employeeCard = this.page
        .locator("div.flex.items-center.justify-between")
        .filter({ has: this.page.locator("h1", { hasText: employeeName }) });

      await expect(employeeCard).toHaveCount(1);
      const editButton = employeeCard.getByTestId("EditButton");
      await editButton.click();

      return this.actions;
    },
  };

  public readonly assertions = {
    isPageVisible: async () => {
      try {
        await this.page.waitForURL(/\/employee-hub/i, { timeout: 30_000 });
      } catch {
        throw new Error(
          "Test failed: Employee page did not load within 30 seconds"
        );
      }
      const sidebar = this.page.getByTestId("sideBar");
      await expect(
        sidebar,
        "Sidebar must be visible shortly after login"
      ).toBeVisible();
      return this.actions;
    },
  };

  public readonly addEmployeeActions = {
    enterEmployeeDetail: async (field: EmployeeField, value: string) => {
      const selector = this.employeeFieldSelectors[field];
      const input = this.page.locator(selector);

      await expect(
        input,
        `Employee field ${field} must be visible`
      ).toBeVisible();

      await input.click();
      await input.fill("");
      await input.pressSequentially(value, { delay: 20 });

      return this.actions;
    },

    openDatePicker: async () => {
      await this.page.getByTestId("input-selector").click();
      const panel = this.page.getByTestId("daypicker-panel");
      await expect(panel).toBeVisible();

      return this.actions;
    },

    // This is very simple data picker, further refactoring would have month and year pickers.
    pickDayByNumber: async (dayNumber: number) => {
      const dayLocator = this.page.locator(
        ".DayPicker-Day:not(.DayPicker-Day--outside) .DayPicker-Day-Number",
        { hasText: String(dayNumber) }
      );

      const dayCount = await dayLocator.count();
      if (dayCount === 0) {
        throw new Error(
          `Day ${dayNumber} is not available in the current month view`
        );
      }

      await dayLocator.first().click();

      const display = this.page.getByTestId("input-selector");
      await expect(display).toContainText(String(dayNumber));

      return this.actions;
    },

    clickFormAction: async (action: FormAction) => {
      const { label } = this.actionButtons[action];
      const btn = this.page.getByRole("button", { name: label });

      await expect(btn, `Button '${action}' must be visible`).toBeVisible();
      await expect(btn, `Button '${action}' must be enabled`).toBeEnabled();
      await btn.click();

      return this.actions;
    },
  };

  public readonly addEmployeeEmployeeAssertions = {
    addModalVisible: async () => {
      const modal = this.page.getByRole("dialog");

      await expect(modal, "Add employee modal should be visible").toBeVisible();

      await expect(
        modal.getByRole("heading", { name: /^Add new employee$/i }),
        "Add employee heading must be visible"
      ).toBeVisible();
    },
  };

  public readonly successEmployeeActions = {
    clickSuccessModalAction: async (action: SuccessModalAction) => {
      const modal = this.page.getByRole("dialog");
      await expect(modal).toBeVisible();

      const element = this.successModalSelectors[action];
      await expect(
        element,
        `Button/link '${action}' must be visible in success modal`
      ).toBeVisible();

      if (action === "goToProfile") {
        await Promise.all([
          this.page.waitForURL("**/employee-profile/**"),
          element.click(),
        ]);
      } else if (action === "goToRotas") {
        await Promise.all([
          this.page.waitForURL("**/rota-planner**"),
          element.click(),
        ]);
      } else {
        await element.click();
      }

      return this.actions;
    },
  };

  public readonly successEmployeeAssertions = {
    successModalVisible: async () => {
      const modal = this.page.getByRole("dialog");

      await expect(modal, "Success modal should be visible").toBeVisible();

      await expect(
        modal.getByRole("heading", { name: /^success! new employee added$/i }),
        "Success heading must be visible"
      ).toBeVisible();
    },
  };
}
