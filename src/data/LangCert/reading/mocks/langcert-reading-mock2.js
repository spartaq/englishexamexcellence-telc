/**
 * LangCert Reading Mock 2
 * 
 * The History of Coffee - Gap fill exercise
 */

export const readingMock2 = {
  id: 'langcert-reading-2',
  title: 'The History of Coffee',
  type: 'gap-fill-tokens',
  tier: 'bronze',
  instruction: 'Complete the passage about the history of coffee.',
  xpReward: 50,
  passage: `Coffee is one of the world's most popular ____(1)____. According to 
legend, it was discovered in Ethiopia around the 9th century. The story says 
a goat herder noticed his goats became very ____(2)____ after eating berries 
from a certain tree.

From Ethiopia, coffee spread to the Arabian ____(3)____ where it became 
extremely popular. By the 17th century, it had reached Europe. Today, Brazil 
is the largest ____(4)____ of coffee in the world, followed by Vietnam and 
Colombia.

Coffee houses, known as qahwa houses, became important social ____(5)____ 
in Middle Eastern cities, where people gathered to drink coffee and discuss 
various topics.`,
  tokens: [
    'beverages', 'drinks', 'products',
    'energetic', 'active', 'excited', 'alert',
    'Peninsula', 'region', 'area',
    'producer', 'exporter', 'consumer',
    'centers', 'places', 'venues'
  ],
  answers: [
    'beverages',
    'energetic',
    'Peninsula',
    'producer',
    'centers'
  ]
};

export default readingMock2;
