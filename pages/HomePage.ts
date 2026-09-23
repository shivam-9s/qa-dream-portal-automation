import {
  Page,
  Locator,
  BrowserContext,
  expect,
} from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly loadingScreen: Locator;
  readonly mainContent: Locator;
  readonly myDreamsButton: Locator;

  constructor(page: Page) {
    this.page = page;

    /*
     * Keep the selector focused on actual loading elements.
     * Do not use broad selectors such as [class*="loader"]
     * if they can match unrelated application elements.
     */
    this.loadingScreen = page.locator(
      '.loading-screen, #loading, .loader'
    );

    this.mainContent = page.locator('body');

    this.myDreamsButton = page
      .getByRole('button', {
        name: /my dreams/i,
      })
      .or(
        page.getByRole('link', {
          name: /my dreams/i,
        })
      )
      .or(
        page.getByText('My Dreams', {
          exact: true,
        })
      );
  }

  async goto(): Promise<void> {
    await this.page.goto('./', {
      waitUntil: 'commit',
    });
  }

  async isLoadingVisible(): Promise<boolean> {
    try {
      const count = await this.loadingScreen.count();

      if (count === 0) {
        return false;
      }

      for (let i = 0; i < count; i++) {
        const loader = this.loadingScreen.nth(i);

        if (
          await loader
            .isVisible()
            .catch(() => false)
        ) {
          return true;
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  async waitForLoadingToDisappear(
    timeoutMs: number
  ): Promise<void> {
    const count = await this.loadingScreen.count();

    if (count === 0) {
      return;
    }

    for (let i = 0; i < count; i++) {
      const loader = this.loadingScreen.nth(i);

      if (
        await loader
          .isVisible()
          .catch(() => false)
      ) {
        await expect(loader).toBeHidden({
          timeout: timeoutMs,
        });
      }
    }
  }

  async waitForMainContentVisible(): Promise<void> {
    await expect(
      this.mainContent
    ).toBeVisible();

    await expect(
      this.myDreamsButton
    ).toBeVisible();
  }

  async clickMyDreamsAndCaptureNewTabs(
    context: BrowserContext
  ): Promise<Page[]> {
    /*
     * Remember the pages that already exist.
     * Normally this will contain only the home page.
     */
    const existingPages = new Set(
      context.pages()
    );

    /*
     * Perform exactly ONE click.
     */
    await this.myDreamsButton.click();

    /*
     * Wait until the application has opened its
     * new tabs/windows.
     */
    await expect
      .poll(
        () =>
          context
            .pages()
            .filter(
              (page) =>
                !existingPages.has(page)
            ).length,
        {
          timeout: 10_000,
          message:
            'Expected two new tabs/windows after clicking My Dreams',
        }
      )
      .toBe(2);

    /*
     * Capture only genuinely new pages.
     */
    const newPages = context
      .pages()
      .filter(
        (page) =>
          !existingPages.has(page)
      );

    /*
     * Wait for navigation in both pages.
     */
    for (const newPage of newPages) {
      await newPage
        .waitForLoadState(
          'domcontentloaded'
        )
        .catch(() => undefined);
    }

    return newPages;
  }
}