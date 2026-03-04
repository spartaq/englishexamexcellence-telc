// src/data/speaking/mocks/mock-4.js
export const speakingMock4 = {
  id: 'speaking-mock-4',
  type: 'langcert-speaking',
  title: 'B2 Speaking Practice #4',
  xpReward: 1500,
  parts: [
    {
      id: 'part1',
      title: 'Personal Information & Opinions',
      instruction: 'Express your ideas clearly using a range of vocabulary.',
      prompts: [
        "How concerned are you about climate change in your local area?",
        "Is it important for people to follow fashion trends? Why/Why not?",
        "Tell me about a tradition in your country that you find interesting.",
        "What are the advantages of living in a multicultural society?"
      ]
    },
    {
      id: 'part2',
      title: 'Situational Role-play',
      instruction: 'Listen to the interlocutor and respond according to the role.',
      scenarios: [
        {
          context: "Neutral: I am a stranger at a train station. I am struggling with a heavy suitcase and look confused by the timetable.",
          interlocutorLine: "(Looking stressed) Oh dear, I think I've missed the last train to the airport.",
          goal: "Offer help, suggest checking a travel app, or mention an alternative transport method like a bus or taxi."
        },
        {
          context: "Formal: You are at a hotel. The room you were given is noisy and the air conditioning is broken. I am the receptionist.",
          interlocutorLine: "Good evening, sir/madam. Is everything alright with your room?",
          goal: "Complain about the noise and the AC, and ask to be moved to a different room."
        }
      ]
    },
    {
      id: 'part3',
      title: 'Exchanging Information (Decision Making)',
      instruction: 'Our company wants to go on a team-building weekend. We need to decide on the location and the duration.',
      candidateInfo: {
        theme: "Team Building Trip",
        options: [
          "Location A: A mountain cabin (Hiking and campfire activities).",
          "Location B: A city hotel (Spa and organized workshops)."
        ],
        discussionPoints: ["Cost per person", "Physical fitness required", "Travel time"]
      }
    },
    {
      id: 'part4',
      title: 'Long Turn',
      instruction: 'You have 30 seconds to prepare. Speak for 2 minutes on the topic below.',
      topicCard: {
        topic: "The pros and cons of living in a big city versus a small village.",
        bulletPoints: [
          "Access to services and entertainment",
          "The pace of life and stress levels",
          "Employment opportunities",
          "Environmental quality"
        ],
        followUpQuestions: [
          "Where would you prefer to raise a family?",
          "Do you think technology will make where we live less important in the future?"
        ]
      }
    }
  ]
};