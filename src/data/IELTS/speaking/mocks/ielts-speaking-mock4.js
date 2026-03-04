// IELTS Speaking Practice Test #4

export const speakingMock4 = {
  id: 'ielts-speaking-mock4',
  type: 'ielts-speaking',
  title: 'IELTS Speaking Practice Test 4',
  xpReward: 500,
  tier: 'bronze',
  parts: [
    // Part 1: Introduction and Interview
    {
      id: 'part1',
      title: 'Introduction and Interview',
      instruction: 'Answer the examiner\'s questions about familiar topics.',
      duration: '4-5 minutes',
      type: 'interview',
      prompts: [
        {
          topic: 'Food and Cooking',
          questions: [
            { id: 'p1q1', text: 'What kind of food do you enjoy?' },
            { id: 'p1q2', text: 'Can you cook?' },
            { id: 'p1q3', text: 'Who usually cooks in your family?' },
            { id: 'p1q4', text: 'Do you think eating out is expensive in your country?' }
          ]
        },
        {
          topic: 'Holidays',
          questions: [
            { id: 'p1q5', text: 'What is your favourite holiday destination?' },
            { id: 'p1q6', text: 'How often do you travel abroad?' },
            { id: 'p1q7', text: 'What do you usually do during holidays?' },
            { id: 'p1q8', text: 'Do you prefer relaxing holidays or active holidays?' }
          ]
        }
      ]
    },

    // Part 2: Part 2
    {
      id: 'part2',
      title: 'Part 2',
      instruction: 'You will have 1 minute to prepare, then speak for 1-2 minutes.',
      duration: '3-4 minutes',
      type: 'long-turn',
      topicCard: {
        id: 'task4a',
        topic: 'Describe a skill you learned when you were a child.',
        description: 'You should say:',
        bulletPoints: [
          'what the skill was',
          'who taught you',
          'how you learned it',
          'explain why this skill has been useful'
        ],
        roundingQuestions: [
          { id: 'r1', text: 'Is it difficult to learn this skill?' },
          { id: 'r2', text: 'Would you teach it to your children?' }
        ]
      }
    },

    // Part 3: Part 3
    {
      id: 'part3',
      title: 'Part 3',
      instruction: 'Discuss more abstract issues related to the topic in Part 2.',
      duration: '4-5 minutes',
      type: 'discussion',
      topics: [
        {
          topic: 'Education and Learning',
          questions: [
            { id: 'p3q1', text: 'What is the best age to learn new skills?' },
            { id: 'p3q2', text: 'Should all skills be taught in school?' }
          ]
        },
        {
          topic: 'Life-long Learning',
          questions: [
            { id: 'p3q3', text: 'Is it important to keep learning throughout life?' }
          ]
        }
      ]
    }
  ]
};
