import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';

const destinations = [
  ['TC-FT-02', 'О компании', '/article/28', /Компания HeadHunter/i],
  ['TC-FT-03', 'Пользовательское соглашение', '/account/agreement', /Соглашение по содействию/i],
  ['TC-FT-04', 'Защита персональных данных', '/article/personal_data', /персональных данных/i],
  ['TC-FT-05', 'Производственный календарь', '/calendar', /Производственный календарь.*\d{4}/i],
  ['TC-FT-06', 'Требования к ПО', '/article/176', /Требования к ПО/i],
  ['TC-FT-07', 'Безопасный HeadHunter', '/safety', /Безопасный HeadHunter/i],
] as const;

for (const [id, label, path, title] of destinations) {
  test(id + ' — переход из футера: ' + label, async ({ page, context }) => {
    await new MainPage(page).open();
    const link = page.locator('footer').getByRole('link', { name: label, exact: true });
    await link.scrollIntoViewIfNeeded();
    const target = await link.getAttribute('target');
    const popup = target === '_blank' ? context.waitForEvent('page') : undefined;
    await link.click();
    const destination = popup ? await popup : page;
    await expect(destination).toHaveURL(url =>
      url.hostname === 'vladivostok.hh.ru' && url.pathname === path);
    await expect(destination).toHaveTitle(title);
  });
}
