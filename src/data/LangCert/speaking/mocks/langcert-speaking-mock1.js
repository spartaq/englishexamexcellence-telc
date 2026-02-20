// src/data/speaking/mocks/langcert-speaking-mock1.js
export const speakingMock1 = {
  id: 'langcert-speaking-mock1',
  type: 'langcert-speaking',
  title: 'B2 Speaking Practice #1',
  xpReward: 1500,
  parts: [
    {
      id: 'part1',
      title: 'Part 1: Personal Information & Opinions',
      instruction: 'Answer the questions naturally. Express your opinions on these topics.',
      prompts: [
        "Can you tell me about a place in your country that you think everyone should visit?",
        "How important is it for people to protect the local environment in their daily lives?",
        "Do you think people spend too much time on their phones these days? Why?",
        "How has your taste in music or films changed as you have grown older?"
      ]
    },
    {
      id: 'part2',
      title: 'Part 2: Situational Role-play',
      instruction: 'Listen to the context and respond appropriately. You must initiate or respond as required.',
      scenarios: [
        {
          context: "Informal: I am your friend. I have just bought a very expensive piece of technology, but I don't know how to use it. I ask you for help.",
          interlocutorLine: "Look at this new tablet! It cost me a fortune, but I can't even figure out how to turn it on. Could you help me?",
          goal: "Offer assistance and give a brief explanation of how to start."
        },
        {
          context: "Formal: You are in a shop. You bought a jacket yesterday, but when you got home, you found a hole in the sleeve. I am the shop manager.",
          interlocutorLine: "Good morning. How can I help you today?",
          goal: "Explain the problem clearly and ask for a refund or exchange."
        }
      ]
    },
    {
      id: 'part3',
      title: 'Part 3: Exchanging Information (Info Gap)',
      instruction: 'We want to organize a charity event. Let\'s discuss and agree on 2-3 specific plans.',
      candidateInfo: {
        theme: "Charity Fundraiser",
        options: [
          "Option A: A 5km Fun Run (Good for fitness, needs a lot of volunteers).",
          "Option B: A Bake Sale (Easy to organize, lower profit margin)."
        ],
        discussionPoints: ["Location", "Target Audience", "Date"]
      }
    },
    {
      id: 'part4',
      title: 'Part 4: Long Turn',
      instruction: 'You have 30 seconds to prepare. Speak for 2 minutes on the topic below.',
      topicCard: {
        topic: "The benefits and challenges of working from home.",
        bulletPoints: [
          "Why it is becoming more popular",
          "The impact on work-life balance",
          "Potential problems for employers",
          "Your personal preference"
        ],
        followUpQuestions: [
          "Do you think offices will completely disappear in the future?",
          "Is it harder to manage staff when you cannot see them in person?"
        ]
      }
    }
  ]
};
