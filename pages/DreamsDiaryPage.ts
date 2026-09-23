import { Page, Locator } from '@playwright/test';
import { DreamRow } from '../utils/testData';

export class DreamsDiaryPage {
  readonly page: Page;
  readonly table: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;

    this.table = page.locator('table').first();

    this.rows = this.table.locator('tbody tr').filter({
      hasNot: page.locator('th'),
    });
  }

  async goto(): Promise<void> {
    await this.page.goto('./dreams-diary.html', {
      waitUntil: 'domcontentloaded',
    });
  }

  async rowCount(): Promise<number> {
    return await this.rows.count();
  }

  async getAllRows(): Promise<DreamRow[]> {
    const count = await this.rowCount();

    const result: DreamRow[] = [];

    for (let i = 0; i < count; i++) {
      const cells = this.rows.nth(i).locator('td');

      const cellCount = await cells.count();

      const name =
        cellCount > 0
          ? (await cells.nth(0).innerText()).trim()
          : '';

      const daysAgo =
        cellCount > 1
          ? (await cells.nth(1).innerText()).trim()
          : '';

      const type =
        cellCount > 2
          ? (await cells.nth(2).innerText()).trim()
          : '';

      result.push({
        name,
        daysAgo,
        type: type as DreamRow['type'],
      });
    }

    return result;
  }

  static findRecurringNames(
    rows: DreamRow[]
  ): string[] {
    const counts = new Map<string, number>();

    for (const row of rows) {
      counts.set(
        row.name,
        (counts.get(row.name) ?? 0) + 1
      );
    }

    return [...counts.entries()]
      .filter(([, count]) => count > 1)
      .map(([name]) => name);
  }
}