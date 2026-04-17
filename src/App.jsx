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
      const isVocabHub = activeCategory?.title === 'Vocab Lab';
      
      // Update URL based on previous view
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
    
    // No history, use lessonOrigin or go to default
    if (lessonOrigin) {
      console.log('[navigateBack] no history, using lessonOrigin:', lessonOrigin);
      // Check if coming from Vocab Hub (stored in activeCategory)
      const isVocabHub = activeCategory?.title === 'Vocab Lab';
      
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
    
    // Apply the plan to the states
    setView(plan.view);
    setViewHistory(plan.viewHistory);
    setActiveCategory(plan.activeCategory);
    setActiveSection(plan.activeSection);
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

  const handleSelectModule = (hubKey) => {
    // Simply navigate to the route - let the Resolver handle state updates
    const hubPath = `/telc/${hubKey.replaceAll('_', '-')}`;
    navigate(hubPath);
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
      navigate('/telc/drillshub');
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
          setActiveLesson(null);
          navigateBack();
        }}
        onNavigateToView={navigateToView}
        headerCenterContent={headerCenterContent}
        setActiveTest={setActiveTest}
        onNavigateToMyWords={() => navigateToView('mywords')}
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
                  setActiveLesson(exercise);
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
                  setActiveLesson(exercise);
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
          {view === 'drillsHub' && activeCategory?.title === 'Drills Hub' && <DrillsHub data={activeCategory} onSelectSection={handleSelectSection} onStartTask={handleStartTask} />}
          {view === 'drillsHub' && activeCategory?.title !== 'Drills Hub' && <VocabHub data={activeCategory} onSelectSection={handleSelectSection} onNavigateToMyWords={() => navigateToView('mywords')} />}
          {view === 'mywords' && <MyWords onBack={() => navigateToView('drillsHub')} />}
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
