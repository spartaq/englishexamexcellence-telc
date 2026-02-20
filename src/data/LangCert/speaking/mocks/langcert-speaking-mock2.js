// src/data/speaking/mocks/speaking-mock-2.js
export const speakingMock2 = {
  id: 'langcert-speaking-mock2',
  type: 'langcert-speaking',
  title: 'B2 Speaking Practice #2',
  xpReward: 1500,
  parts: [
    {
      id: 'part1',
      title: 'Part 1: Personal Information & Opinions',
      instruction: 'Answer the following questions using abstract ideas and personal experience.',
      prompts: [
        "What do you think is the best way to stay healthy in a busy city?",
        "Should more money be spent on public transport or on building new roads?",
        "If you could learn a new skill instantly, what would it be and why?",
        "Is it better to travel alone or with a group of friends? Why?"
      ]
    },
    {
      id: 'part2',
      title: 'Part 2: Situational Role-play',
      instruction: 'Respond to the situation based on the level of formality described.',
      scenarios: [
        {
          context: "Neutral: We are colleagues. We are supposed to meet for lunch, but you are running 20 minutes late. You call me.",
          interlocutorLine: "Hello? Where are you? I've been waiting at the restaurant for ten minutes.",
          goal: "Apologize, explain the delay, and suggest what I should do (wait or start without you)."
        },
        {
          context: "Formal: I am your neighbor. Your dog has been barking late at night, and I am complaining to you about it.",
          interlocutorLine: "Excuse me, I hate to complain, but your dog kept me awake until 2 AM last night. This is the third time this week.",
          goal: "Respond politely, explain the situation, and offer a solution to prevent it from happening again."
        }
      ]
    },
    {
      id: 'part3',
      title: 'Part 3: Exchanging Information (Decision Making)',
      instruction: 'We are planning a farewell party for a colleague. We need to decide on the venue and the gift.',
      candidateInfo: {
        theme: "Farewell Party",
        options: [
          "Venue 1: The Italian restaurant downtown (Expensive but high quality).",
          "Venue 2: The office lounge (Free, but less special)."
        ],
        discussionPoints: ["Budget", "Surprise element", "Guest list"]
      }
    },
    {
      id: 'part4',
      title: 'Part 4: Long Turn',
      instruction: 'You have 30 seconds to prepare. Speak for 2 minutes on the topic below.',
      topicCard: {
        topic: "The importance of learning foreign languages in the modern world.",
        bulletPoints: [
          "Cultural understanding",
          "Career opportunities",
          "The role of translation technology (AI)",
          "Personal growth"
        ],
        followUpQuestions: [
          "Will English always be the global language of business?",
          "Should children start learning a second language as early as possible?"
        ]
      }
    }
  ]
};
