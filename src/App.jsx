import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/globals.css';
import './App.css';

// ============================================================
// CHAPTER 1: THE TEACHER'S TOOLS (IMPORTS & ASSETS)
// ============================================================
import { 
  BookOpen, 
  Mic, Headset, PenTool,
  Zap, Library, RefreshCw
} from 'lucide-react';
// Navigation & Structure Components
import BrandTestHub from './components/ui/BrandTestHub';
import ExamDescription from './components/ui/IELTSExamDescription';
import VocabHub from './components/ui/VocabHub';
import DrillsHub from './components/ui/DrillsHub';
import TaskSelection from './components/ui/TaskSelection';

import ResultScreen from './components/engine/ResultScreen'; 

// The Training Blocks (Engine Components)
import Engine from './components/engine/Engine';
import useCheckAnswers from './components/engine/useCheckAnswers';

// Behind-the-Scenes (Data, Hooks & Utilities)
import { useActive } from './hooks/useActive';
import { useXP } from './hooks/useXP';
import { useExamStore } from './store/useExamStore';
import ScrollToTop from './scrollToTop';
import { pluckRandom, pluckRandomFullMock, findVocabFromReading, pluckSingleSpeakingPart } from './utils/mockPlucker';
import { resolvePath, resolveSection } from './utils/NavigationResolver';
import { getMockById } from './data/IELTS/mocks';
import { LessonFactory } from './utils/LessonFactory';

// Layout Shell Components
import AppShell from './components/ui/AppShell';
import LessonHeaderTabs from './components/ui/LessonHeaderTabs';

// ============================================================
// CHAPTER 2: 
// ============================================================

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
  const [view, setView] = useState(initialView || 'ieltsHub');
  const [viewHistory, setViewHistory] = useState([initialView || 'ieltsHub']);
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

  // handle update answer
const handleUpdateAnswer = useCallback((qId, val) => {
  setUserAnswers(prev => ({ ...prev, [qId]: val }));
}, []);

  // Helper to set view with history tracking
  const navigateToView = (newView) => {
    if (newView !== view) {
      setViewHistory(prev => [...prev, newView]);
      setView(newView);
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
      if (previousView === 'landing') {
        navigate('/ielts');
      } else if (previousView === 'ieltsHub') {
        navigate('/ielts');
      } else if (previousView === 'drillsHub') {
        navigate('/ielts');
      } else if (previousView === 'selection') {
        navigate('/ielts');
      }
    } else {
      // If we're at the root view or directly accessed, go to ieltsHub
      setView('ieltsHub');
      navigate('/ielts');
    }
  };      

  // Learning & Result State
  const [userAnswers, setUserAnswers] = useState({});
  const [lessonResults, setLessonResults] = useState({ accuracy: 0, earnedXP: 0, isPerfect: false });
  const [isReviewMode, setIsReviewMode] = useState(false);    

  // Router Navigate
  const navigate = useNavigate();
  
  // Complex Interaction State
  // Note: gapFillSelections, headingSelections, and mcqSelections are no longer needed
  // as the Engine now uses handleUpdateAnswer (useCallback) with userAnswers as the single source of truth

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
    
    // Use NavigationResolver to determine the navigation plan
    const plan = resolvePath(initialView);
    
    // Apply the plan to the states
    setView(plan.view);
    setViewHistory(plan.viewHistory);
    setActiveCategory(plan.activeCategory);
    setActiveSection(plan.activeSection);
    
    // If the plan contains a triggerTask, call handleStartTask
    if (plan.triggerTask) {
      handleStartTask(plan.triggerTask);
    }
  }, [initialView]);     

  // Layout logic for specialized views
  // Note: All skill types removed from isHighFocus to show sidebar for all exercises
  const isHighFocus = false;
  const showSidebar = !isHighFocus && view !== 'results' && view !== 'landing';
  const showHeader = view !== 'results' && view !== 'landing';


  
  // ============================================================
  // CHAPTER 4: THE GRADING MACHINE
  // ============================================================
  
  // Initialize the hook
  const { checkAnswers, getPassageStatus } = useCheckAnswers({
    activeLesson,
    activeSectionIndex,
    activePassageIndex,
    userAnswers,
    activeTest,
  });

  // The orchestrator that handles the click event
  const handleCheckAnswers = (drillAnswers = null) => {
    // 1. Get the math from the hook
    const { results, ieltsScore } = checkAnswers(drillAnswers);
    
    // 2. Combine results with IELTS score if it exists
    const finalResults = ieltsScore ? { ...results, ieltsScore } : results;

    // 3. Save to state and enter review mode
    setLessonResults(finalResults);
    setIsReviewMode(prev => !prev); // Toggle Review Mode
  };

  // ============================================================
  // CHAPTER 5: THE HALLWAYS (NAVIGATION HANDLERS)
  // ============================================================
  const handleGetStarted = () => navigateToView('landing');

  const handleSelectModule = (hubKey) => {
    console.log('handleSelectModule called with', hubKey);
    
    // Simply navigate to the route - let the Resolver handle state updates
    const hubPath = `/ielts/${hubKey.replaceAll('_', '-')}`;
    console.log('navigating to', hubPath);
    navigate(hubPath);
  };

  
  // Helper function to start a full test (used by routes and onSelectPath)
  const handleFullTestSelection = (testType, path = null) => {
    // The Factory handles all the path parsing and formatting
    const fullMock = LessonFactory.prepareFullTest(testType, path);
    
    if (fullMock) {
      setActiveLesson(fullMock);
      setActiveSectionIndex(0);
      setActiveSkillTab(0);
      setView('lesson');
    } else {
      console.error("Could not resolve full mock for:", testType, path);
    }
  };

   const handleSelectSection = (section) => {
     console.log('handleSelectSection called with:', section);
     
     // Use NavigationResolver to determine the navigation plan
     const plan = resolveSection(section, activeCategory);
     
     // Apply the plan to the states
     setView(plan.view);
     setViewHistory(plan.viewHistory);
     setActiveCategory(plan.activeCategory);
     setActiveSection(plan.activeSection);
     
     // If the plan contains a triggerTask, call handleStartTask
     if (plan.triggerTask) {
       handleStartTask(plan.triggerTask);
     }
  };

  const handleStartTask = (taskMetadata) => {
    // 1. Check Permissions
    if (taskMetadata.tier !== 'bronze' && !isPremium) { 
      setShowPaywall(true); 
      return; 
    }
    
    // 2. Clear previous session state
    setUserAnswers({});
    setIsReviewMode(false);
    setActiveSectionIndex(0);
    setActivePassageIndex(0);

    // 3. Prepare the Lesson using the Factory
    const preparedLesson = LessonFactory.create(taskMetadata);

    if (preparedLesson) {
      setActiveLesson(preparedLesson);
      setView('lesson'); // Navigate to Engine
    } else {
      console.error("Failed to prepare lesson", taskMetadata);
    }
  };

  const handleFinishLesson = () => navigateToView('results');

  const handleFinalClaim = () => {
    claimXp(lessonResults.earnedXP || activeLesson.xpReward || activeLesson.xp || 0);
    navigateToView('ieltsHub');
    setActiveLesson(null);
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
        background: 'var(--bg-app)',
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

  // Prepare header center content with LessonHeaderTabs
  const headerCenterContent = view === 'lesson' && activeLesson ? (
    <LessonHeaderTabs
      activeLesson={activeLesson}
      activeSectionIndex={activeSectionIndex}
      activeSkillTab={activeSkillTab}
      setActiveSectionIndex={setActiveSectionIndex}
      setActiveSkillTab={setActiveSkillTab}
      setIsReviewMode={setIsReviewMode}
      setActivePassageIndex={setActivePassageIndex}
    />
  ) : null;

  return (
    <div className={`invictus-app-shell ${isHighFocus ? 'high-focus-layout' : ''}`}>
      <ScrollToTop />
      
      <AppShell
        view={view}
        activeTest={activeTest}
        showSidebar={showSidebar}
        showHeader={showHeader}
        onNavigateBack={() => {
          setActiveLesson(null);
          navigateBack();
        }}
        onNavigateToView={navigateToView}
        headerCenterContent={headerCenterContent}
        setActiveTest={setActiveTest}
      >
        <main className="invictus-main-content">
          <div className="invictus-engine-container workspace-container">

         

          {/* IELTSHUB VIEW - Uses BrandTestHub */}
          {view === 'ieltsHub' && (
            <BrandTestHub 
              activeTest={activeTest}
              EXTRA_TOOLS={EXTRA_TOOLS}
              onSelectModule={handleSelectModule}
              onOpenPaywall={() => setShowPaywall(true)}
              onSelectPath={(path, skill) => {
                console.log('[onSelectPath - ieltsHub] Received path:', path, 'skill:', skill);
                // Check if path is a mock ID (e.g., 'ielts-general-mock-1' or 'ielts-academic-mock-1')
                if (path && path.startsWith('ielts-general-mock-')) {
                  console.log('[onSelectPath - ieltsHub] Detected general mock ID, calling handleFullTestSelection');
                  handleFullTestSelection('general-full-mock', path);
                } else if (path && path.startsWith('ielts-academic-mock-')) {
                  console.log('[onSelectPath - ieltsHub] Detected academic mock ID, calling handleFullTestSelection');
                  handleFullTestSelection('academic-full-mock', path);
                } else if (path === 'ielts-general-mini-test') {
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
                   } else if (path.startsWith('ielts-general-full-test-')) {
                     // Start a General Training full test (from BrandTestHub) with specific mock ID
                     const mockId = path.replace('ielts-general-full-test-', '');
                     const specificMock = getMockById(mockId);
                     const generalMock = specificMock || pluckRandomFullMock('general');
                     if (generalMock && generalMock.sections && generalMock.sections.length > 0) {
                       setActiveLesson(generalMock);
                       setActiveSectionIndex(0);
                       setView('lesson');
                     }
                   } else if (path.startsWith('ielts-academic-full-test-')) {
                     // Start an Academic full test (from BrandTestHub) with specific mock ID
                     const mockId = path.replace('ielts-academic-full-test-', '');
                     const specificMock = getMockById(mockId);
                     const academicMock = specificMock || pluckRandomFullMock('academic');
                     if (academicMock && academicMock.sections && academicMock.sections.length > 0) {
                       setActiveLesson(academicMock);
                       setActiveSectionIndex(0);
                       setView('lesson');
                     }
                  } else if (path === 'mocks') {
                    // Navigate to test hub with URL change
                    if (activeTest) {
                      navigate(`/ielts/${activeTest.id}-full-individual`);
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

           {/* DYNAMIC HUB & SELECTION */}
          {view === 'drillsHub' && activeCategory?.title === 'Drills Hub' && <DrillsHub data={activeCategory} onSelectSection={handleSelectSection} onStartTask={handleStartTask} />}
          {view === 'drillsHub' && activeCategory?.title !== 'Drills Hub' && <VocabHub data={activeCategory} onSelectSection={handleSelectSection} />}
          {view === 'selection' && <TaskSelection section={activeSection} onSelectTask={handleStartTask} />}

          {/* THE LESSON ENGINE */}
{view === 'lesson' && activeLesson && (
  <div className="lesson-engine">
    {/* 
       The Engine now handles 'ielts-complex', 'reading', 'listening', etc. 
       We just pass it the activeLesson and let it work.
    */}
    <Engine 
      activeLesson={activeLesson}
      activeSectionIndex={activeSectionIndex}
      activePassageIndex={activePassageIndex}
      userAnswers={userAnswers}
      onUpdateAnswers={handleUpdateAnswer} // This uses the bridge function we added
      onCheckAnswers={handleCheckAnswers}
      isReviewMode={isReviewMode}
      availableSections={activeLesson?.sections || []}
      activeSkillTab={activeSkillTab}
      setActiveSectionIndex={setActiveSectionIndex}
      setActivePassageIndex={setActivePassageIndex}
      setIsReviewMode={setIsReviewMode}
      availableSkills={activeLesson?.sections?.map(s => s.skill).filter(Boolean) || []}
    />
  </div>
)}

          {/* RESULTS SCREEN */}
          {view === 'results' && <ResultScreen lesson={activeLesson} results={lessonResults} userAnswers={userAnswers} onClaim={handleFinalClaim} activeSectionIndex={activeSectionIndex} activePassageIndex={activePassageIndex} />}
        </div>
      </main>
      </AppShell>
    </div>
  );
}

export default App;