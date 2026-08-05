import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const storyUrl = "/iframe.html?id=contracts-e2e--default&viewMode=story";

test.beforeEach(async ({ page }) => {
  await page.goto(storyUrl);
});

test("Button supports keyboard activation", async ({ page }) => {
  await page.getByRole("button", { name: "Keyboard action" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Press count")).toHaveText("1");
});

test("TextField maintains label and error associations", async ({ page }) => {
  const input = page.getByRole("textbox", { name: "Account email" });
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveAttribute("aria-describedby", /.+/);
});

test("Dialog traps focus, closes with Escape, and restores focus", async ({
  page,
}) => {
  const trigger = page.getByRole("button", { name: "Open contract dialog" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Contract dialog" });
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 5; index += 1) {
    await page.keyboard.press("Tab");
    await expect(dialog.locator(":focus")).toHaveCount(1);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("explicit light and dark themes apply", async ({ page }) => {
  await page.getByRole("button", { name: "Dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("representative page passes axe", async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
