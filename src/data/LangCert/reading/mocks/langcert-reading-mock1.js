/**
 * LangCert Reading Mock 1
 * 
 * Language Learning Tips - Gap fill exercise
 */

export const readingMock1 = {
  id: 'langcert-reading-1',
  title: 'Language Learning Tips',
  type: 'gap-fill-tokens',
  tier: "bronze",
  instruction: 'Read the passage and complete the gaps by selecting the correct words.',
  xpReward: 50,
  passage: `Learning a new language can be challenging, but there are ____(1)____ 
techniques that make it easier. First, immerse yourself in the language by watching 
movies or listening to music in the target language. This helps you ____(2)____ 
to the sounds and rhythms of the language.

Second, practice speaking with native speakers whenever ____(3)____. Don't be 
afraid of making mistakes - they are a natural part of the learning process. 
____(4)____, try to think in the new language rather than translating from 
your native language.

Finally, set realistic goals and track your ____(5)____. Celebrate small 
victories along the way to stay motivated. Remember, consistency is key to 
mastering any language.`,
  tokens: [
    'effective', 'possible', 'useful', 'adjust',
    'opportunity', 'available', 'Finally',
    'progress', 'advance', 'development'
  ],
  answers: [
    'effective',
    'adjust',
    'possible',
    'Finally',
    'progress'
  ]
};

export default readingMock1;
