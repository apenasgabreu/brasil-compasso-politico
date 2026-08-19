import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function expectNoAutomaticA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, results.violations.map((violation) => `${violation.id}: ${violation.help}\n${violation.nodes.map((node) => node.html).join("\n")}`).join("\n\n")).toEqual([]);
}

test("início tem navegação acessível e não apresenta violações automáticas", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Descubra afinidades/i })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
  await expectNoAutomaticA11yViolations(page);
});

test("rota Método abre diretamente, expõe integridade e não apresenta violações automáticas", async ({ page }) => {
  await page.goto("/metodo");
  await expect(page.getByText("Transparência metodológica", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Matriz 2026/i })).toBeVisible();
  const provenanceLink = page.locator("footer a");
  await expect(provenanceLink).toBeVisible();
  await expect(provenanceLink).toHaveAttribute("href", /github\.com\/apenasgabreu\/brasil-compasso-politico/);
  await expectNoAutomaticA11yViolations(page);
});
