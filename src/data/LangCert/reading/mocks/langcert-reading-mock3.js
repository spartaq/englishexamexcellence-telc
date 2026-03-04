/**
 * LangCert Reading Mock 3
 * 
 * Complete Reading Test with 4 parts:
 * - Part 1: Multiple Choice (6 questions)
 * - Part 2: Sentence Completion (6 gaps)
 * - Part 3: Matching Information (7 questions)
 * - Part 4: Short Answer (7 questions)
 */

export const readingMock3 = {
  id: 'langcert-reading-3',
  title: 'LangCert Reading Practice Test 3',
  type: 'langcert-reading-mock',
  tier: 'silver',
  xpReward: 150,
  totalTime: 45, // minutes
  sections: [
    // PART 1: Multiple Choice - March of the Penguins
    {
      id: 'p1',
      section: 1,
      title: 'Multiple Choice',
      description: 'Read the text and the questions. Choose the correct answer for each question.',
      passages: [
        {
          id: 'passage-1',
          type: 'langcert-complex',
          content: [
            `<h3>March of the Penguins - Film Review</h3>
            <p>It's not hard to see why March of the Penguins has been a surprise box office smash - after all, who doesn't love to look at penguins? However, the film-makers miss several opportunities to make this something really special.</p>
            <p>Directed by Frenchman Luc Jacquet and narrated (in the US version) by Morgan Freeman, the film took over a year to make and was filmed in extremely harsh conditions in Antarctica. It was then edited down from over 120 hours of footage to a viewer-friendly 85 minutes. It charts the annual cycle of the emperor penguins of Antarctica, beginning with their 70-mile march from the sea to their mating grounds (the bleak, uninhabited area where their lives began). They walk in single file, enduring winds of up to 100 mph and sub-zero temperatures. When they finally reach the mating grounds they undergo a series of elaborate rituals before mating.</p>
            <p>Once the egg is laid, the female penguins go back to the sea where they swim around, eating and having a great time, whilst the males are left to hatch the eggs. After two months, the eggs hatch and the females return with food, at which point the males begin a constant trek to the sea and back in order to gather enough food to keep the penguin chicks in the style to which they've become accustomed.</p>
            <p>The savage beauty of the Antarctic, as well as the details of the penguins' feathers, are all captured by the fantastic photography. The main problem is the constant human-centred approach to the narration, and Morgan Freeman is never given the chance to miss jerking tears: 'This is the first time the father has broken his bond with the chick. It is not an easy thing to do.' Really? How do we know? Did Jacquet interview the daddy penguins? In truth, the images are striking enough on their own.</p>
            <p>Secondly, it's been horribly sanitised, with all the real bits, notably death and the mating process, removed to make it safely suitable for young children. Freeman also glosses over the deaths of tired penguins who can't endure the journey: they don't die; they 'disappear' or 'fade away'.</p>
            <p>In short, March of the Penguins is undeniably spectacular to look at, but it doesn't amount to much more than 85 minutes of 'Ooh, look at the cute penguins'. Kids will love it and it's still worth watching it yourself for the astonishing imagery.</p>`
          ]
        }
      ],
      subTasks: [
        {
          type: 'mcq',
          instruction: 'Choose the correct answer (a, b, or c) for each question.',
          questions: [
            {
              id: '1',
              question: '1. At the beginning of the cycle, the penguins',
              options: [
                'a) travel along the coast.',
                'b) go to their birthplace.',
                'c) search for a new home.'
              ],
              answer: 1 // b
            },
            {
              id: '2',
              question: '2. After the females lay their eggs, they',
              options: [
                'a) keep them warm.',
                'b) go back to their home.',
                'c) return to the sea to feed.'
              ],
              answer: 2 // c
            },
            {
              id: '3',
              question: '3. After the chicks are born, the males',
              options: [
                'a) take them to the sea to feed them.',
                'b) spend two months in the sea.',
                'c) bring food to them from the sea.'
              ],
              answer: 2 // c
            },
            {
              id: '4',
              question: '4. The film suffers from',
              options: [
                'a) a poor choice of narrator.',
                'b) an over-emotional script.',
                'c) insufficient visual material.'
              ],
              answer: 1 // b
            },
            {
              id: '5',
              question: '5. In order to appeal to children, the film-makers have',
              options: [
                'a) cut the less pleasant images.',
                'b) changed the story of the film.',
                'c) reduced the length of the film.'
              ],
              answer: 0 // a
            },
            {
              id: '6',
              question: '6. In a nutshell, the reviewer\'s opinion is that the film is',
              options: [
                'a) worth seeing despite the narration.',
                'b) visually stunning and well-narrated.',
                'c) fine for kids but adults will hate it.'
              ],
              answer: 0 // a
            }
          ]
        }
      ]
    },

    // PART 2: Sentence Completion - Playing and Learning
    {
      id: 'p2',
      section: 2,
      title: 'Sentence Completion',
      description: 'Read the text. Use the sentences to complete the text. Choose the correct sentence for each gap. There is one extra sentence you will not need.',
      passages: [
        {
          id: 'passage-2',
          type: 'langcert-complex',
          content: [
            `<h3>Playing and Learning</h3>
            <p>Throughout history children have played in groups and taken part in imaginative games. They've pretended to be pirates and princesses, heroes and villains. (1)_________ However, the way in which children play has changed during recent times. Children now have a much wider range of toys to choose from and as a result spend less time playing pretend games. (2)_________</p>
            <p>Pretend games actually help children to develop an important learning skill called 'executive function', which improves their ability to self-regulate. Kids with good self-regulation are able to manage their emotions and behaviour, and display self-control and discipline.</p>
            <p>(3)_________ In the late 1940s psychologists carried out a self-regulation study, in which young children were asked to perform a number of different exercises. One of the exercises in the experiment was to stand perfectly still without moving, which most three-year olds were good at. (4)_________ They found that today's five-year-old children could only perform at the same level as three-year-olds in the 1940s and today's seven-year-olds were only just reaching the level of a five-year-old then.</p>
            <p>A child's level of 'executive function' can have a big effect on the success they have at school, as children learn more when they can pay attention and manage their feelings. One reason imaginative play is such a vital tool for building self-control is because it teaches children to engage in 'private speech'. (5)_________ When children's play is more structured, their private speech declines.</p>
            <p>Children are now starting their formal lessons in school at a much younger age and classes are often geared towards testing children and preparing them for exams. (6)_________ But it now seems that this environment we've created, which was designed to give children every advantage in life, may actually have deprived them of a vital activity. Play time, it seems, is extremely important for children.</p>`
          ]
        }
      ],
      subTasks: [
        {
          type: 'sentence-complete',
          instruction: 'Choose the correct sentence (A-G) for each gap. There is one extra sentence you will not need.',
          options: [
            { id: 'A', text: 'Parents created secure environments to play in.' },
            { id: 'B', text: "They've improvised and regulated their play by making up their own rules and characters." },
            { id: 'C', text: 'Researchers recently repeated this experiment, and found very different results.' },
            { id: 'D', text: 'This recent trend has been shown to have an impact on their imagination.' },
            { id: 'E', text: 'As a result some teachers think playing is a waste of time.' },
            { id: 'F', text: 'This means that children talk to themselves about what they are going to do and how they are going to do it.' },
            { id: 'G', text: "By comparing two studies, we can now prove that children's ability to self-regulate has been reduced in the past sixty years." }
          ],
          questions: [
            { id: '1', answer: 'B' }, // They've improvised... - matches "They've pretended to be pirates..."
            { id: '2', answer: 'D' }, // This recent trend... - refers to "the way in which children play has changed"
            { id: '3', answer: 'G' }, // By comparing two studies... - leads to the 1940s study comparison
            { id: '4', answer: 'C' }, // Researchers recently repeated... - leads to the findings
            { id: '5', answer: 'F' }, // This means that children talk... - explains private speech
            { id: '6', answer: 'E' }  // As a result some teachers think... - leads to the conclusion
          ]
        }
      ]
    },

    // PART 3: Matching Information - About Potatoes
    {
      id: 'p3',
      section: 3,
      title: 'Matching Information',
      description: 'Read the four texts. Which text gives you the answer to each question? Choose the correct text (A-D) for each question.',
      passages: [
        {
          id: 'text-a',
          type: 'text-a',
          content: [`<h3>Text A</h3><p>For the perfect fries, follow these tips: cut long, thin chips, and salt them. Pour enough good quality oil in a pan and increase the heat. Test the temperature by dropping a chip in. If it starts frying, the temperature is right. Add the potatoes to the hot oil and cover the pot for five minutes, then remove the lid and fry for another five minutes on high. Take them out and add salt if needed. If you like, add some melted cheese too.</p>`]
        },
        {
          id: 'text-b',
          type: 'text-b',
          content: [`<h3>Text B</h3><p>Nowhere can imagine life without potatoes, but they are a fairly new addition to the European diet. Sailors returning from South America brought them back, but for at least two centuries, potatoes remained a food for few. They became popular in the late 17th and early 18th centuries, when the climate changed, and other products people relied on were hard to find. One of the most famous and well-liked dishes, is, of course, fried potatoes which are easy to make and always tasty if cooked properly.</p>`]
        },
        {
          id: 'text-c',
          type: 'text-c',
          content: [`<h3>Text C</h3><p>Are you fond of potatoes? Do you enjoy well-fried chips as much as we do? Do you like your fries crispy on the outside and soft on the inside? Do you fancy different varieties of toppings and dressings with them? If you do, then, the Happy Potato Café is the place to visit! We specialise in making the perfect fries for every taste by cooking them at the appropriate temperature in high quality oil! Visit our historic, two-hundred-year-old café and taste the best fries since Belgian farmers first invented them!</p>`]
        },
        {
          id: 'text-d',
          type: 'text-d',
          content: [`<h3>Text D</h3><p>Last Saturday we visited this café we'd heard so much about to try their fries. I must say they were far from delicious, so I'd not recommend it. The owners claim they make the best in the area, but obviously ours hadn't been cooked at an appropriate temperature because they were cold and soft, not at all crispy – very disappointing. There were lots of customers, though, and the owners say their café's really old – but our fries tasted as old as the first potatoes to come to Europe from America!</p>`]
        }
      ],
      subTasks: [
        {
          type: 'matching-choice',
          instruction: 'Which text (A-D)?',
          allowReuse: true,
          questions: [
            { id: '1', text: 'aims to attract potential customers?', answer: 'C' },
            { id: '2', text: 'is an account of a personal experience?', answer: 'D' },
            { id: '3', text: 'gives instructions on how to do something?', answer: 'A' },
            { id: '4', text: 'When was an eating place established?', answer: 'C' },
            { id: '5', text: 'What does someone advise against?', answer: 'D' },
            { id: '6', text: 'How can you tell when the temperature is appropriate?', answer: 'A' },
            { id: '7', text: 'Who introduced potatoes to Europe?', answer: 'B' }
          ]
        }
      ]
    },

    // PART 4: Short Answer - Ancient Airplanes
    {
      id: 'p4',
      section: 4,
      title: 'Short Answer',
      description: 'Read the text and answer the questions. Use a maximum of five words for each question.',
      passages: [
        {
          id: 'passage-4',
          type: 'langcert-complex',
          content: [
            `<h3>Ancient Airplanes - Did the Incas Build Aircrafts?</h3>
            <p>In 1954, the Colombian government sent part of its collection of ancient artifacts to the USA for further analysis. Emmanuel Staubs, a leading jeweller, took six weeks to make copies of six of the objects. Initially, these objects were thought to be representing animals. Fifteen years later, one was given to biologist Ivan Sanderson for analysis. After thorough examination that lasted a month and several discussions with experts, Sanderson's conclusion was that the object is a model of an aircraft at least a thousand years old.</p>
            <p>Approximately 2 inches long, these objects were worn as jewellery on neck chains. Other suggested usages as charms or toys were later rejected. Their exact age was difficult to determine, however, it is believed that they all date back to 500 - 800 AD.</p>
            <p>Both Sanderson and Dr Arthur Poyslee of the Aeronautical Institute of New York stated that the object did not represent any known winged animal. In fact, the little artifact appears more mechanical than biological, mostly because of the shape of the wings. For example, the front wings are delta-shaped, unlike animal wings. The tail is perhaps the item resembling a plane the most, as it is triangular and vertical to the wings.</p>
            <p>Adding to the mystery, researchers examined the left side of the tail, where ID marks appear on many planes today. They found a symbol as confusing as the gold model itself, since it has been identified as the Aramaic letter B. This may indicate that if there was an original plane, it did not come from Colombia, but it was the product of a population from the Middle East who knew the secret of flying.</p>
            <p>In 1997, Peter Belting put the theory to the test. He centered his research on historical evidence and found that the wings of insects are at the top of the body, not at the bottom, and that all Incan artifacts, except these few suspected "planes", were made correctly. Belting studied many scientific essays and made a model plane, first with a propeller, afterwards with a jet engine. Whereas the first has to take off by hand, the jet engine one also had landing gear.</p>
            <p>At a conference in Orlando, Florida, the researcher showed a recording where both models were actually able to fly. The jet-engine model was also capable of taking off and landing perfectly. A live demonstration later took place in the parking lot of the Florida mall, yet the models can be found in several museums around the world. Despite Belting's findings, archaeology identifies them as representations of birds, lizards, amphibians and insects, common in the region and period.</p>`
          ]
        }
      ],
      subTasks: [
        {
          type: 'short-answer',
          instruction: 'Answer the questions using a maximum of five words.',
          wordLimit: 5,
          allowNumber: true,
          questions: [
            { id: '1', text: 'How long did it take Sanderson to decide what the objects were?', answer: 'a month' },
            { id: '2', text: 'What was the purpose of the objects?', answer: 'jewellery on neck chains' },
            { id: '3', text: 'What makes the objects look like a machine?', answer: 'the shape of the wings' },
            { id: '4', text: 'In the fourth paragraph, what does "it" refer to?', answer: 'the symbol' },
            { id: '5', text: 'What was Belting\'s theory based on?', answer: 'historical evidence' },
            { id: '6', text: 'What extra equipment did Belting\'s second model have?', answer: 'landing gear' },
            { id: '7', text: 'Where can someone see the copies of the objects?', answer: 'in several museums worldwide' }
          ]
        }
      ]
    }
  ]
};

export default readingMock3;
