import React, { useState } from 'react';
import './styles/globals.css';
import './App.css';

// ============================================================
// CHAPTER 1: THE TEACHER'S TOOLS (IMPORTS & ASSETS)
// ============================================================
import { 
  LayoutDashboard, BookOpen, LogOut, Award, 
  CheckCircle, XCircle, ArrowRight, Book, Mic, Headset, PenTool,
  Zap, Library, Atom
} from 'lucide-react';
// Navigation & Structure Components
import LandingPage from './components/LandingPage/LandingPage';
import Dashboard from './components/ui/Dashboard';
import BrandTestHub from './components/ui/BrandTestHub';
import ExamDescription from './components/ui/ExamDescription';
import SkillHub from './components/ui/SkillHub';
import TaskSelection from './components/ui/TaskSelection';
import PaywallModal from './components/ui/PaywallModal';

// Experience & Feedback Components
import XPBadge from './components/gamified/XPBadge';
import ReflectionGate from './components/engine/ReflectionGate'; 
import ResultScreen from './components/engine/ResultScreen'; 

// The Training Blocks (Engine Components)
import ReadingBlock from './components/engine/ReadingBlock';
import WritingBlock from './components/engine/WritingBlock';
import SpeakingBlock from './components/engine/SpeakingBlock'; 
import ListeningBlock from './components/engine/ListeningBlock'; 
import MCQBlock from './components/engine/InteractiveBlocks/MCQBlock';
import SentenceMatchingBlock from './components/engine/InteractiveBlocks/SentenceMatchingBlock';
import TokenSelectBlock from './components/engine/InteractiveBlocks/TokenSelectBlock';
import ReorderingBlock from './components/engine/InteractiveBlocks/ReorderingBlock';
import VocabBlock from './components/engine/VocabBlock';
import HeadingMatchBlock from './components/engine/InteractiveBlocks/HeadingMatchBlock';
import GapFillBlock from './components/engine/InteractiveBlocks/GapFillBlock';
import TrinaryBlock from './components/engine/InteractiveBlocks/TrinaryBlock';
import MatchingChoiceBlock from './components/engine/InteractiveBlocks/MatchingChoiceBlock';
import MatchingFeaturesBlock from './components/engine/InteractiveBlocks/MatchingFeaturesBlock';
import SmartInputBlock from './components/engine/InteractiveBlocks/SmartInputBlock';
import ShortAnswerBlock from './components/engine/InteractiveBlocks/ShortAnswerBlock';
import DiagramLabelBlock from './components/engine/InteractiveBlocks/DiagramLabelBlock';
import TableCompletionBlock from './components/engine/InteractiveBlocks/TableCompletionBlock';
import FlowChartCompletionBlock from './components/engine/InteractiveBlocks/FlowChartCompletionBlock';
import NotesCompletionBlock from './components/engine/InteractiveBlocks/NotesCompletionBlock';

// Behind-the-Scenes (Data, Hooks & Utilities)
import { HUBS, loadFullLesson } from './data/index';
import { ATOM_HUB } from './data/IELTS/atoms';
import { useActive } from './hooks/useActive';
import { useXP } from './hooks/useXP';
import { useExamStore } from './store/useExamStore';
import ScrollToTop from './scrollToTop';
import { evaluateDrill } from './utils/evaluate';
import { getAtomsFromMocks, pluckRandom, getVocabById, pluckRandomFullMock, findVocabFromReading } from './utils/mockPlucker';

// ============================================================
// CHAPTER 2: THE SYLLABUS (EXAM CONFIGURATIONS)
// ============================================================
const TEST_PLATFORM_CONFIG = {
  ielts: {
    id: 'ielts',
    title: 'IELTS',
    description: 'Complete Academic and General Training prep',
    color: '#e11d48',
    modules: [
      { id: 'r_ac', title: 'Academic Reading', icon: <BookOpen size={20} />, hubKey: 'reading_academic' },
      { id: 'r_gt', title: 'General Reading', icon: <BookOpen size={20} />, hubKey: 'reading_general' },
      { id: 'w_ac', title: 'Academic Writing', icon: <PenTool size={20} />, hubKey: 'writing_academic' },
      { id: 'w_gt', title: 'General Writing', icon: <PenTool size={20} />, hubKey: 'writing_general' },
      { id: 'listening', title: 'Listening', icon: <Headset size={20} />, hubKey: 'listening' },
      { id: 'speaking', title: 'Speaking', icon: <Mic size={20} />, hubKey: 'speaking' },
      { id: 'ielts_atoms', title: 'IELTS Atoms', icon: <Atom size={20} />, hubKey: 'ielts_atoms' },
    ]
  },
  langcert: {
    id: 'langcert',
    title: 'LangCert ESOL',
    description: 'International ESOL B2/C1 qualification',
    color: '#2563eb',
    modules: [
      { id: 'speaking', title: 'Speaking', icon: <Mic size={20} />, hubKey: 'speaking' },
    ]
  }
};

const EXTRA_TOOLS = [
  { 
    id: 'vocab', 
    title: 'Vocab Hub', 
    description: 'Master academic and topical vocabulary.', 
    icon: <Library size={24} />, 
    hubKey: 'vocabulary',
    color: '#8b5cf6' 
  },
  { 
    id: 'skills', 
    title: 'Skills Hub', 
    description: 'Grammar, punctuation, and core drills.', 
    icon: <Zap size={24} />, 
    hubKey: 'general_drills',
    color: '#f59e0b' 
  }
];

function App() {
  // ============================================================
  // CHAPTER 3: THE TEACHER'S GRADEBOOK (STATE MANAGEMENT)
  // ============================================================
  
  // Navigation State
  const [view, setView] = useState('landing');             
  const [activeTest, setActiveTest] = useState(null);       
  const [activeCategory, setActiveCategory] = useState(null); 
  const [activeSection, setActiveSection] = useState(null);   
  const [activeLesson, setActiveLesson] = useState(null);     
  const [activePassageIndex, setActivePassageIndex] = useState(0); 
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeSkillTab, setActiveSkillTab] = useState(0); // For unified skill tabs: Vocab(mini), Reading, Writing, Speaking, Listening 
  const [showPaywall, setShowPaywall] = useState(false);      

  // Learning & Result State
  const [userAnswers, setUserAnswers] = useState({});
  const [showReflection, setShowReflection] = useState(false);
  const [lessonResults, setLessonResults] = useState({ accuracy: 0, earnedXP: 0, isPerfect: false });
  const [isReviewMode, setIsReviewMode] = useState(false);    

  // Complex Interaction State
  const [gapFillSelections, setGapFillSelections] = useState({});
  const [activeGap, setActiveGap] = useState(null);
  const [headingSelections, setHeadingSelections] = useState({});
  const [mcqSelections, setMcqSelections] = useState({});

  // Global Store Connections
  const claimXp = useExamStore(state => state.claimXp);
  const isPremium = useExamStore(state => state.isPremium); 
    
  // Effort Tracking Hooks
  const isUserInApp = view !== 'landing';
  useActive(isUserInApp); 
  useXP(isUserInApp);     

  // Layout logic for specialized views
  const isHighFocus = activeLesson && ['WRITING', 'SPEAKING', 'LISTENING', 'VOCAB', 'WRITING_MOCK', 'ielts-speaking'].includes(activeLesson.type);
  const showSidebar = !isHighFocus && view !== 'results' && view !== 'landing';
  const showHeader = view !== 'results' && view !== 'landing';

  // ============================================================
  // CHAPTER 4: THE GRADING MACHINE (CORE LOGIC)
  // ============================================================

  const getFlattenedQuestions = (lesson) => {
    let flat = [];
    const crawl = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      if (obj.id !== undefined && obj.answer !== undefined) {
        flat.push(obj);
      }
      const childrenKeys = ['sections', 'passages', 'parts', 'questions', 'subTasks'];
      childrenKeys.forEach(key => {
        if (Array.isArray(obj[key])) obj[key].forEach(crawl);
        else if (obj[key] && typeof obj[key] === 'object') crawl(obj[key]);
      });
    };
    crawl(lesson);
    return flat;
  };

  const getAnyStoredAnswer = (id) => {
    if (mcqSelections.hasOwnProperty(id)) return mcqSelections[id];
    if (gapFillSelections.hasOwnProperty(id)) {
      const selectionObj = gapFillSelections[id];
      return Object.keys(selectionObj)
        .sort((a, b) => Number(a) - Number(b))
        .map(key => selectionObj[key]);
    }
    if (headingSelections.hasOwnProperty(id)) return headingSelections[id];
    if (userAnswers.hasOwnProperty(id)) return userAnswers[id];
    return undefined;
  };

  const getPassageStatus = (passage) => {
    if (!isReviewMode || !passage) return null;
    const questions = getFlattenedQuestions(passage);
    if (questions.length === 0) return null;
    let correct = 0;
    questions.forEach(q => {
      const userVal = String(getAnyStoredAnswer(q.id) || "").trim().toLowerCase();
      const correctVal = String(q.answer).trim().toLowerCase();
      if (userVal === correctVal) correct++;
    });
    return correct === questions.length ? 'correct' : 'incorrect';
  };

  const handleCheckAnswers = (drillAnswers = null) => {
    const currentSection = activeLesson.sections?.[activeSectionIndex];
    const currentPassage = currentSection?.passages?.[activePassageIndex];

    const isWritingTask = 
      activeLesson.type?.includes('WRITING') || 
      currentSection?.type === 'WRITING' || 
      currentPassage?.type === 'WRITING' ||
      activeLesson.type === 'writing-mock';

    const isSpeakingTask = 
      activeLesson.type?.includes('SPEAKING') || 
      currentSection?.type === 'SPEAKING' || 
      currentPassage?.type === 'SPEAKING' ||
      activeLesson.type === 'ielts-speaking';

    if (isWritingTask || isSpeakingTask) {
      setShowReflection(true);
      return;
    }

    let results = { accuracy: 0, earnedXP: 0, isPerfect: false };

    if (activeLesson.type === 'heading-match') {
      const totalQuestions = Object.keys(activeLesson.answers).length;
      let correctCount = 0;
      Object.keys(activeLesson.answers).forEach(paraId => {
        if (String(headingSelections[paraId]) === String(activeLesson.answers[paraId])) {
          correctCount++;
        }
      });
      const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      results = { 
        accuracy, 
        earnedXP: Math.round((activeLesson.xpReward || 0) * (accuracy / 100)), 
        isPerfect: accuracy >= 100 
      };
    } 
    else if (activeLesson.type === 'token-select') {
      const evaluation = evaluateDrill(activeLesson, drillAnswers?.selected || []);
      results = { accuracy: evaluation.accuracy, earnedXP: evaluation.earnedXP, isPerfect: evaluation.isPerfect };
    } 
    else {
      const allQuestions = getFlattenedQuestions(activeLesson);
      let correctCount = 0;
      allQuestions.forEach(q => {
        const userVal = getAnyStoredAnswer(q.id);
        const correctVal = q.answer;
        if (Array.isArray(correctVal)) {
          const isCorrect = Array.isArray(userVal) && 
            correctVal.every((val, idx) => String(val).trim().toLowerCase() === String(userVal[idx] || "").trim().toLowerCase());
          if (isCorrect) correctCount++;
        } else {
          if (String(userVal || "").trim().toLowerCase() === String(correctVal).trim().toLowerCase()) {
            correctCount++;
          }
        }
      });
      const accuracy = allQuestions.length > 0 ? Math.round((correctCount / allQuestions.length) * 100) : 0;
      results = { 
        accuracy, 
        earnedXP: Math.round((activeLesson.xpReward || 0) * (accuracy / 100)), 
        isPerfect: accuracy >= 100 
      };
    }
    setLessonResults(results);
    setIsReviewMode(true); 
  };

  // ============================================================
  // CHAPTER 5: THE HALLWAYS (NAVIGATION HANDLERS)
  // ============================================================
  const handleGetStarted = () => setView('landing'); 
  const handleSelectTest = (testId) => { setActiveTest(TEST_PLATFORM_CONFIG[testId]); setView('strategy'); };

  const handleSelectModule = (hubKey) => {
    if (hubKey === 'ielts_atoms') {
      // Use ATOM_HUB directly - categories are the tasks
      setActiveCategory(ATOM_HUB);
      setView('hub');
      return;
    }
        
    const hubData = HUBS[hubKey];
    if (hubData) {
      const subItems = hubData.sections || hubData.categories || [];
      
      // If only one category and it's NOT using sections (like READING_HUB), skip hub
      if (subItems.length === 1 && !hubData.sections) {
        setActiveCategory(hubData);      
        setActiveSection(subItems[0]); 
        setView('selection');            
      } else {
        setActiveCategory(hubData);
        setView('hub');
      }
    }
  };

  const handleSelectSection = (section) => {
  // Check if this is an ATOM_HUB category (has 'type' property indicating it's a task)
  if (section.type) {
    handleStartTask(section);
    return;
  }
  
  // If this is from the DRILLS_HUB, use standard behavior
  if (activeCategory?.title === "General Practice Drills") {
    setActiveSection(section);
  } 
  // If this is an 'atom' section from ATOM_HUB, go pluck the tasks from the mocks
  else if (section.id === 'reading-drills' || section.id === 'listening-drills') {
    const hydratedSection = getAtomsFromMocks(section.id);
    setActiveSection(hydratedSection);
  } 
  // Standard behavior for normal lessons
  else {
    setActiveSection(section);
  }
  setView('selection');
};

  const handleStartTask = (taskMetadata) => {
    if (taskMetadata.tier !== 'bronze' && !isPremium) { setShowPaywall(true); return; }
    
    // Handle ATOM_HUB task types
    if (taskMetadata.type === 'flow') {
      // Mini-test flow: pick random exercises from each skill
      // Vocab comes from the reading passage in this test
      const readingExercise = pluckRandom('reading');
      const vocabExercise = findVocabFromReading(readingExercise);
      
      const flowLesson = {
        id: 'dynamic-flow',
        title: taskMetadata.title || 'Daily Mini Test',
        type: 'mixed-flow',
        xpReward: taskMetadata.xp || 1500,
        sections: [
          { ...vocabExercise, skill: 'vocab' },
          { ...readingExercise, skill: 'reading' },
          { ...pluckRandom('listening'), skill: 'listening' },
          { ...(pluckRandom('speaking') || {
            id: 'speaking-fallback',
            title: 'Speaking Practice',
            type: 'SPEAKING',
            xp: 200,
            prompts: [
              'Tell me about your hometown.',
              'What do you like to do in your free time?',
              'Describe your favorite food.',
              'What is your favorite season? Why?'
            ]
          }), skill: 'speaking' },
          { ...pluckRandom('writing'), skill: 'writing' }
        ].filter(Boolean)
      };
      setActiveLesson(flowLesson);
    } else if (taskMetadata.type === 'academic-flow') {
      // Academic Mini Flow: uses academic reading and writing
      const readingExercise = pluckRandom('reading_academic');
      const vocabExercise = findVocabFromReading(readingExercise);
      
      const flowLesson = {
        id: 'academic-dynamic-flow',
        title: taskMetadata.title || 'Academic Mini Test',
        type: 'mixed-flow',
        xpReward: taskMetadata.xp || 1500,
        sections: [
          { ...vocabExercise, skill: 'vocab' },
          { ...readingExercise, skill: 'reading' },
          { ...pluckRandom('listening'), skill: 'listening' },
          { ...(pluckRandom('speaking') || {
            id: 'speaking-fallback',
            title: 'Speaking Practice',
            type: 'SPEAKING',
            xp: 200,
            prompts: [
              'Tell me about your hometown.',
              'What do you like to do in your free time?',
              'Describe your favorite food.',
              'What is your favorite season? Why?'
            ]
          }), skill: 'speaking' },
          { ...pluckRandom('writing_academic'), skill: 'writing' }
        ].filter(Boolean)
      };
      setActiveLesson(flowLesson);
    } else if (taskMetadata.type === 'random-pick') {
      // Random pick: get a random exercise from the specified skill
      const randomExercise = pluckRandom(taskMetadata.skill);
      if (randomExercise) {
        setActiveLesson({
          ...randomExercise,
          xpReward: taskMetadata.xp || 500
        });
      }
    } else if (taskMetadata.type === 'specific') {
      // Specific exercise: load by exerciseId
      const fullLesson = loadFullLesson(taskMetadata);
      setActiveLesson(fullLesson);
    } else if (taskMetadata.type === 'full-flow') {
      // Full test flow: combine all 4 skills with full mock content
      const fullMock = pluckRandomFullMock();
      
      if (fullMock) {
        setActiveLesson({
          ...fullMock,
          type: 'full-test',
          xpReward: taskMetadata.xp || 2000
        });
      }
    } else if (taskMetadata.id === 'mini-test-flow') {
      // Legacy flow handling - also use vocab from reading
      const readingExercise = pluckRandom('reading');
      const vocabExercise = findVocabFromReading(readingExercise);
      
      const flowLesson = {
        id: 'dynamic-flow',
        title: 'Daily Mini Test',
        type: 'mixed-flow',
        sections: [
          { ...vocabExercise, skill: 'vocab' },
          { ...readingExercise, skill: 'reading' },
          { ...pluckRandom('listening'), skill: 'listening' },
          { ...(pluckRandom('speaking') || {
            id: 'speaking-fallback',
            title: 'Speaking Practice',
            type: 'SPEAKING',
            xp: 200,
            prompts: [
              'Tell me about your hometown.',
              'What do you like to do in your free time?',
              'Describe your favorite food.',
              'What is your favorite season? Why?'
            ]
          }), skill: 'speaking' },
          { ...pluckRandom('writing'), skill: 'writing' }
        ].filter(Boolean)
      };
      setActiveLesson(flowLesson);
    } else {
      // STANDARD: Load a single task
      const fullLesson = loadFullLesson(taskMetadata);
      setActiveLesson(fullLesson);
    }
    
    setActiveSectionIndex(0);
    setActivePassageIndex(0);
    setActiveSkillTab(0);
    setUserAnswers({});
    setGapFillSelections({});
    setHeadingSelections({});
    setMcqSelections({});
    setActiveGap(null);
    setIsReviewMode(false);
    setView('lesson');
  };

  const handleFinishLesson = () => setView('results');

  const handleFinalClaim = () => {
    claimXp(lessonResults.earnedXP || activeLesson.xpReward || activeLesson.xp || 0);
    setShowReflection(false);
    setView('dashboard');
    setActiveLesson(null);
  };

  const handleGapFillWordSelect = (word, parentId) => {
    const targetId = activeGap?.parentId || parentId;
    const targetGapIndex = activeGap?.gapId;
    if (targetId && targetGapIndex) {
      setGapFillSelections(prev => ({...prev, [targetId]: {...(prev[targetId] || {}), [targetGapIndex]: word}}));
      setActiveGap(null);
    }
  };

  // ============================================================
  // CHAPTER 6: THE CLASSROOM BUILDER (RENDER HELPERS)
  // ============================================================
  const renderQuestionBlock = (taskData) => {
    if (!taskData) return null;

    if (taskData.prompts || taskData.scenarios || taskData.candidateInfo || taskData.topicCard || taskData.type === 'SPEAKING' || taskData.type === 'ielts-speaking' || taskData.parts) {
        return <SpeakingBlock data={taskData} onComplete={handleCheckAnswers} />;
    }
    if (taskData.type === 'WRITING' || taskData.prompt) {
        return <WritingBlock data={taskData} onComplete={handleCheckAnswers} />;
    }

    if (taskData.type === 'LISTENING') return <ListeningBlock data={taskData} onComplete={handleCheckAnswers} />;
    if (taskData.type === 'VOCAB') return <VocabBlock data={taskData} onComplete={handleCheckAnswers} />;

    if (taskData.type === 'gap-fill' && taskData.label && !taskData.content) {
        const isCorrect = isReviewMode && userAnswers[taskData.id]?.trim().toLowerCase() === taskData.answer?.toLowerCase();
        return (
            <div key={taskData.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                <span style={{ fontWeight: 700, minWidth: '150px' }}>{taskData.label}</span>
                <div style={{ position: 'relative', flex: 1 }}>
                    <input 
                        type="text" 
                        className={`listening-text-input ${isReviewMode ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                        value={userAnswers[taskData.id] || ''}
                        onChange={(e) => setUserAnswers({...userAnswers, [taskData.id]: e.target.value})}
                        disabled={isReviewMode}
                        placeholder={taskData.placeholder || "Type answer..."}
                    />
                    {isReviewMode && !isCorrect && <span className="listening-correction">{taskData.answer}</span>}
                </div>
            </div>
        );
    }

    const children = taskData.questions || taskData.subTasks;
    // Don't render nested questions for LISTENING sections - they handle their own rendering
    if (children && !taskData.type) {
      return (
        <div className="nested-questions-wrapper">
          {children.map((child, idx) => (
            <div key={child.id || idx}>{renderQuestionBlock(child)}</div>
          ))}
        </div>
      );
    }
    
    // Early return for LISTENING type - it handles its own rendering
    if (taskData.type === 'LISTENING' || taskData.skill === 'listening') {
      return null;
    }

    switch (taskData.type) {
      case 'token-select':
        return <TokenSelectBlock data={taskData} isReviewMode={isReviewMode} onComplete={(results) => handleCheckAnswers(results)} />;

      case 'ielts-complex':
        const subTasks = taskData.subTasks || taskData.questions || [];
        return (
          <>
            {subTasks.map((sub, idx) => (
              <React.Fragment key={sub.id || idx}>
                {/* Pass parent content to blocks that need it */}
                {renderQuestionBlock({
                  ...sub,
                  parentContent: (sub.type === 'matching-features' || sub.type === 'matching-choice') ? taskData.content : sub.parentContent
                })}
              </React.Fragment>
            ))}
          </>
        );

      case 'mcq':
        if (taskData.questions) return taskData.questions.map(q => <div key={q.id}>{renderQuestionBlock({ ...q, type: 'mcq' })}</div>);
        return (
          <MCQBlock 
            data={{ id: taskData.id, question: taskData.question || taskData.text, options: taskData.options, correctIndex: taskData.correctIndex ?? taskData.answer, correctIndices: taskData.correctIndices, multiSelect: taskData.multiSelect }} 
            isReviewMode={isReviewMode} 
            selectedAnswer={mcqSelections[taskData.id]} 
            selectedAnswers={Array.isArray(mcqSelections[taskData.id]) ? mcqSelections[taskData.id] : []}
            onSelect={(idx) => setMcqSelections({...mcqSelections, [taskData.id]: idx})}
            onMultiSelect={(indices) => setMcqSelections({...mcqSelections, [taskData.id]: indices})}
          />
        );

      case 'gap-fill':
        if (taskData.questions) return taskData.questions.map(q => <div key={q.id}>{renderQuestionBlock({ ...q, type: 'gap-fill' })}</div>);
        return (
          <GapFillBlock 
            data={{ id: taskData.id, content: taskData.text || taskData.content, options: taskData.wordBank || taskData.options, answers: Array.isArray(taskData.answer) ? taskData.answer : [taskData.answer] }} 
            isReviewMode={isReviewMode} 
            selections={gapFillSelections[taskData.id] || {}} 
            activeGap={activeGap} 
            onWordSelect={(w) => handleGapFillWordSelect(w, taskData.id)} 
            onGapClick={(idx) => setActiveGap({ parentId: taskData.id, gapId: idx })} 
          />
        );

      case 'heading-match':
        return (
          <HeadingMatchBlock 
            data={taskData} 
            selections={headingSelections} 
            onSelect={(paraId, headingIdx) => {
              setHeadingSelections(prev => ({ ...prev, [paraId]: headingIdx }));
            }}
            isReviewMode={isReviewMode}
          />
        );

      case 'sentence-matching':
        return <SentenceMatchingBlock data={taskData} userAnswers={userAnswers} isReviewMode={isReviewMode} onUpdate={(qId, val) => setUserAnswers({...userAnswers, [qId]: val})} />;

      case 'trinary':
        if (taskData.questions) return taskData.questions.map(q => <div key={q.id}>{renderQuestionBlock({ ...q, type: 'trinary' })}</div>);
        return <TrinaryBlock data={taskData} userAnswers={userAnswers} onUpdate={(qId, val) => setUserAnswers({...userAnswers, [qId]: val})} isReviewMode={isReviewMode} />;
      
      case 'short-answer':
        return  <ShortAnswerBlock 
      data={taskData} 
      userAnswers={userAnswers} 
      isReviewMode={isReviewMode} 
      wordLimit={taskData.wordLimit} 
      onUpdate={(qId, val) => setUserAnswers({...userAnswers, [qId]: val})} 
    />;
      
      case 'matching-info':
      case 'matching-choice': 
        return <MatchingChoiceBlock data={{
          ...taskData,
          parentContent: taskData.parentContent || taskData.content
        }} userAnswers={userAnswers} isReviewMode={isReviewMode} onUpdate={(qId, val) => setUserAnswers({...userAnswers, [qId]: val})} />;
      
      case 'matching-features':
        return <MatchingFeaturesBlock data={taskData} userAnswers={userAnswers} isReviewMode={isReviewMode} onUpdate={(qId, val) => setUserAnswers({...userAnswers, [qId]: val})} />;
      
      case 'diagram-label':
        return <DiagramLabelBlock data={taskData} userAnswers={userAnswers} isReviewMode={isReviewMode} onUpdate={(qId, val) => setUserAnswers({...userAnswers, [qId]: val})} />;
      
      case 'table':
        return <TableCompletionBlock data={taskData} userAnswers={userAnswers} isReviewMode={isReviewMode} onUpdate={(qId, val) => setUserAnswers({...userAnswers, [qId]: val})} />;
      
      case 'flowchart':
        return <FlowChartCompletionBlock data={taskData} userAnswers={userAnswers} isReviewMode={isReviewMode} onUpdate={(qId, val) => setUserAnswers({...userAnswers, [qId]: val})} />;
      
      case 'notes':
      case 'notes-completion':
        return <NotesCompletionBlock data={taskData} userAnswers={userAnswers} isReviewMode={isReviewMode} onUpdate={(qId, val) => setUserAnswers({...userAnswers, [qId]: val})} />;
      
      case 'table-completion':
        return <TableCompletionBlock data={taskData} userAnswers={userAnswers} isReviewMode={isReviewMode} onUpdate={(qId, val) => setUserAnswers({...userAnswers, [qId]: val})} />;
      
      default: return null;
    }
  };

  // ============================================================
  // CHAPTER 7: THE SCHOOL BUILDING (MAIN RENDER)
  // ============================================================
  if (view === 'landing') return <LandingPage onGetStarted={() => setView('dashboard')} />;

  return (
    
    <div className={`app-shell ${isHighFocus ? 'high-focus-layout' : ''}`}>
       <ScrollToTop /> 
      {/* SIDEBAR NAVIGATION */}
      {showSidebar && (
        <aside className="desktop-sidebar">
          <div className="brand" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-mint)' }}>The Lab</h2>
            <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>{activeTest ? activeTest.title.toUpperCase() : 'SELECT EXAM'}</p>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={() => { setView('dashboard'); setActiveTest(null); }} className={`nav-item ${view === 'dashboard' ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </button>
            {activeTest && (
              <button onClick={() => setView('testHub')} className={`nav-item ${view === 'testHub' ? 'active' : ''}`}>
                <BookOpen size={18} /> {activeTest.title} Hub
              </button>
            )}
            <button className="nav-item" onClick={() => setView('landing')} style={{ marginTop: 'auto', opacity: 0.5 }}>
              <LogOut size={18} /> Exit Lab
            </button>
          </nav>
          <div style={{ marginTop: 'auto' }}><XPBadge mode="total" /></div>
        </aside>
      )}

      <main className="main-content">
        
        {/* HEADER & GLOBAL TOOLS */}
        {showHeader && (
          <header className="app-header">
            <div>
              {/* Only show header back button for views that don't have their own back button */}
              {view === 'testHub' && (
                <button onClick={() => setView('dashboard')} className="exit-btn">
                  <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Dashboard
                </button>
              )}
              {view === 'lesson' && (
                <button onClick={() => { 
                  setActiveLesson(null); 
                  // Check if we came from atoms hub - go back to atoms hub/selection
                  if (activeCategory?.title === 'IELTS Atoms') {
                    setView('hub');
                  } else if (activeSection && activeSection.title) {
                    setView('selection');
                  } else {
                    setView('testHub');
                  }
                }} className="exit-btn">
                  <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Tasks
                </button>
              )}
              {view === 'results' && (
                <button onClick={() => setView('dashboard')} className="exit-btn">
                  <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Dashboard
                </button>
              )}
              {view === 'strategy' && (
                <button onClick={() => setView('dashboard')} className="exit-btn">
                  <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Dashboard
                </button>
              )}
            </div>
            {view === 'lesson' && <XPBadge mode="time" />}
          </header>
        )}

        <div className="workspace-container">

          {/* DASHBOARD VIEW */}
          {view === 'dashboard' && (
            <Dashboard 
              isPremium={isPremium}
              onSelectTest={handleSelectTest}
              onSelectModule={handleSelectModule}
              TEST_PLATFORM_CONFIG={TEST_PLATFORM_CONFIG}
              EXTRA_TOOLS={EXTRA_TOOLS}
            />
          )}

          {/* STRATEGY VIEW - Now uses BrandTestHub */}
          {view === 'strategy' && (
            <BrandTestHub 
              activeTest={activeTest} 
              onSelectPath={(path, skill) => {
                if (path === 'mini-test') {
                  // Mini-test flow: pick random exercises from each skill + vocab
                  const readingExercise = pluckRandom('reading');
                  const vocabExercise = pluckRandom('vocabulary');
                  const writingExercise = pluckRandom('writing');
                  const speakingExercise = pluckRandom('speaking');
                  const listeningExercise = pluckRandom('listening');
                  
                   // Create a mini-test flow with all exercises as sections
                   const miniTest = {
                     id: 'mini-test-flow',
                     title: 'Mini Test',
                     type: 'mini-test-flow',
                     xp: 1000,
                     sections: [
                       { ...vocabExercise, skill: 'vocab' },
                       { ...readingExercise, skill: 'reading' },
                       { ...listeningExercise, skill: 'listening' },
                       { ...writingExercise, skill: 'writing' },
                       { 
                         ...(speakingExercise || {
                           id: 'speaking-fallback',
                           title: 'Speaking Practice',
                           type: 'SPEAKING',
                           xp: 200,
                           prompts: [
                             'Tell me about your hometown.',
                             'What do you like to do in your free time?',
                             'Describe your favorite food.',
                             'What is your favorite season? Why?'
                           ]
                         }),
                         skill: 'speaking' 
                       }
                     ].filter(Boolean)
                   };
                  
                  if (miniTest.sections.length > 0) {
                    setActiveLesson(miniTest);
                    setActiveSectionIndex(0);
                    setView('lesson');
                  }
                } else if (path === 'academic-flow') {
                  // Academic Mini Flow: pick academic-specific exercises
                  const readingExercise = pluckRandom('reading_academic');
                  const vocabExercise = findVocabFromReading(readingExercise);
                  const writingExercise = pluckRandom('writing_academic');
                  const speakingExercise = pluckRandom('speaking');
                  const listeningExercise = pluckRandom('listening');
                  
                   // Create a mini-test flow with all exercises as sections
                   const academicMiniTest = {
                     id: 'academic-mini-flow',
                     title: 'Academic Mini Test',
                     type: 'academic-mini-flow',
                     xp: 1500,
                     sections: [
                       { ...vocabExercise, skill: 'vocab' },
                       { ...readingExercise, skill: 'reading' },
                       { ...listeningExercise, skill: 'listening' },
                       { ...writingExercise, skill: 'writing' },
                       { 
                         ...(speakingExercise || {
                           id: 'speaking-fallback',
                           title: 'Speaking Practice',
                           type: 'SPEAKING',
                           xp: 200,
                           prompts: [
                             'Tell me about your hometown.',
                             'What do you like to do in your free time?',
                             'Describe your favorite food.',
                             'What is your favorite season? Why?'
                           ]
                         }),
                         skill: 'speaking' 
                       }
                     ].filter(Boolean)
                   };
                  
                  if (academicMiniTest.sections.length > 0) {
                    setActiveLesson(academicMiniTest);
                    setActiveSectionIndex(0);
                    setView('lesson');
                  }
                } else if (path === 'skill-tests') {
                  // Show the skill tests view with individual skill options
                  setView('skillTests');
                } else if (path === 'atom-skill') {
                  // Start a random exercise from the specific skill
                  // skill = 'reading-ac', 'reading-gt', 'writing-ac', etc.
                  const skillMap = {
                    'reading-ac': 'reading',
                    'reading-gt': 'reading',
                    'writing-ac': 'writing',
                    'writing-gt': 'writing',
                    'listening': 'listening',
                    'speaking': 'speaking'
                  };
                  const randomExercise = pluckRandom(skillMap[skill] || skill);
                  if (randomExercise) {
                    setActiveLesson(randomExercise);
                    setActiveSectionIndex(0);
                    setView('lesson');
                  }
                } else if (path === 'random-mock') {
                  // Start a random full mock test immediately
                  const randomMock = pluckRandomFullMock();
                  if (randomMock && randomMock.sections && randomMock.sections.length > 0) {
                    setActiveLesson(randomMock);
                    setActiveSectionIndex(0);
                    setView('lesson');
                  }
                } else if (path === 'mocks') {
                  setView('testHub');
                }
              }}
              onShowDescription={() => setView('description')}
            />
          )}

          {/* EXAM DESCRIPTION VIEW */}
          {view === 'description' && (
            <ExamDescription 
              activeTest={activeTest}
              onBack={() => setView('strategy')}
            />
          )}

          {/* SKILL TESTS VIEW */}
          {view === 'skillTests' && (
            <div className="strategy-container">
              <header className="strategy-header">
                <button onClick={() => setView('strategy')} className="btn-back-link">
                  ← Back
                </button>
                <h1>Skill Tests</h1>
                <p>Choose a specific skill to practice with a random exercise.</p>
              </header>
              
              <div className="skill-tests-grid">
                <button 
                  className="skill-test-card"
                  onClick={() => {
                    const exercise = pluckRandom('reading');
                    if (exercise) {
                      setActiveLesson(exercise);
                      setActiveSectionIndex(0);
                      setView('lesson');
                    }
                  }}
                >
                  <BookOpen size={24} />
                  <h3>Reading</h3>
                  <p>Practice reading comprehension</p>
                </button>
                
                <button 
                  className="skill-test-card"
                  onClick={() => {
                    const exercise = pluckRandom('listening');
                    if (exercise) {
                      setActiveLesson(exercise);
                      setActiveSectionIndex(0);
                      setView('lesson');
                    }
                  }}
                >
                  <Headset size={24} />
                  <h3>Listening</h3>
                  <p>Practice listening skills</p>
                </button>
                
                <button 
                  className="skill-test-card"
                  onClick={() => {
                    const exercise = pluckRandom('writing');
                    if (exercise) {
                      setActiveLesson(exercise);
                      setActiveSectionIndex(0);
                      setView('lesson');
                    }
                  }}
                >
                  <PenTool size={24} />
                  <h3>Writing</h3>
                  <p>Practice writing tasks</p>
                </button>
                
                <button 
                  className="skill-test-card"
                  onClick={() => {
                    const exercise = pluckRandom('speaking');
                    if (exercise) {
                      setActiveLesson(exercise);
                      setActiveSectionIndex(0);
                      setView('lesson');
                    }
                  }}
                >
                  <Mic size={24} />
                  <h3>Speaking</h3>
                  <p>Practice speaking prompts</p>
                </button>
                
                <button 
                  className="skill-test-card"
                  onClick={() => {
                    const exercise = pluckRandom('vocabulary');
                    if (exercise) {
                      setActiveLesson(exercise);
                      setActiveSectionIndex(0);
                      setView('lesson');
                    }
                  }}
                >
                  <Zap size={24} />
                  <h3>Vocabulary</h3>
                  <p>Learn new words</p>
                </button>
              </div>
            </div>
          )}

          {/* TEST HUB VIEW */}
          {view === 'testHub' && activeTest && (
            <div className="test-hub-view">
              <h1>{activeTest.title} Mock Tests</h1>
              <div className="test-hub-grid">
                {activeTest.modules.map(module => (
                  <button key={module.id} onClick={() => handleSelectModule(module.hubKey)} className="hub-module-btn">
                    <span className="icon-wrapper" style={{ background: activeTest.color }}>{module.icon}</span>
                    <h4>{module.title}</h4>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DYNAMIC HUB & SELECTION */}
          {view === 'hub' && <SkillHub data={activeCategory} onBack={() => {
            // For IELTS Atoms (or any hub with specific categories), go back to testHub
            setView('testHub');
          }} onSelectSection={handleSelectSection} />}
          {view === 'selection' && <TaskSelection section={activeSection} onBack={() => {
            // If activeCategory has only 1 category, go back to testHub instead of hub
            const subItems = activeCategory?.sections || activeCategory?.categories || [];
            if (subItems.length === 1) {
              setView('testHub');
            } else {
              setView('hub');
            }
          }} onSelectTask={handleStartTask} />}

          {/* THE LESSON ENGINE */}
          {view === 'lesson' && activeLesson && (
            <div className="lesson-engine">
              {activeLesson.sections || activeLesson.passages || activeLesson.parts ? (
                <div className="mock-flow">
                  {(() => {
                    const sections = activeLesson.sections || activeLesson.passages || activeLesson.parts || [];
                    const currentSection = sections[activeSectionIndex];
                    const subPassages = currentSection?.passages || [];
                    const currentPassage = subPassages[activePassageIndex];
                    const directQuestions = currentSection?.questions || [];

                    return (
                      <div className="ielts-mock-container">
                        {/* UNIFIED SKILL TABS - for combined flows (mini test or full test) */}
                        {(() => {
                          // Check if this is a combined flow (sections have 'skill' property)
                          const isCombinedFlow = sections.some(s => s.skill);
                          
                          if (isCombinedFlow) {
                            // Define skill order: Vocab (mini only), Reading, Writing, Speaking, Listening
                            const skillOrder = ['vocab', 'reading', 'writing', 'speaking', 'listening'];
                            
                            // Filter to only include skills that exist in this lesson
                            const availableSkills = skillOrder.filter(skill => 
                              sections.some(s => s.skill === skill)
                            );
                            
                            return (
                              <>
                                <div className="section-tabs">
                                  {availableSkills.map((skill, idx) => (
                                    <button 
                                      key={skill} 
                                      onClick={() => { 
                                        // Find the first section index for this skill
                                        const skillSectionIdx = sections.findIndex(s => s.skill === skill);
                                        setActiveSkillTab(idx);
                                        setActiveSectionIndex(skillSectionIdx >= 0 ? skillSectionIdx : 0); 
                                        setActivePassageIndex(0); 
                                        setIsReviewMode(false); 
                                      }} 
                                      className={`section-tab ${activeSkillTab === idx ? 'active' : ''}`}>
                                      {skill === 'vocab' ? '📚 Vocab' : skill === 'reading' ? '📖 Reading' : skill === 'listening' ? '🎧 Listening' : skill === 'writing' ? '✍️ Writing' : skill === 'speaking' ? '🗣️ Speaking' : skill}
                                    </button>
                                  ))}
                                </div>
                                
                                {/* Passage tabs for current skill */}
                                {(() => {
                                  const currentSkill = availableSkills[activeSkillTab];
                                  const skillSections = sections.filter(s => s.skill === currentSkill);
                                  
                                  // Show passage tabs if more than 1 section for this skill OR if it's speaking (to show parts)
                                  if (skillSections.length > 1 || currentSkill === 'speaking') {
                                    return (
                                      <div className="passage-tabs">
                                        {skillSections.map((s, idx) => {
                                          // For speaking, show parts; for others show sections
                                          const sidx = sections.findIndex(sec => sec === s);
                                          return (
                                            <button 
                                              key={idx} 
                                              onClick={() => { setActiveSectionIndex(sidx); setActivePassageIndex(0); setIsReviewMode(false); }} 
                                              className={`tab ${activeSectionIndex === sidx ? 'active' : ''} ${getPassageStatus(s) || ''}`}>
                                              {currentSkill === 'speaking' ? (s.title || `Part ${idx + 1}`) : (s.title || `Section ${idx + 1}`)}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                              </>
                            );
                          }
                          
                          // Original section tabs for non-combined flows (single skill mocks)
                          return (
                            <div className="section-tabs">
                              {sections.map((s, idx) => (
                                <button key={idx} onClick={() => { setActiveSectionIndex(idx); setActivePassageIndex(0); setIsReviewMode(false); }} className={`section-tab ${activeSectionIndex === idx ? 'active' : ''}`}>
                                  {s.skill === 'vocab' ? '📚 Vocab' : s.skill === 'reading' ? '📖 Reading' : s.skill === 'listening' ? '🎧 Listening' : s.skill === 'writing' ? '✍️ Writing' : s.skill === 'speaking' ? '🗣️ Speaking' : s.type === 'ielts-speaking' ? '🗣️ Speaking' : s.type === 'LISTENING' ? '🎧 Listening' : s.type === 'WRITING' ? '✍️ Writing' : s.type === 'VOCAB' ? '📚 Vocab' : (s.type && (s.type.includes('reading') || s.type === 'reading-practice' || s.type.includes('ielts'))) ? '📖 Reading' : `Part ${idx + 1}`}
                                </button>
                              ))}
                            </div>
                          );
                        })()}

                        <div className="section-header">
                          {/* Show title for all sections including listening */}
                          <h2>{currentSection.title || currentSection.mockTitle || activeLesson.title || (currentSection.skill === 'listening' ? 'Listening Practice' : `Section ${activeSectionIndex + 1}`)}</h2>
                          {currentSection.type !== 'LISTENING' && currentSection.subtitle && (
                            <p className="subtitle">{currentSection.subtitle}</p>
                          )}
                          {currentSection.type !== 'LISTENING' && currentSection.description && (
                            <p className="description">{currentSection.description}</p>
                          )}
                          {currentSection.instructions && (
                            <div className="section-instructions">
                              {currentSection.instructions}
                            </div>
                          )}
                        </div>

                        {subPassages.length > 1 && (
                          <div className="passage-tabs">
                            {subPassages.map((p, idx) => (
                              <button key={idx} onClick={() => { setActivePassageIndex(idx); setIsReviewMode(false); }} className={`tab ${activePassageIndex === idx ? 'active' : ''} ${getPassageStatus(p) || ''}`}>
                                {p.title || `Passage ${idx + 1}`}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Check if we should use single-column layout for self-contained blocks */}
                        {(() => {
                          // Check if this section type handles its own questions internally
                          const handlesOwnQuestions = ['LISTENING', 'SPEAKING', 'WRITING', 'VOCAB'].includes(currentSection.type) || currentSection.skill === 'listening' || currentSection.skill === 'speaking' || currentSection.skill === 'writing' || currentSection.skill === 'vocab';
                          
                          const subTasks = currentPassage?.subTasks || currentSection?.subTasks || [];
                          
                          // Render self-contained blocks directly
                          if (handlesOwnQuestions) {
                            return (
                              <div className="workspace-grid single-column">
                                <div className="question-pane full-width">
                                  {renderQuestionBlock(currentSection)}
                                </div>
                              </div>
                            );
                          }
                          const hasHeadingMatch = subTasks.some(t => t.type === 'heading-match');
                          const hasMatchingChoice = subTasks.some(t => t.type === 'matching-choice');
                          const hasMatchingFeatures = subTasks.some(t => t.type === 'matching-features');
                          const hasGapFill = subTasks.some(t => t.type === 'gap-fill');
                          const useSingleColumn = hasHeadingMatch || hasMatchingChoice || hasMatchingFeatures || hasGapFill;
                          
                          // If single column needed (heading-match, matching-choice, or gap-fill), render everything together
                          if (useSingleColumn) {
                            // For gap-fill, render only the subTasks (the text with gaps IS the content)
                            // For other types, render the full passage/section
                            return (
                              <div className="workspace-grid single-column">
                                <div className="question-pane full-width">
                                  {hasGapFill ? (
                                    // Render only gap-fill subtasks - the text with gaps is self-contained
                                    subTasks.filter(t => t.type === 'gap-fill').map((task, idx) => (
                                      <GapFillBlock 
                                        key={`gap-${idx}`}
                                        data={{ 
                                          id: task.id || `${currentPassage?.id || currentSection?.id}-gap-${idx}`, 
                                          content: task.text || task.content, 
                                          options: task.wordBank || task.options, 
                                          answers: Array.isArray(task.answer) ? task.answer : [task.answer] 
                                        }} 
                                        isReviewMode={isReviewMode}
                                        selections={gapFillSelections[currentPassage?.id || currentSection?.id] || {}} 
                                        activeGap={activeGap} 
                                        onWordSelect={(w) => handleGapFillWordSelect(w, currentPassage?.id || currentSection?.id)} 
                                        onGapClick={(idx) => setActiveGap({ parentId: currentPassage?.id || currentSection?.id, gapId: idx })} 
                                      />
                                    ))
                                  ) : (
                                    <>
                                      {renderQuestionBlock(subPassages.length > 0 ? currentPassage : currentSection)}
                                      {!handlesOwnQuestions && directQuestions.length > 0 && directQuestions.map(q => <div key={q.id} style={{marginBottom: '20px'}}>{renderQuestionBlock(q)}</div>)}
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          
                          // Original two-column layout for reading passages with content
                          // Note: LISTENING, SPEAKING, WRITING, VOCAB types handle their own questions internally
                           
                           return (
                             <div className={`workspace-grid ${(subPassages.length > 0 || currentSection.content) ? '' : 'single-column'}`}>
                               {(subPassages.length > 0 || currentSection.content) && (
                                 <div className="reading-pane">
                                   <ReadingBlock content={currentPassage?.content || currentSection.content} />
                                 </div>
                               )}
                               <div className="question-pane">
                                 <>
                                   {renderQuestionBlock(subPassages.length > 0 ? currentPassage : currentSection)}
                                   {!handlesOwnQuestions && directQuestions.length > 0 && directQuestions.map(q => <div key={q.id} style={{marginBottom: '20px'}}>{renderQuestionBlock(q)}</div>)}
                                 </>
                               </div>
                             </div>
                           );
                        })()}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="drill-flow">
                  {activeLesson.content && activeLesson.type !== 'token-select' && activeLesson.type !== 'heading-match' && (
                    <ReadingBlock content={activeLesson.content} />
                  )}
                  {renderQuestionBlock(activeLesson)}
                </div>
              )}
            </div>
          )}

          {/* RESULTS SCREEN */}
          {view === 'results' && <ResultScreen lesson={activeLesson} results={lessonResults} onClaim={handleFinalClaim} />}
        </div>

        {/* PERSISTENT FOOTER FOR LESSONS */}
        {view === 'lesson' && activeLesson && (
          <footer className="lesson-footer">
            {!isReviewMode ? (
              <button className="btn-primary" onClick={() => handleCheckAnswers()}>Check Answers</button>
            ) : (
              <div className="footer-buttons">
                {(activeLesson.sections?.[activeSectionIndex]?.passages?.[activePassageIndex + 1]) ? (
                  <button className="btn-secondary" onClick={() => { setActivePassageIndex(prev => prev + 1); setIsReviewMode(false); }}>Next Passage <ArrowRight size={18} /></button>
                 ) : 
                 (activeLesson.sections || activeLesson.passages || activeLesson.parts)?.[activeSectionIndex + 1] ? (
                   <button className="btn-secondary" onClick={() => { 
                     const nextSectionIndex = activeSectionIndex + 1;
                     setActiveSectionIndex(nextSectionIndex); 
                     setActivePassageIndex(0); 
                     setIsReviewMode(false); 
                     // Update activeSkillTab to match the new section's skill
                     const sections = activeLesson.sections || activeLesson.passages || activeLesson.parts || [];
                     const nextSection = sections[nextSectionIndex];
                     if (nextSection.skill) {
                       const skillOrder = ['vocab', 'reading', 'writing', 'speaking', 'listening'];
                       const availableSkills = skillOrder.filter(skill => 
                         sections.some(s => s.skill === skill)
                       );
                       const newSkillIndex = availableSkills.findIndex(skill => skill === nextSection.skill);
                       if (newSkillIndex !== -1) {
                         setActiveSkillTab(newSkillIndex);
                       }
                     }
                   }}>Next Part <ArrowRight size={18} /></button>
                ) : (
                  <button className="btn-finish" onClick={handleFinishLesson}>Finish & View Score <Award size={18} /></button>
                )}
              </div>
            )}
          </footer>
        )}
      </main>

      {/* OVERLAY MODALS */}
      <ReflectionGate 
        isOpen={showReflection} 
        type={ (activeLesson?.type?.includes('SPEAKING') || activeLesson?.sections?.[activeSectionIndex]?.type === 'SPEAKING' || activeLesson?.sections?.[activeSectionIndex]?.passages?.[activePassageIndex]?.type === 'SPEAKING') ? 'SPEAKING' : 'WRITING'} 
        xpAmount={activeLesson?.xpReward || activeLesson?.xp || 0} 
        onClaim={handleFinalClaim} 
      />
      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}

export default App;