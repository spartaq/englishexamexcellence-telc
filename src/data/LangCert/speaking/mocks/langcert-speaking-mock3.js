// src/data/speaking/mocks/mock-3.js
export const speakingMock3 = {
  id: 'speaking-mock-3',
  type: 'langcert-speaking',
  title: 'B2 Speaking Practice #3',
  xpReward: 1500,
  parts: [
    {
      id: 'part1',
      title: 'Part 1: Personal Information & Opinions',
      instruction: 'Answer the following questions. Provide reasons for your opinions.',
      prompts: [
        "How has the internet changed the way you study or work?",
        "Do you prefer to get your news from social media or traditional newspapers?",
        "What qualities do you think make a person a good leader?",
        "If you could start your own business, what kind of company would it be?"
      ]
    },
    {
      id: 'part2',
      title: 'Part 2: Situational Role-play',
      instruction: 'Respond to the situations. Pay attention to the level of formality.',
      scenarios: [
        {
          context: "Informal: I am your friend. I want to go to the cinema tonight, but you have a big exam tomorrow morning.",
          interlocutorLine: "Come on! You've been studying all day. Let's go see that new action movie, it starts in an hour.",
          goal: "Refuse the invitation politely, explain why you can't go, and suggest meeting another time."
        },
        {
          context: "Formal: I am your manager at work. You want to request a week off next month for a family event.",
          interlocutorLine: "Hello. You said you wanted to discuss something regarding your schedule?",
          goal: "Explain the reason for your request, state the dates, and offer to finish your work in advance."
        }
      ]
    },
    {
      id: 'part3',
      title: 'Part 3: Exchanging Information (Decision Making)',
      instruction: 'We are part of a committee deciding how to improve the local park. We need to choose two main additions.',
      candidateInfo: {
        theme: "Park Improvements",
        options: [
          "Option 1: A new outdoor gym area (Promotes health, low maintenance).",
          "Option 2: A small café and seating area (Creates jobs, social space)."
        ],
        discussionPoints: ["Local budget", "Safety for children", "Impact on wildlife"]
      }
    },
    {
      id: 'part4',
      title: 'Part 4: Long Turn',
      instruction: 'You have 30 seconds to prepare. Speak for 2 minutes on the topic below.',
      topicCard: {
        topic: "The impact of Artificial Intelligence on our daily lives.",
        bulletPoints: [
          "How it makes life easier",
          "Concerns about privacy and security",
          "The future of the job market",
          "AI in education"
        ],
        followUpQuestions: [
          "Can a machine ever be as creative as a human being?",
          "Should there be stricter laws to control the development of AI?"
        ]
      }
    }
  ]
};