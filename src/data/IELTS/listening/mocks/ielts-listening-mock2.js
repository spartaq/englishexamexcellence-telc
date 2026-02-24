// IELTS Listening Mock 1 - Conforms to IELTS Guidelines
// 4 Parts, 10 Questions each = 40 Total Questions
// Uses existing InteractiveBlocks: MCQBlock, GapFillBlock, ShortAnswerBlock, 
// TableCompletionBlock, DiagramLabelBlock, NotesCompletionBlock, MatchingChoiceBlock

export const listeningMock2 = {
  id: "listening-mock2",
  type: "LISTENING",
  title: "IELTS Listening Mock Test 2",
  tier: "bronze",
  xp: 1500,
  
  // Overall test instructions
  instructions: "You will hear a number of different recordings and you will have to answer questions on what you hear. There will be time for you to read the instructions and questions, and you will have a chance to check your work. All the recordings will be played once only. The test is in 4 parts. At the end of the test, you will be given 10 minutes to transfer your answers to the answer sheet.",
  
  sections: [
    // ============================================
    // PART 1: Conversation between two speakers (Social Context)
    // Questions 1-10: Form completion + Short-answer questions
    // Uses: ShortAnswerBlock
    // ============================================
    {
      id: "part1",
      part: 1,
      title: "Part 1",
      subtitle: "Mock 2",
      description: "You will hear a conversation between a travel agent and a customer who wants to book a holiday cottage. First, you have some time to look at questions 1-10.",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      context: "Conversation between two speakers - social situation",
      type: "LISTENING",
      skill: "listening",
      
      // Using ShortAnswerBlock format with proper structure
      questions: [
        {
          type: "short-answer",
    instruction: "Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
    wordLimit: 2,
    allowNumber: true,
          instruction: "Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
           questions: [
            { id: 1, text: "Customer name:", answer: "Sarah Mitchell", wordLimit: 2, allowNumber: true },
            { id: 2, text: "Contact telephone:", answer: "07788 456321", wordLimit: 1, allowNumber: true },
            { id: 3, text: "Preferred location:", answer: "Lake District", wordLimit: 2, allowNumber: false },
            { id: 4, text: "Number of adults:", answer: "4", wordLimit: 1, allowNumber: true },
            { id: 5, text: "Number of children:", answer: "2", wordLimit: 1, allowNumber: true }
          ]
        },
        {
          type: "short-answer",
    instruction: "Answer the questions below. Write NO MORE THAN TWO WORDS for each answer.",
    wordLimit: 2,
          instruction: "Answer the questions below. Write NO MORE THAN TWO WORDS for each answer.",
           questions: [
            { id: 6, text: "What is the maximum budget per week?", answer: "800 pounds", wordLimit: 2, allowNumber: true },
            { id: 7, text: "Which facility must the cottage have?", answer: "garden", wordLimit: 2, allowNumber: false },
            { id: 8, text: "What date does the customer want to arrive?", answer: "15th July", wordLimit: 2, allowNumber: true },
            { id: 9, text: "What is the customer's main concern about the cottage?", answer: "parking", wordLimit: 2, allowNumber: false },
            { id: 10, text: "What does the customer ask to be sent?", answer: "brochure", wordLimit: 2, allowNumber: false }
          ]
        }
      ]
    },
    
    // ============================================
    // PART 2: Monologue (Social/Facilities Context)
    // Questions 11-20: Map labelling + MCQ
    // Uses: DiagramLabelBlock + MCQBlock
    // ============================================
    {
      id: "part2",
      part: 2,
      title: "Part 2",
      subtitle: "Mock 2",
      description: "You will hear a guide giving a tour of a museum complex. First, you have some time to look at questions 11-20.",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      context: "Monologue - information about local facilities",
      type: "LISTENING",
      skill: "listening",
      
      // Questions 11-15: Map Labelling using DiagramLabelBlock format
      questions: [
        {
          id: 11,
          type: "diagram-label",
          instruction: "Label the map below. Write the correct letter, A-H, next to Questions 11-15.",
          diagram: {
            src: "/assets/maps/museum-map.png",
            alt: "Museum Complex Map",
            caption: "Museum Complex Floor Plan"
          },
           labels: [
            { id: "11", text: "Ticket Office", answer: "A" },
            { id: "12", text: "Café", answer: "D" },
            { id: "13", text: "Gift Shop", answer: "F" },
            { id: "14", text: "Main Exhibition Hall", answer: "C" },
            { id: "15", text: "Children's Activity Centre", answer: "H" }
          ],
          wordLimit: 1,
          options: ["A", "B", "C", "D", "E", "F", "G", "H"]
        },
        // Questions 16-20: Multiple Choice using MCQBlock format
        {
          id: 16,
          type: "mcq",
          instruction: "Choose the correct letter, A, B or C.",
          question: "The museum was originally built as a",
          options: [
            "A) a private residence",
            "B) a government building", 
            "C) a factory"
          ],
          answer: "A"
        },
        {
          id: 17,
          type: "mcq",
          question: "The museum's collection focuses mainly on",
          options: [
            "A) ancient artefacts",
            "B) local history",
            "C) modern art"
          ],
          answer: "B"
        },
        {
          id: 18,
          type: "mcq",
          question: "The guided tours last approximately",
          options: [
            "A) 45 minutes",
            "B) 1 hour",
            "C) 90 minutes"
          ],
          answer: "B"
        },
        {
          id: 19,
          type: "mcq",
          question: "On Sundays, the museum opens at",
          options: [
            "A) 9 am",
            "B) 10 am",
            "C) 11 am"
          ],
          answer: "C"
        },
        {
          id: 20,
          type: "mcq",
          question: "The speaker recommends visiting the",
          options: [
            "A) special exhibition first",
            "B) café during peak hours",
            "C) gift shop before leaving"
          ],
          answer: "A"
        }
      ]
    },
    
    // ============================================
    // PART 3: Conversation between two speakers (Educational Context)
    // Questions 21-30: Matching + Sentence Completion
    // Uses: MatchingChoiceBlock + ShortAnswerBlock
    // ============================================
    {
      id: "part3",
      part: 3,
      title: "Part 3",
      subtitle: "Mock 2",
      description: "You will hear a discussion between two university students and their tutor about a group assignment. First, you have some time to look at questions 21-30.",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      context: "Conversation between two main speakers - educational situation",
      type: "LISTENING",
      skill: "listening",
      
      questions: [
        // Questions 21-25: Matching using MatchingChoiceBlock format
        {
          id: "matching-21-25",
          type: "matching-choice",
          instruction: "What does each student agree to research? Choose FIVE answers from the box and write the correct letter, A-G, next to Questions 21-25.",
          options: [
            { id: "A", text: "historical background" },
            { id: "B", text: "current legislation" },
            { id: "C", text: "case studies" },
            { id: "D", text: "statistical analysis" },
            { id: "E", text: "international comparisons" },
            { id: "F", text: "future predictions" },
            { id: "G", text: "ethical considerations" }
          ],
           items: [
            { id: "21", text: "Maria will research", answer: "A" },
            { id: "22", text: "James will research", answer: "D" },
            { id: "23", text: "Emma will research", answer: "E" },
            { id: "24", text: "David will research", answer: "C" },
            { id: "25", text: "Sophie will research", answer: "B" }
          ]
        },
        // Questions 26-30: Sentence Completion using ShortAnswerBlock format
        {
          id: "short-answer-26-30",
          type: "short-answer",
          instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
           questions: [
            { id: 26, text: "The assignment must be submitted by the ______ of March.", answer: "fifteenth", wordLimit: 2, allowNumber: true },
            { id: 27, text: "Students should include at least ______ primary sources.", answer: "five", wordLimit: 2, allowNumber: true },
            { id: 28, text: "The tutor warned against using ______ from the internet.", answer: "unreliable sources", wordLimit: 2, allowNumber: false },
            { id: 29, text: "Each group member must write approximately ______ words.", answer: "2000", wordLimit: 1, allowNumber: true },
            { id: 30, text: "The final presentation should last no longer than ______ minutes.", answer: "twenty", wordLimit: 2, allowNumber: true }
          ]
        }
      ]
    },
    
    // ============================================
    // PART 4: Monologue (Academic Context)
    // Questions 31-40: Note completion + Table completion
    // Uses: NotesCompletionBlock + TableCompletionBlock
    // ============================================
    {
      id: "part4",
      part: 4,
      title: "Part 4",
      subtitle: "Mock 2",
      description: "You will hear a lecture on sustainable architecture given at a university. First, you have some time to look at questions 31-40.",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      context: "Monologue on an academic subject",
      type: "LISTENING",
      skill: "listening",
      
      questions: [
        // Questions 31-35: Note Completion using NotesCompletionBlock format
        {
          id: "notes-31-35",
          type: "notes-completion",
          instruction: "Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.",
          title: "Sustainable Architecture Lecture Notes",
          notes: [
            { id: "31", type: "gap", label: "Buildings account for approximately ______ of global energy consumption.", answer: "40%" },
            { id: "32", type: "gap", label: "The lecturer defines sustainable architecture as buildings that minimise ______ impact.", answer: "environmental" },
            { id: "33", type: "gap", label: "Passive solar design uses ______ to heat buildings naturally.", answer: "sunlight" },
            { id: "34", type: "gap", label: "Green roofs help reduce ______ in urban areas.", answer: "temperatures" },
            { id: "35", type: "gap", label: "The lecturer mentions ______ as a renewable building material.", answer: "bamboo" }
          ],
          wordLimit: 2
        },
        // Questions 36-40: Table Completion using TableCompletionBlock format
        {
          id: "table-36-40",
          type: "table-completion",
          instruction: "Complete the table below. Write NO MORE THAN TWO WORDS for each answer.",
          title: "Comparison of Building Materials",
          table: {
            headers: ["Material", "Advantage", "Disadvantage"],
            rows: [
              ["Traditional concrete", "Strong and durable", "High ______ footprint"],
              ["Recycled steel", "Requires ______ energy", "Limited availability"],
              ["Timber", "From ______ forests", "Needs treatment"],
              ["Hempcrete", "Excellent ______ insulation", "New technology"],
              ["Bioplastics", "______ materials", "Currently expensive"]
            ]
          },
          gaps: [
            { id: "36", rowIndex: 0, colIndex: 2, answer: "carbon" },
            { id: "37", rowIndex: 1, colIndex: 1, answer: "less" },
            { id: "38", rowIndex: 2, colIndex: 1, answer: "managed" },
            { id: "39", rowIndex: 3, colIndex: 1, answer: "thermal" },
            { id: "40", rowIndex: 4, colIndex: 1, answer: "Biodegradable" }
          ],
          wordLimit: 2
        }
      ]
    }
  ]
};
