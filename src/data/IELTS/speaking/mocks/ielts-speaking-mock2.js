// IELTS Speaking Practice Test #2

export const speakingMock2 = {
  id: 'ielts-speaking-mock2',
  type: 'ielts-speaking',
  title: 'IELTS Speaking Practice Test 2',
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
          topic: 'Free Time',
          questions: [
            { id: 'p1q5', text: 'What do you like to do in your free time?' },
            { id: 'p1q6', text: 'How do you usually spend your weekends?' },
            { id: 'p1q7', text: 'Do you prefer relaxing or active hobbies?' },
            { id: 'p1q8', text: 'Is there any hobby you would like to try?' }
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
        id: 'task2a',
        topic: 'Describe a person who has influenced you.',
        description: 'You should say:',
        bulletPoints: [
          'who this person is',
          'how you first met them',
          'what they did that influenced you',
          'explain how this person has affected your life'
        ],
        roundingQuestions: [
          { id: 'r1', text: 'Is this person famous?' },
          { id: 'r2', text: 'Would you like to meet them again?' }
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
          topic: 'Influences on Young People',
          questions: [
            { id: 'p3q1', text: 'Who influences young people more, family or friends?' },
            { id: 'p3q2', text: 'Has this changed over time?' }
          ]
        },
        {
          topic: 'Role Models',
          questions: [
            { id: 'p3q3', text: 'What qualities make a good role model?' }
          ]
        }
      ]
    }
  ]
};
