// src/data/speaking/mocks/mock-5.js
export const speakingMock5 = {
  id: 'speaking-mock-5',
  type: 'langcert-speaking',
  title: 'B2 Speaking Practice #5',
  xpReward: 1500,
  parts: [
    {
      id: 'part1',
      title: 'Part 1: Personal Information & Opinions',
      instruction: 'Answer the questions focusing on abstract and familiar topics.',
      prompts: [
        "What do you think is the most significant invention of the last 50 years?",
        "How do you usually handle stressful situations in your life?",
        "Is it more important to have a high-paying job or a job you enjoy?",
        "Do you think the way we celebrate holidays has become too commercial?"
      ]
    },
    {
      id: 'part2',
      title: 'Part 2: Situational Role-play',
      instruction: 'Maintain the conversation and achieve the goal of the task.',
      scenarios: [
        {
          context: "Informal: I am your housemate. You left the kitchen in a mess this morning, and I'm not happy about it.",
          interlocutorLine: "I can't believe it! I came home to a mountain of dirty dishes and food all over the counter.",
          goal: "Apologize, explain that you were in a rush, and promise to clean it up immediately."
        },
        {
          context: "Formal: You are at a library. You want to borrow a book that is currently out on loan. I am the librarian.",
          interlocutorLine: "Yes? How can I help you today?",
          goal: "Inquire about the book, ask when it is expected back, and see if you can reserve it."
        }
      ]
    },
    {
      id: 'part3',
      title: 'Part 3: Exchanging Information (Decision Making)',
      instruction: 'We want to start a local community project. We need to decide which project would be most beneficial.',
      candidateInfo: {
        theme: "Community Project",
        options: [
          "Project 1: A community garden (Encourages nature and fresh food).",
          "Project 2: An after-school club for teenagers (Provides safety and hobbies)."
        ],
        discussionPoints: ["Volunteer availability", "Long-term benefits", "Publicity"]
      }
    },
    {
      id: 'part4',
      title: 'Part 4: Long Turn',
      instruction: 'You have 30 seconds to prepare. Speak for 2 minutes on the topic below.',
      topicCard: {
        topic: "The influence of celebrity culture on young people today.",
        bulletPoints: [
          "Role models and inspiration",
          "Unrealistic beauty standards",
          "The impact of 'influencers' on shopping habits",
          "The loss of privacy in the digital age"
        ],
        followUpQuestions: [
          "Are celebrities more powerful now than they were in the past?",
          "Should celebrities be expected to behave as perfect role models?"
        ]
      }
    }
  ]
};