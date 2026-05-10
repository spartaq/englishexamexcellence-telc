export const conjunctions1Data = {
  id: 'conjunctions-1',
  type: 'gap-fill-tokens',
  title: 'Conjunctions & Connectors',
  instruction: 'Select the correct connector for each gap.',
  xpReward: 100,
  passage: `Many students struggle with English exams. ____(a)____ they study hard, they still fail because they don't practice enough. ____(b)____ the exam is difficult, with the right preparation anyone can pass. Some students work part-time, ____(c)____ others focus only on studying.`,
  tokens: [
    'ALTHOUGH', 'HOWEVER', 'EVEN THOUGH', 'BECAUSE', 'WHILE',
    'UNLESS', 'SINCE', 'BUT', 'OTHERWISE', 'THEREFORE'
  ],
  answers: {
    "a": "ALTHOUGH",
    "b": "HOWEVER",
    "c": "WHILE"
  }
};