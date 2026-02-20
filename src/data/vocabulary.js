export const VOCAB_HUB = {
  title: "Vocab Lab",
  description: "Master academic lexis using Spaced Repetition.",
  categories: [
    {
      id: 'topic-environment',
      title: 'Environment & Ecology',
      description: 'Climate change, conservation, and ecosystems.',
      tasks: [
        {
          id: 'v_env_bronze_1',
          type: 'VOCAB',
          title: 'Environment Basics',
          tier: 'bronze',
          words: [
            { term: 'Pollution', hu: 'Szennyezés', definition: 'Harmful substances in air, water, or land.', example: 'Air pollution causes serious breathing problems.' },
            { term: 'Conservation', hu: 'Természetvédelem', definition: 'Protecting nature and resources from being destroyed.', example: 'Conservation helps protect wildlife.' },
            { term: 'Renewable', hu: 'Megújuló', definition: 'Energy that is naturally replaced and does not run out.', example: 'Wind is a renewable energy source.' },
            { term: 'Biodiversity', hu: 'Biológiai sokféleség', definition: 'The variety of plant and animal life in a habitat.', example: 'The rainforest has high levels of biodiversity.' },
            { term: 'Mitigation', hu: 'Enyhítés / Mérséklés', definition: 'The action of reducing the severity or seriousness of something.', example: 'The government is working on flood mitigation.' },
            { term: 'Sustainability', hu: 'Fenntarthatóság', definition: 'The ability to be maintained at a certain rate without harming the environment.', example: 'Sustainability is key to long-term survival.' },
            { term: 'Depletion', hu: 'Kimerülés / Elfogyás', definition: 'Reduction in the number or quantity of something.', example: 'The depletion of the ozone layer is a major concern.' },
            { term: 'Irrigation', hu: 'Öntözés', definition: 'The supply of water to land or crops to help growth.', example: 'Ancient civilizations developed complex irrigation systems.' },
            { term: 'Contaminate', hu: 'Szennyez / Fertőz', definition: 'To make something impure by exposure to poisonous substances.', example: 'Chemicals contaminated the local water supply.' },
            { term: 'Exacerbate', hu: 'Súlyosbít', definition: 'To make a problem or bad situation worse.', example: 'High temperatures exacerbate the drought conditions.' },
            { term: 'Ecosystem', hu: 'Ökoszisztéma', definition: 'Plants, animals, and their environment working together.', example: 'A lake is a fragile ecosystem.' },
            { term: 'Deforestation', hu: 'Erdőirtás', definition: 'Cutting down large areas of forest.', example: 'Deforestation destroys animal homes.' },
            { term: 'Endangered', hu: 'Veszélyeztetett', definition: 'At risk of disappearing forever.', example: 'Tigers are endangered animals.' },
            { term: 'Drought', hu: 'Aszály', definition: 'A long time with very little rain.', example: 'The drought ruined crops.' },
            { term: 'Extinction', hu: 'Kihalás', definition: 'When a plant or animal no longer exists.', example: 'Many species face extinction.' }
          ]
        }
      ]
    },
    {
      id: 'topic-sociology',
      title: 'Sociology & Psychology',
      description: 'Human behavior, social structures, and the mind.',
      tasks: [
        {
          id: 'v_soc_silver_1',
          type: 'VOCAB',
          title: 'Human Behavior',
          tier: 'bronze',
          words: [
            { term: 'Demographics', hu: 'Demográfia', definition: 'Statistical data relating to the population and groups within it.', example: 'The town’s demographics are changing as more young people move in.' },
            { term: 'Cognition', hu: 'Megismerés / Gondolkodás', definition: 'The mental action or process of acquiring knowledge and understanding.', example: 'Childhood is a period of rapid cognitive development.' },
            { term: 'Incentive', hu: 'Ösztönző', definition: 'A thing that motivates or encourages someone to do something.', example: 'Tax breaks provide an incentive for green energy.' },
            { term: 'Hierarchy', hu: 'Hierarchia', definition: 'A system in which members of a society are ranked according to status.', example: 'Most companies have a clear social hierarchy.' },
            { term: 'Conformity', hu: 'Konformitás', definition: 'Behavior in accordance with socially accepted standards.', example: 'There is pressure on teenagers to maintain conformity.' },
            { term: 'Innate', hu: 'Veleszületett', definition: 'Inborn; natural.', example: 'Humans have an innate capacity for language.' },
            { term: 'Sedentary', hu: 'Ülő (életmód)', definition: 'Spending too much time seated; somewhat inactive.', example: 'Modern office work has led to a sedentary lifestyle.' },
            { term: 'Perception', hu: 'Érzékelés', definition: 'The way in which something is regarded, understood, or interpreted.', example: 'Public perception of the problem is changing.' },
            { term: 'Reinforce', hu: 'Megerősít', definition: 'To strengthen or support an existing idea or feeling.', example: 'The experiment reinforced the scientist’s theory.' },
            { term: 'Communal', hu: 'Közösségi', definition: 'Shared by all members of a community.', example: 'The tribe lived in a communal dwelling.' }
          ]
        }
      ]
    },
    {
      id: 'topic-business',
      title: 'Business & Economics',
      description: 'Global trade, markets, and financial systems.',
      tasks: [
        {
          id: 'v_bus_silver_1',
          type: 'VOCAB',
          title: 'Economic Trends',
          tier: 'bronze',
          words: [
            { term: 'Consumerism', hu: 'Konzumizmus', definition: 'The protection or promotion of the interests of consumers.', example: 'Modern culture is often criticized for its focus on consumerism.' },
            { term: 'Revenue', hu: 'Bevétel', definition: 'Income, especially when of a company or organization.', example: 'The company reported a drop in annual revenue.' },
            { term: 'Globalization', hu: 'Globalizáció', definition: 'The process by which businesses develop international influence.', example: 'Globalization has led to cheaper goods but more competition.' },
            { term: 'Surplus', hu: 'Többlet', definition: 'An amount of something left over when requirements have been met.', example: 'The country has a trade surplus this year.' },
            { term: 'Fluctuate', hu: 'Ingadozik', definition: 'Rise and fall irregularly in number or amount.', example: 'Stock prices fluctuate daily.' },
            { term: 'Lucrative', hu: 'Jövedelmező', definition: 'Producing a great deal of profit.', example: 'The software industry is a lucrative market.' },
            { term: 'Outsource', hu: 'Kiszervez', definition: 'Obtain goods or a service from an outside or foreign supplier.', example: 'Many companies outsource their customer service to other countries.' },
            { term: 'Monopoly', hu: 'Monopólium', definition: 'The exclusive possession or control of the supply of a commodity.', example: 'The government is breaking up the telecommunications monopoly.' },
            { term: 'Fiscal', hu: 'Pénzügyi / Költségvetési', definition: 'Relating to government revenue, especially taxes.', example: 'The government promised fiscal reform.' },
            { term: 'Commodity', hu: 'Árucikk', definition: 'A raw material or primary agricultural product that can be bought and sold.', example: 'Oil is one of the world’s most traded commodities.' }
          ]
        }
      ]
    },
    {
      id: 'topic-tech',
      title: 'Technology',
      description: 'Innovation, Digital Age, and Computing',
      tasks: [
        {
          id: 'v_tech_bronze_1',
          type: 'VOCAB',
          title: 'Technology Basics',
          tier: 'bronze',
          words: [
            { term: 'Innovation', hu: 'Innováció', definition: 'A new method, idea, or product.', example: 'Technological innovation drives the economy.' },
            { term: 'Breakthrough', hu: 'Áttörés', definition: 'A sudden, dramatic, and important discovery or development.', example: 'Scientists made a breakthrough in cancer research.' },
            { term: 'Automation', hu: 'Automatizálás', definition: 'The use of machines to do work instead of humans.', example: 'Automation has changed the manufacturing industry.' },
            { term: 'Obsolete', hu: 'Elavult', definition: 'No longer produced or used; out of date.', example: 'Floppy disks are now obsolete.' },
            { term: 'Cutting-edge', hu: 'Élvonalbeli', definition: 'At the most advanced stage of development.', example: 'The lab uses cutting-edge technology.' },
            { term: 'Sophisticated', hu: 'Kifinomult', definition: 'Highly developed and complex.', example: 'The new security system is very sophisticated.' },
            { term: 'Infrastructure', hu: 'Infrastruktúra', definition: 'The basic physical and organizational structures needed for operation.', example: 'The country needs better digital infrastructure.' },
            { term: 'Implementation', hu: 'Megvalósítás', definition: 'The process of putting a decision or plan into effect.', example: 'The implementation of the new software took six months.' },
            { term: 'Pioneer', hu: 'Úttörő', definition: 'A person who is among the first to develop or use something.', example: 'He was a pioneer in the field of robotics.' },
            { term: 'Artificial Intelligence', hu: 'Mesterséges intelligencia', definition: 'The simulation of human intelligence by machines.', example: 'AI is being used to analyze medical data.' }
          ]
        }
      ]
    },
    {
      id: 'topic-edu',
      title: 'Education',
      description: 'Academic Life and Lifelong Learning',
      tasks: [
        {
          id: 'v_edu_silver_1',
          type: 'VOCAB',
          title: 'Academic Study',
          tier: 'bronze',
          words: [
            { term: 'Curriculum', hu: 'Tanterv', definition: 'The subjects comprising a course of study in a school or college.', example: 'The school is adding coding to its curriculum.' },
            { term: 'Pedagogy', hu: 'Pedagógia', definition: 'The method and practice of teaching.', example: 'The university is researching modern pedagogy.' },
            { term: 'Acquisition', hu: 'Elsajátítás', definition: 'The learning or developing of a skill, habit, or quality.', example: 'Language acquisition is easier for children.' },
            { term: 'Assessment', hu: 'Értékelés', definition: 'The evaluation of the nature, quality, or ability of someone.', example: 'Continuous assessment is better than a single exam.' },
            { term: 'Literacy', hu: 'Írni-olvasni tudás', definition: 'The ability to read and write.', example: 'Adult literacy rates are rising globally.' },
            { term: 'Compulsory', hu: 'Kötelező', definition: 'Required by law or a rule; obligatory.', example: 'Primary education is compulsory in most countries.' },
            { term: 'Vocational', hu: 'Szakmai', definition: 'Relating to an occupation or employment.', example: 'He chose vocational training over university.' },
            { term: 'Evaluate', hu: 'Kiértékel', definition: 'To judge or determine the significance, worth, or quality of.', example: 'Students are asked to evaluate the course.' },
            { term: 'Impart', hu: 'Átad (tudást)', definition: 'To make known; to communicate or pass on.', example: 'Teachers impart knowledge to their students.' },
            { term: 'Standardize', hu: 'Standardizál', definition: 'To cause to conform to a standard.', example: 'Standardized tests are used to compare schools.' }
          ]
        }
      ]
    },
    {
    id: 'topic-health',
    title: 'Health & Well-being',
    description: 'Medicine, Fitness, and Mental Health',
    tasks: [
      {
        id: 'v_health_bronze_1',
        type: 'VOCAB',
        title: 'Health Basics',
        tier: 'bronze',
        words: [
          { term: 'Health', hu: 'Egészség', definition: 'The condition of body and mind.', example: 'Health is important.' },
          { term: 'Illness', hu: 'Betegség', definition: 'A condition causing poor health.', example: 'He recovered from illness.' },
          { term: 'Symptom', hu: 'Tünet', definition: 'A sign of illness.', example: 'Fever is a symptom.' },
          { term: 'Doctor', hu: 'Orvos', definition: 'A medical professional.', example: 'Visit the doctor.' },
          { term: 'Medicine', hu: 'Gyógyszer', definition: 'A substance used to treat illness.', example: 'Take the medicine.' },
          { term: 'Exercise', hu: 'Testmozgás', definition: 'Physical activity for health.', example: 'Exercise keeps you fit.' },
          { term: 'Diet', hu: 'Étrend', definition: 'The food you eat.', example: 'A healthy diet matters.' },
          { term: 'Stress', hu: 'Stressz', definition: 'Mental pressure or worry.', example: 'Work causes stress.' },
          { term: 'Sleep', hu: 'Alvás', definition: 'Resting state for the body.', example: 'Sleep improves health.' },
          { term: 'Pain', hu: 'Fájdalom', definition: 'Physical discomfort.', example: 'The pain stopped.' },
          { term: 'Treatment', hu: 'Kezelés', definition: 'Medical care for illness.', example: 'The treatment worked.' },
          { term: 'Hospital', hu: 'Kórház', definition: 'A place for medical care.', example: 'He stayed in hospital.' },
          { term: 'Injury', hu: 'Sérülés', definition: 'Physical harm to the body.', example: 'The injury healed.' },
          { term: 'Recovery', hu: 'Felépülés', definition: 'Returning to good health.', example: 'Recovery takes time.' },
          { term: 'Mental health', hu: 'Mentális egészség', definition: 'Emotional and psychological well-being.', example: 'Mental health matters.' },
          { term: 'Healthy', hu: 'Egészséges', definition: 'In good physical condition.', example: 'She feels healthy.' },
          { term: 'Unhealthy', hu: 'Egészségtelen', definition: 'Bad for health.', example: 'Smoking is unhealthy.' },
          { term: 'Lifestyle', hu: 'Életmód', definition: 'The way someone lives.', example: 'Lifestyle affects health.' },
          { term: 'Balance', hu: 'Egyensúly', definition: 'Keeping things in good proportion.', example: 'Work-life balance helps.' },
          { term: 'Well-being', hu: 'Jóllét', definition: 'Feeling healthy and happy.', example: 'Well-being improves productivity.' }
        ]
      }
    ]
  },
  {
    id: 'topic-science',
    title: 'Science & Nature',
    description: 'Biological Phenomena and Natural Sciences',
    tasks: [
      {
        id: 'v_science_bronze_1',
        type: 'VOCAB',
        title: 'Science Basics',
        tier: 'bronze',
        words: [
          { term: 'Predatory', hu: 'Ragadozó', definition: 'Hunting or killing other animals for food.', example: 'Sharks are predatory fish with keen senses.' },
          { term: 'Olfactory', hu: 'Szaglási', definition: 'Relating to the sense of smell.', example: 'Sharks use their olfactory organs to smell prey.' },
          { term: 'Sub-atomic', hu: 'Szubatomos', definition: 'Smaller than an atom.', example: 'Neutrinos are sub-atomic particles.' },
          { term: 'Neurological', hu: 'Neurológiai', definition: 'Relating to the nervous system.', example: 'The neurological system processes sensory information.' },
          { term: 'Biological', hu: 'Biológiai', definition: 'Related to living organisms.', example: 'Electroreception is a biological phenomenon.' },
          { term: 'Species', hu: 'Faj', definition: 'A group of similar organisms that can reproduce.', example: 'Many species use electroreception for survival.' },
          { term: 'Organ', hu: 'Szerv', definition: 'A part of the body with a specific function.', example: 'Fish have special organs for electroreception.' },
          { term: 'Stimulus', hu: 'Ingér', definition: 'Something that causes a response.', example: 'Electrical stimuli trigger electroreceptors.' },
          { term: 'Migratory', hu: 'Vándorló', definition: 'Moving from one place to another seasonally.', example: 'Some sharks use electroreception for migratory purposes.' },
        ]
      }
    ]
  },
  {
    id: 'topic-sports',
    title: 'Sports & Events',
    description: 'Olympics, Competitions, and Major Events',
    tasks: [
      {
        id: 'v_sports_bronze_1',
        type: 'VOCAB',
        title: 'Sports Basics',
        tier: 'bronze',
        words: [
          { term: 'Legacy', hu: 'Örökség', definition: 'The long-lasting impact or consequences of an event.', example: 'The Olympic legacy includes new sports facilities.' },
          { term: 'Infrastructure', hu: 'Infrastruktúra', definition: 'The basic systems and services needed for a city to function.', example: 'Olympic infrastructure often includes new stadiums.' },
          { term: 'Bidding', hu: 'Pályázat', definition: 'The process of applying to host an event.', example: 'The bidding process for the Olympics is expensive.' },
          { term: 'Capital injection', hu: 'Tőkeinjekció', definition: 'Investment of money into a system or organization.', example: 'Host cities receive capital injection for development.' },
          { term: 'Disenfranchisement', hu: 'Megfosztás', definition: 'Being deprived of rights or opportunities.', example: 'Smaller cities face disenfranchisement in bidding.' },
          { term: 'Prosperous', hu: 'Virágzó', definition: 'Successful and financially strong.', example: 'Prosperous cities can afford Olympic bids.' },
          { term: 'Extravagance', hu: 'Pazarlás', definition: 'Excessive and unnecessary spending.', example: 'Olympic extravagances burden host cities.' },
          { term: 'Debt', hu: 'Adósság', definition: 'Money owed to others.', example: 'Montreal is still in debt from its 1976 Games.' },
          { term: 'Venue', hu: 'Helyszín', definition: 'A place where an event takes place.', example: 'Olympic venues require costly maintenance.' },
          { term: 'Festival', hu: 'Fesztivál', definition: 'A celebration or series of events.', example: 'Extending the Olympics creates a months-long festival.' },
          { term: 'Performance', hu: 'Teljesítmény', definition: 'How well someone or something does a task.', example: 'Athlete performance affects public enthusiasm.' },
          { term: 'Maintenance', hu: 'Karbantartás', definition: 'Keeping something in good condition.', example: 'Infrastructure maintenance costs are high.' },
          { term: 'Budget', hu: 'Költségvetés', definition: 'A plan for how money will be spent.', example: 'Olympic budgets often exceed initial estimates.' },
          { term: 'Global centre', hu: 'Globális központ', definition: 'A major city that serves as a hub for international activities.', example: 'The IOC favours prosperous global centres.' }
        ]
      }
    ]
  },
  {
    id: 'topic-physics',
    title: 'Physics & Time',
    description: 'Time Travel, Relativity, and Theoretical Physics',
    tasks: [
      {
        id: 'v_physics_bronze_1',
        type: 'VOCAB',
        title: 'Physics Basics',
        tier: 'bronze',
        words: [
          { term: 'Time travel', hu: 'Időutazás', definition: 'Moving between different points in time.', example: 'Time travel is a popular theme in science fiction.' },
          { term: 'Neutrino', hu: 'Neutrínó', definition: 'A sub-atomic particle that travels at high speed.', example: 'Neutrinos can pass through matter without stopping.' },
          { term: 'Relativity', hu: 'Relativitás', definition: 'Theory describing how space and time are connected.', example: 'Einstein developed the theory of relativity.' },
          { term: 'Paradox', hu: 'Paradoxon', definition: 'A seemingly contradictory situation with a logical solution.', example: 'The grandfather paradox questions time travel logic.' },
          { term: 'Parallel universe', hu: 'Párhuzamos univerzum', definition: 'A hypothetical universe existing alongside our own.', example: 'The many-worlds interpretation suggests parallel universes.' },
          { term: 'Speed of light', hu: 'Fénysebesség', definition: 'The fastest speed at which information can travel.', example: 'Nothing travels faster than the speed of light.' },
          { term: 'Cause and effect', hu: 'Ok és okozat', definition: 'The relationship between actions and their consequences.', example: 'Cause and effect must come in proper order.' },
          { term: 'Hypothesis', hu: 'Hipotézis', definition: 'A proposed explanation based on limited evidence.', example: 'Scientists test hypotheses through experiments.' },
          { term: 'Theory', hu: 'Elmélet', definition: 'An explanation supported by evidence and reasoning.', example: 'Relativity theory transformed physics.' },
          { term: 'Particle', hu: 'Részecske', definition: 'A tiny piece of matter.', example: 'Sub-atomic particles include electrons and neutrinos.' },
          { term: 'Nanosecond', hu: 'Nanoszekundum', definition: 'One billionth of a second.', example: 'The neutrinos arrived sixty nanoseconds early.' },
          { term: 'Consequence', hu: 'Következmény', definition: 'The result of an action.', example: 'Time travel consequences could alter history.' },
          { term: 'Interpretation', hu: 'Értelmezés', definition: 'An explanation of meaning.', example: 'The many-worlds interpretation offers alternatives.' },
          { term: 'Consistency', hu: 'Konzisztencia', definition: 'The quality of being consistent or logical.', example: 'The self-consistency principle prevents paradoxes.' },
          { term: 'Historical', hu: 'Történelmi', definition: 'Relating to history or the past.', example: 'Historical identity matters in time travel scenarios.' }
        ]
      }
    ]
  },
  {
    id: 'topic-community',
    title: 'Community & Facilities',
    description: 'Public Services, Buildings, and Community Resources',
    tasks: [
      {
        id: 'v_community_bronze_1',
        type: 'VOCAB',
        title: 'Community Basics',
        tier: 'bronze',
        words: [
          { term: 'Facility', hu: 'Létesítmény', definition: 'A place, building, or piece of equipment for a particular purpose.', example: 'The community centre has excellent facilities.' },
          { term: 'Capacity', hu: 'Kapacitás', definition: 'The maximum number something can hold.', example: 'The hall has a capacity of 200 people.' },
          { term: 'Organic', hu: 'Bio', definition: 'Grown without artificial chemicals.', example: 'The cafe serves organic snacks.' },
          { term: 'Fair-trade', hu: 'Fair-trade', definition: 'Trading with fair prices for producers.', example: 'The cafe serves fair-trade coffee.' },
          { term: 'Low-impact', hu: 'Kímélő', definition: 'Not causing much strain or damage.', example: 'Yoga is a low-impact exercise.' },
          { term: 'Climate control', hu: 'Klímaszabályozás', definition: 'Systems that regulate temperature.', example: 'The studio has climate control.' },
          { term: 'Membership', hu: 'Tagság', definition: 'The state of being a member of a group.', example: 'Library membership is free for residents.' },
          { term: 'Collection', hu: 'Gyűjtemény', definition: 'A group of similar things collected together.', example: 'The library has a large collection of books.' },
          { term: 'Workstation', hu: 'Munkaállomás', definition: 'A place with equipment for work.', example: 'The tech suite has fifteen workstations.' },
          { term: 'Rental', hu: 'Bérlet', definition: 'Payment for using something temporarily.', example: 'Kitchen access is included in the rental fee.' },
          { term: 'Fiber-optic', hu: 'Optikai szál', definition: 'Technology using light to transmit data.', example: 'The building has fiber-optic internet.' },
          { term: 'Integrated', hu: 'Integrált', definition: 'Combined into a unified whole.', example: 'The hall has an integrated sound system.' },
          { term: 'Dimmable', hu: 'Szabályozható', definition: 'Able to have brightness adjusted.', example: 'The studio has dimmable lighting.' },
          { term: 'Productivity', hu: 'Termelékenység', definition: 'Efficiency in producing results.', example: 'The software boosts productivity.' },
          { term: 'Mirrored', hu: 'Tükrözött', definition: 'Having mirrors on the walls.', example: 'The wellness studio has mirrored walls.' }
        ]
      }
    ]
  },
  {
    id: 'topic-employment',
    title: 'Employment',
    description: 'Jobs, Careers, and Workplace Policies',
    tasks: [
      {
        id: 'v_employment_bronze_1',
        type: 'VOCAB',
        title: 'Employment Basics',
        tier: 'bronze',
        words: [
          { term: 'CV', hu: 'Önéletrajz', definition: 'A document listing work experience and qualifications.', example: 'Please send your CV with the application.' },
          { term: 'Cover letter', hu: 'Kísérőlevél', definition: 'A letter introducing a job application.', example: 'Include a brief cover letter with your CV.' },
          { term: 'Probationary period', hu: 'Próbaidőszak', definition: 'A trial period when starting a new job.', example: 'The probationary period lasts three months.' },
          { term: 'Line manager', hu: 'Közvetlen vezető', definition: 'A manager directly responsible for employees.', example: 'Notify your line manager if you are sick.' },
          { term: 'Bonus', hu: 'Bónusz', definition: 'Extra money paid as a reward.', example: 'Performance-based bonuses are available after one year.' },
          { term: 'Entry-level', hu: 'Belépő szintű', definition: 'An introductory position requiring little experience.', example: 'This is not an entry-level role.' },
          { term: 'Technical proficiency', hu: 'Technikai jártasság', definition: 'Skill in using technical tools or software.', example: 'CRM proficiency is a plus.' },
          { term: 'Remote work', hu: 'Távmunka', definition: 'Working from a location other than the office.', example: 'The tech suite is ideal for remote work.' },
          { term: 'Customer service', hu: 'Ügyfélszolgálat', definition: 'Assistance provided to customers.', example: 'She has customer service experience.' },
          { term: 'Full-time', hu: 'Teljes munkaidő', definition: 'Working the standard number of hours.', example: 'All full-time employees receive benefits.' },
          { term: 'Dress code', hu: 'Öltözködési szabály', definition: 'Rules about appropriate clothing at work.', example: 'The company has a smart casual dress code.' },
          { term: 'Consecutive', hu: 'Egymást követő', definition: 'Following one after another without interruption.', example: "A doctor's note is needed after five consecutive days." },
          { term: 'Inquiry', hu: 'Megkeresés', definition: 'A question or request for information.', example: 'Handle customer inquiries professionally.' },
          { term: 'Fluency', hu: 'Folyékonyság', definition: 'Ability to speak or write easily and accurately.', example: 'Candidates must be entirely fluent in English.' },
          { term: 'Criteria', hu: 'Kritériumok', definition: 'Standards or requirements for judgment.', example: 'Review the job criteria before applying.' }
        ]
      }
    ]
  },
  {
    id: 'topic-history',
    title: 'History & Communication',
    description: 'Historical Events, Postal Services, and Communication Systems',
    tasks: [
      {
        id: 'v_history_bronze_1',
        type: 'VOCAB',
        title: 'History Basics',
        tier: 'bronze',
        words: [
          { term: 'Relay system', hu: 'Váltó rendszer', definition: 'A series of stations where things are passed along.', example: 'Ancient Persia used relay systems for messages.' },
          { term: 'Mechanization', hu: 'Gépesítés', definition: 'The use of machines instead of manual work.', example: 'Mechanization transformed postal services.' },
          { term: 'Postcode', hu: 'Irányítószám', definition: 'A number identifying a mail delivery area.', example: 'Postcodes help sort mail efficiently.' },
          { term: 'E-commerce', hu: 'E-kereskedelem', definition: 'Buying and selling goods online.', example: 'E-commerce has grown dramatically.' },
          { term: 'Logistics', hu: 'Logisztika', definition: 'The organization of moving and storing goods.', example: 'Modern logistics includes automated sorting.' },
          { term: 'Airmail', hu: 'Légiposta', definition: 'Mail transported by aircraft.', example: 'Airmail speeded up international correspondence.' },
          { term: 'Adhesive', hu: 'Öntapadós', definition: 'Able to stick to surfaces.', example: 'The Penny Black was an adhesive postage stamp.' },
          { term: 'Empire', hu: 'Birodalom', definition: 'A large territory under one ruler.', example: 'The Persian Empire had an advanced postal system.' },
          { term: 'Reform', hu: 'Reform', definition: 'A change designed to improve a system.', example: 'The 1840 postal reform changed communication.' },
          { term: 'Recipient', hu: 'Címzett', definition: 'A person who receives something.', example: 'Historically, mail costs fell on the recipient.' },
          { term: 'Sophisticated', hu: 'Kifinomult', definition: 'Complex and advanced.', example: 'The Persian system was remarkably sophisticated.' },
          { term: 'Drone', hu: 'Drón', definition: 'An unmanned aerial vehicle.', example: 'Postal services are testing drone delivery.' },
          { term: 'Digital revolution', hu: 'Digitális forradalom', definition: 'The shift from mechanical to digital technology.', example: 'The digital revolution changed communication.' },
          { term: 'Sorting', hu: 'Rendezés', definition: 'Organizing items into groups.', example: 'Automated sorting speeds up mail delivery.' },
          { term: 'Transmission', hu: 'Továbbítás', definition: 'The act of sending or passing along.', example: 'Message transmission was faster with relay stations.' }
        ]
      }
    ]
  }
  ]
};
