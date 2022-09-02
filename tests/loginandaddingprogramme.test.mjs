import { expect, test } from '@playwright/test';

const baseUrl = 'http://localhost:3000/';

// getting right format of the date
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-');
}

test('navigation test', async ({ page }) => {
  // login as admin
  await page.goto(`${baseUrl}login`);
  await page.locator('[placeholder="cinetourist1"]').fill('admin');
  await page.locator('[placeholder="XXXXXX"]').fill('123');
  await page.locator('button:has-text("Login")').click();
  await expect(page).toHaveURL('http://localhost:3000/profile');

  // editing programme
  await page.locator('text=Edit Programme').click();
  await expect(page).toHaveURL('http://localhost:3000/edit_programme');

  // adding input data
  await page
    .locator(
      'text=Film:DunedfasdfRiverTertasTop Gun: MaverickNo Time To Dieasdfasdfadsf >> input',
    )
    .fill('Dune');
  await page
    .locator('text=Cinema:AMC High Noon CinemaRegal 16 Cinemas >> input')
    .fill('AMC High Noon Cinema');
  const today = formatDate(new Date(Date.now()));
  await page.locator('input[type="date"]').fill(today);
  await page.locator('input[type="time"]').fill('00:01');
  await page.locator('text=Add').click();

  // checking if the programme is on the main page today
  await page.goto(baseUrl);
  await page.locator('text=Dune').click();

  // deleting the programme
  await page.goto(`${baseUrl}login`);
  await page.locator('text=Edit Programme').click();
  await expect(page).toHaveURL('http://localhost:3000/edit_programme');
  await page.locator('text=Edit').first().click();
  await page.locator('text=X').first().click();
});
