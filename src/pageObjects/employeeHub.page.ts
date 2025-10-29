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

export class EmployeePage {
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
      await expect(this.page.locator('form[action="#"]')).toBeVisible();
      await expect(
        this.page.getByRole("heading", { name: /^add new employee$/i })
      ).toBeVisible();
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

    pickDate: async (args: { year: number; month: string; day: number }) => {
      const { year, month, day } = args;

      await this.page.getByTestId("input-selector").click();

      const panel = this.page.getByTestId("daypicker-panel");
      await expect(panel).toBeVisible();

      await panel.getByRole("button", { name: /select year/i }).click();
      await panel.getByRole("button", { name: String(year) }).click();

      await panel.getByRole("button", { name: /select month/i }).click();
      await panel
        .getByRole("button", { name: new RegExp(`^${month}$`, "i") })
        .click();

      const dayCell = panel
        .getByRole("gridcell")
        .filter({ hasText: new RegExp(`^\\s*${day}\\s*$`) })
        .filter({ has: this.page.locator('[aria-disabled="false"]') });

      await expect(dayCell, `Day ${day} should be clickable`).toBeVisible();
      await dayCell.first().click();

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

  public readonly assertions = {
    isPageVisible: async () => {
      await expect(this.page).toHaveURL(/\/employee-hub/i);
      const sidebar = this.page.getByTestId("sideBar");
      await expect(
        sidebar,
        "Sidebar must be visible shortly after login"
      ).toBeVisible();
      return this.actions;
    },
  };
}
