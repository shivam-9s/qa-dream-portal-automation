import OpenAI from 'openai';

/**
 * Bonus (Part 2): thin wrapper around the OpenAI API that classifies a
 * dream's name as "Good" or "Bad", so tests can cross-check the app's own
 * classification against an independent AI judgment.
 *
 * Requires OPENAI_API_KEY in the environment (see .env.example).
 */

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return client;
}

export function isAiClassificationConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Error used when the external AI service is unavailable.
 *
 * This is different from an actual AI classification mismatch.
 */
export class AiServiceUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AiServiceUnavailableError';
  }
}

/**
 * Classifies a dream name as 'Good' or 'Bad'.
 *
 * The actual OpenAI classification remains unchanged.
 *
 * Throws:
 * - AiServiceUnavailableError when the external API cannot be used,
 *   such as HTTP 429 / exhausted API credits.
 * - Error when the model returns something other than Good or Bad.
 */
export async function classifyDreamName(
  dreamName: string
): Promise<'Good' | 'Bad'> {
  const openai = getClient();

  const model =
    process.env.OPENAI_MODEL || 'gpt-4o-mini';

  let response;

  try {
    response =
      await openai.chat.completions.create({
        model,
        temperature: 0,
        messages: [
          {
            role: 'system',
            content:
              'You classify the emotional tone of a dream based only on its short title. ' +
              'Respond with exactly one word: "Good" or "Bad". No punctuation, no explanation.',
          },
          {
            role: 'user',
            content: `Dream title: "${dreamName}"`,
          },
        ],
      });
  } catch (error: any) {
    const status = error?.status;

    if (status === 429) {
      throw new AiServiceUnavailableError(
        'OpenAI API unavailable: HTTP 429. Check API credits, billing, or rate limits.'
      );
    }

    throw new AiServiceUnavailableError(
      `OpenAI API unavailable: ${
        error?.message ?? String(error)
      }`
    );
  }

  const raw =
    response.choices[0]?.message?.content?.trim() ?? '';

  const normalized = raw.replace(
    /[^a-zA-Z]/g,
    ''
  );

  if (/^good$/i.test(normalized)) {
    return 'Good';
  }

  if (/^bad$/i.test(normalized)) {
    return 'Bad';
  }

  throw new Error(
    `Unexpected AI classification response for "${dreamName}": "${raw}"`
  );
}