// IELTS Speaking Practice Test #5

export const speakingMock5 = {
  id: 'ielts-speaking-mock5',
  type: 'ielts-speaking',
  title: 'IELTS Speaking Practice Test 5',
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
          topic: 'Your Home Town or Village',
          questions: [
            { id: 'p1q1', text: 'What kind of place is it?' },
            { id: 'p1q2', text: 'What\'s the most interesting part of your town/village?' },
            { id: 'p1q3', text: 'What kind of jobs do the people in your town/village do?' },
            { id: 'p1q4', text: 'Would you say it\'s a good place to live? (Why?)' }
          ]
        },
        {
          topic: 'Shopping',
          questions: [
            { id: 'p1q5', text: 'What kind of shops are there in your area?' },
            { id: 'p1q6', text: 'Do you prefer shopping online or in stores?' },
            { id: 'p1q7', text: 'How has shopping changed in recent years?' },
            { id: 'p1q8', text: 'Do you think shopping is good for the economy?' }
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
        id: 'task5a',
        topic: 'Describe your favourite book or film.',
        description: 'You should say:',
        bulletPoints: [
          'what it is',
          'what it is about',
          'why you like it',
          'explain how it has affected you'
        ],
        roundingQuestions: [
          { id: 'r1', text: 'Is this book/film popular in your country?' },
          { id: 'r2', text: 'Would you recommend it to others?' }
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
          topic: 'Entertainment',
          questions: [
            { id: 'p3q1', text: 'What kind of entertainment is popular in your country?' },
            { id: 'p3q2', text: 'Has entertainment changed over time?' }
          ]
        },
        {
          topic: 'Books and Films',
          questions: [
            { id: 'p3q3', text: 'Do you think reading is important for education?' }
          ]
        }
      ]
    }
  ]
};
