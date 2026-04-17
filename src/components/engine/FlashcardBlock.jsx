import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExamStore } from '../../store/useExamStore';
import { VOCAB_HUB } from '../../data/vocabulary';
import './FlashcardBlock.css';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Prioritize words by SRS status: due words first, then by level, then by review date
const prioritizeWords = (words, progress) => {
  const now = Date.now();
  return [...words].sort((a, b) => {
    const aProgress = progress[a.term];
    const bProgress = progress[b.term];
    
    // Due words first (nextReview <= now or no progress)
    const aDue = aProgress ? aProgress.nextReview <= now : true;
    const bDue = bProgress ? bProgress.nextReview <= now : true;
    
    if (aDue && !bDue) return -1;
    if (!aDue && bDue) return 1;
    
    // Among due words, lower level first (needs more practice)
    if (aDue && bDue) {
      const aLevel = aProgress?.level || 0;
      const bLevel = bProgress?.level || 0;
      return aLevel - bLevel;
    }
    
    // Among non-due words, earlier review date first
    const aReview = aProgress?.nextReview || 0;
    const bReview = bProgress?.nextReview || 0;
    return aReview - bReview;
  });
};

const FlashcardBlock = ({ 
  data, 
  onComplete,
  onNavigateToMyWords
 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipStage, setFlipStage] = useState(0);
  const updateVocabMastery = useExamStore(state => state.updateVocabMastery);
  const vocabProgress = useExamStore(state => state.vocabProgress);

  const [words, setWords] = useState([]);
  
  // Session configuration state
  const [selectedLevel, setSelectedLevel] = useState(data?.level || 'B2');
  const [selectedTopic, setSelectedTopic] = useState(data?.topic || 'Environment & Ecology');
  const [wordCount, setWordCount] = useState(data?.words?.length || 15);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SessionConfigForm = ({
    selectedLevel,
    selectedTopic,
    wordCount,
    availableTopics,
    getFilteredWords,
    sessionStarted,
    handleLevelSelect,
    handleTopicChange,
    handleWordCountChange,
    handleStartSession,
    onSessionStart
  }) => {
    const availableCount = getFilteredWords.length;
    const sliderMax = Math.max(5, Math.min(availableCount, 100));
    const sliderMin = Math.min(5, sliderMax);
    const safeSliderValue = Math.min(Math.max(wordCount, sliderMin), sliderMax);
    const isSliderDisabled = availableCount === 0;

    return (
      <>
        <h2 className="config-section-title">Session Configuration</h2>
        <div className="config-group">
          <div className="config-item">
            <label className="config-label">Target Proficiency</label>
            <div className="level-selector">
              <button 
                className={`level-btn ${selectedLevel === 'B1' ? 'active' : ''}`}
                onClick={() => handleLevelSelect('B1')}
              >
                B1 INTERMEDIATE
              </button>
              <button 
                className={`level-btn ${selectedLevel === 'B2' ? 'active' : ''}`}
                onClick={() => handleLevelSelect('B2')}
              >
                B2 GENERAL
              </button>
              <button 
                className={`level-btn ${selectedLevel === 'C1' ? 'active' : ''}`}
                onClick={() => handleLevelSelect('C1')}
              >
                C1 ADVANCED
              </button>
            </div>
          </div>

          <div className="config-item">
            <label className="config-label">Subject Domain</label>
            <select 
              className="topic-select"
              value={selectedTopic}
              onChange={handleTopicChange}
            >
              {availableTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div className="config-item">
            <div className="slider-header">
              <label className="config-label">Lexical Volume</label>
              <span className="slider-value">{safeSliderValue} Words</span>
            </div>
            <input 
              type="range" 
              className="word-slider"
              min={sliderMin}
              max={sliderMax}
              value={safeSliderValue}
              disabled={isSliderDisabled}
              onChange={handleWordCountChange}
            />
            <div className="slider-labels">
              <span>{sliderMin}</span>
              <span>{Math.floor(sliderMax / 2)}</span>
              <span>{sliderMax}</span>
            </div>
          </div>

          <button 
            className="start-session-btn"
            onClick={() => {
              handleStartSession();
              if (typeof onSessionStart === 'function') onSessionStart();
            }}
            disabled={availableCount === 0}
          >
            {sessionStarted ? 'Session Active' : 'Start Session'}
          </button>
        </div>

        <div className="protocol-section">
          <div className="protocol-header">
            <span className="protocol-dot"></span>
            <span className="protocol-label">Active Protocol</span>
          </div>
          <p className="protocol-text">
            Spaced Repetition System (SRS) enabled. Your feedback directly influences the algorithmic latency of future word presentations.
          </p>
        </div>
      </>
    );
  };

  // Get available topics from VOCAB_HUB
  const availableTopics = useMemo(() => {
    return VOCAB_HUB.categories.map(cat => cat.title);
  }, []);
  
  // Get words for selected topic and level
  const getFilteredWords = useMemo(() => {
    const category = VOCAB_HUB.categories.find(cat => cat.title === selectedTopic);
    if (!category) return [];
    
    const task = category.tasks.find(t => t.level === selectedLevel);
    if (!task) return [];
    
    return task.words || [];
  }, [selectedTopic, selectedLevel]);
  
  // Reset words when data changes or session starts
  useEffect(() => {
    if (sessionStarted) {
      const rawWords = getFilteredWords.slice(0, wordCount);
      const prioritizedWords = prioritizeWords(rawWords, vocabProgress);
      const shuffledWords = data?.isRandomMix ? shuffleArray(prioritizedWords) : prioritizedWords;
      setWords(shuffledWords);
      setCurrentIndex(0);
      setFlipStage(0);
    }
  }, [data?.id, data?.isRandomMix, sessionStarted, getFilteredWords, wordCount, vocabProgress]);
  
  // Initialize with data words if provided
  useEffect(() => {
    if (data?.words && !sessionStarted) {
      const rawWords = data.words;
      const shuffledWords = data?.isRandomMix ? shuffleArray(rawWords) : rawWords;
      setWords(shuffledWords);
      setCurrentIndex(0);
      setFlipStage(0);
    }
  }, [data?.id, data?.isRandomMix, data?.words, sessionStarted]);
  
  const currentWord = words[currentIndex];
  
  // Get level from data (each task now has one level)
  const level = sessionStarted ? selectedLevel : (data?.level || selectedLevel);
  
  // Handle level selection
  const handleLevelSelect = (newLevel) => {
    setSelectedLevel(newLevel);
  };
  
  // Handle topic selection
  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };
  
  // Handle word count change
  const handleWordCountChange = (e) => {
    setWordCount(parseInt(e.target.value, 10));
  };
  
  // Handle start session
  const handleStartSession = () => {
    setSessionStarted(true);
  };
  
  // If no words available, show message and allow completion
  if (words.length === 0) {
    return (
      <div className="invictus-flashcard-session-layout">
        <div className="flashcard-container">
          <div className="flashcard-empty">
            <h3>No vocabulary words available</h3>
            <p>This exercise needs a words array to display.</p>
            <button 
              onClick={onComplete} className="invictus-finish-btn"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCardClick = () => {
    if (flipStage === 0) {
      setFlipStage(1);
    } else if (flipStage === 1) {
      setFlipStage(2);
    }
  };

  const handleDifficulty = (level) => {
    // 1. Update store
    updateVocabMastery(currentWord.term, level);
    
    // 2. Reset flip stage for the next word
    setFlipStage(0);

    // 3. Small delay for visual feedback before moving to next word
    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    }, 300);
  };

  return (
    <div className="invictus-flashcard-session-layout">
      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Slide-in Panel */}
            <motion.aside 
              className="mobile-menu-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="mobile-menu-header">
                <h2 className="mobile-menu-title">Session Configuration</h2>
                <button 
                  className="mobile-menu-close"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="mobile-menu-content">
                <SessionConfigForm
                  selectedLevel={selectedLevel}
                  selectedTopic={selectedTopic}
                  wordCount={wordCount}
                  availableTopics={availableTopics}
                  getFilteredWords={getFilteredWords}
                  sessionStarted={sessionStarted}
                  handleLevelSelect={handleLevelSelect}
                  handleTopicChange={handleTopicChange}
                  handleWordCountChange={handleWordCountChange}
                  handleStartSession={handleStartSession}
                  onSessionStart={() => setIsMobileMenuOpen(false)}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      {/* MAIN CONTENT AREA */}
      <main className="flashcard-main-content">
        <div className="flashcard-main-content-inner">
          <div className="content-grid">
            {/* LEFT PANEL: SESSION CONFIGURATION */}
            <section className="session-config">
              <SessionConfigForm
                selectedLevel={selectedLevel}
                selectedTopic={selectedTopic}
                wordCount={wordCount}
                availableTopics={availableTopics}
                getFilteredWords={getFilteredWords}
                sessionStarted={sessionStarted}
                handleLevelSelect={handleLevelSelect}
                handleTopicChange={handleTopicChange}
                handleWordCountChange={handleWordCountChange}
                handleStartSession={handleStartSession}
              />
            </section>

            {/* CENTER PANEL: FLASHCARD ENVIRONMENT */}
            <section className="flashcard-section">
              {/* Section Title */}
              <div className="flashcard-section-header">
                <h2 className="flashcard-section-title">Vocabulary Training</h2>
                <p className="flashcard-section-subtitle">{selectedTopic} • {level} Level</p>
                <div className="flashcard-header-actions">
                  {/* My Words Button */}
                  {onNavigateToMyWords && (
                    <button 
                      className="my-words-btn"
                      onClick={onNavigateToMyWords}
                    >
                      <span className="material-symbols-outlined">book</span>
                      My Words
                    </button>
                  )}
                  {/* Mobile Menu Trigger Button */}
                  <button 
                    className="mobile-menu-trigger"
                    onClick={() => setIsMobileMenuOpen(true)}
                    aria-label="Open session configuration"
                  >
                    <span className="material-symbols-outlined">tune</span>
                  </button>
                </div>
              </div>

              {/* The Flashcard */}
              <div 
                className={`flashcard-container ${flipStage > 0 ? 'flipped' : ''}`} 
                onClick={handleCardClick}
              >
                {/* Word Counter */}
                <div className="flashcard-counter">
                  <span className="counter-text">
                    WORD {currentIndex + 1} <span className="counter-divider">OF</span> {words.length}
                  </span>
                </div>
                {/* Navigation Arrows */}
                <button
                  className="flashcard-nav-arrow flashcard-nav-prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentIndex > 0) {
                      setCurrentIndex(prev => prev - 1);
                      setFlipStage(0);
                    }
                  }}
                  disabled={currentIndex === 0}
                  aria-label="Previous card"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                
                <button
                  className="flashcard-nav-arrow flashcard-nav-next"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentIndex < words.length - 1) {
                      setCurrentIndex(prev => prev + 1);
                      setFlipStage(0);
                    }
                  }}
                  disabled={currentIndex === words.length - 1}
                  aria-label="Next card"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
                {/* Clinical Grid Sub-texture */}
                <div className="grid-texture"></div>
                
                <div className="flashcard-inner">
                  {/* Front of card */}
                  <div className="flashcard-front">
                    <h1 className="flashcard-term">{currentWord.term}</h1>
                    <div className="flashcard-divider"></div>
                    <p className="flashcard-hint">
                      Click for definition and usage examples.
                    </p>
                  </div>
                  
                  {/* Back of card */}
                  <div className="flashcard-back">
                    {flipStage === 1 && (
                      <div className="flashcard-definition">
                        <p className="definition-label">Definition</p>
                        <p className="definition-text">{currentWord.definition}</p>
                      </div>
                    )}
                    
                    {flipStage === 2 && (
                      <div className="flashcard-example-translation">
                        <div className="flashcard-example">
                          <p className="example-label">Example</p>
                          <p className="example-text">{currentWord.example}</p>
                        </div>
                        <div className="flashcard-translation">
                          <p className="translation-label">Hungarian</p>
                          <p className="translation-text">{currentWord.hu}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Accents */}
                <div className="card-accent-bottom">
                  <div className="accent-dot"></div>
                  <div className="accent-dot"></div>
                  <div className="accent-dot"></div>
                </div>
              </div>

              {/* SRS Controls */}
              <div className="srs-controls">
                <button
                  className="srs-btn recall-failure"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDifficulty('hard');
                  }}
                >
                  <span className="material-symbols-outlined srs-icon">cancel</span>
                  <span className="srs-label">Recall Failure</span>
                  <span className="srs-review-time">Review soon</span>
                </button>
                
                <button
                  className="srs-btn uncertain"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDifficulty('good');
                  }}
                >
                  <span className="material-symbols-outlined srs-icon">question_mark</span>
                  <span className="srs-label">Uncertain</span>
                  <span className="srs-review-time">Review in 2-3 days</span>
                </button>
                
                <button
                  className="srs-btn mastered"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDifficulty('easy');
                  }}
                >
                  <span className="material-symbols-outlined srs-icon">verified</span>
                  <span className="srs-label">Mastered</span>
                  <span className="srs-review-time">Review in 1 week</span>
                </button>
              </div>

            </section>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default FlashcardBlock;
