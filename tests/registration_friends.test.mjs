import { expect, test } from '@playwright/test';

const baseUrl = 'http://localhost:3000/';

test('navigation test', async ({ page }) => {
  await page.goto(`${baseUrl}login`);

  const titleLocator = await page.locator('h1 >> nth=0');
  await expect(titleLocator).toHaveText('Login');

  // random profile ending genarator
  const r = (Math.random() + 1).toString(36).slice(7);

  // getting to registration
  await page.locator('text=Register').click();
  await expect(page).toHaveURL('http://localhost:3000/register');

  // filling the registration form
  await page.locator('[placeholder="cinetourist3"]').fill(`test${r}`);
  await page.locator('input[type="password"]').fill('123');
  await page.locator('[placeholder="Lukas"]').fill('Rado');
  await page.locator('[placeholder="Fritzl"]').fill('Mateo');
  await page
    .locator('text=E-Mail: >> [placeholder="lukas\\@gmail\\.com"]')
    .fill('luk@gmail.com');
  await page.locator('textarea').fill('description');
  await page.locator('button:has-text("Register")').click();

  // check if the registered user is logged in successfully
  await expect(page).toHaveURL(`${baseUrl}profile`);
  await expect(titleLocator).toHaveText(`CineTourist test${r}`);

  // finding a friend
  await page.locator('input[type="checkbox"]').check();
  await page.locator('button:has-text("Cinetourists")').click();
  await expect(page).toHaveURL('http://localhost:3000/cinetourists');
  await page.locator('a:has-text("admin")').click();

  // adding a friend
  await expect(page).toHaveURL('http://localhost:3000/cinetourists/admin');
  await page.locator('text=Add Friend').click();

  // checking if the friend is there
  await page.goto(`${baseUrl}profile`);
  await page.locator('a:has-text("admin")').click();
  await expect(page).toHaveURL('http://localhost:3000/cinetourists/admin');
});
