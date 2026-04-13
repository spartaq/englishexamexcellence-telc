/**
 * Question Flattener Utility
 * 
 * Consolidates the question flattening logic used across
 * LanguageElementsBlock, ReadingBlock, and ListeningBlock.
 * 
 * Converts nested subTasks structure into a flat array for QuestionCarousel.
 */

export const SELF_CONTAINED_TYPES = [
  'sentence-matching',
  'diagram-label',
  'flow-chart',
  'flowchart',
  'heading-match',
  'sentence-complete',
  'gap-fill',
  'short-answer',
  'mcq',
  'trinary',
  'matching-info',
  'matching-features',
  'notes-completion',
  'sentence-insert'
];

// Types that should always be kept as self-contained even if they have questions array
export const ALWAYS_SELF_CONTAINED = ['heading-match', 'notes-completion'];

/**
 * Flattens nested subTasks into a flat questions array for QuestionCarousel.
 * 
 * Self-contained types: Kept as single carousel item (entire block handles multiple questions)
 * Individual types: Flattened into separate questions
 * 
 * @param {Array} subTasks - Array of subTask objects from exam data
 * @returns {Array} Flattened array of questions/subTasks
 */
export const flattenQuestions = (subTasks) => {
  if (!Array.isArray(subTasks)) return [];

  return subTasks.flatMap(st => {
    // Always keep certain types as self-contained, regardless of having questions
    if (ALWAYS_SELF_CONTAINED.includes(st.type)) {
      return [st];
    }

    // For other types, flatten if they have questions array
    if (st.questions && Array.isArray(st.questions)) {
      return st.questions.map(q => ({
        ...q,
        type: q.type || st.type
      }));
    }

    if (SELF_CONTAINED_TYPES.includes(st.type)) {
      return [st];
    }

    return [st];
  });
};