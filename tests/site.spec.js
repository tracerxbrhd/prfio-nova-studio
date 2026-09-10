import { test, expect } from '@playwright/test';
test('project filters and keyboard accessible case study', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Brand', exact: true }).click();
  await expect(page.locator('.project:visible')).toHaveCount(2);
  await expect(page.locator('#filter-result')).toHaveText('2 projects shown');
  await page
    .getByRole('button', { name: 'View Velo Collective case study' })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Velo Collective', exact: true }).last(),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(
    page.getByRole('button', { name: 'View Velo Collective case study' }),
  ).toBeFocused();
  const secondQuote = page.getByRole('button', {
    name: 'Quote from Mara Chen',
  });
  await secondQuote.focus();
  await page.keyboard.press('Enter');
  await expect(secondQuote).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#collaborator-quote')).toContainText(
    'room to breathe',
  );
  await expect(page.locator('.quote-person strong')).toHaveText('Mara Chen');
  await page.getByRole('button', { name: 'Quote from Jamie Lawson' }).click();
  await expect(page.locator('.quote-person strong')).toHaveText('Jamie Lawson');
});
test('validates the brief and downloads the entered information', async ({
  page,
}) => {
  await page.goto('/#contact');
  await page
    .getByRole('button', { name: 'Download your project brief' })
    .click();
  await expect(page.locator('#brief-status')).toBeEmpty();
  await page.getByLabel('Your name').fill('Alex Morgan');
  await page.getByLabel('Your email').fill('alex@example.com');
  await page.getByLabel('What are you working on?').fill(' '.repeat(30));
  await page
    .getByRole('button', { name: 'Download your project brief' })
    .click();
  await expect(page.locator('#brief-status')).toBeEmpty();
  expect(
    await page
      .getByLabel('What are you working on?')
      .evaluate((field) => field.validationMessage),
  ).toContain('20 characters');
  await page
    .getByLabel('What are you working on?')
    .fill('A new accessible website for a local architecture practice.');
  const download = page.waitForEvent('download');
  await page
    .getByRole('button', { name: 'Download your project brief' })
    .click();
  expect((await download).suggestedFilename()).toBe('nova-project-brief.txt');
  await expect(page.locator('#brief-status')).toContainText(
    'Your brief is ready',
  );
});
for (const width of [360, 768, 1440, 2560]) {
  test('responsive layout and screenshot at ' + width, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 360 ? 800 : 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    if (width === 360) {
      await page.getByRole('button', { name: 'Menu' }).click();
      await expect(page.locator('#navigation')).toBeVisible();
      await page
        .locator('#navigation')
        .getByRole('link', { name: 'Studio', exact: true })
        .click();
      await expect(page.locator('#navigation')).not.toBeVisible();
      await page.evaluate(() => scrollTo(0, 0));
    }
    await page.screenshot({
      path:
        'docs/screenshots/' +
        (width === 360
          ? 'mobile'
          : width === 1440
            ? 'desktop'
            : 'responsive-' + width) +
        '.png',
      fullPage: width === 360 || width === 1440,
    });
  });
}
test('local links, images, semantics and runtime are healthy', async ({
  page,
  request,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('main')).toHaveCount(1);
  for (const href of await page
    .locator('a[href]')
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href')))) {
    if (href.startsWith('#') && href.length > 1)
      expect(await page.locator(href).count()).toBe(1);
    else if (href.startsWith('./'))
      expect((await request.get(href)).ok()).toBeTruthy();
  }
  expect(
    await page
      .locator('img')
      .evaluateAll((images) =>
        images.every((img) => img.alt && img.complete && img.naturalWidth > 0),
      ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
  await page
    .getByRole('button', { name: 'View Folio Finance case study' })
    .click();
  await page.screenshot({ path: 'docs/screenshots/case-study.png' });
});
