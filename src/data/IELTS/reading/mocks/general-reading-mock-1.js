export const generalReadingMock1 = {
  id: 'general-reading-mock-1',
  type: 'general-reading-mock',
  title: 'General Reading Practice Test 1',
  xpReward: 2500,
  totalTime: 60, // minutes
  instructions: `Read the instructions for each part of the paper carefully. Answer all the questions. Write your answers in the answer sheet. You must complete the answer sheet within the time limit. At the end of the test, hand in both this question paper and your answer sheet.`,
  sections: [
    // SECTION 1: THE EARTH
    {
      id: 's1',
      section: 1,
      title: 'Section 1: The Earth',
      description: 'Questions 1–13 based on Reading Passage 1',
      passages: [
         {
          id: 'p1',
          title: 'The Earth',
          type: 'ielts-complex',
          vocabId: 'v_env_bronze_1',
          vocabList: [
            { term: 'approximately', hu: 'körülbelül', definition: 'About or roughly', example: 'The Earth formed approximately 4.5 billion years ago.' },
            { term: 'consist', hu: 'áll', definition: 'To be composed or made up of', example: 'The Solar System consists of eight planets.' },
            { term: 'surface', hu: 'felszín', definition: 'The outside or top layer', example: 'The Earth\'s surface is 71% water.' },
            { term: 'originate', hu: 'eredet', definition: 'To come from a source', example: 'The idea of months originated from the moon.' },
            { term: 'habitat', hu: 'élőhely', definition: 'A natural home for organisms', example: 'The biosphere includes all habitats on Earth.' },
            { term: 'convert', hu: 'átalakít', definition: 'To change from one form to another', example: 'Cyanobacteria convert sunlight to oxygen.' },
            { term: 'diameter', hu: 'átmérő', definition: 'The distance across a circle', example: 'The Earth has a diameter of about 12,742 km.' },
            { term: 'rotate', hu: 'forog', definition: 'To spin on an axis', example: 'The Earth rotates on its axis once a day.' }
          ],
          content: [
            `<p>(A) The Earth is the third planet from the Sun and it is the only planet known to have life on it. The Earth formed around 4.5 billion years ago. It is one of four rocky planets on the inside of the Solar System. The other three are Mercury, Venus, and Mars.</p>`,
            `<p>(B) The large mass of the Sun makes the Earth move around it, just as the mass of the Earth makes the Moon move around it. The Earth also turns round in space, so different parts face the Sun at different times. The Earth goes around the Sun once (one "year") for every 365¼ times it turns all the way around (one "day").</p>`,
            `<p>(C) The Moon goes around the Earth about every 27⅓ days, and reflects light from the Sun. As the Earth goes round the Sun at the same time, the changing light of the Moon takes about 29½ days to go from dark to bright to dark again. That is where the idea of "month" came from. However, now most months have 30 or 31 days so they fit into one year.</p>`,
            `<p>(D) The Earth is the only planet in our Solar System that has a large amount of liquid water. About 71% of the surface of the Earth is covered by oceans. Because of this, it is sometimes called the "Blue Planet".</p>`,
            `<p>(E) Because of its water, the Earth is home to millions of species of plants and animals. The things that live on Earth have changed its surface greatly. For example, early cyanobacteria changed the air and gave it oxygen. The living part of the Earth's surface is called the "biosphere".</p>`,
            `<p>(F) The Earth is part of the eight planets and many thousands of small bodies that move around the Sun as its Solar System. The Solar System is moving through the Orion Arm of the Milky Way Galaxy now, and will be for about the next 10,000 years.</p>`,
            `<p>(G) The Earth is generally 150,000,000 kilometers or 93,000,000 miles away from the Sun (this distance is named an "Astronomical Unit"). The Earth moves along its way at an average speed of about 30 km or 19 mi a second. The Earth turns all the way around about 365¼ times in the time it takes for the Earth to go all the way around the Sun. To make up this extra bit of a day every year, an additional day is used every four years. This is named a "leap year".</p>`,
            `<p>(H) The Moon goes around the Earth at an average distance of 400,000 kilometers (250,000 mi). It is locked to Earth, so that it always has the same half facing the Earth; the other half is called the "dark side of the Moon". It takes about 27⅓ days for the Moon to go all the way around the Earth but, because the Earth is moving around the Sun at the same time, it takes about 29½ days for the Moon to go from dark to bright to dark again. This is where the word "month" came from, even though most months now have 30 or 31 days.</p>`
          ],
          subTasks: [
            {
              type: 'matching-info',
              instruction: "Which paragraph contains the following information? (1-8)",
              questions: [
                { id: 1, text: "Earth’s natural satellite", answer: "H" },
                { id: 2, text: "Distance between Earth and Sun", answer: "G" },
                { id: 3, text: "General information about Earth", answer: "A" },
                { id: 4, text: "The Solar System", answer: "F" },
                { id: 5, text: "Length of most months", answer: "C" },
                { id: 6, text: "Another name for Earth", answer: "D" },
                { id: 7, text: "The living part of the Earth's surface", answer: "E" },
                { id: 8, text: "The movements of Earth around the Sun", answer: "B" }
              ]
            },
            {
              type: 'short-answer',
              instruction: "Complete the sentences below. Choose NO MORE THAN THREE WORDS from the text for each answer.",
              questions: [
                { id: 9, text: "Apart from Earth, other rocky planets in our Solar Systems are Venus, Mars and _______.", answer: "Mercury" },
                { id: 10, text: "Moon _______ from the Sun on Earth.", answer: "reflects light" },
                { id: 11, text: "There are millions of _______ of plants and animals that inhabit Earth.", answer: "species" },
                { id: 12, text: "Now the Solar System is travelling through _______.", answer: "Orion Arm" },
                { id: 13, text: "The dark side of the Moon is the side, which _______ faces Earth.", answer: "never" }
              ]
            }
          ]
        }
      ]
    },

    // SECTION 2: JOB ADVERTISEMENTS
    {
      id: 's2',
      section: 2,
      title: 'Section 2: Job Advertisements',
      description: 'Questions 14–28 based on Reading Passage 2',
      passages: [
         {
          id: 'p2',
          title: 'Part-time Openings',
          type: 'ielts-complex',
          vocabId: 'v_employment_bronze_1',
          vocabList: [
            { term: 'approximately', hu: 'körülbelül', definition: 'About or roughly', example: 'The Vitamin Shoppe has approximately 1,946 openings.' },
            { term: 'extensive', hu: 'kiterjedt', definition: 'Covering a large area', example: 'Advantage Sales & Marketing offers extensive services.' },
            { term: 'flexible', hu: 'rugalmas', definition: 'Able to adapt', example: 'Chipotle offers a flexible work schedule.' },
            { term: 'progressive', hu: 'progresszív', definition: 'Forward-thinking', example: 'The Vitamin Shoppe has progressive policies.' },
            { term: 'compassionate', hu: 'áldozatos', definition: 'Showing care and concern', example: 'PSA Healthcare provides compassionate care.' },
            { term: 'candidate', hu: 'jelölt', definition: 'A person being considered for a position', example: 'Candidates must have experience.' },
            { term: 'opportunity', hu: 'lehetőség', definition: 'A chance for progress', example: 'There are room for advancement opportunities.' },
            { term: 'comprehensive', hu: 'közérthető', definition: 'Complete and thorough', example: 'PSA Healthcare provides comprehensive services.' }
          ],
          content: [
            `<p><strong>1. The Vitamin Shoppe: 1,946 part-time openings.</strong><br/>The Vitamin Shoppe is a New Jersey-based retailer of nutritional supplements. They also operate stores in Canada under the name "VitaPath". The company provides approximately 8,000 different SKU's of supplements through its retail stores and over 20,000 different SKU's of supplements through its online retail websites.<br/><em>Employee Review:</em> "Good growth opportunities and stores opening all over the US all year 'round. Company based out of NJ, so more progressive policies on employment and benefits. Good vacation, health, and dental benefits. Payment is above average. Good policies on customer service interaction as well. Focus on Customer service vs. pushing products."</p>`,
            `<p><strong>2. Chipotle: 1,553 part-time openings.</strong><br/>Chipotle is known for its use of organic meats throughout its more than 1,500 restaurants, which are located in 45 states. Since having been founded in 1993, the chain has since exploded and now counts some 37,000 employees. It is a pioneer in the "fast casual" dining movement.<br/><em>Employee Review:</em> "The people I work with are awesome and the food is good. It pays my bills and makes me laugh. The schedule is super flexible but it's a lot of work. If you're looking for something easy and laid back, keep looking."</p>`,
            `<p><strong>3. Advantage Sales & Marketing: 1,742 part-time openings.</strong><br/>Advantage Sales & Marketing provides outsourced sales, merchandising, and marketing services to consumer goods and food product manufacturers and suppliers. Owning more than 65 offices in the US and Canada, ASM does merchandising for 1,200 clients -- including Johnson & Johnson, Mars, Unilever, Energizer.<br/><em>Employee Review:</em> "Long lasting business, able to adapt to changes in market. Well-thought out schedule, and flexible time off for both vacation and illness."</p>`,
            `<p><strong>4. Universal Protection Service: 1,219 part-time openings.</strong><br/>Universal Protection Service is one of the largest providers of security services in the U.S. They offer an expansive range of security solutions for airports, healthcare facilities, office buildings, and more.<br/><em>Employee Review:</em> "Good pay depending on where you work. Room for advancement based on availability. Better company than any other I have worked for in security."</p>`,
            `<p><strong>5. PSA Healthcare: 1,295 part-time openings.</strong><br/>PSA Healthcare, also known as Pediatric Services of America, provides comprehensive home health services through a branch of office across the United States. The company is headquartered in Atlanta, Ga.<br/><em>Employee Review:</em> "I love working one-on-one with the pediatric patient and their families. You have the time needed to give great compassionate care! Office staff and supervisors are very good with both employees and clients. There is a lot of flexibility with staffing. I never received grief for requesting a day off."</p>`
          ],
          subTasks: [
            {
              type: 'mcq',
              instruction: "Choose the correct letter, A, B, C or D.",
              questions: [
                { id: 14, text: "Which offer has the most part-time openings?", options: ["Chipotle", "PSA Healthcare", "The Vitamin Shoppe", "Advantage Sales & Marketing"], answer: 2 },
                { id: 15, text: "Which of these companies operate both in USA and Canada?", options: ["The Vitamin Shoppe and Advantage Sales & Marketing", "PSA Healthcare and Advantage Sales & Marketing", "Chipotle and PSA Healthcare", "PSA Healthcare and The Vitamin Shoppe"], answer: 0 },
                { id: 16, text: "Review of which company says that it is the best security company he/she worked for?", options: ["Chipotle", "The Vitamin Shoppe", "Universal Protection Service", "PSA Healthcare"], answer: 2 },
                { id: 17, text: "Which company was founded in 1993?", options: ["The Vitamin Shoppe", "Universal Protection Service", "PSA Healthcare", "Chipotle"], answer: 3 },
                { id: 18, text: "Main office of which company is situated in Atlanta?", options: ["The Vitamin Shoppe", "PSA Healthcare", "Chipotle", "Advantage Sales & Marketing"], answer: 1 },
                { id: 19, text: "VitaPath is the other name of which company?", options: ["PSA Healthcare", "Universal Protection Service", "The Vitamin Shoppe", "Advantage Sales & Marketing"], answer: 2 },
                { id: 20, text: "Which review doesn’t mention a comfortable timetable?", options: ["Chipotle", "Advantage Sales & Marketing", "The Vitamin Shoppe", "PSA Healthcare"], answer: 2 },
                { id: 21, text: "Which company is described as a long lasting business?", options: ["PSA Healthcare", "Advantage Sales & Marketing", "Universal Protection Service", "Chipotle"], answer: 1 },
                { id: 22, text: "Organic meat is used by what company?", options: ["Chipotle", "The Vitamin Shoppe", "Advantage Sales & Marketing", "None of them"], answer: 0 }
              ]
            },
            {
              type: 'trinary',
              mode: 'tfng',
              questions: [
                { id: 23, text: "The Vitamin Shoppe has an above average salary, according to the review.", answer: "TRUE" },
                { id: 24, text: "Reviewer of the company Chipotle says that working there is both fun and earns enough money.", answer: "TRUE" },
                { id: 25, text: "Advantage Sales & Marketing owns 65 offices all over the world.", answer: "FALSE" },
                { id: 26, text: "Universal Protection Service offers various security services in the USA.", answer: "TRUE" },
                { id: 27, text: "Reviewer of the PSA Healthcare praises its high wages.", answer: "NOT GIVEN" },
                { id: 28, text: "None of the offers included an approximate salary in the description.", answer: "TRUE" }
              ]
            }
          ]
        }
      ]
    },

    // SECTION 3: FIRE SAFETY
    {
      id: 's3',
      section: 3,
      title: 'Section 3: What to do in a fire?',
      description: 'Questions 29–40 based on Reading Passage 3',
      passages: [
         {
          id: 'p3',
          title: 'What to do in a fire?',
          type: 'ielts-complex',
          vocabId: 'v_community_bronze_1',
          vocabList: [
            { term: 'emergency', hu: 'vész', definition: 'A serious, unexpected situation', example: 'Fire drills prepare you for emergencies.' },
            { term: 'evacuate', hu: 'elhagy', definition: 'To leave a dangerous place', example: 'You must evacuate during a fire.' },
            { term: 'hazard', hu: 'veszély', definition: 'A danger or risk', example: 'Fire is a major hazard.' },
            { term: 'respond', hu: 'válaszol', definition: 'To react to something', example: 'People must respond quickly to fire alarms.' },
            { term: 'precaution', hu: 'elózmény', definition: 'A measure taken to prevent something', example: 'Fire drills are an important precaution.' },
            { term: 'calm', hu: 'nyugodt', definition: 'Not showing nervousness', example: 'It is important to stay calm during a fire.' },
            { term: 'route', hu: 'útvonal', definition: 'A path to be taken', example: 'Families should have escape routes.' },
            { term: 'detector', hu: 'észlelő', definition: 'A device that senses something', example: 'Smoke detectors alert people to fires.' }
          ],
          content: [
            `<p>Fire drills are a big part of being safe in school: They prepare you for what you need to do in case of a fire. But what if there was a fire where you live? Would you know what to do? Talking about fires can be scary because no one likes to think about people getting hurt or their things getting burned. But you can feel less worried if you are prepared.</p>`,
            `<p>It's a good idea for families to talk about what they would do to escape a fire. Different families will have different strategies. Some kids live in one-story houses and other kids live in tall buildings. You'll want to talk about escape plans and escape routes, so let's start there.</p>`,
            `<p><strong>Know Your Way Out</strong><br/>An escape plan can help every member of a family get out of a burning house. The idea is to get outside quickly and safely. Smoke from a fire can make it hard to see where things are, so it's important to learn and remember the different ways out of your home. How many exits are there? How do you get to them from your room? It's a good idea to have your family draw a map of the escape plan. It's possible one way out could be blocked by fire or smoke, so you'll want to know where other ones are. And if you live in an apartment building, you'll want to know the best way to the stairwell or other emergency exits.</p>`,
            `<p><strong>Safety Steps</strong><br/>If you're in a room with the door closed when the fire breaks out, you need to take a few extra steps:</p>`,
            `<ul><li>Check to see if there's heat or smoke coming in the cracks around the door. (You're checking to see if there's fire on the other side.)</li><li>If you see smoke coming under the door — don't open the door!</li><li>If you don't see smoke — touch the door. If the door is hot or very warm — don't open the door!</li><li>If you don't see smoke — and the door is not hot — then use your fingers to lightly touch the doorknob. If the doorknob is hot or very warm — don't open the door!</li><li>If the doorknob feels cool, and you can't see any smoke around the door, you can open the door very carefully and slowly. When you open the door, if you feel a burst of heat or smoke pours into the room, quickly shut the door and make sure it is really closed. If there's no smoke or heat when you open the door, go toward your escape route exit.</li></ul>`
          ],
          subTasks: [
            {
              type: 'short-answer',
              instruction: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the text for each answer.",
              questions: [
                { id: 29, text: "While some might live in a tall buildings, others might live in a _______.", answer: "one-story house" },
                { id: 30, text: "Important thing is to talk with your kids about escape _______ and _______.", answer: "plans, routes" },
                { id: 31, text: "Making a _______ is a good idea, it can help you escape.", answer: "map" },
                { id: 32, text: "If you live in an apartment, you have to know the way to the staircase or other _______.", answer: "emergency exits" },
                { id: 33, text: "You can only open the door if the _______ is not hot and you can’t see smoke around the door.", answer: "doorknob" },
                { id: 34, text: "You should immediately close the door, if smoke _______ into the room.", answer: "pours" }
              ]
            },
            {
              type: 'trinary',
              mode: 'tfng',
              questions: [
                { id: 35, text: "It is important to have a strategy before escaping the fire.", answer: "TRUE" },
                { id: 36, text: "You should mark different ways out of your home on the map.", answer: "TRUE" },
                { id: 37, text: "If you’re stuck in a room, and see smoke coming from the other room, you should open the door and run to the exit.", answer: "FALSE" },
                { id: 38, text: "Hot door means you shouldn’t open it to escape.", answer: "TRUE" },
                { id: 39, text: "If you open the door and everything seems fine, go straight to the exit.", answer: "TRUE" }
              ]
            },
            {
              type: 'mcq',
              instruction: "Choose the correct letter, A, B, C or D.",
              questions: [
                { 
                  id: 40, 
                  text: "This article is mainly aimed at helping:", 
                  options: ["Children", "Children and their parents", "Only parents", "Teachers at schools"], 
                  answer: 1 
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};