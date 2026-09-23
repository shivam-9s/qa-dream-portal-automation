import { test, expect } from '@playwright/test';

import { DreamsDiaryPage } from '../pages/DreamsDiaryPage';

import {
  classifyDreamName,
  isAiClassificationConfigured,
  AiServiceUnavailableError,
} from '../utils/aiClassifier';

/**
 * Part 2 (Bonus): AI-Based Content Classification.
 *
 * For every dream name in the diary table, ask an OpenAI model to
 * independently classify it as "Good" or "Bad" and compare that judgment
 * against the type already recorded in the app.
 *
 * The test is skipped automatically when:
 * - OPENAI_API_KEY is not configured, or
 * - the external OpenAI service is unavailable, such as HTTP 429
 *   caused by exhausted API credits.
 *
 * A genuine AI/app classification mismatch is NOT skipped.
 * It remains a real test failure.
 */
test.describe(
  'Bonus: AI-based dream classification (dreams-diary.html)',
  () => {
    test.skip(
      !isAiClassificationConfigured(),
      'OPENAI_API_KEY not set — skipping AI bonus checks'
    );

    test(
      'AI classification agrees with the app\'s recorded dream type for each entry',
      async ({ page }) => {
        const diary = new DreamsDiaryPage(page);

        await diary.goto();

        const rows =
          await diary.getAllRows();

        const mismatches: {
          name: string;
          appType: string;
          aiType: string;
        }[] = [];

        for (const row of rows) {
          let aiType:
            | 'Good'
            | 'Bad';

          try {
            aiType =
              await classifyDreamName(
                row.name
              );
          } catch (error) {
            /*
             * The AI bonus depends on an external paid API.
             *
             * If that service is unavailable, skip the bonus test
             * instead of reporting an application failure.
             */
            if (
              error instanceof
              AiServiceUnavailableError
            ) {
              test.skip(
                true,
                `AI bonus skipped: ${error.message}`
              );
            }

            /*
             * Any other unexpected error should still fail the test.
             */
            throw error;
          }

          test.info().annotations.push({
            type: 'ai-classification',
            description:
              `"${row.name}" → app: ${row.type}, AI: ${aiType}`,
          });

          if (
            aiType !== row.type
          ) {
            mismatches.push({
              name: row.name,
              appType: row.type,
              aiType,
            });
          }

          /*
           * Soft assertion allows the test report to show
           * all AI classifications instead of stopping at
           * the first mismatch.
           */
          expect
            .soft(
              aiType,
              `AI classified "${row.name}" as "${aiType}", app says "${row.type}"`
            )
            .toBe(row.type);
        }

        const agreementRate =
          ((rows.length -
            mismatches.length) /
            rows.length) *
          100;

        test.info().annotations.push({
          type: 'ai-agreement-rate',
          description:
            `${agreementRate.toFixed(1)}% ` +
            `(${rows.length - mismatches.length}/${rows.length})`,
        });

        /*
         * Require at least 70% agreement.
         *
         * A genuine AI/app mismatch is therefore still
         * treated as a test failure.
         */
        expect(
          agreementRate,
          `AI/app agreement too low. Mismatches: ${JSON.stringify(
            mismatches,
            null,
            2
          )}`
        ).toBeGreaterThanOrEqual(70);
      }
    );
  }
);