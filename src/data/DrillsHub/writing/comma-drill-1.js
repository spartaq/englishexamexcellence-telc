// Comma Usage Drill 1 - Introductory Elements and Coordinating Conjunctions
// Users click between words to add commas where needed

export const commaDrill1Data = {
  id: 'comma-drill-1',
  type: 'punctuation-correction',
  title: 'Comma Usage: Introductory Elements',
  instruction: 'Click between words to add commas where they belong. Focus on introductory words and phrases.',
  xpReward: 100,
  punctuationMark: ',',
  correctPositions: [0, 3, 0, 2, 3, 2, 0, 4],
  
  sentences: [
    {
      id: 's1',
      text: 'However the results were inconclusive.',
      correctPositions: [0], // Comma after "However"
      explanation: 'Use a comma after transitional words like "however," "therefore," "moreover," and "nevertheless."'
    },
    {
      id: 's2',
      text: 'After the meeting ended we went for coffee.',
      correctPositions: [3], // Comma after "ended"
      explanation: 'Use a comma after an introductory dependent clause (a clause that cannot stand alone).'
    },
    {
      id: 's3',
      text: 'Unfortunately the project was delayed due to budget constraints.',
      correctPositions: [0], // Comma after "Unfortunately"
      explanation: 'Use a comma after introductory adverbs expressing attitude or viewpoint.'
    },
    {
      id: 's4',
      text: 'In the morning I like to drink tea.',
      correctPositions: [2], // Comma after "morning"
      explanation: 'Use a comma after introductory prepositional phrases, especially longer ones.'
    },
    {
      id: 's5',
      text: 'Running late for work she forgot her phone.',
      correctPositions: [3], // Comma after "work"
      explanation: 'Use a comma after introductory participial phrases.'
    },
    {
      id: 's6',
      text: 'To be honest I disagree with your assessment.',
      correctPositions: [2], // Comma after "honest"
      explanation: 'Use a comma after introductory infinitive phrases used as modifiers.'
    },
    {
      id: 's7',
      text: 'Well I think we should reconsider.',
      correctPositions: [0], // Comma after "Well"
      explanation: 'Use a comma after introductory interjections or filler words.'
    },
    {
      id: 's8',
      text: 'By the time we arrived the concert had already started.',
      correctPositions: [4], // Comma after "arrived"
      explanation: 'Use a comma after introductory time clauses.'
    }
  ]
};

// Additional comma drills can be added with different focus areas:

export const commaDrill2Data = {
  id: 'comma-drill-2',
  type: 'punctuation-correction',
  title: 'Comma Usage: Compound & Complex Sentences',
  instruction: 'Click between words to add commas where they belong. Focus on joining clauses.',
  xpReward: 100,
  punctuationMark: ',',
  correctPositions: [3, 5, 5, 3, 3, 4],

  sentences: [
    {
      id: 's1',
      text: 'The weather was beautiful so we decided to have a picnic.',
      correctPositions: [3], // Comma before "so"
      explanation: 'Use a comma before coordinating conjunctions (FANBOYS: for, and, nor, but, or, yet, so) when they connect two independent clauses.'
    },
    {
      id: 's2',
      text: 'I wanted to buy the book but I did not have enough money.',
      correctPositions: [5], // Comma before "but"
      explanation: 'Use a comma before "but" when it connects two complete sentences.'
    },
    {
      id: 's3',
      text: 'She studied hard for the exam yet she still found it difficult.',
      correctPositions: [5], // Comma before "yet"
      explanation: '"Yet" functions as a coordinating conjunction here, so a comma precedes it.'
    },
    {
      id: 's4',
      text: 'Because it was raining the event was postponed.',
      correctPositions: [3], // Comma after "raining"
      explanation: 'When a dependent clause comes first, separate it from the main clause with a comma.'
    },
    {
      id: 's5',
      text: 'Although she was tired she stayed up to finish her assignment.',
      correctPositions: [3], // Comma after "tired"
      explanation: 'Introductory subordinate clauses need a comma before the main clause.'
    },
    {
      id: 's6',
      text: 'The team won the championship and they celebrated all night.',
      correctPositions: [4], // Comma before "and"
      explanation: 'Use a comma before "and" when it joins two independent clauses.'
    }
  ]
};

export const commaDrill3Data = {
  id: 'comma-drill-3',
  type: 'punctuation-correction',
  title: 'Comma Usage: Lists and Series',
  instruction: 'Click between words to add commas where they belong. Focus on lists and series.',
  xpReward: 100,
  punctuationMark: ',',
  correctPositions: [2, 3, 4, 5, 6, 2, 3, 3, 4, 4, 5],

  sentences: [
    {
      id: 's1',
      text: 'She bought apples oranges and bananas at the market.',
      correctPositions: [2, 3], // After "apples" and "oranges"
      explanation: 'Use commas to separate items in a series. The Oxford comma before "and" is optional but recommended for clarity.'
    },
    {
      id: 's2',
      text: 'The recipe calls for flour sugar eggs and butter.',
      correctPositions: [4, 5, 6], // After "flour", "sugar", "eggs"
      explanation: 'Separate all items in a list with commas, including before the final "and."'
    },
    {
      id: 's3',
      text: 'He is tall dark and handsome.',
      correctPositions: [2, 3], // After "tall" and "dark"
      explanation: 'Adjectives in a series describing the same noun are separated by commas.'
    },
    {
      id: 's4',
      text: 'They traveled to Paris London and Rome during their vacation.',
      correctPositions: [3, 4], // After "Paris" and "London"
      explanation: 'Cities in a series are separated by commas.'
    },
    {
      id: 's5',
      text: 'The morning routine includes stretching jogging and meditation.',
      correctPositions: [4, 5], // After "stretching" and "jogging"
      explanation: 'Activities in a list are separated by commas.'
    }
  ]
};
