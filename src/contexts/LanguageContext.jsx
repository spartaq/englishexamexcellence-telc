import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize language on mount: localStorage first, then default 'en'.
  // Path-based /hu/ override is handled by LanguageDetectionInitializer.
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage) {
          setLanguage(savedLanguage);
        } else {
          setLanguage('en');
        }
      } catch (error) {
        console.error('Language initialization failed:', error);
        setLanguage('en');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeLanguage();
  }, []);
  
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
  };
  
  const translations = {
    en: {
      // === 1. LANDING PAGE ===
      // Navigation
      'nav.site-title': 'ENGLISH EXAM EXERCISES',
      'nav.telc.levels': 'TELC Levels',
      'nav.methodology': 'Methodology',
      'nav.pricing': 'Pricing',
      'nav.telc.info': 'Telc Info',
      'nav.sign.in': 'Sign In',
      'nav.get.started': 'Get Started',
      
      // Hero Section
      'hero.title': 'TELC Exam Lab. Really get prepared.',
      'hero.subtitle': 'Serious preparation means building deep vocabulary and solid grammar. We don\'t just teach you how to pass; we teach you how to master the language until success is inevitable.',
      'hero.foundation': 'Foundation',
      'hero.upper.intermediate': 'Upper Intermediate',
      'hero.advanced': 'Advanced',
      'hero.start': 'START',
      
      // Free Test Buttons
      'freetest.ready': 'Ready to test your skills?',
      'freetest.description': 'Access our full-length mock examinations. Precise scoring, realistic timing.',
      'freetest.b1': 'B1 Free Test',
      'freetest.b2': 'B2 Free Test',
      'freetest.c1': 'C1 Free Test',
      
      // Features Section
      'features.methodology': 'The Methodology',
      'features.results': 'Engineered for Results',
      'features.focus': 'Focus That Counts',
      'features.focus.desc': 'Highly targeted exercises designed to bridge the gap between intermediate and advanced mastery. We prioritise high-yield vocabulary and nuanced exam skills.',
      'features.ai': 'AI Assessments',
      'features.ai.desc': 'Our gold-tier AI feedback engine provides granular, authoritative critiques for Writing and Speaking modules, mimicking actual examiner benchmarks.',
      'features.atoms': 'Exam Atoms',
      'features.atoms.desc': 'Short, 15-minute intensive drills designed to isolate and strengthen your weakest areas. Maximum efficiency for the time-constrained student.',
      
      // Login Prompt
      'login.required': 'Sign in required',
      'login.desc': 'Sign in to access the TELC practice lab and continue your progress.',
      
      // Teacher's Note
      'teacher.note': 'Preparation should be a marathon, not a sprint. We focus on the precision of language — the atoms of academic success — to ensure that when you sit for the exam, you aren\'t just guessing. You are asserting your knowledge.',
      'teacher.title': 'Senior Academic Director, Invictus Lab',
      
      // === 2. BRAND TEST HUB ===
      'hub.welcome': 'Welcome',
      'hub.exams': 'Exams',
      'hub.skills': 'Skills',
      'hub.jump.in': 'Jump in!',
      'hub.real.solution': 'The Real Solution',
      'hub.real.solution.desc': 'Targeted vocabulary and skill mastery beats endless testing',
      'hub.skill.building': 'SKILL BUILDING',
      'hub.what.practice': 'What should you practice today?',
      'hub.vocab.progress': 'Vocab progress bar',
      'hub.tests.progress': 'Tests progress bar',
      'hub.drills.progress': 'Drills progress bar',
      'hub.real.solution': 'The Real Solution',
      'hub.real.solution.desc': 'Targeted vocabulary and skill mastery beats endless testing',
      'hub.full.exam': 'Take a full practice exam',
      'hub.full.test': 'Take a full practice test',
      'hub.practice.skills': 'Practice individual skills',
      'hub.practice.part': 'Take practice tests for an individual part of the test',
      'hub.skill.reading': 'Reading',
      'hub.skill.listening': 'Listening',
      'hub.skill.writing': 'Writing',
      'hub.skill.speaking': 'Speaking',
      'hub.skill.vocabulary': 'Vocabulary',
      'hub.skill.lang.elem': 'Lang. Elements',
      'hub.search.mocks': 'Search mocks by number or title...',
      'hub.all.mocks': 'All Mocks',
      'hub.bronze': 'Bronze',
      'hub.silver': 'Silver',
      'hub.gold': 'Gold',
      'hub.start.mock': 'Start Mock',
      'hub.unlock.gold': 'Unlock Gold',
      
      // Extra Tools
      'tool.vocab.title': 'Vocab Hub',
      'tool.vocab.desc': 'Build lasting vocabulary with spaced-repetition. Essential for reading comprehension.',
      'tool.drillshub.title': 'Drills Hub',
      'tool.drillshub.desc': 'Master grammar, reading, and writing skills that transfer beyond any test.',
      
      // Dual Section
      'dual.take.exam': 'Take a full practice exam',
      'dual.take.test': 'Take a full practice test',
      'dual.practice.skills': 'Practice individual skills',
      'dual.practice.part': 'Take practice tests for an individual part of the test',
      
      // Controls
      'controls.search.mocks': 'Search mocks by number or title...',
      'controls.all.mocks': 'All Mocks',
      'controls.bronze': 'Bronze',
      'controls.silver': 'Silver',
      'controls.gold': 'Gold',
      'controls.start.mock': 'Start Mock',
      
      // Skill Buttons
      'skill.reading': 'Reading',
      'skill.listening': 'Listening',
      'skill.writing': 'Writing',
      'skill.speaking': 'Speaking',
      'skill.vocabulary': 'Vocabulary',
      'skill.lang.elem': 'Lang. Elements',
      
      // Description
      'desc.target.skills': 'Target individual skills with focused practice sessions tailored to your weak areas.',
      
      // === 3. DRILLS HUB ===
      'drills.hub.title': 'DRILLS HUB',
      'drills.select.level': 'Select your proficiency level to begin targeted skill training.',
      'drills.level.b1': 'B1 Level',
      'drills.level.b2': 'B2 Level',
      'drills.level.c1': 'C1 Level',
      'drills.start': 'Start',
      'drills.skill.building': 'SKILL BUILDING',
      'drills.desc.reading': 'Master reading strategies for any text',
      'drills.desc.writing': 'Write clearly and structure your thoughts',
      'drills.desc.language': 'Grammar that serves you everywhere',
      'drills.desc.speaking': 'Communicate with confidence and clarity',
      'drills.quick.drill': 'QUICK DRILL',
      'drills.initiate': 'Initiate high-intensity randomized grammar and reading drills.',
      'drills.start.random': 'START RANDOM PRACTICE',
      'drills.all.levels': 'All Levels',
      'drills.enter.level': 'Enter Level',
      'drills.drill.engine': 'DRILL ENGINE',
      
      // === 4. VOCAB HUB ===
      'vocab.lab': 'VOCABULARY LAB',
      'vocab.select.level': 'Select your proficiency level to begin targeted lexical training.',
      'vocab.topical': 'TOPICAL MASTERY',
      'vocab.intermediate': 'Intermediate',
      'vocab.upper.intermediate': 'Upper-Intermediate',
      'vocab.advanced': 'Advanced',
      'vocab.skill.drills': 'Skill Drills',
      'vocab.mastered': 'Mastered',
      'vocab.mixed.topic': 'Mixed-topic randomized practice for comprehensive retention.',
      'vocab.academic.tokens': 'academic tokens',
      'vocab.passive': 'Passive vocabulary = reading fluency + comprehension',
      'vocab.review.queue': 'REVIEW QUEUE',
      'vocab.words.ready': 'words ready',
      
      // === 5. PRICING PAGE ===
      'pricing.once': 'Pay Once, Study Forever',
      'pricing.no.sub': 'No subscriptions. No hidden fees. Just lifetime access to TELC mastery.',
      'pricing.choose': 'Choose Your Access Level',
      'pricing.students': 'What Our Students Say',
      'pricing.faq': 'Frequently Asked Questions',
      'pricing.master': 'Ready to master the TELC exam?',
      'pricing.start': 'Start Learning Free →',
      'pricing.faq.sub': 'Is this a subscription?',
      'pricing.faq.sub.ans': 'No! You pay once for lifetime access. No recurring charges, no auto-renewals.',
      'pricing.faq.payment': 'What payment methods do you accept?',
      'pricing.faq.payment.ans': 'We accept all major credit cards through our secure payment processor.',
      'pricing.faq.updates': 'Do I get all future updates?',
      'pricing.faq.updates.ans': 'Yes! Your lifetime access includes all future content updates and improvements.',
      'pricing.faq.forum': 'What is the Community Forum?',
      'pricing.faq.forum.ans': 'Ask English learning questions and get answers from our teaching team. Responses typically come within a few hours (not real-time chat).',
      'pricing.faq.refund': 'Can I get a refund?',
      'pricing.faq.refund.ans': 'Absolutely. If you\'re not satisfied within 14 days of purchase, we\'ll give you a full refund.',
      'pricing.faq.progress': 'Is my progress saved forever?',
      'pricing.faq.progress.ans': 'Yes! All your progress, scores, and achievements are permanently saved to your account.',
      
      // === 6. TELC EXAM DESCRIPTION ===
      'telc.about': 'About the TELC',
      'telc.desc': 'Understanding the exam structure is the first step to mastering it. Here\'s what you need to know about each section.',
      'telc.four.pillars': 'The Four Pillars',
      'telc.reading': 'Reading (60 Mins)',
      'telc.reading.desc': 'It\'s not a reading test; it\'s a hunting test. You have 3 long texts and 40 questions.',
      'telc.listening': 'Listening (40 Mins)',
      'telc.listening.desc': 'The audio only plays once. You need to write while you listen.',
      'telc.writing': 'Writing (60 Mins)',
      'telc.writing.desc': 'Task 2 is worth double points. We teach rhetorical structure to guide the examiner.',
      'telc.speaking': 'Speaking (15 Mins)',
      'telc.speaking.desc': 'Focus on fluency and range. Practice to speak for 2 minutes straight.',
      'telc.strategy.note': 'Teacher\'s Strategy Note:',
      'telc.strategy': 'Most students fail because they try to do a full mock exam every day and get exhausted. Don\'t do that. Spend 4 days a week on \'Atoms\' and only 1 day on a \'Mock.\'',
      
      // === 7. RESULT SCREEN ===
      'result.perfect': 'Perfect!',
      'result.complete': 'Complete!',
      'result.telc.score': 'TELC Score',
      'result.accuracy': 'Accuracy',
      'result.xp.earned': 'XP Earned',
      'result.word.of': 'WORD 1 OF 10',
      'result.hide.answers': 'Hide Answers',
      'result.review.answers': 'Review Answers (N)',
      'result.answer.review': 'Answer Review',
      'result.your.answer': 'Your answer:',
      'result.correct.answer': 'Correct answer:',
      'result.no.answer': 'no answer',
      
      // === 8. FLASHCARD BLOCK ===
      'flashcard.click': 'Click for definition and usage examples.',
      'flashcard.definition': 'Definition',
      'flashcard.example': 'Example',
      'flashcard.hungarian': 'Hungarian',
      'flashcard.word.of': 'WORD OF',
      'flashcard.recall.failure': 'Recall Failure',
      'flashcard.review.soon': 'Review soon',
      'flashcard.uncertain': 'Uncertain',
      'flashcard.mastered': 'Mastered',
      'flashcard.review.2days': 'Review in 2-3 days',
      'flashcard.review.1week': 'Review in 1 week',
      'flashcard.continue.next': 'Continue to Next',
      'flashcard.finish': 'Finish Vocabulary Training',
      'flashcard.no.words': 'No vocabulary words available',
      'flashcard.needs.array': 'This exercise needs a words array to display.',
      'flashcard.continue': 'Continue',
      
      // === 9. APP SHELL ===
      'shell.brand': 'TELCHub',
      'shell.select.exam': 'SELECT EXAM',
      'shell.vocab.hub': 'Vocab Hub',
      'shell.drills.hub': 'Drills Hub',
      'shell.exit.lab': 'Exit Lab',
      'shell.back': 'Back',
      'shell.my.words': 'My Words',
      'shell.upgrade.gold': 'Upgrade to Gold',
      'shell.sign.out': 'Sign Out',
      
      // === 10. GAP FILL ===
      'gapfill.title': 'Fill in the Blanks',
      'gapfill.select': 'Select words to fill the gaps:',
      'gapfill.no.tasks': 'No tasks available for this section.',
      
      // === 11. MCQ ===
      'mcq.choose.all': 'Choose all that apply.',
      'mcq.select.one': 'Please select at least 1 option.',
      
      // === 12. MATCHING FEATURES ===
      'matching.match': 'Match each statement to the correct feature.',
      'matching.features': 'Features',
      'matching.more.once': 'May be used more than once',
      'matching.select': 'Select...',
      'matching.used': 'Used',
      'matching.score': 'Score:',
      
      // === 13. SHORT ANSWER ===
      'shortanswer.answer': 'Answer the questions below:',
      'shortanswer.type': 'Type answer here... (Limit 3 words)',
      'shortanswer.limit': 'Limit: 3 words',
      'shortanswer.tip': 'Tip: Ensure spelling is correct and you stay within the word limit.',
      
      // === 14. SIDEBAR ===
      'sidebar.exam.lab': 'EXAM LAB',
      'sidebar.dashboard': 'Dashboard',
      'sidebar.skill.hub': 'Skill Hub',
      'sidebar.practice.sets': 'Practice Sets',
      'sidebar.settings': 'Settings',
      'sidebar.current.rank': 'Current Rank',
      'sidebar.academic.scholar': 'Academic Scholar',
      
      // === 15. SEO & META ===
      'seo.title': 'English Exam Excellence — TELC B1, B2 & C1 Preparation',
      'seo.desc': 'Prepare for TELC B1, B2, and C1 exams with expert strategies, practice tests, and interactive 15-minute training sessions for English exam success.',
      'seo.keywords': 'TELC preparation, TELC practice tests, TELC B1, TELC B2, TELC C1, TELC English, English exam strategies, test-taking tips',
      
      // === COMMON ===
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.close': 'Close',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
    },
    hu: {
      // === 1. LANDING PAGE ===
      // Navigation
      'nav.site-title': 'ANGOL VIZSGA GYAKORLATOK',
      'nav.telc.levels': 'TELC SZINTEK',
      'nav.methodology': 'METODOLOGIA',
      'nav.pricing': 'ÁRAK',
      'nav.telc.info': 'TELC INFÓ',
      'nav.sign.in': 'BEJELENTKEZÉS',
      'nav.get.started': 'KEZDÉS',
      
      // Hero Section
      'hero.title': 'TELC Vizsga Labor. Valóban felkészülj!',
      'hero.subtitle': 'Komoly felkészítés a mély szókincs és biztos nyelvtudás építését jelenti. Nemcsak azt tanáljuk, hogyan érd el a megfelelő eredményt, hanem azt, hogyan szinteülj meg a nyelven a siker kötelezővé váltáig.',
      'hero.foundation': 'Alap',
      'hero.upper.intermediate': 'Felső-közép',
      'hero.advanced': 'Haladó',
      'hero.start': 'INDÍTÁS',
      
      // Free Test Buttons
      'freetest.ready': 'Készen állsz a tesztelésre?',
      'freetest.description': 'Hozzáférés a teljes tesztmintáinkhoz. Pontos pontszámítás, valós idejű mérés.',
      'freetest.b1': 'B1 Ingyenes Teszt',
      'freetest.b2': 'B2 Ingyenes Teszt',
      'freetest.c1': 'C1 Ingyenes Teszt',
      
      // Features Section
      'features.methodology': 'A Metodológia',
      'features.results': 'Eredményekért Kitalált',
      'features.focus': 'Előadott Fókusz',
      'features.focus.desc': 'Nagyon célzott feladatok, amelyek áthidalják a közepes és haladói szintek közötti szakadékot. Prioritásként a magas hatékonyságú szókincset és finom vizsga készségeket helyezzük.',
      'features.ai': 'MI Értékelés',
      'features.ai.desc': 'Az arany szintű MI visszajelzés motorunk részletes, hiteles visszajelzéseket ad az Írás és Beszéd modulokra, tükrözve a valós vizsgáztói szempontokat.',
      'features.atoms': 'Vizsga Atomok',
      'features.atoms.desc': 'Rövid, 15 perc hosszú intenzív gyakorlatok a leggyengebb területeid izolálására és erősítésére. Maximális hatékonyság korlátozott időű diákoknak.',
      
      // Login Prompt
      'login.required': 'Bejelentkezés szükséges',
      'login.desc': 'Jelentkezz be a TELC gyakorló laborhoz való hozzáférésért, és folytasd a haladásod.',
      
      // Teacher's Note
      'teacher.note': 'A felkészítés maraton, nem verseny. A nyelv pontosságára fókuszálunk — a siker atomjai — hogy biztosítsuk, a vizsga során nem csak tippelni, hanem ismeretedet kiállíthatod.',
      'teacher.title': 'Főtanácsadó, Invictus Labor',
      
      // === 2. BRAND TEST HUB ===
      'hub.welcome': 'Üdvözöljük',
      'hub.exams': 'Vizsgák',
      'hub.skills': 'Készségek',
      'hub.jump.in': 'Csatlakozz!',
      'hub.real.solution': 'A Valós Megoldás',
      'hub.real.solution.desc': 'Célzott szókincs és készség móra felülmúlja a végteljes tesztet',
      'hub.skill.building': 'KÉSZSÉG ÉPÍTÉS',
      'hub.what.practice': 'Mit érdemes ma gyakorolni?',
      'hub.vocab.progress': 'Szókincs előrehaladás',
      'hub.tests.progress': 'Tesztek előrehaladás',
      'hub.drills.progress': 'Gyakorlatok előrehaladás',
      'hub.real.solution': 'A Valós Megoldás',
      'hub.real.solution.desc': 'Célzott szókincs és készség móra felülmúlja a végteljes tesztet',
      'hub.full.exam': 'Teljes gyakorlati vizsga',
      'hub.full.test': 'Teljes gyakorlati teszt',
      'hub.practice.skills': 'Egyéni készségek gyakorlása',
      'hub.practice.part': 'Válassz egy vizsga részt a gyakorláshoz',
      'hub.skill.reading': 'Olvasás',
      'hub.skill.listening': 'Hallás',
      'hub.skill.writing': 'Írás',
      'hub.skill.speaking': 'Beszéd',
      'hub.skill.vocabulary': 'Szókincs',
      'hub.skill.lang.elem': 'Nyelvi Elemek',
      'hub.search.mocks': 'Keresés tesztszám vagy cím szerint...',
      'hub.all.mocks': 'Összes Teszt',
      'hub.bronze': 'Bronz',
      'hub.silver': 'Ezüst',
      'hub.gold': 'Arany',
      'hub.start.mock': 'Indítás',
      'hub.unlock.gold': 'Gold feloldása',
      
      // Extra Tools
      'tool.vocab.title': 'Szókincs Hub',
      'tool.vocab.desc': 'Állandó szókincs építése időintervallumos ismétléssel. Fontosságú az olvasási megértéshez.',
      'tool.drillshub.title': 'Gyakorlatok Hub',
      'tool.drillshub.desc': 'Nyelvtan, olvasás és írás készségek elsajátítása, amelyek mindenhol hasznosak.',
      
      // === 3. DUAL SECTION ===
      'dual.take.exam': 'Teljes gyakorlati vizsga',
      'dual.take.test': 'Teljes gyakorlati teszt',
      'dual.practice.skills': 'Egyéni készségek gyakorlása',
      'dual.practice.part': 'Válassz egy vizsga részt a gyakorláshoz',
      
      // === 4. CONTROLS ===
      'controls.search.mocks': 'Keresés tesztszám vagy cím szerint...',
      'controls.all.mocks': 'Összes Teszt',
      'controls.bronze': 'Bronz',
      'controls.silver': 'Ezüst',
      'controls.gold': 'Arany',
      'controls.start.mock': 'Indítás',
      
      // === 5. SKILL BUTTONS ===
      'skill.reading': 'Olvasás',
      'skill.listening': 'Hallás',
      'skill.writing': 'Írás',
      'skill.speaking': 'Beszéd',
      'skill.vocabulary': 'Szókincs',
      'skill.lang.elem': 'Nyelvi Elemek',
      
      // === 6. DESCRIPTION ===
      'desc.target.skills': 'Célzott készségek gyakorlása gyengébb területeid alapján.',
      
      // === 3. DRILLS HUB ===
      'drills.hub.title': 'GYAKORLATOK HUB',
      'drills.select.level': 'Válasd ki a szinted a célzott készség tréninghez.',
      'drills.level.b1': 'B1 Szint',
      'drills.level.b2': 'B2 Szint',
      'drills.level.c1': 'C1 Szint',

      'drills.start': 'Kezdés',
      'drills.skill.building': 'KÉSZSÉG ÉPÍTÉS',
      'drills.desc.reading': 'Olvasási stratégiák mestere bármely szöveghez',
      'drills.desc.writing': 'Világosan írd és struktúráld gondolataid',
      'drills.desc.language': 'Nyelvtan ami mindenhol hasznos',
      'drills.desc.speaking': 'Kommunikálj bizalommal és egyértelműen',
      'drills.quick.drill': 'GYORS GYAKORLAT',
      'drills.initiate': 'Kezdd el a magas intenszitású véletlenszerű nyelvtan és olvasási gyakorlatokat.',
      'drills.start.random': 'INDÍTÁS VÉLETLENŰ GYAKORLAT',
      'drills.all.levels': 'Összes Szint',
      'drills.enter.level': 'Belépés',
      'drills.drill.engine': 'GYAKORLATMOTOR',
      
      // === 4. VOCAB HUB ===
      'vocab.lab': 'SZÓKINCSEK LABOR',
      'vocab.select.level': 'Válasd ki a szinted a célzott szókincs tréninghez.',
      'vocab.topical': 'TEMAI MESTERSÉG',
      'vocab.intermediate': 'Középfok',
      'vocab.upper.intermediate': 'Felső-közép',
      'vocab.advanced': 'Hαλadó',
      'vocab.skill.drills': 'Készség Gyakorlatok',
      'vocab.mastered': 'Mesterév',
      'vocab.mixed.topic': 'Vegyes téma, véletlenszerű gyakorlat átfogó megtartása érdekében.',
      'vocab.academic.tokens': 'akadémiai kifejezések',
      'vocab.passive': 'Passzív szókincs = olvasási folyékonyság + megértés',
      'vocab.review.queue': 'ÁTISMETZELÉSI SOR',
      'vocab.words.ready': 'szavak készen',
      
      // === 5. PRICING PAGE ===
      'pricing.once': 'Egyszeri Fizetés, Örökkön Tanulás',
      'pricing.no.sub': 'Nincs előfizetés. Nincs rejtett díj. Csak élettartam hozzáférés a TELC móra.',
      'pricing.choose': 'Válaszd ki a hozzáférés szintre',
      'pricing.students': 'Mit Mondanak Diánjaink',
      'pricing.faq': 'Gyakran Ismételt Kérdések',
      'pricing.master': 'Kész vagy a TELC vizsga elsajátítására?',
      'pricing.start': 'Ingyenes Kezdés →',
      'pricing.faq.sub': 'Ez előfizetés?',
      'pricing.faq.sub.ans': 'Nem! Egy egyszeri fizetéssel kapj élettartamos hozzáférést. Nincs visszatérő díj, nincs automatikus megújítás.',
      'pricing.faq.payment': 'Milyen fizetési módokat elfogadunk?',
      'pricing.faq.payment.ans': 'Minden nagyobb hitelkártyát elfogadunk a biztonságos fizetőoldalunkon.',
      'pricing.faq.updates': 'Kapok minden jövőbeli frissítést?',
      'pricing.faq.updates.ans': 'Igen! Az élettartamos hozzáférésed tartalmazza minden jövőbeli tartalom frissítését.',
      'pricing.faq.forum': 'Mi a Közösségi Fórum?',
      'pricing.faq.forum.ans': 'Kérdezz angol nyelv tanulással kapcsolatos kérdéseket és kapj válaszokat a tanári csapattól. Válaszokat jellemzően néhány órán belül kaptok (nem valós idejű chat).',
      'pricing.faq.refund': 'Kapok visszatérítést?',
      'pricing.faq.refund.ans': 'Természetesen. Ha nem vagy elégedett a vásárlás 14 napos idejében, teljes visszatérítést adunk.',
      'pricing.faq.progress': 'Mentve a haladásom örökkön?',
      'pricing.faq.progress.ans': 'Igen! Minden haladásod, pontszámaid és teljesítményed véglegesen mentve a fiókodba.',
      
      // === 6. TELC EXAM DESCRIPTION ===
      'telc.about': 'A TELC-ről',
      'telc.desc': 'A megértés a vizsga struktúrájában az első lépés a mestermű felkészítéséhez. Íme, mit kell tudnod minden részről.',
      'telc.four.pillars': 'A Négy Előállító',
      'telc.reading': 'Olvasás (60 Perc)',
      'telc.reading.desc': 'Ez nem egyszerű olvasási teszt. A válaszokat a szövegekben kell keresned. 3 hosszú szöveg és 40 kérdésed van.',
      'telc.listening': 'Hallás (40 Perc)',
      'telc.listening.desc': 'Az audio csak egyszer játszik le. Írnod kell míg hallod.',
      'telc.writing': 'Írás (60 Perc)',
      'telc.writing.desc': 'A 2. feladat kétszer annyi pontot ér. Tanítjuk a retorikai struktúrát a vizsgáztó vezérlésére.',
      'telc.speaking': 'Beszéd (15 Perc)',
      'telc.speaking.desc': 'Fókuszáld a fluidt és tartományt. Gyakorolj 2 percre egymást követően beszélni.',
      'telc.strategy.note': 'Tanár Stratégia Megjegyzése:',
      'telc.strategy': 'A legtöbb diák bukik, mert minden nap teljes tesztet próbál meg csinálni és kimerül. Ne csináld ezt. Több napot fordíts a gyakorlatokra, és csak egy napot egy teljes tesztre.',
      
      // === 7. RESULT SCREEN ===
      'result.perfect': 'Tökéletes!',
      'result.complete': 'Kész!',
      'result.telc.score': 'TELC Pontszám',
      'result.accuracy': 'Pontosság',
      'result.xp.earned': 'XP Szerezve',
      'result.word.of': 'SZÓ 1 / 10',
      'result.hide.answers': 'Elrejtés',
      'result.review.answers': 'Válaszok Felülvizsgálata (N)',
      'result.answer.review': 'Válasz Felülvizsgálás',
      'result.your.answer': 'A válaszod:',
      'result.correct.answer': 'Helyes válasz:',
      'result.no.answer': 'nincs válasz',
      
      // === 8. FLASHCARD BLOCK ===
      'flashcard.click': 'Kattints a meghatározásért és használati példákért.',
      'flashcard.definition': 'Definíció',
      'flashcard.example': 'Példa',
      'flashcard.hungarian': 'Magyar',
      'flashcard.word.of': 'SZÓ /',
      'flashcard.recall.failure': 'Emlékezési Hiba',
      'flashcard.review.soon': 'Hamar ismétlés',
      'flashcard.uncertain': 'Nem biztos',
      'flashcard.mastered': 'Mesterév',
      'flashcard.review.2days': 'Ismétlés 2-3 nap múlva',
      'flashcard.review.1week': 'Ismétlés 1 hét múlva',
      'flashcard.continue.next': 'Folytatás a következővel',
      'flashcard.finish': 'A Szókincs Tréning Befejezése',
      'flashcard.no.words': 'Nincs elérhető szó',
      'flashcard.needs.array': 'Ez a gyakorlat szótárral fog megjelenni.',
      'flashcard.continue': 'Folytatás',
      
      // === 9. APP SHELL ===
      'shell.brand': 'TELCHub',
      'shell.select.exam': 'VÁLASZD A VIZSGÁT',
      'shell.vocab.hub': 'Szókincs Hub',
      'shell.drills.hub': 'Gyakorlatok Hub',
      'shell.exit.lab': 'Kilépés a Laborból',
      'shell.back': 'Vissza',
      'shell.my.words': 'Szavaim',
      'shell.upgrade.gold': 'Frissítés Goldra',
      'shell.sign.out': 'Kijelentkezés',

      
      // === 10. GAP FILL ===
      'gapfill.title': 'Hiányzó Szavak Kitöltése',
      'gapfill.select': 'Válaszd ki a szavakat a hiányzó részekhez:',
      'gapfill.no.tasks': 'Nincs elérhető feladat ebben a részben.',
      
      // === 11. MCQ ===
      'mcq.choose.all': 'Válaszd ki az összes vonatkozó opciót.',
      'mcq.select.one': 'Válassz legalább egy opciót.',
      
      // === 12. MATCHING FEATURES ===
      'matching.match': 'Helyezd minden nyilatkozatot a megfelelő tulajdonságra.',
      'matching.features': 'Tulajdonságok',
      'matching.more.once': 'Többször használható',
      'matching.select': 'Válaszd...',
      'matching.used': 'Használt',
      'matching.score': 'Pontszám:',

      
      // === 13. SHORT ANSWER ===
      'shortanswer.answer': 'Válaszolj az alábbiakra:',
      'shortanswer.type': 'Írd be a választ itt... (legfeljebb 3 szó)',
      'shortanswer.limit': 'Szavak száma: max 3',
      'shortanswer.tip': 'Tipp: Gondoskodj a helyes írásról és tartaszd meg a szavak számát.',
      
      // === 14. SIDEBAR ===
      'sidebar.exam.lab': 'VIZSGALABOR',
      'sidebar.dashboard': 'Vezérlőpult',
      'sidebar.skill.hub': 'Készség Hub',
      'sidebar.practice.sets': 'Gyakorlati Feladatok',
      'sidebar.settings': 'Beállítások',
      'sidebar.current.rank': 'Aktuális Rangsor',
      'sidebar.academic.scholar': 'Akadémiai Tanuló',

      
      // === 15. SEO & META ===
      'seo.title': 'Angol Vizsga Felkészítés — TELC B1, B2 & C1 Gyakorlatok',
      'seo.desc': 'Felkészülj a TELC B1, B2 és C1 vizsgákra szakemberi stratégiákkal, gyakorlati tesztekkel és interaktív 15 perces tréningekkel.',
      'seo.keywords': 'TELC felkészítés, TELC gyakorlatok, TELC B1, TELC B2, TELC C1, angol vizsga stratégiák, teszt tippek',
      
      // === COMMON ===
      'common.loading': 'Betöltés...',
      'common.error': 'Hiba',
      'common.close': 'Bezár',
      'common.save': 'Mentés',
      'common.cancel': 'Mégse',
    }
  };
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;