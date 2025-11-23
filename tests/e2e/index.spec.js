// tests/birthday.spec.js
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000/'; // change if different

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
});

test('Q1 - name: validation and success reveal first letter', async ({ page }) => {
  const nameInput = page.locator('#nameInput');
  const msg = page.locator('#q1-msg');
  const letter1 = page.locator('#l1');

  // Initially first letter not revealed
  await expect(letter1).not.toHaveClass(/revealed/);

  // Empty -> error
  await nameInput.fill('');
  await page.getByRole('button', { name: /check answer/i }).first().click();
  await expect(msg).toHaveText(/WHAT IS YOUR NAME/i);

  // Wrong name
  await nameInput.fill('wrongname');
  await page.getByRole('button', { name: /check answer/i }).first().click();
  await expect(msg).toHaveText(/nuh uh/i);
  await expect(letter1).not.toHaveClass(/revealed/);

  // Accepted names: arsen or toji
  await nameInput.fill('ToJi');
  await page.getByRole('button', { name: /check answer/i }).first().click();
  await expect(msg).toHaveText(/correct now move on/i);
  await expect(letter1).toHaveClass(/revealed/);
});

test('Q2 - birthday yes/no buttons', async ({ page }) => {
  const msg = page.locator('#q2-msg');
  const letter2 = page.locator('#l2');

  // Wrong (no)
  await page.getByRole('button', { name: /no…………/i }).click();
  await expect(msg).toHaveText(/bruh no loser/i);
  await expect(letter2).not.toHaveClass(/revealed/);

  // Correct (yes)
  await page.getByRole('button', { name: /yeahhfebibfbdffb/i }).click();
  await expect(msg).toHaveText(/good boy/i);
  await expect(letter2).toHaveClass(/revealed/);
});

test('Q3 - age input must be 18 and then gets disabled', async ({ page }) => {
  const ageInput = page.locator('#ageInput');
  const msg = page.locator('#q3-msg');
  const letter3 = page.locator('#l3');

  const checkBtn = page.locator('#q3 button').filter({ hasText: /check answer/i });

  // Non-number
  await ageInput.fill('');
  await checkBtn.click();
  await expect(msg).toHaveText(/how old is u turning/i);

  // Wrong age
  await ageInput.fill('17');
  await checkBtn.click();
  await expect(msg).toHaveText(/are you okay.. answer again/i);
  await expect(letter3).not.toHaveClass(/revealed/);

  // Correct age
  await ageInput.fill('18');
  await checkBtn.click();
  await expect(msg).toHaveText(/7.9 trillion/i);
  await expect(letter3).toHaveClass(/revealed/);

  // Input becomes disabled
  await expect(ageInput).toBeDisabled();
});

test('Q4 - sender name must be chloe or taiga', async ({ page }) => {
  const senderInput = page.locator('#senderInput');
  const msg = page.locator('#q4-msg');
  const letter4 = page.locator('#l4');
  const checkBtn = page.locator('#q4 button').filter({ hasText: /check answer yay/i });

  // Empty
  await senderInput.fill('');
  await checkBtn.click();
  await expect(msg).toHaveText(/who send u this/i);

  // Wrong
  await senderInput.fill('bob');
  await checkBtn.click();
  await expect(msg).toHaveText(/you stupid no im not/i);
  await expect(letter4).not.toHaveClass(/revealed/);

  // Correct (case-insensitive)
  await senderInput.fill('ChLoE');
  await checkBtn.click();
  await expect(msg).toHaveText(/correct correct i am amazing yes/i);
  await expect(letter4).toHaveClass(/revealed/);
});

test('Q5 - ancient yes/no', async ({ page }) => {
  const msg = page.locator('#q5-msg');
  const letter5 = page.locator('#l5');

  // Wrong
  await page.getByRole('button', { name: /^No$/ }).click();
  await expect(msg).toHaveText(/do u have dementia/i);
  await expect(letter5).not.toHaveClass(/revealed/);

  // Correct
  await page.getByRole('button', { name: /yes hahahaha/i }).click();
  await expect(msg).toHaveText(/so you know just how ancient you are/i);
  await expect(letter5).toHaveClass(/revealed/);
});

test('Q6 - date by dropdown and by text, and final letter', async ({ page }) => {
  const daySel = page.locator('#daySel');
  const monthSel = page.locator('#monthSel');
  const yearSel = page.locator('#yearSel');
  const dateText = page.locator('#dateText');
  const msg = page.locator('#q6-msg');
  const letter6 = page.locator('#l6');
  const checkBtn = page.locator('#q6 button').filter({ hasText: /check answer/i });

  // Wrong date via text
  await dateText.fill('01/01/2000');
  await checkBtn.click();
  await expect(msg).toHaveText(/how can u not know your own birthday/i);
  await expect(letter6).not.toHaveClass(/revealed/);

  // Clear and correct via dropdown: 26/11/2025
  await page.locator('#q6 button').filter({ hasText: /clear text\/date/i }).click();
  await daySel.selectOption('26');
  await monthSel.selectOption('11');
  await yearSel.selectOption('2025');
  await checkBtn.click();
  await expect(msg).toContainText(/right right so basically/i);
  await expect(letter6).toHaveClass(/revealed/);
});

test('Final message and progress after all questions answered correctly', async ({ page }) => {
  // Q1
  await page.locator('#nameInput').fill('toji');
  await page.locator('#q1 button', { hasText: 'check answer' }).click();

  // Q2
  await page.getByRole('button', { name: /yeahhfebibfbdffb/i }).click();

  // Q3
  await page.locator('#ageInput').fill('18');
  await page.locator('#q3 button').filter({ hasText: /check answer/i }).click();

  // Q4
  await page.locator('#senderInput').fill('chloe');
  await page.locator('#q4 button').filter({ hasText: /check answer yay/i }).click();

  // Q5
  await page.getByRole('button', { name: /yes hahahaha/i }).click();

  // Q6
  await page.locator('#dateText').fill('26/11/2025');
  await page.locator('#q6 button').filter({ hasText: /check answer/i }).click();

  const progressCount = page.locator('#progressCount');
  const finalMessage = page.locator('#finalMessage');
  const typewriter = page.locator('#typewriter');

  await expect(progressCount).toHaveText('6');
  await expect(finalMessage).toBeVisible();
  await expect(typewriter).toContainText('HAPPY BIRTHDAY');
});