import { Page } from '@playwright/test';

export class DreamsTotalPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto('./dreams-total.html', {
      waitUntil: 'domcontentloaded',
    });
  }

  private async fullText(): Promise<string> {
    return (
      await this.page.locator('body').innerText()
    ).replace(/\s+/g, ' ');
  }

  private async extractStat(
    label: string
  ): Promise<number | null> {
    const text = await this.fullText();

    const pattern = new RegExp(
      `${label}[^0-9]{0,10}(\\d+)`,
      'i'
    );

    const match = text.match(pattern);

    return match
      ? parseInt(match[1], 10)
      : null;
  }

  async getGoodDreamsCount(): Promise<number | null> {
    return await this.extractStat('Good Dreams');
  }

  async getBadDreamsCount(): Promise<number | null> {
    return await this.extractStat('Bad Dreams');
  }

  async getTotalDreamsCount(): Promise<number | null> {
    return await this.extractStat('Total Dreams');
  }

  async getRecurringDreamsCount(): Promise<number | null> {
    return await this.extractStat('Recurring Dreams');
  }

  async pageMentions(
    dreamName: string
  ): Promise<boolean> {
    const text = await this.fullText();

    return text
      .toLowerCase()
      .includes(dreamName.toLowerCase());
  }
}