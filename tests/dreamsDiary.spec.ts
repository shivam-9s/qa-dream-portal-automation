import { test, expect } from '@playwright/test';
import { DreamsDiaryPage } from '../pages/DreamsDiaryPage';
import { EXPECTED } from '../utils/testData';

test.describe('Dream Log Table (dreams-diary.html)', () => {
  test('contains exactly 10 dream entries', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await diary.goto();

    const count = await diary.rowCount();
    expect(count).toBe(EXPECTED.totalDreamEntries);
  });

  test('every dream type is either "Good" or "Bad"', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await diary.goto();

    const rows = await diary.getAllRows();
    expect(rows.length).toBeGreaterThan(0);

    for (const row of rows) {
      expect(
        EXPECTED.validDreamTypes,
        `Row "${row.name}" has an unexpected dream type: "${row.type}"`
      ).toContain(row.type);
    }
  });

  test('every row has Dream Name, Days Ago, and Dream Type filled in', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await diary.goto();

    const rows = await diary.getAllRows();

    for (const [index, row] of rows.entries()) {
      expect(row.name, `Row ${index + 1}: Dream Name should not be empty`).not.toBe('');
      expect(row.daysAgo, `Row ${index + 1}: Days Ago should not be empty`).not.toBe('');
      expect(row.type, `Row ${index + 1}: Dream Type should not be empty`).not.toBe('');
    }
  });

  test('identifies "Flying over mountains" and "Lost in maze" as recurring', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await diary.goto();

    const rows = await diary.getAllRows();
    const recurring = DreamsDiaryPage.findRecurringNames(rows);

    for (const name of EXPECTED.recurringDreamNames) {
      expect(recurring, `Expected "${name}" to appear more than once in the diary`).toContain(
        name
      );
    }
  });
});
