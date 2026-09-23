import { test, expect } from '@playwright/test';
import { DreamsTotalPage } from '../pages/DreamsTotalPage';
import { DreamsDiaryPage } from '../pages/DreamsDiaryPage';
import { EXPECTED } from '../utils/testData';

test.describe('Summary Page (dreams-total.html)', () => {
  test('shows the correct Good / Bad / Total / Recurring counts', async ({
    page,
  }) => {
    const total = new DreamsTotalPage(page);

    await total.goto();

    await expect
      .poll(
        () => total.getGoodDreamsCount(),
        { message: 'Good Dreams stat' }
      )
      .toBe(EXPECTED.summary.good);

    await expect
      .poll(
        () => total.getBadDreamsCount(),
        { message: 'Bad Dreams stat' }
      )
      .toBe(EXPECTED.summary.bad);

    await expect
      .poll(
        () => total.getTotalDreamsCount(),
        { message: 'Total Dreams stat' }
      )
      .toBe(EXPECTED.summary.total);

    await expect
      .poll(
        () => total.getRecurringDreamsCount(),
        { message: 'Recurring Dreams stat' }
      )
      .toBe(EXPECTED.summary.recurring);
  });

  test('counts "Flying over mountains" and "Lost in maze" as recurring using diary logic', async ({
    page,
    context,
  }) => {
    const diaryPage = await context.newPage();

    const diary = new DreamsDiaryPage(diaryPage);

    await diary.goto();

    const rows = await diary.getAllRows();

    const recurringNames =
      DreamsDiaryPage.findRecurringNames(rows);

    await diaryPage.close();

    expect(
      recurringNames
    ).toEqual(
      expect.arrayContaining(
        EXPECTED.recurringDreamNames
      )
    );

    expect(
      recurringNames.length,
      'Recurring dream count calculated from diary'
    ).toBe(EXPECTED.summary.recurring);

    const total = new DreamsTotalPage(page);

    await total.goto();

    expect(
      await total.getRecurringDreamsCount(),
      'Summary recurring count should match recurring dreams found in diary'
    ).toBe(recurringNames.length);
  });

  test('cross-check: summary stats match what is actually in the diary table', async ({
    page,
    context,
  }) => {
    const diaryPage = await context.newPage();

    const diary = new DreamsDiaryPage(diaryPage);

    await diary.goto();

    const rows = await diary.getAllRows();

    await diaryPage.close();

    const good = rows.filter(
      (r) => r.type === 'Good'
    ).length;

    const bad = rows.filter(
      (r) => r.type === 'Bad'
    ).length;

    const recurringFromDiary =
      DreamsDiaryPage.findRecurringNames(rows).length;

    const total = new DreamsTotalPage(page);

    await total.goto();

    expect(
      await total.getGoodDreamsCount()
    ).toBe(good);

    expect(
      await total.getBadDreamsCount()
    ).toBe(bad);

    expect(
      await total.getTotalDreamsCount()
    ).toBe(rows.length);

    expect(
      await total.getRecurringDreamsCount()
    ).toBe(recurringFromDiary);
  });
});