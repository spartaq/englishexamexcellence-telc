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
import ExamDescription from './components/ui/TELCExamDescription';
import VocabHub from './components/ui/VocabHub';
import MyWords from './components/ui/MyWords';
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
import { pluckRandomFullMock, pluckRandom } from './utils/mockPlucker';
import { resolvePath, resolveSection } from './utils/NavigationResolver';
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
    description: 'Build lasting vocabulary with spaced-repetition. Essential for reading comprehension.', 
    icon: <Library size={24} />, 
    hubKey: 'vocabulary',
    color: '#8b5cf6' 
  },
  { 
    id: 'drillshub', 
    title: 'Drills Hub', 
    description: 'Master grammar, reading, and writing skills that transfer beyond any test.', 
    icon: <Zap size={24} />, 
    hubKey: 'drillshub',
    color: '#f59e0b' 
  }
];


function App({ initialView, initialLevel }) {
  // ============================================================
  // CHAPTER 3: THE TEACHER'S GRADEBOOK (STATE MANAGEMENT)
  // ============================================================
  
  // Navigation State
  const [view, setView] = useState(initialView || 'telc-b2-hub');
  const [viewHistory, setViewHistory] = useState([initialView || 'telc-b2-hub']);
  const [activeTest, setActiveTest] = useState(null);       
  const [activeCategory, setActiveCategory] = useState(null); 
  const [activeSection, setActiveSection] = useState(null);   
  const [activeLesson, setActiveLesson] = useState(null);     
  const [activePassageIndex, setActivePassageIndex] = useState(0); 
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeSkillTab, setActiveSkillTab] = useState(0); // For unified skill tabs: Vocab(mini), Reading, Writing, Speaking, Listening
  const [showPaywall, setShowPaywall] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
   const [lessonOrigin, setLessonOrigin] = useState(null); // Track which hub the lesson was started from
   const [selectedVocabLevel, setSelectedVocabLevel] = useState(
     initialLevel ? initialLevel.toUpperCase() : null
   ); // For level-filtered VocabHub (B1/B2/C1)
   const [selectedDrillLevel, setSelectedDrillLevel] = useState(
     initialLevel ? initialLevel.toUpperCase() : null
   ); // For level-filtered DrillsHub (B1/B2/C1)

  // Learning & Result State (moved before handleUpdateAnswer)
  const [userAnswers, setUserAnswers] = useState({});
  const [lessonResults, setLessonResults] = useState({ accuracy: 0, earnedXP: 0, isPerfect: false });
  const [isReviewMode, setIsReviewMode] = useState(false);    

  // Loading effect - set loading to false after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

   // Sync initialLevel prop to selectedVocabLevel state (on route changes)
   useEffect(() => {
     if (initialLevel !== undefined && initialLevel !== selectedVocabLevel) {
       setSelectedVocabLevel(initialLevel ? initialLevel.toUpperCase() : null);
     }
   }, [initialLevel, selectedVocabLevel]);

   // Sync initialLevel prop to selectedDrillLevel state (on route changes)
   useEffect(() => {
     if (initialLevel !== undefined && initialLevel !== selectedDrillLevel) {
       setSelectedDrillLevel(initialLevel ? initialLevel.toUpperCase() : null);
     }
   }, [initialLevel, selectedDrillLevel]);

  // handle update answer
  const handleUpdateAnswer = useCallback((qId, val) => {
    setUserAnswers(prev => ({ ...prev, [qId]: val }));
  }, []);

  // Helper to set view with history tracking
  const navigateToView = (newView) => {
    if (newView !== view) {
      setViewHistory(prev => [...prev, newView]);
      setView(newView);
      setCurrentView(newView); // Update Zustand store for ScrollToTop
    }
  };

// Helper to go back to previous view
  const navigateBack = () => {
    console.log('[navigateBack] view:', view, 'lessonOrigin:', lessonOrigin, 'viewHistory:', viewHistory);
    
    // Determine if we're currently in Vocab Hub (with a level selected)
    const isVocabHub = activeCategory?.title === 'Vocab Lab';

    // If we have history with more than just 'lesson' entries, find the first non-lesson view
    if (viewHistory.length > 1) {
      let newHistory = [...viewHistory];
      newHistory.pop(); // Remove current view

      // Skip backwards over any 'lesson' entries to find the actual hub
      let previousView = newHistory[newHistory.length - 1];
      while (newHistory.length > 1 && previousView === 'lesson') {
        newHistory.pop();
        previousView = newHistory[newHistory.length - 1];
      }

      console.log('[navigateBack] going to previousView:', previousView);
      setViewHistory(newHistory);
      setView(previousView);
      setCurrentView(previousView);

      // Handle special case - clean up lesson state when going back from results
      if (previousView !== 'lesson' && view === 'results') {
        setActiveLesson(null);
      }

      // Update URL based on previous view + check if coming from Vocab Hub (stored in activeCategory)
      if (previousView === 'landing') {
        navigate('/telc/b2');
      } else if (previousView === 'telc-b2-hub') {
        navigate('/telc/b2');
      } else if (previousView === 'telc-b1-hub') {
        navigate('/telc/b1');
      } else if (previousView === 'telc-c1-hub') {
        navigate('/telc/c1');
      } else if (previousView === 'drillsHub') {
        // If coming from Vocab Hub, go to /telc/vocabulary, else go to /telc/drillshub
        if (isVocabHub) {
          navigate('/telc/vocabulary');
        } else {
          navigate('/telc/drillshub');
        }
      } else if (previousView === 'selection') {
        navigate('/telc/b2');
      } else if (previousView === 'mywords') {
        navigate('/telc/mywords');
      }
      return;
    }

    // No history (single-entry viewHistory, e.g. directly navigating to drillsHub view)
    // Use activeCategory to determine the correct back destination
    if (view === 'drillsHub' || view === 'selection') {
      if (isVocabHub) {
        navigate('/telc/vocabulary');
      } else {
        navigate('/telc/drillshub');
      }
      return;
    }

    // Use lessonOrigin or go to default
    if (lessonOrigin) {
      console.log('[navigateBack] no history, using lessonOrigin:', lessonOrigin);

      if (lessonOrigin === 'telc-b1-hub') {
        navigate('/telc/b1');
      } else if (lessonOrigin === 'telc-b2-hub') {
        navigate('/telc/b2');
      } else if (lessonOrigin === 'telc-c1-hub') {
        navigate('/telc/c1');
      } else if (lessonOrigin === 'drillsHub') {
        // If coming from Vocab Hub, go to /telc/vocabulary, else go to /telc/drillshub
        if (isVocabHub) {
          navigate('/telc/vocabulary');
        } else {
          navigate('/telc/drillshub');
        }
      } else if (lessonOrigin === 'skillTests') {
        navigate('/telc/b2');
      } else {
        navigate('/telc/b2');
      }
      setLessonOrigin(null);
      setActiveLesson(null);
    } else {
      // If we're at the root view or directly accessed, go to telc-b2-hub
      setView('telc-b2-hub');
      setCurrentView('telc-b2-hub');
      navigate('/telc/b2');
    }
  };

  // Router Navigate
  const navigate = useNavigate();
  
  // Complex Interaction State
  // Note: gapFillSelections, headingSelections, and mcqSelections are no longer needed
  // as the Engine now uses handleUpdateAnswer (useCallback) with userAnswers as the single source of truth

  // Global Store Connections
  const claimXp = useExamStore(state => state.claimXp);
  const isPremium = useExamStore(state => state.isPremium);
  const setCurrentView = useExamStore(state => state.setCurrentView); 
    
  // Effort Tracking Hooks
  const isUserInApp = view !== 'landing';
  useActive(isUserInApp); 
  useXP(isUserInApp);
  
    // Effect to handle initial view (routing)
    useEffect(() => {
      // Use NavigationResolver to determine the navigation plan
      const plan = resolvePath(initialView);

      // Preserve the existing view history when navigating to drillsHub (shared view for vocab/drills hubs).
      // Without this, the history gets reset to just ['drillsHub'], causing the back button to fall through
      // to the default B2 hub instead of the correct previous hub.
      if (plan.view === 'drillsHub') {
        setViewHistory(prev => {
          const lastEntry = prev[prev.length - 1];
          // If already on drillsHub, just keep existing history (e.g., switching between vocab/drills levels)
          if (lastEntry === 'drillsHub') return prev;
          // If the last entry is a valid hub, append drillsHub so back navigation works
          const validHubs = ['telc-b1-hub', 'telc-b2-hub', 'telc-c1-hub', 'drillsHub', 'landing'];
          if (validHubs.includes(lastEntry)) {
            return [...prev, 'drillsHub'];
          }
          // Otherwise (direct URL access), replace with a default hub + drillsHub
          return ['telc-b2-hub', 'drillsHub'];
        });
      } else {
        setViewHistory(plan.viewHistory);
      }

      // Apply the rest of the plan to the states
      setView(plan.view);
      setActiveCategory(plan.activeCategory);
      setActiveSection(plan.activeSection);
      // Handle vocab level from context (for /telc/vocabulary/b2 etc)
      if (plan.context?.vocabLevel) {
        setSelectedVocabLevel(plan.context.vocabLevel);
      }
      // Handle drill level from context (for /telc/drillshub/b2 etc)
      if (plan.context?.drillLevel) {
        setSelectedDrillLevel(plan.context.drillLevel);
      }
      setCurrentView(plan.view); // Update Zustand store for ScrollToTop

      // Handle triggerTask if present
      if (plan.triggerTask) {
        handleStartTask(plan.triggerTask);
      }

      // Handle triggerFullTest if present
      if (plan.triggerFullTest) {
        handleFullTestSelection(plan.triggerFullTest.testType, plan.triggerFullTest.path);
      }
    }, [initialView]);

  // Layout logic for specialized views
  // Note: All skill types removed from isHighFocus to show sidebar for all exercises if && view !== 'lesson' is not present
  const isHighFocus = false;
  const showSidebar = !isHighFocus && view !== 'results' && view !== 'landing' && view !== 'lesson';
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
    const { results, telcScore } = checkAnswers(drillAnswers);
    
    // 2. Combine results with TELC score if it exists
    const finalResults = telcScore ? { ...results, telcScore } : results;

    // 3. Save to state and enter review mode
    setLessonResults(finalResults);
    setIsReviewMode(prev => !prev); // Toggle Review Mode
  };

  // ============================================================
  // CHAPTER 5: THE HALLWAYS (NAVIGATION HANDLERS)
  // ============================================================
  const handleGetStarted = () => navigateToView('landing');

   // Handler to select a section (used by DrillsHub, VocabHub)
   const handleSelectSection = (section) => {
     if (!section) return;

     console.log('[handleSelectSection] Selecting section:', section);

     // Use the Resolver to figure out the navigation plan
     const plan = resolveSection(section, activeCategory);

     if (plan) {
       navigateToView(plan.view);
       setActiveCategory(plan.activeCategory);
       setActiveSection(plan.activeSection);
       setCurrentView(plan.view);

       // Handle triggerTask if present (start the lesson)
       if (plan.triggerTask) {
         handleStartTask(plan.triggerTask);
       }
     }
   };

   const handleSelectModule = (hubKey, level = null) => {
     const basePath = `/telc/${hubKey.replaceAll('_', '-')}`;
     const path = level ? `${basePath}/${level.toLowerCase()}` : basePath;
     navigate(path);
   };

   const handleNavigateToMyWords = () => {
     setSelectedVocabLevel(null);
     navigateToView('mywords');
   };

    const handleBackFromMyWords = () => {
      // Use standard back navigation which handles history and URL sync
      navigateBack();
    };

   const handleNavigateToLevel = (level) => {
     const upperLevel = level.toUpperCase();
     setSelectedVocabLevel(upperLevel);
     navigate(`/telc/vocabulary/${level.toLowerCase()}`);
   };

   const handleNavigateToDrillLevel = (level) => {
     const upperLevel = level.toUpperCase();
     setSelectedDrillLevel(upperLevel);
     navigate(`/telc/drillshub/${level.toLowerCase()}`);
   };

   const handleNavigateToLevelSelector = () => {
     setSelectedVocabLevel(null);
     navigate('/telc/vocabulary');
   };

   const handleNavigateToDrillLevelSelector = () => {
     setSelectedDrillLevel(null);
     navigate('/telc/drillshub');
   };
  
  // Handler to start a task/exercise (used by BrandTestHub, DrillsHub, TaskSelection)
  const handleStartTask = (taskMetadata) => {
    if (!taskMetadata || !taskMetadata.id) {
      console.error('[handleStartTask] Invalid taskMetadata:', taskMetadata);
      return;
    }
    
    console.log('[handleStartTask] Creating lesson for:', taskMetadata.id);
    
    // Use LessonFactory to create the lesson from task metadata
    const lesson = LessonFactory.create(taskMetadata);
    
    if (lesson) {
      // Track origin for proper back navigation
      console.log('[handleStartTask] Setting lessonOrigin to:', view);
      setLessonOrigin(view);
      setActiveLesson(lesson);
      setActiveSectionIndex(0);
      setActiveSkillTab(0);
      navigateToView('lesson');
    } else {
      console.error('[handleStartTask] Failed to create lesson for:', taskMetadata.id);
    }
  };
  
  
  // Helper function to start a full test (used by routes and onSelectPath)
  const handleFullTestSelection = (testType, path = null) => {
    // The Factory handles all the path parsing and formatting
    const fullMock = LessonFactory.prepareFullTest(testType, path);
    
    if (fullMock) {
      // Track origin for proper back navigation
      console.log('[handleFullTestSelection] Setting lessonOrigin to:', view);
      setLessonOrigin(view);
      setActiveLesson(fullMock);
      setActiveSectionIndex(0);
      setActiveSkillTab(0);
      navigateToView('lesson');
    }
  };

  const handleFinishLesson = () => navigateToView('results');

  const handleFinalClaim = () => {
    claimXp(lessonResults.earnedXP || activeLesson.xpReward || activeLesson.xp || 0);
    // Use lessonOrigin to go back to the correct hub
    const targetHub = lessonOrigin || 'telc-b2-hub';
    const isVocabHub = activeCategory?.title === 'Vocab Lab';
    setActiveLesson(null);
    setLessonOrigin(null);

    // Navigate to the appropriate hub
    if (targetHub === 'telc-b1-hub') {
      navigate('/telc/b1');
    } else if (targetHub === 'telc-b2-hub') {
      navigate('/telc/b2');
    } else if (targetHub === 'telc-c1-hub') {
      navigate('/telc/c1');
    } else if (targetHub === 'drillsHub') {
      if (isVocabHub) {
        navigate('/telc/vocabulary');
      } else {
        navigate('/telc/drillshub');
      }
    } else {
      navigate('/telc/b2');
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
    <div className={`invictus-app-shell ${isHighFocus ? 'high-focus-layout' : ''} ${!showSidebar ? 'no-sidebar' : ''}`}>
      <ScrollToTop />
      
      <AppShell
        view={view}
        activeTest={activeTest}
        showSidebar={showSidebar}
        showHeader={showHeader}
        onNavigateBack={() => {
          // Check if we're coming from mini test results before clearing state
          if (view === 'results' && activeLesson) {
            const isMiniTest = (activeLesson.type === 'mixed-flow' && 
                               activeLesson.title && 
                               activeLesson.title.endsWith('Mini Test')) ||
                              (activeLesson.id && 
                               activeLesson.id.startsWith('mini-test-full-'));
                            
            if (isMiniTest) {
              console.log('[navigateBack] Detected mini test results, navigating to landing page');
              navigate('/');
              // Don't call setActiveLesson(null) or navigateBack() for mini tests
              // to avoid intermediate blank page
              return;
            }
          }
          
          // Otherwise, proceed with normal back navigation
          setActiveLesson(null);
          navigateBack();
        }}
        onNavigateToView={navigateToView}
        headerCenterContent={headerCenterContent}
        setActiveTest={setActiveTest}
         onNavigateToMyWords={handleNavigateToMyWords}
      >
        <main className="invictus-main-content">
          <div className="invictus-main-container workspace-container style-scrollbar">

                   {/* TELC B1 HUB VIEW */}
          {view === 'telc-b1-hub' && (
            <BrandTestHub 
              activeTest={{ title: 'TELC B1' }}
              level="b1"
              EXTRA_TOOLS={EXTRA_TOOLS}
              onSelectModule={handleSelectModule}
              onOpenPaywall={() => setShowPaywall(true)}
              onSelectPath={(path, skill) => {
                if (path && path.includes('single-exercise')) {
                  handleStartTask({ id: path, skill });
                } else if (path && path.startsWith('telc-')) {
                  handleFullTestSelection(path.split('-')[1], path);
                } else if (path === 'skill-tests') {
                  navigateToView('skillTests');
                } else {
                  handleStartTask({ id: path, skill });
                }
              }}
              onStartSkill={(skill, level) => {
                console.log('[onStartSkill] skill:', skill, 'level:', level);
                const exercise = pluckRandom(skill, level);
                console.log('[onStartSkill] exercise:', exercise?.id, exercise?.title, 'type:', exercise?.type);
                if (exercise) {
                  setLessonOrigin('telc-b1-hub');
                  setActiveLesson({ ...exercise, lessonOrigin: { source: 'telc-b1-hub', skill, level } });
                  setActiveSectionIndex(0);
                  navigateToView('lesson');
                }
              }}
              onShowDescription={() => navigateToView('description')}
            />
          )}

          {/* TELC B2 HUB VIEW */}
          {view === 'telc-b2-hub' && (
            <BrandTestHub 
              activeTest={{ title: 'TELC B2' }}
              level="b2"
              EXTRA_TOOLS={EXTRA_TOOLS}
              onSelectModule={handleSelectModule}
              onOpenPaywall={() => setShowPaywall(true)}
              onSelectPath={(path, skill) => {
                if (path && path.includes('single-exercise')) {
                  handleStartTask({ id: path, skill });
                } else if (path && path.startsWith('telc-')) {
                  handleFullTestSelection(path.split('-')[1], path);
                } else if (path === 'skill-tests') {
                  navigateToView('skillTests');
                } else {
                  handleStartTask({ id: path, skill });
                }
              }}
              onStartSkill={(skill, level) => {
                const exercise = pluckRandom(skill, level);
                if (exercise) {
                  setLessonOrigin('telc-b2-hub');
                  setActiveLesson({ ...exercise, lessonOrigin: { source: 'telc-b2-hub', skill, level } });
                  setActiveSectionIndex(0);
                  navigateToView('lesson');
                }
              }}
              onShowDescription={() => navigateToView('description')}
            />
          )}

          {/* TELC C1 HUB VIEW */}
          {view === 'telc-c1-hub' && (
            <BrandTestHub 
              activeTest={{ title: 'TELC C1' }}
              level="c1"
              EXTRA_TOOLS={EXTRA_TOOLS}
              onSelectModule={handleSelectModule}
              onOpenPaywall={() => setShowPaywall(true)}
              onSelectPath={(path, skill) => {
                if (path && path.includes('single-exercise')) {
                  handleStartTask({ id: path, skill });
                } else if (path && path.startsWith('telc-')) {
                  handleFullTestSelection(path.split('-')[1], path);
                } else if (path === 'skill-tests') {
                  navigateToView('skillTests');
                } else {
                  handleStartTask({ id: path, skill });
                }
              }}
              onStartSkill={(skill, level) => {
                const exercise = pluckRandom(skill, level);
                if (exercise) {
                  setActiveLesson(exercise);
                  setActiveSectionIndex(0);
                  navigateToView('lesson');
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
            <div className="telc-hub-container">
              <header className="telc-hub-header">
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

                <button 
                  className="skill-test-card"
                  onClick={() => {
                    const exercise = pluckRandom('language-elements');
                    if (exercise) {
                      setActiveLesson(exercise);
                      setActiveSectionIndex(0);
                      navigateToView('lesson');
                    }
                  }}
                >
                  <div className="skill-icon-wrapper language-elements">
                    <Zap size={24} color="#0891b2" />
                  </div>
                  <h3>Language Elements</h3>
                  <p>Practice grammar & vocab</p>
                  <span className="skill-xp-badge">+200 XP</span>
                </button>
              </div>
            </div>
          )}

            {/* DYNAMIC HUB & SELECTION */}
{view === 'drillsHub' && activeCategory?.title === 'Drills Hub' && <DrillsHub
                 data={activeCategory}
                 selectedLevel={selectedDrillLevel}
                 onSelectSection={handleSelectSection}
                 onStartTask={handleStartTask}
                 onNavigateToLevelSelector={handleNavigateToDrillLevelSelector}
                 onNavigateToLevel={handleNavigateToDrillLevel}
               />}
             {view === 'drillsHub' && activeCategory?.title !== 'Drills Hub' && (
               <VocabHub
                 data={activeCategory}
                 selectedLevel={selectedVocabLevel}
                 onSelectSection={handleSelectSection}
                 onNavigateToMyWords={handleNavigateToMyWords}
                 onNavigateToLevelSelector={handleNavigateToLevelSelector}
                 onNavigateToLevel={handleNavigateToLevel}
               />
             )}
            {view === 'mywords' && <MyWords onBack={handleBackFromMyWords} />}
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
      setActiveSkillTab={setActiveSkillTab}
      availableSkills={activeLesson?.sections?.map(s => s.skill).filter(Boolean) || []}
      onNavigateToMyWords={() => navigateToView('mywords')}
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
