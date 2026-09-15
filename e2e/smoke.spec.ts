import { test, expect } from "@playwright/test";

test.describe("RAHEEL & ROAA landing smoke", () => {
  test("Arabic default locale has RTL and contact CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    const contact = page.locator("#contact");
    await expect(contact).toBeAttached();

    const primaryCta = page.getByRole("link", { name: /ابدأ رحلتك|Start Your Journey/i }).first();
    await expect(primaryCta).toBeVisible();
  });

  test("English locale switches to LTR", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");

    await expect(page.locator("#services")).toBeAttached();
    await expect(page.locator("#contact")).toBeAttached();
  });

  test("language toggle flips locale", async ({ page }) => {
    await page.goto("/");
    await Promise.all([
      page.waitForURL(/\/en/),
      page.getByRole("link", { name: /English/i }).first().click(),
    ]);
    await expect(page).toHaveURL(/\/en/);
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");

    await page.getByRole("link", { name: /العربية/i }).first().click();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });

  test("mobile viewport shows hero CTA without scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const cta = page.getByRole("link", { name: "ابدأ رحلتك" }).first();
    await expect(cta).toBeVisible();
  });

  test("mobile menu opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const toggle = page.getByRole("button", { name: /فتح القائمة|Open menu/i });
    await toggle.click();
    await expect(page.locator("#mobile-nav")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-nav")).toBeHidden();
  });
});
