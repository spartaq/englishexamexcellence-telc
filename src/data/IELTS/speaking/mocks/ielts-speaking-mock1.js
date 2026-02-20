// IELTS Speaking Practice Test #1
// Official IELTS Speaking format: Part 1 (Interview), Part 2 (Long Turn), Part 3 (Discussion)

export const speakingMock1 = {
  id: 'ielts-speaking-mock1',
  type: 'ielts-speaking',
  title: 'IELTS Speaking Practice Test 1',
  xpReward: 500,
  tier: 'bronze',
  parts: [
    // Part 1: Introduction and Interview (4-5 minutes)
    {
      id: 'part1',
      title: 'Part 1: Introduction and Interview',
      instruction: 'Answer the examiner\'s questions about familiar topics. Speak naturally and give full answers.',
      duration: '4-5 minutes',
      type: 'interview',
      prompts: [
        // Topic 1: Home town/village
        {
          topic: 'Your Home Town or Village',
          questions: [
            { id: 'p1q1', text: 'What kind of place is it?' },
            { id: 'p1q2', text: 'What\'s the most interesting part of your town/village?' },
            { id: 'p1q3', text: 'What kind of jobs do the people in your town/village do?' },
            { id: 'p1q4', text: 'Would you say it\'s a good place to live? (Why?)' }
          ]
        },
        // Topic 2: Accommodation
        {
          topic: 'Accommodation',
          questions: [
            { id: 'p1q5', text: 'Tell me about the kind of accommodation you live in.' },
            { id: 'p1q6', text: 'How long have you lived there?' },
            { id: 'p1q7', text: 'What do you like about living there?' },
            { id: 'p1q8', text: 'What sort of accommodation would you most like to live in?' }
          ]
        }
      ]
    },

    // Part 2: Individual Long Turn (3-4 minutes)
    {
      id: 'part2',
      title: 'Part 2: Individual Long Turn',
      instruction: 'You will have 1 minute to prepare, then speak for 1-2 minutes on the topic.',
      duration: '3-4 minutes',
      type: 'long-turn',
      topicCard: {
        id: 'task1',
        topic: 'Describe something valuable that you own.',
        description: 'You should say:',
        bulletPoints: [
          'what it is',
          'how you got it',
          'what you use it for',
          'explain why it is valuable to you'
        ],
        roundingQuestions: [
          { id: 'r1', text: 'Is it valuable in terms of money?' },
          { id: 'r2', text: 'Would it be easy to replace?' }
        ]
      }
    },

    // Part 3: Two-way Discussion (4-5 minutes)
    {
      id: 'part3',
      title: 'Part 3: Two-way Discussion',
      instruction: 'Discuss more abstract issues related to the topic in Part 2.',
      duration: '4-5 minutes',
      type: 'discussion',
      topics: [
        {
          topic: 'How people\'s values have changed',
          questions: [
            { id: 'p3q1', text: 'What kind of things give status to people in your country?' },
            { id: 'p3q2', text: 'Have things changed since your parents\' time?' }
          ]
        },
        {
          topic: 'The role of advertising',
          questions: [
            { id: 'p3q3', text: 'Do you think advertising influences what people buy?' }
          ]
        }
      ]
    }
  ]
};

// Additional speaking prompts for variety in Part 1
export const speakingPart1Topics = [
  {
    topic: 'Your Home Town or Village',
    questions: [
      'What kind of place is it?',
      'What\'s the most interesting part of your town/village?',
      'What kind of jobs do the people in your town/village do?',
      'Would you say it\'s a good place to live? (Why?)'
    ]
  },
  {
    topic: 'Accommodation',
    questions: [
      'Tell me about the kind of accommodation you live in.',
      'How long have you lived there?',
      'What do you like about living there?',
      'What sort of accommodation would you most like to live in?'
    ]
  },
  {
    topic: 'Work or Studies',
    questions: [
      'What work do you do?',
      'Why did you choose that job?',
      'What do you enjoy most about your job?',
      'Do you plan to change your job in the future?'
    ]
  },
  {
    topic: 'Hobbies and Interests',
    questions: [
      'What do you enjoy doing in your free time?',
      'How did you become interested in that hobby?',
      'Do you prefer to do hobbies alone or with others?',
      'Would you like to try any new hobbies?'
    ]
  },
  {
    topic: 'Holidays and Travel',
    questions: [
      'What is your favourite holiday destination?',
      'How often do you travel abroad?',
      'What do you usually do during holidays?',
      'Do you prefer relaxing holidays or active holidays?'
    ]
  },
  {
    topic: 'Food and Cooking',
    questions: [
      'What kind of food do you enjoy?',
      'Can you cook?',
      'Who usually cooks in your family?',
      'Do you think eating out is expensive in your country?'
    ]
  },
  {
    topic: 'Technology',
    questions: [
      'What technology do you use most often?',
      'How has technology changed your life?',
      'Do you think technology makes life easier?',
      'What technology will we have in the future?'
    ]
  }
];

// Sample topic cards for Part 2
export const speakingPart2Topics = [
  {
    id: 'task1',
    topic: 'Describe something valuable that you own.',
    description: 'You should say:',
    bulletPoints: [
      'what it is',
      'how you got it',
      'what you use it for',
      'explain why it is valuable to you'
    ]
  },
  {
    id: 'task2',
    topic: 'Describe a person who has influenced you.',
    description: 'You should say:',
    bulletPoints: [
      'who this person is',
      'how you first met them',
      'what they did that influenced you',
      'explain how this person has affected your life'
    ]
  },
  {
    id: 'task3',
    topic: 'Describe a place you would like to visit.',
    description: 'You should say:',
    bulletPoints: [
      'where it is',
      'when you would like to go',
      'what you would do there',
      'explain why you would like to visit this place'
    ]
  },
  {
    id: 'task4',
    topic: 'Describe a skill you learned when you were a child.',
    description: 'You should say:',
    bulletPoints: [
      'what the skill was',
      'who taught you',
      'how you learned it',
      'explain why this skill has been useful'
    ]
  },
  {
    id: 'task5',
    topic: 'Describe a memorable event in your life.',
    description: 'You should say:',
    bulletPoints: [
      'what the event was',
      'when and where it happened',
      'who was involved',
      'explain why it was memorable'
    ]
  },
  {
    id: 'task6',
    topic: 'Describe your favourite book or film.',
    description: 'You should say:',
    bulletPoints: [
      'what it is',
      'what it is about',
      'why you like it',
      'explain how it has affected you'
    ]
  }
];

// Sample discussion topics for Part 3
export const speakingPart3Topics = [
  {
    topic: 'Values and Status',
    questions: [
      'What kind of things give status to people in your country?',
      'Have things changed since your parents\' time?',
      'Is it important to be rich? Why/Why not?'
    ]
  },
  {
    topic: 'Advertising and Consumerism',
    questions: [
      'Do you think advertising influences what people buy?',
      'Is advertising more powerful now than in the past?',
      'Should there be more regulations on advertising?'
    ]
  },
  {
    topic: 'Education and Learning',
    questions: [
      'What is the best age to start school?',
      'How has education changed in recent years?',
      'Should university education be free?'
    ]
  },
  {
    topic: 'Environment and Sustainability',
    questions: [
      'What are the main environmental problems in your country?',
      'How can individuals help protect the environment?',
      'Should the government force people to recycle?'
    ]
  }
];
