import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { EXPECTED } from '../utils/testData';

test.describe('Dream Portal Home (index.html)', () => {
  test('loading animation appears and disappears within the expected time', async ({
    page,
  }) => {
    const home = new HomePage(page);

    const startTime = Date.now();

    await home.goto();

    /*
     * The loading animation is the behavior whose duration
     * is being measured.
     */
    await home.waitForLoadingToDisappear(
      EXPECTED.loadingAnimationMaxMs
    );

    const loadingTime = Date.now() - startTime;

    expect(
      loadingTime,
      `Dream Portal loading animation took ${loadingTime}ms`
    ).toBeLessThanOrEqual(
      EXPECTED.loadingAnimationMaxMs
    );

    await home.waitForMainContentVisible();
  });

  test('main content and "My Dreams" button become visible after loading', async ({
    page,
  }) => {
    const home = new HomePage(page);

    await home.goto();

    await home.waitForLoadingToDisappear(
      EXPECTED.loadingAnimationMaxMs
    );

    await home.waitForMainContentVisible();

    await expect(home.myDreamsButton).toBeEnabled();

    await page.screenshot({
      path: 'screenshots/home-loaded.png',
      fullPage: true,
    });
  });

  test('clicking "My Dreams" opens dreams-diary.html and dreams-total.html in new tabs', async ({
    page,
    context,
  }) => {
    const home = new HomePage(page);

    await home.goto();

    await home.waitForLoadingToDisappear(
      EXPECTED.loadingAnimationMaxMs
    );

    await home.waitForMainContentVisible();

    const newTabs =
      await home.clickMyDreamsAndCaptureNewTabs(context);

    expect(
      newTabs.length,
      'Expected two new tabs/windows to open'
    ).toBe(2);

    const urls = newTabs.map((tab) => tab.url());

    expect(
      urls.some((url) =>
        url.includes('dreams-diary.html')
      )
    ).toBe(true);

    expect(
      urls.some((url) =>
        url.includes('dreams-total.html')
      )
    ).toBe(true);

    for (const tab of newTabs) {
      await expect(tab).toHaveURL(
        /dreams-(diary|total)\.html/
      );
    }
  });
});