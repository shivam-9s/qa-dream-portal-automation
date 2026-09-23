/**
 * Central expected-values file. Keeping these constants in one place means
 * the assignment's acceptance criteria are declared once and imported by
 * every spec, instead of being duplicated (and drifting) across test files.
 */

export interface DreamRow {
  name: string;
  daysAgo: string;
  type: 'Good' | 'Bad';
}

export const EXPECTED = {
  totalDreamEntries: 10,
  validDreamTypes: ['Good', 'Bad'] as const,

  summary: {
    good: 6,
    bad: 4,
    total: 10,
    recurring: 2,
  },

  recurringDreamNames: ['Flying over mountains', 'Lost in maze'],

  loadingAnimationMaxMs: 3500, // ~3s per spec, with a small buffer
};
