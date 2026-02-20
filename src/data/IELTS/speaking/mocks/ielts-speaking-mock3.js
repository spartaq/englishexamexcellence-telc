// IELTS Speaking Practice Test #3

export const speakingMock3 = {
  id: 'ielts-speaking-mock3',
  type: 'ielts-speaking',
  title: 'IELTS Speaking Practice Test 3',
  xpReward: 500,
  tier: 'bronze',
  parts: [
    // Part 1: Introduction and Interview
    {
      id: 'part1',
      title: 'Part 1: Introduction and Interview',
      instruction: 'Answer the examiner\'s questions about familiar topics.',
      duration: '4-5 minutes',
      type: 'interview',
      prompts: [
        {
          topic: 'Work or Studies',
          questions: [
            { id: 'p1q1', text: 'What work do you do?' },
            { id: 'p1q2', text: 'Why did you choose that job?' },
            { id: 'p1q3', text: 'What do you enjoy most about your job?' },
            { id: 'p1q4', text: 'Do you plan to change your job in the future?' }
          ]
        },
        {
          topic: 'Technology',
          questions: [
            { id: 'p1q5', text: 'What technology do you use most often?' },
            { id: 'p1q6', text: 'How has technology changed your life?' },
            { id: 'p1q7', text: 'Do you think technology makes life easier?' },
            { id: 'p1q8', text: 'What technology will we have in the future?' }
          ]
        }
      ]
    },

    // Part 2: Individual Long Turn
    {
      id: 'part2',
      title: 'Part 2: Individual Long Turn',
      instruction: 'You will have 1 minute to prepare, then speak for 1-2 minutes.',
      duration: '3-4 minutes',
      type: 'long-turn',
      topicCard: {
        id: 'task3a',
        topic: 'Describe a place you would like to visit.',
        description: 'You should say:',
        bulletPoints: [
          'where it is',
          'when you would like to go',
          'what you would do there',
          'explain why you would like to visit this place'
        ],
        roundingQuestions: [
          { id: 'r1', text: 'Is it expensive to travel there?' },
          { id: 'r2', text: 'Would you like to live there?' }
        ]
      }
    },

    // Part 3: Two-way Discussion
    {
      id: 'part3',
      title: 'Part 3: Two-way Discussion',
      instruction: 'Discuss more abstract issues related to the topic in Part 2.',
      duration: '4-5 minutes',
      type: 'discussion',
      topics: [
        {
          topic: 'Tourism',
          questions: [
            { id: 'p3q1', text: 'Why do people like to travel abroad?' },
            { id: 'p3q2', text: 'How has tourism changed in recent years?' }
          ]
        },
        {
          topic: 'Environmental Impact of Travel',
          questions: [
            { id: 'p3q3', text: 'Is tourism good or bad for the environment?' }
          ]
        }
      ]
    }
  ]
};
