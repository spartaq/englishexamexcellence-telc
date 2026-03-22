import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import './styles/globals.css';
import './App.css';

// ============================================================
// CHAPTER 1: THE TEACHER'S TOOLS (IMPORTS & ASSETS)
// ============================================================
import { 
  LayoutDashboard, BookOpen, LogOut, Award, 
  CheckCircle, XCircle, ArrowRight, Book, Mic, Headset, PenTool,
  Zap, Library, Atom, RefreshCw
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
import SentenceCompleteBlock from './components/engine/InteractiveBlocks/SentenceCompleteBlock';
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
import PunctuationCorrectionBlock from './components/engine/InteractiveBlocks/PunctuationCorrectionBlock';

// Behind-the-Scenes (Data, Hooks & Utilities)
import { HUBS, loadFullLesson, ieltsMocks } from './data/index';
import { ATOM_HUB } from './data/IELTS/atoms';
import { useActive } from './hooks/useActive';
import { useXP } from './hooks/useXP';
import { useExamStore } from './store/useExamStore';
import ScrollToTop from './scrollToTop';
import { evaluateDrill } from './utils/evaluate';
import { calculateIELTSReadingScore, calculateIELTSListeningScore, calculateIELTSScore, calculateAccuracy } from './utils/scoring/index';
import { getAtomsFromMocks, pluckRandom, getVocabById, pluckRandomFullMock, findVocabFromReading, pluckSingleSpeakingPart } from './utils/mockPlucker';

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
      { id: 'reading_ac', title: 'Academic Reading', icon: <BookOpen size={20} />, hubKey: 'reading_academic' },
      { id: 'reading_gt', title: 'General Reading', icon: <BookOpen size={20} />, hubKey: 'reading_general' },
      { id: 'writing_ac', title: 'Academic Writing', icon: <PenTool size={20} />, hubKey: 'writing_academic' },
      { id: 'writing_gt', title: 'General Writing', icon: <PenTool size={20} />, hubKey: 'writing_general' },
      { id: 'listening', title: 'Listening', icon: <Headset size={20} />, hubKey: 'listening' },
      { id: 'speaking', title: 'Speaking', icon: <Mic size={20} />, hubKey: 'speaking' },
    ]
  },
  langcert: {
    id: 'langcert',
    title: 'LangCert',
    description: 'International ESOL qualification',
    color: '#2563eb',
    modules: [
      { id: 'speaking', title: 'Speaking', icon: <Mic size={20} />, hubKey: 'speaking' },
      { id: 'reading', title: 'Reading', icon: <BookOpen size={20} />, hubKey: 'langcert_reading' },
    ]
  },
  toefl: {
    id: 'toefl',
    title: 'TOEFL',
    description: 'Test of English as a Foreign Language',
    color: '#3b82f6',
    modules: [
      { id: 'r_ac', title: 'Academic Reading', icon: <BookOpen size={20} />, hubKey: 'reading_academic' },
      { id: 'r_gt', title: 'General Reading', icon: <BookOpen size={20} />, hubKey: 'reading_general' },
      { id: 'w_ac', title: 'Academic Writing', icon: <PenTool size={20} />, hubKey: 'writing_academic' },
      { id: 'w_gt', title: 'General Writing', icon: <PenTool size={20} />, hubKey: 'writing_general' },
      { id: 'listening', title: 'Listening', icon: <Headset size={20} />, hubKey: 'listening' },
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
    id: 'drillshub', 
    title: 'Drills Hub', 
    description: 'Grammar, punctuation, and core drills.', 
    icon: <Zap size={24} />, 
    hubKey: 'drillshub',
    color: '#f59e0b' 
  }
];

function App({ initialView }) {
  // ============================================================
  // CHAPTER 3: THE TEACHER'S GRADEBOOK (STATE MANAGEMENT)
  // ============================================================
  
  // Navigation State
  const [view, setView] = useState(initialView || 'dashboard');
  const [viewHistory, setViewHistory] = useState([initialView || 'dashboard']);
  const [activeTest, setActiveTest] = useState(null);       
  const [activeCategory, setActiveCategory] = useState(null); 
  const [activeSection, setActiveSection] = useState(null);   
  const [activeLesson, setActiveLesson] = useState(null);     
  const [activePassageIndex, setActivePassageIndex] = useState(0); 
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeSkillTab, setActiveSkillTab] = useState(0); // For unified skill tabs: Vocab(mini), Reading, Writing, Speaking, Listening 
  const [showPaywall, setShowPaywall] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Loading effect - set loading to false after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Helper to set view with history tracking
  const navigateToView = (newView) => {
    if (newView !== view) {
      setViewHistory(prev => [...prev, newView]);
      setView(newView);
      
      // Update URL based on view type
      if (newView === 'testHub' && activeTest) {
        navigate(`/dashboard/${activeTest.id}-full-individual`);
      } else if (newView === 'strategy' && activeTest) {
        navigate(`/dashboard/${activeTest.id}-hub`);
      }
    }
  };

  // Helper to go back to previous view
  const navigateBack = () => {
    // If we have history, go back
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); // Remove current view
      const previousView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setView(previousView);
      
      // Update URL based on previous view
      if (previousView === 'dashboard' || previousView === 'landing') {
        navigate('/dashboard');
      } else if (previousView === 'strategy' && activeTest) {
        navigate(`/dashboard/${activeTest.id}-hub`);
      } else if (previousView === 'testHub' && activeTest) {
        navigate(`/dashboard/${activeTest.id}-full-individual`);
      } else if (previousView === 'hub' && activeTest) {
        // Go back to test hub for hub views
        navigate(`/dashboard/${activeTest.id}-full-individual`);
      } else if (previousView === 'selection' && activeTest) {
        // If going back to selection from a hub, stay on test hub
        navigate(`/dashboard/${activeTest.id}-full-individual`);
      }
    } else {
      // If we're at the root view or directly accessed, go to dashboard
      setView('dashboard');
      navigate('/dashboard');
    }
  };      

  // Learning & Result State
  const [userAnswers, setUserAnswers] = useState({});
  const [showReflection, setShowReflection] = useState(false);
  const [lessonResults, setLessonResults] = useState({ accuracy: 0, earnedXP: 0, isPerfect: false });
  const [isReviewMode, setIsReviewMode] = useState(false);    

  // Router Navigate
  const navigate = useNavigate();
  
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
  
   // Effect to handle initial view (routing)
  useEffect(() => {
    console.log('[Routing] initialView changed:', initialView);
    if (initialView && initialView !== 'dashboard') {
      // Clear previous state before loading new hub
      setActiveCategory(null);
      setActiveSection(null);
      // Check if it's a mini individual route (e.g., ielts-mini-individual) - must check FIRST
      if (initialView.includes('-mini-individual')) {
        const testId = initialView.split('-')[0]; // Extract test id (e.g., ielts from ielts-mini-individual)
        if (TEST_PLATFORM_CONFIG[testId]) {
          setActiveTest(TEST_PLATFORM_CONFIG[testId]);
          // Initialize history with dashboard -> strategy -> skillTests
          setViewHistory(['dashboard', 'strategy', 'skillTests']);
          setView('skillTests');
        }
      } else if (initialView.includes('-full-individual')) {
        // Check if it's a full individual route (e.g., ielts-full-individual)
        const testId = initialView.split('-')[0]; // Extract test id (e.g., ielts from ielts-full-individual)
        if (TEST_PLATFORM_CONFIG[testId]) {
          setActiveTest(TEST_PLATFORM_CONFIG[testId]);
          // Initialize history with dashboard -> strategy -> testHub
          setViewHistory(['dashboard', 'strategy', 'testHub']);
          setView('testHub');
        }
      } else if (initialView.includes('-hub')) {
        // Check if it's a strategy route (e.g., ielts-hub)
        const testId = initialView.split('-')[0]; // Extract test id (e.g., ielts from ielts-hub)
        if (TEST_PLATFORM_CONFIG[testId]) {
          setActiveTest(TEST_PLATFORM_CONFIG[testId]);
          // Initialize history with dashboard -> strategy
          setViewHistory(['dashboard', 'strategy']);
          setView('strategy');
        }
      } else if (initialView.includes('-test-hub')) {
        // Check if it's a test hub route (e.g., ielts-test-hub)
        const testId = initialView.split('-')[0]; // Extract test id (e.g., ielts from ielts-test-hub)
        if (TEST_PLATFORM_CONFIG[testId]) {
          setActiveTest(TEST_PLATFORM_CONFIG[testId]);
          // Initialize history with dashboard -> testHub
          setViewHistory(['dashboard', 'testHub']);
          setView('testHub');
        }
      } else {
        // Check if it's a hub route (HUBS object keys) - check this FIRST to prioritize hub/selection flow
        // Normalize hubKey: convert hyphens to underscores to match HUBS keys
        const hubKey = initialView.replace(/-/g, '_');
        if (HUBS[hubKey]) {
          const hub = HUBS[hubKey];
          // Directly set the view and activeCategory instead of calling handleSelectModule
          setActiveCategory(hub);
          
          // If hub has only 1 category, skip directly to selection (don't include 'hub' in history)
          if (hub.categories && hub.categories.length === 1) {
            setActiveSection(hub.categories[0]);
            setViewHistory(['dashboard', 'selection']);
            setView('selection');
          } else {
            // Initialize history with dashboard -> hub
            setViewHistory(['dashboard', 'hub']);
            setView('hub');
          }
        } else {
          // Check if it's a full test route
          if (initialView === 'ielts-general-full-test' || initialView === 'ielts-academic-full-test') {
            const testType = initialView === 'ielts-general-full-test' ? 'general-full-mock' : 'academic-full-mock';
            const testId = 'ielts';
            if (TEST_PLATFORM_CONFIG[testId]) {
              setActiveTest(TEST_PLATFORM_CONFIG[testId]);
              // Set view to strategy so the BrandTestHub renders, then trigger the test
              setViewHistory(['dashboard', 'strategy']);
              setView('strategy');
              // Use setTimeout to ensure the view is set before triggering onSelectPath
              setTimeout(() => {
                // Find the BrandTestHub's onSelectPath through the component tree
                // Since we can't directly call it, we'll set up the test manually
                handleFullTestSelection(testType);
              }, 100);
            }
          } else {
            // Check if it's a mini test route (skillCategories in ATOM_HUB)
            const taskMetadata = ATOM_HUB.skillCategories[initialView];
            if (taskMetadata) {
              handleStartTask(taskMetadata);
            } else {
              // For any other route not matching known patterns, go to dashboard
              setView('dashboard');
            }
          }
        }
      }
    }
  }, [initialView]);     

  // Layout logic for specialized views
  // Note: All skill types removed from isHighFocus to show sidebar for all exercises
  const isHighFocus = false;
  const showSidebar = !isHighFocus && view !== 'results' && view !== 'landing';
  const showHeader = view !== 'results' && view !== 'landing' && view !== 'dashboard';

  // ============================================================
  // CHAPTER 4: THE GRADING MACHINE (CORE LOGIC)
  // ============================================================

  const getFlattenedQuestions = (lesson) => {
    let flat = [];
    const crawl = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      // Only consider it a question if it has text/question/prompt AND an answer
      const hasText = obj.text || obj.question || obj.prompt || obj.stem;
      const hasAnswer = obj.answer !== undefined;
      if (obj.id !== undefined && hasText && hasAnswer) {
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
    let ieltsScore = null;

    // Detect if this is an IELTS test
    const isIELTS = 
      activeTest?.id === 'ielts' || 
      activeLesson.type?.includes('ielts') ||
      activeLesson.id?.includes('ielts') ||
      activeLesson.type === 'general-reading-mock' ||
      activeLesson.type === 'academic-reading-mock' ||
      activeLesson.type === 'ielts-listening-mock';
    
    const isReading = activeLesson.skill === 'reading' || 
                     activeLesson.type === 'READING' ||
                     activeLesson.type === 'reading' ||
                     activeLesson.type === 'general-reading-mock' ||
                     activeLesson.type === 'academic-reading-mock' ||
                     currentSection?.type === 'READING' ||
                     currentPassage?.type === 'READING';
    const isListening = activeLesson.skill === 'listening' || 
                        activeLesson.type === 'LISTENING' ||
                        activeLesson.type === 'ielts-listening-mock' ||
                        currentSection?.type === 'LISTENING' ||
                        currentPassage?.type === 'LISTENING';

    // Determine test type for IELTS (academic vs general)
    const isGeneralTraining = activeLesson.type === 'general-training' || 
                               activeLesson.id?.includes('general');

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
      const selected = userAnswers[activeLesson.id] || [];
      const evaluation = evaluateDrill(activeLesson, selected);
      results = { accuracy: evaluation.accuracy, earnedXP: evaluation.earnedXP, isPerfect: evaluation.isPerfect };
    } 
    else if (activeLesson.type === 'gap-fill-tokens') {
      // Calculate accuracy from stored gapFillSelections
      const selections = gapFillSelections[activeLesson.id] || {};
      const answers = activeLesson.answers || activeLesson.answer || [];
      let correctCount = 0;
      answers.forEach((answer, index) => {
        const gapIndex = index + 1;
        const userAnswer = selections[gapIndex];
        if (userAnswer && userAnswer.toLowerCase() === answer.toLowerCase()) {
          correctCount++;
        }
      });
      const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;
      results = { 
        accuracy, 
        earnedXP: Math.round((activeLesson.xpReward || 0) * (accuracy / 100)), 
        isPerfect: accuracy >= 100 
      };
    } 
    else if (activeLesson.type === 'punctuation-correction') {
      // Calculate accuracy from stored punctuation placements
      const placements = userAnswers[activeLesson.id] || {};
      const sentences = activeLesson.sentences || [];
      let totalCorrect = 0;
      let totalExpected = 0;
      
      sentences.forEach(sentence => {
        const userPositions = new Set(placements[sentence.id] || []);
        const expectedPositions = new Set(sentence.correctPositions || []);
        
        const correct = [...userPositions].filter(pos => expectedPositions.has(pos));
        totalCorrect += correct.length;
        totalExpected += expectedPositions.size;
      });
      
      const accuracy = totalExpected > 0 ? Math.round((totalCorrect / totalExpected) * 100) : 0;
      results = { 
        accuracy, 
        earnedXP: Math.round((activeLesson.xpReward || 0) * (accuracy / 100)), 
        isPerfect: accuracy >= 100 
      };
    } 
    else {
      const allQuestions = getFlattenedQuestions(activeLesson);
      console.log('[handleCheckAnswers] Total questions found:', allQuestions.length);
      console.log('[handleCheckAnswers] Question IDs:', allQuestions.map(q => q.id));
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

    // Apply IELTS scoring if applicable
    if (isIELTS && isReading) {
      // For IELTS Reading, calculate band score
      // Note: In real IELTS, there are 40 questions. We'll scale if fewer questions.
      const scaledMarks = results.isPerfect ? 40 : Math.round((results.accuracy / 100) * 40);
      const testType = isGeneralTraining ? 'general' : 'academic';
      
      ieltsScore = calculateIELTSReadingScore(scaledMarks, testType);
      console.log('IELTS Reading Score:', ieltsScore);
    }
    
    if (isIELTS && isListening) {
      const scaledMarks = results.isPerfect ? 40 : Math.round((results.accuracy / 100) * 40);
      ieltsScore = calculateIELTSListeningScore(scaledMarks);
      console.log('IELTS Listening Score:', ieltsScore);
    }

    // Include IELTS score in results if available
    if (ieltsScore) {
      results = { ...results, ieltsScore };
    }

    setLessonResults(results);
    setIsReviewMode(true); 
    setView('results');
  };

  // ============================================================
  // CHAPTER 5: THE HALLWAYS (NAVIGATION HANDLERS)
  // ============================================================
  const handleGetStarted = () => navigateToView('landing'); 
  const handleSelectTest = (testId) => {
    setActiveTest(TEST_PLATFORM_CONFIG[testId]);
    navigateToView('strategy');
    navigate(`/dashboard/${testId}-hub`);
  };

  const handleSelectModule = (hubKey) => {
    console.log('handleSelectModule called with', hubKey);
    
    // Directly set state instead of relying on route change
    const normalizedKey = hubKey.replace(/-/g, '_');
    const hub = HUBS[normalizedKey];
    
    if (hub) {
      console.log('Found hub, setting state:', hub.title);
      setActiveCategory(hub);
      
      if (hub.categories && hub.categories.length === 1) {
        setActiveSection(hub.categories[0]);
        setViewHistory(['dashboard', 'selection']);
        setView('selection');
      } else {
        setViewHistory(['dashboard', 'hub']);
        setView('hub');
      }
      
      // Also navigate for URL consistency
      const hubPath = `/dashboard/${hubKey.replace('_', '-')}`;
      console.log('navigating to', hubPath);
      navigate(hubPath);
    } else {
      console.error('Hub not found for key:', hubKey);
    }
  };

  // Helper function to start a full test (used by routes and onSelectPath)
  const handleFullTestSelection = (testType) => {
    if (testType === 'general-full-mock') {
      const generalMock = pluckRandomFullMock('general');
      if (generalMock && generalMock.sections && generalMock.sections.length > 0) {
        setActiveLesson(generalMock);
        setActiveSectionIndex(0);
        setView('lesson');
      }
    } else if (testType === 'academic-full-mock') {
      const academicMock = pluckRandomFullMock('academic');
      if (academicMock && academicMock.sections && academicMock.sections.length > 0) {
        setActiveLesson(academicMock);
        setActiveSectionIndex(0);
        setView('lesson');
      }
    }
  };

   const handleSelectSection = (section) => {
     console.log('handleSelectSection called with:', section);
     
    // Check for VOCAB_FLASHCARDS type - start immediately
      if (section.type === 'VOCAB_FLASHCARDS') {
        console.log('VOCAB_FLASHCARDS detected, calling handleStartTask');
        handleStartTask(section);
        return;
      }
      
      // Check if this is an ATOM_HUB category (explicitly check for task types)
      const allowedTaskTypes = ['TASK', 'VOCAB_FLASHCARDS'];
      if (section.type && allowedTaskTypes.includes(section.type)) {
        handleStartTask(section);
        return;
      }
      
      // If this is from the DRILLS_HUB, use standard behavior
     if (activeCategory && activeCategory.title === "Drills Hub") {
       setActiveSection(section);
       setView('selection');
     } 
     // If this is an 'atom' section from ATOM_HUB, go pluck the tasks from the mocks
     else if (section.id === 'reading-drills' || section.id === 'listening-drills') {
       const hydratedSection = getAtomsFromMocks(section.id);
       setActiveSection(hydratedSection);
       setView('selection');
     } 
     // Standard behavior for normal lessons
     else {
       setActiveSection(section);
       setView('selection');
     }
  };

  const handleStartTask = (taskMetadata) => {
    console.log('handleStartTask called!', taskMetadata.type);
    if (taskMetadata.tier !== 'bronze' && !isPremium) { setShowPaywall(true); return; }
    
    // Handle VOCAB type - load directly from task metadata
    if (taskMetadata.type === 'VOCAB' || taskMetadata.type === 'VOCAB_FLASHCARDS') {
      setActiveLesson(taskMetadata);
      setView('lesson');
    } else if (taskMetadata.type === 'flow') {
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
          { ...(pluckSingleSpeakingPart()?.sections?.[0] || {
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
      setView('lesson');
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
          { ...(pluckSingleSpeakingPart()?.sections?.[0] || {
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
      setView('lesson');
    } else if (taskMetadata.type === 'random-pick') {
      // Random pick: get a random exercise from the specified skill
      const randomExercise = pluckRandom(taskMetadata.skill);
      if (randomExercise) {
        setActiveLesson({
          ...randomExercise,
          xpReward: taskMetadata.xp || 500
        });
        setView('lesson');
      }
    } else if (taskMetadata.type === 'specific' || taskMetadata.type === 'gap-fill-tokens') {
      // Specific exercise: load by exerciseId
      const fullLesson = loadFullLesson(taskMetadata);
      setActiveLesson(fullLesson);
      setView('lesson');
    } else if (taskMetadata.type === 'full-flow') {
      // Full test flow: combine all 4 skills with full mock content
      const fullMock = pluckRandomFullMock();
      
      if (fullMock) {
        setActiveLesson({
          ...fullMock,
          type: 'full-test',
          xpReward: taskMetadata.xp || 2000
        });
        setView('lesson');
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
          { ...(pluckSingleSpeakingPart()?.sections?.[0] || {
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
      setView('lesson');
    } else if (taskMetadata.type === 'ielts-complex' || taskMetadata.type === 'READING' || taskMetadata.skill === 'reading') {
      console.log('[DEBUG] Reading task triggered, metadata:', JSON.stringify(taskMetadata));
      // Reading task from hub - load reading section from mock
      if (taskMetadata.mockId) {
        const mock = ieltsMocks[taskMetadata.mockId];
        if (mock?.reading) {
          // Flatten all passages from all sections into a single array for the lesson
          const allPassages = [];
          if (mock.reading.sections) {
            mock.reading.sections.forEach(section => {
              if (section.passages) {
                section.passages.forEach(passage => {
                  allPassages.push({
                    ...passage,
                    sectionTitle: section.title,
                    sectionDescription: section.description
                  });
                });
              }
            });
          }
          
          setActiveLesson({
            ...mock.reading,
            passages: allPassages,
            type: 'READING',
            skill: 'reading',
            xpReward: taskMetadata.xp || 300
          });
          setView('lesson');
          return;
        }
      }
      // Fallback: try standard loading
      const fullLesson = loadFullLesson(taskMetadata);
      setActiveLesson(fullLesson);
      setView('lesson');
    } else if (taskMetadata.type === 'WRITING' || taskMetadata.skill === 'writing') {
      console.log('[DEBUG] Writing task triggered, metadata:', JSON.stringify(taskMetadata));
      // Writing task from hub - load writing section from mock
      console.log('[DEBUG] Checking mockId:', taskMetadata.mockId, 'ieltsMocks:', Object.keys(ieltsMocks));
      if (taskMetadata.mockId) {
        const mock = ieltsMocks[taskMetadata.mockId];
        console.log('[DEBUG] Found mock:', mock, 'writing:', mock?.writing);
        if (mock?.writing) {
          // Flatten all tasks from all sections
          const allTasks = [];
          if (mock.writing.sections) {
            mock.writing.sections.forEach(section => {
              allTasks.push(section);
            });
          }
          console.log('[DEBUG] Writing sections:', allTasks.length);
          
          setActiveLesson({
            ...mock.writing,
            sections: allTasks,
            type: 'WRITING',
            skill: 'writing',
            xpReward: taskMetadata.xp || 500
          });
          console.log('[DEBUG] Setting view to lesson, activeLesson sections:', allTasks.length);
          setView('lesson');
          console.log('[DEBUG] Done, returning');
          return;
        } else {
          console.log('[DEBUG] No mock.writing found');
        }
      } else {
        console.log('[DEBUG] No mockId in task');
      }
      // Fallback: try standard loading
      console.log('[DEBUG] Falling back to loadFullLesson');
      const fullLesson = loadFullLesson(taskMetadata);
      console.log('[DEBUG] Fallback result:', fullLesson);
      setActiveLesson(fullLesson);
      setView('lesson');
    } else if (taskMetadata.type === 'LISTENING' || taskMetadata.skill === 'listening') {
      // Listening task from hub - load listening section from mock
      if (taskMetadata.mockId) {
        const mock = ieltsMocks[taskMetadata.mockId];
        if (mock?.listening) {
          setActiveLesson({
            ...mock.listening,
            type: 'LISTENING',
            skill: 'listening',
            xpReward: taskMetadata.xp || 300
          });
          setView('lesson');
          return;
        }
      }
      // Fallback: try standard loading
      const fullLesson = loadFullLesson(taskMetadata);
      setActiveLesson(fullLesson);
      setView('lesson');
    } else if (taskMetadata.type === 'speaking' || taskMetadata.skill === 'speaking') {
      // Speaking task from hub - load speaking section from mock
      if (taskMetadata.mockId) {
        const mock = ieltsMocks[taskMetadata.mockId];
        if (mock?.speaking) {
          setActiveLesson({
            ...mock.speaking,
            type: 'speaking',
            skill: 'speaking',
            xpReward: taskMetadata.xp || 300
          });
          setView('lesson');
          return;
        }
      }
      // Fallback: try standard loading
      const fullLesson = loadFullLesson(taskMetadata);
      setActiveLesson(fullLesson);
      setView('lesson');
    } else {
      // STANDARD: Load a single task
      const fullLesson = loadFullLesson(taskMetadata);
      setActiveLesson(fullLesson);
      setView('lesson');
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
    navigateToView('lesson');
  };

  const handleFinishLesson = () => navigateToView('results');

  const handleFinalClaim = () => {
    claimXp(lessonResults.earnedXP || activeLesson.xpReward || activeLesson.xp || 0);
    setShowReflection(false);
    navigateToView('dashboard');
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
    
    console.log('[renderQuestionBlock] Called with type:', taskData.type, 'skill:', taskData.skill, 'prompt:', !!taskData.prompt, 'id:', taskData.id);

    if (taskData.prompts || taskData.scenarios || taskData.candidateInfo || taskData.topicCard || taskData.type === 'SPEAKING' || taskData.type === 'ielts-speaking' || taskData.type === 'discussion' || taskData.type === 'interview' || taskData.type === 'long-turn' || taskData.skill === 'speaking') {
        return <SpeakingBlock data={taskData} onComplete={handleCheckAnswers} isMiniTest={true} />;
    }
    if (taskData.type === 'WRITING' || taskData.prompt) {
        // Extract the task based on activeSectionIndex if sections exist
        const writingTask = taskData.sections && taskData.sections.length > 0 
          ? { ...taskData, ...taskData.sections[activeSectionIndex] || taskData.sections[0] }  // Merge parent with current task
          : taskData;
        console.log('[renderQuestionBlock] Rendering WritingBlock with task index:', activeSectionIndex, 'task:', JSON.stringify(writingTask).slice(0, 300));
        return <WritingBlock data={writingTask} onComplete={handleCheckAnswers} isMiniTest={true} />;
    }

    if (taskData.type === 'LISTENING' || taskData.skill === 'listening') {
      // Calculate if this is the last section for listening
      const listeningSections = activeLesson.listening?.sections?.length || (activeLesson.sections?.filter(s => s.type === 'LISTENING' || s.skill === 'listening').length) || 1;
      const isLastListeningSection = activeSectionIndex >= listeningSections - 1;
      return <ListeningBlock data={taskData} showCheckAnswers={isLastListeningSection} onCheckAnswers={handleCheckAnswers} isMiniTest={true} />;
    }
    if (taskData.type === 'VOCAB' || taskData.type === 'VOCAB_FLASHCARDS') return <VocabBlock data={taskData} onComplete={handleCheckAnswers} />;

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
        return <TokenSelectBlock data={taskData} isReviewMode={isReviewMode} onUpdate={(selected) => setUserAnswers(prev => ({...prev, [taskData.id]: selected}))} />;

      case 'punctuation-correction':
        return <PunctuationCorrectionBlock data={taskData} isReviewMode={isReviewMode} onUpdate={(placements) => setUserAnswers(prev => ({...prev, [taskData.id]: placements}))} />;

      case 'ielts-complex':
      case 'READING':
      case 'reading':
        const passageSubTasks = taskData.subTasks || taskData.questions || [];
        // Calculate if this is the last passage and last section
        const currentSection = activeLesson.sections?.[activeSectionIndex];
        const passagesInSection = currentSection?.passages?.length || 1;
        const hasNextPassage = activePassageIndex < passagesInSection - 1;
        const hasNextSection = activeSectionIndex < (activeLesson.sections?.length || 1) - 1;
        
        // Use ReadingBlock with QuestionCarousel for ielts-complex passages
        return (
          <ReadingBlock 
            content={taskData.content} 
            questions={passageSubTasks}
            isMiniTest={taskData.isMiniTest}
            userAnswers={userAnswers}
            onUpdate={(qId, val) => setUserAnswers({...userAnswers, [qId]: val})}
            navigationProps={{ hasNextPassage, hasNextSection }}
            showCheckAnswers={!hasNextPassage && !hasNextSection}
            onCheckAnswers={handleCheckAnswers}
          />
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
          <SentenceCompleteBlock 
            data={{ id: taskData.id, content: taskData.text || taskData.content, options: taskData.wordBank || taskData.options, answers: Array.isArray(taskData.answer) ? taskData.answer : [taskData.answer] }} 
            isReviewMode={isReviewMode} 
            selections={gapFillSelections[taskData.id] || {}} 
            activeGap={activeGap} 
            onWordSelect={(w) => handleGapFillWordSelect(w, taskData.id)} 
            onGapClick={(idx) => setActiveGap({ parentId: taskData.id, gapId: idx })} 
          />
        );

      case 'gap-fill-tokens':
        return (
          <GapFillBlock
            data={{
              id: taskData.id,
              title: taskData.title,
              instruction: taskData.instruction,
              passage: taskData.passage || taskData.text,
              tokens: taskData.tokens || taskData.wordBank || [],
              answers: taskData.answers || taskData.answer || [],
              xpReward: taskData.xpReward
            }}
            isReviewMode={isReviewMode}
            onUpdate={(selections) => setGapFillSelections({...gapFillSelections, [taskData.id]: selections})}
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
  
  // Loading spinner
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        <RefreshCw className="spinner" size={48} style={{ marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Loading The Lab...</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

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
            <button onClick={() => { navigateToView('dashboard'); setActiveTest(null); }} className={`nav-item ${view === 'dashboard' ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </button>
            {activeTest && (
              <button onClick={() => navigate(`/dashboard/${activeTest.id}-full-individual`)} className={`nav-item ${view === 'testHub' ? 'active' : ''}`}>
                <BookOpen size={18} /> {activeTest.title} Hub
              </button>
            )}
            <button className="nav-item" onClick={() => navigateToView('landing')} style={{ marginTop: 'auto', opacity: 0.5 }}>
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
                 <button onClick={() => navigateBack()} className="exit-btn">
                   <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back
                 </button>
               )}
              {view === 'lesson' && (
                <button onClick={() => { 
                  setActiveLesson(null); 
                  console.log('[Back] activeCategory:', activeCategory);
                  console.log('[Back] viewHistory:', viewHistory);
                  console.log('[Back] initialView:', initialView);
                  // If we have an activeCategory (we came from a hub), go back to that hub
                  if (activeCategory) {
                    // Check if the hub has only 1 category
                    if (activeCategory.categories && activeCategory.categories.length === 1) {
                      setActiveSection(activeCategory.categories[0]);
                      setView('selection');
                    } else {
                      setView('hub');
                    }
                  } else if (viewHistory.length > 1) {
                    // Check if we came from a full test route - go to strategy hub
                    if (initialView && (initialView.includes('full-test'))) {
                      setView('strategy');
                      if (activeTest) {
                        navigate(`/dashboard/${activeTest.id}-hub`);
                      }
                    } else {
                      navigateBack();
                    }
                  } else {
                    setView('dashboard');
                  }
                }} className="exit-btn">
                  <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back
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
              {view === 'skillTests' && (
                <button onClick={() => navigateBack()} className="exit-btn">
                  <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back
                </button>
              )}
              {(view === 'hub' || view === 'selection') && activeTest && !(activeCategory && (activeCategory.title === 'Vocab Lab' || activeCategory.title === 'Drills Hub')) && (
                <button onClick={() => navigate(`/dashboard/${activeTest.id}-full-individual`)} className="exit-btn">
                  <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back
                </button>
              )}
              {/* Back button for non-test hubs like vocabulary and general-drills - go to hub from selection, dashboard from hub */}
              {(view === 'hub' || view === 'selection') && activeCategory && (activeCategory.title === 'Vocab Lab' || activeCategory.title === 'Drills Hub') && (
                <button onClick={() => view === 'selection' ? setView('hub') : setView('dashboard')} className="exit-btn">
                  <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> {view === 'selection' ? 'Back' : 'Dashboard'}
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
                if (path === 'ielts-general-mini-test') {
                  // Mini-test flow: pick ONE random exercise from General test
                  // Randomly select a skill type
                  const skillTypes = ['vocab', 'reading', 'listening', 'writing', 'speaking'];
                  const randomSkill = skillTypes[Math.floor(Math.random() * skillTypes.length)];
                  
                  let singleExercise = null;
                  
                  if (randomSkill === 'vocab') {
                    const readingExercise = pluckRandom('reading_general');
                    singleExercise = findVocabFromReading(readingExercise);
                  } else if (randomSkill === 'reading') {
                    singleExercise = pluckRandom('reading_general');
                  } else if (randomSkill === 'writing') {
                    singleExercise = pluckRandom('writing_general');
                  } else if (randomSkill === 'speaking') {
                    const speakingWrapper = pluckSingleSpeakingPart();
                    singleExercise = speakingWrapper?.sections?.[0] || {
                      id: 'speaking-fallback',
                      title: 'Speaking Practice',
                      type: 'SPEAKING',
                      xp: 200,
                      prompts: ['Tell me about your hometown.', 'What do you like to do in your free time?']
                    };
                  } else if (randomSkill === 'listening') {
                    singleExercise = pluckRandom('listening');
                  }
                  
                  // Create a mini-test flow with only ONE random exercise
                  const miniTest = {
                    id: 'mini-test-flow',
                    title: 'General Mini Test',
                    type: 'mini-test-flow',
                    xp: singleExercise?.xp || 200,
                    sections: [{ ...singleExercise, skill: randomSkill }].filter(Boolean)
                  };
                  
                  if (miniTest.sections.length > 0) {
                    setActiveLesson(miniTest);
                    setActiveSectionIndex(0);
                    setView('lesson');
                  }
                } else if (path === 'ielts-academic-mini-test') {
                  // Academic Mini Flow: pick ONE random exercise
                  const skillTypes = ['vocab', 'reading', 'listening', 'writing', 'speaking'];
                  const randomSkill = skillTypes[Math.floor(Math.random() * skillTypes.length)];
                  
                  let singleExercise = null;
                  
                  if (randomSkill === 'vocab') {
                    const readingExercise = pluckRandom('reading_academic');
                    singleExercise = findVocabFromReading(readingExercise);
                  } else if (randomSkill === 'reading') {
                    singleExercise = pluckRandom('reading_academic');
                  } else if (randomSkill === 'writing') {
                    singleExercise = pluckRandom('writing_academic');
                  } else if (randomSkill === 'speaking') {
                    const speakingWrapper = pluckSingleSpeakingPart();
                    singleExercise = speakingWrapper?.sections?.[0] || {
                      id: 'speaking-fallback',
                      title: 'Speaking Practice',
                      type: 'SPEAKING',
                      xp: 200,
                      prompts: ['Tell me about your hometown.', 'What do you like to do in your free time?']
                    };
                  } else if (randomSkill === 'listening') {
                    singleExercise = pluckRandom('listening');
                  }
                  
                  // Create a mini-test flow with only ONE random exercise
                  const academicMiniTest = {
                    id: 'academic-mini-flow',
                    title: 'Academic Mini Test',
                    type: 'academic-mini-flow',
                    xp: singleExercise?.xp || 200,
                    sections: [{ ...singleExercise, skill: randomSkill }].filter(Boolean)
                  };
                  
                  if (academicMiniTest.sections.length > 0) {
                    setActiveLesson(academicMiniTest);
                    setActiveSectionIndex(0);
                    setView('lesson');
                  }
                } else if (path === 'ielts-mini-random-general') {
                  // Single random exercise - General Training (reading/writing are general)
                  const skillTypes = ['vocab', 'reading', 'listening', 'writing', 'speaking'];
                  const randomSkill = skillTypes[Math.floor(Math.random() * skillTypes.length)];
                  
                  let singleExercise = null;
                  
                  if (randomSkill === 'vocab') {
                    const readingExercise = pluckRandom('reading_general');
                    singleExercise = findVocabFromReading(readingExercise);
                  } else if (randomSkill === 'reading') {
                    singleExercise = pluckRandom('reading_general');
                  } else if (randomSkill === 'writing') {
                    singleExercise = pluckRandom('writing_general');
                  } else if (randomSkill === 'speaking') {
                    const speakingWrapper = pluckSingleSpeakingPart();
                    singleExercise = speakingWrapper?.sections?.[0] || {
                      id: 'speaking-fallback',
                      title: 'Speaking Practice',
                      type: 'SPEAKING',
                      xp: 200,
                      prompts: ['Tell me about your hometown.', 'What do you like to do in your free time?']
                    };
                  } else if (randomSkill === 'listening') {
                    singleExercise = pluckRandom('listening');
                  }
                  
                  // Create a mini-test flow with only ONE random exercise
                  const miniTest = {
                    id: 'mini-random-general-flow',
                    title: 'General Quick Practice',
                    type: 'mini-random-flow',
                    xp: singleExercise?.xp || 200,
                    sections: [{ ...singleExercise, skill: randomSkill }].filter(Boolean)
                  };
                  
                  if (miniTest.sections.length > 0) {
                    setActiveLesson(miniTest);
                    setActiveSectionIndex(0);
                    navigateToView('lesson');
                  }
                } else if (path === 'ielts-mini-random-academic') {
                  // Single random exercise - Academic (reading/writing are academic)
                  const skillTypes = ['vocab', 'reading', 'listening', 'writing', 'speaking'];
                  const randomSkill = skillTypes[Math.floor(Math.random() * skillTypes.length)];
                  
                  let singleExercise = null;
                  
                  if (randomSkill === 'vocab') {
                    const readingExercise = pluckRandom('reading_academic');
                    singleExercise = findVocabFromReading(readingExercise);
                  } else if (randomSkill === 'reading') {
                    singleExercise = pluckRandom('reading_academic');
                  } else if (randomSkill === 'writing') {
                    singleExercise = pluckRandom('writing_academic');
                  } else if (randomSkill === 'speaking') {
                    const speakingWrapper = pluckSingleSpeakingPart();
                    singleExercise = speakingWrapper?.sections?.[0] || {
                      id: 'speaking-fallback',
                      title: 'Speaking Practice',
                      type: 'SPEAKING',
                      xp: 200,
                      prompts: ['Tell me about your hometown.', 'What do you like to do in your free time?']
                    };
                  } else if (randomSkill === 'listening') {
                    singleExercise = pluckRandom('listening');
                  }
                  
                  // Create a mini-test flow with only ONE random exercise
                  const miniTest = {
                    id: 'mini-random-academic-flow',
                    title: 'Academic Quick Practice',
                    type: 'mini-random-flow',
                    xp: singleExercise?.xp || 200,
                    sections: [{ ...singleExercise, skill: randomSkill }].filter(Boolean)
                  };
                  
                  if (miniTest.sections.length > 0) {
                    setActiveLesson(miniTest);
                    setActiveSectionIndex(0);
                    navigateToView('lesson');
                  }
                } else if (path === 'skill-tests') {
                   // Show the skill tests view with individual skill options
                   navigateToView('skillTests');
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
                 } else if (path === 'general-full-mock') {
                   // Start a General Training full mock test
                   const generalMock = pluckRandomFullMock('general');
                   if (generalMock && generalMock.sections && generalMock.sections.length > 0) {
                     setActiveLesson(generalMock);
                     setActiveSectionIndex(0);
                     setView('lesson');
                   }
                 } else if (path === 'academic-full-mock') {
                   // Start an Academic full mock test
                   const academicMock = pluckRandomFullMock('academic');
                   if (academicMock && academicMock.sections && academicMock.sections.length > 0) {
                     setActiveLesson(academicMock);
                     setActiveSectionIndex(0);
                     setView('lesson');
                   }
                   } else if (path === 'mocks') {
                    // Navigate to test hub with URL change
                    if (activeTest) {
                      navigate(`/dashboard/${activeTest.id}-full-individual`);
                    }
                }
              }}
               onShowDescription={() => navigateToView('description')}
            />
          )}

          {/* EXAM DESCRIPTION VIEW */}
          {view === 'description' && (
            <ExamDescription 
              activeTest={activeTest}
            />
          )}

          {/* SKILL TESTS VIEW */}
          {view === 'skillTests' && (
            <div className="strategy-container">
              <header className="strategy-header">
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
                      navigateToView('lesson');
                    }
                  }}
                >
                  <div className="skill-icon-wrapper reading">
                    <BookOpen size={24} color="#e11d48" />
                  </div>
                  <h3>Reading</h3>
                  <p>Practice reading comprehension</p>
                  <span className="skill-xp-badge">+300 XP</span>
                </button>
                
                <button 
                  className="skill-test-card"
                  onClick={() => {
                    const exercise = pluckRandom('listening');
                    if (exercise) {
                      setActiveLesson(exercise);
                      setActiveSectionIndex(0);
                      navigateToView('lesson');
                    }
                  }}
                >
                  <div className="skill-icon-wrapper listening">
                    <Headset size={24} color="#16a34a" />
                  </div>
                  <h3>Listening</h3>
                  <p>Practice listening skills</p>
                  <span className="skill-xp-badge">+250 XP</span>
                </button>
                
                <button 
                  className="skill-test-card"
                  onClick={() => {
                    const exercise = pluckRandom('writing');
                    if (exercise) {
                      setActiveLesson(exercise);
                      setActiveSectionIndex(0);
                      navigateToView('lesson');
                    }
                  }}
                >
                  <div className="skill-icon-wrapper writing">
                    <PenTool size={24} color="#2563eb" />
                  </div>
                  <h3>Writing</h3>
                  <p>Practice writing tasks</p>
                  <span className="skill-xp-badge">+400 XP</span>
                </button>
                
                <button 
                  className="skill-test-card"
                  onClick={() => {
                    const exercise = pluckRandom('speaking');
                    if (exercise) {
                      setActiveLesson(exercise);
                      setActiveSectionIndex(0);
                      navigateToView('lesson');
                    }
                  }}
                >
                  <div className="skill-icon-wrapper speaking">
                    <Mic size={24} color="#9333ea" />
                  </div>
                  <h3>Speaking</h3>
                  <p>Practice speaking prompts</p>
                  <span className="skill-xp-badge">+350 XP</span>
                </button>
                
                <button 
                  className="skill-test-card"
                  onClick={() => {
                    const exercise = pluckRandom('vocabulary');
                    if (exercise) {
                      setActiveLesson(exercise);
                      setActiveSectionIndex(0);
                      navigateToView('lesson');
                    }
                  }}
                >
                  <div className="skill-icon-wrapper vocab">
                    <Zap size={24} color="#ea580c" />
                  </div>
                  <h3>Vocabulary</h3>
                  <p>Learn new words</p>
                  <span className="skill-xp-badge">+150 XP</span>
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
          {view === 'hub' && <SkillHub data={activeCategory} onSelectSection={handleSelectSection} />}
          {view === 'selection' && <TaskSelection section={activeSection} onSelectTask={handleStartTask} />}

          {/* THE LESSON ENGINE */}
          {view === 'lesson' && activeLesson && (
            console.log('[RENDER] Rendering lesson, activeLesson.type:', activeLesson.type, 'sections:', activeLesson.sections?.length) ||
            <div className="lesson-engine">
              {/* Use mock-flow for tests with sections/passages/parts OR mock-test types */}
              {(activeLesson.sections || activeLesson.passages || activeLesson.parts || 
               (activeLesson.type && activeLesson.type.includes('mock')) ||
               activeLesson.type === 'LISTENING' ||
               activeLesson.type === 'SPEAKING' ||
               activeLesson.type === 'WRITING' ||
               activeLesson.type === 'ielts-complex' ||
               activeLesson.type === 'reading-practice' ||
               activeLesson.type === 'full-test') ? (
                <div className="mock-flow">
                  {(() => {
                    const sections = activeLesson.sections || activeLesson.passages || [];
                    // For speaking tests with 'parts' array (full mocks), use activeLesson directly
                    // For 'ielts-complex' type reading exercises, activeLesson IS the passage
                    // Otherwise use the section at activeSectionIndex
                    // Check if we have multiple passages - if so, don't treat as single passage
                    const hasMultiplePassages = activeLesson.passages && activeLesson.passages.length > 1;
                    const isSinglePassage = !hasMultiplePassages && (activeLesson.type === 'ielts-complex' || activeLesson.type === 'READING' || activeLesson.type === 'reading' || activeLesson.type === 'reading-practice' || activeLesson.type === 'LISTENING' || activeLesson.type === 'listening' || activeLesson.type === 'WRITING' || activeLesson.type === 'writing');
                    const currentSection = (activeLesson.parts && activeLesson.parts.length > 0) 
                      ? activeLesson 
                      : isSinglePassage 
                        ? activeLesson 
                        : sections[activeSectionIndex];
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
                                  {/* Mock identifier badge */}
                                  {activeLesson.mockNumber && (
                                    <span className="mock-badge" style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      padding: '4px 10px',
                                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                      color: 'white',
                                      borderRadius: '20px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      marginRight: '12px',
                                      boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                                    }}>
                                      <span>📋</span>
                                      <span>Mock #{activeLesson.mockNumber}</span>
                                    </span>
                                  )}
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
                                
                                {/* Part tabs for current skill - only show if more than 1 section */}
                                {(() => {
                                  const currentSkill = availableSkills[activeSkillTab];
                                  const skillSections = sections.filter(s => s.skill === currentSkill);
                                  
                                  // Only show part tabs if more than 1 section exists
                                  if (skillSections.length > 1) {
                                    return (
                                      <div className="passage-tabs">
                                        {skillSections.map((s, idx) => {
                                          // Always show 'Part #' for consistent naming in mini-flows
                                          const partTitle = `Part ${idx + 1}`;
                                          const sidx = sections.findIndex(sec => sec === s);
                                          return (
                                            <button 
                                              key={idx} 
                                              onClick={() => { setActiveSectionIndex(sidx); setActivePassageIndex(0); setIsReviewMode(false); }} 
                                              className={`tab ${activeSectionIndex === sidx ? 'active' : ''} ${getPassageStatus(s) || ''}`}>
                                              {partTitle}
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
                              {/* Mock identifier badge */}
                              {activeLesson.mockNumber && (
                                <span className="mock-badge" style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '4px 10px',
                                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                  color: 'white',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  marginRight: '12px',
                                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                                }}>
                                  <span>📋</span>
                                  <span>Mock #{activeLesson.mockNumber}</span>
                                </span>
                              )}
                              {sections.map((s, idx) => (
                                <button key={idx} onClick={() => { setActiveSectionIndex(idx); setActivePassageIndex(0); setIsReviewMode(false); }} className={`section-tab ${activeSectionIndex === idx ? 'active' : ''}`}>
                                  {s.skill === 'vocab' ? '📚 Vocab' : s.skill === 'reading' ? '📖 Reading' : s.skill === 'listening' ? '🎧 Listening' : s.skill === 'writing' ? '✍️ Writing' : s.skill === 'speaking' ? '🗣️ Speaking' : s.type === 'ielts-speaking' ? '🗣️ Speaking' : s.type === 'discussion' ? '🗣️ Part 3' : s.type === 'interview' ? '🗣️ Part 1' : s.type === 'long-turn' ? '🗣️ Part 2' : s.type === 'LISTENING' ? '🎧 Listening' : s.type === 'WRITING' ? '✍️ Writing' : s.type === 'VOCAB' ? '📚 Vocab' : (s.type && (s.type.includes('reading') || s.type === 'reading-practice' || s.type.includes('ielts'))) ? '📖 Reading' : `Part ${idx + 1}`}
                                </button>
                              ))}
                            </div>
                          );
                        })()}

                        {/* Only show section header for non-self-contained blocks */}
                        {(() => {
                          // Skip header only for Vocab (they have their own internal headers)
                          // Show section header for Reading, Listening, Speaking, Writing
                          const skipHeader = currentSection.skill === 'vocab' || currentSection.type === 'VOCAB';
                          
                          if (skipHeader) {
                            return null;
                          }
                          
                          return (
                            <div className="section-header">
                              {/* Show title for all sections - use custom title, then partTitle, then "Part #" */}
                              <h2>{currentSection.title || currentSection.mockTitle || currentSection.partTitle || activeLesson.title || `Part ${activeSectionIndex + 1}`}</h2>
                              {currentSection.subtitle && (
                                <p className="subtitle">{currentSection.subtitle}</p>
                              )}
                              {currentSection.description && (
                                <p className="description">{currentSection.description}</p>
                              )}
                              {currentSection.instructions && (
                                <div className="section-instructions">
                                  {currentSection.instructions}
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {subPassages.length > 1 && (
                          <div className="passage-tabs">
                            {subPassages.map((p, idx) => (
                              <button key={idx} onClick={() => { setActivePassageIndex(idx); setIsReviewMode(false); }} className={`tab ${activePassageIndex === idx ? 'active' : ''} ${getPassageStatus(p) || ''}`}>
                                {p.title || `Part ${idx + 1}`}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Show speaking parts tabs when activeLesson has parts array - but NOT for mini tests */}
                        {activeLesson.parts && activeLesson.parts.length > 1 && !activeLesson.type?.includes('mini') && (
                          <div className="passage-tabs">
                            {activeLesson.parts.map((p, idx) => (
                              <button key={idx} onClick={() => { setActiveSectionIndex(idx); setActivePassageIndex(0); setIsReviewMode(false); }} className={`tab ${activeSectionIndex === idx ? 'active' : ''}`}>
                                {p.title || `Part ${idx + 1}`}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Check if we should use single-column layout for self-contained blocks */}
                        {(() => {
                          // Check if this section type handles its own questions internally
                          // Also check if currentSection or its passages have reading skill
                          const sectionHasReading = currentSection?.skill === 'reading' || 
                            (currentSection?.passages && currentSection.passages.some(p => p.type === 'ielts-complex'));
                          const handlesOwnQuestions = ['LISTENING', 'SPEAKING', 'WRITING', 'VOCAB', 'ielts-speaking', 'discussion', 'interview', 'long-turn', 'READING', 'reading', 'reading-practice', 'ielts-complex'].includes(currentSection.type) || currentSection.skill === 'listening' || currentSection.skill === 'speaking' || currentSection.skill === 'writing' || currentSection.skill === 'vocab' || currentSection.skill === 'reading' || sectionHasReading;
                          
                          console.log('[RENDER] currentSection.type:', currentSection.type, 'currentSection.skill:', currentSection.skill, 'handlesOwnQuestions:', handlesOwnQuestions);
                          
                          const subTasks = currentPassage?.subTasks || currentSection?.subTasks || [];
                          
                          // Render self-contained blocks directly
                          if (handlesOwnQuestions) {
                            // Check if this is a mini-test flow (combined flow)
                            const isMiniTest = activeLesson.type === 'mixed-flow';
                            
                            // For speaking tests with 'parts' array, extract the current part
                            const hasSpeakingParts = activeLesson.parts && activeLesson.parts.length > 0;
                            const currentPart = hasSpeakingParts ? activeLesson.parts[activeSectionIndex] : null;
                            
                            // For reading/writing/listening sections, include the passage data
                            // For full mocks, passages are nested in currentSection.passages
                            const currentPassage = subPassages.length > 0 ? subPassages[0] : null;
                            const taskData = currentPart 
                              ? {...activeLessonWithoutParts, ...currentPart, isMiniTest} 
                              : currentPassage
                                ? {...currentSection, ...currentPassage, isMiniTest}
                                : {...currentSection, isMiniTest};
                            
                            return (
                              <div className="workspace-grid single-column">
                                <div className="question-pane full-width">
                                  {renderQuestionBlock(taskData)}
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
                                      <SentenceCompleteBlock 
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
                  {/* Section header for reading skill tests */}
                  {(activeLesson.title || activeLesson.sourceTitle) && (
                    <div className="section-header" style={{ marginBottom: '20px' }}>
                      <h2>{activeLesson.title || activeLesson.sourceTitle}</h2>
                      {activeLesson.instructions && (
                        <p className="description">{activeLesson.instructions}</p>
                      )}
                    </div>
                  )}
                  {activeLesson.instructions && !activeLesson.title && !activeLesson.sourceTitle && (
                    <div className="lesson-instructions">
                      <div className="instructions-icon">📋</div>
                      <div className="instructions-text">{activeLesson.instructions}</div>
                    </div>
                  )}
                  {activeLesson.content && activeLesson.type !== 'token-select' && activeLesson.type !== 'heading-match' && (
                    <ReadingBlock content={activeLesson.content} />
                  )}
                  {renderQuestionBlock(activeLesson)}
                </div>
              )}
            </div>
          )}

          {/* RESULTS SCREEN */}
          {view === 'results' && <ResultScreen lesson={activeLesson} results={lessonResults} userAnswers={userAnswers} onClaim={handleFinalClaim} />}
        </div>

       
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