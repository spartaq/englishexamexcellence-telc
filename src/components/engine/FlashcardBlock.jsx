import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useExamStore } from '../../store/useExamStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

const getWordsForSelection = (topic, level) => {
  if (topic === 'All Topics' || topic === 'Due Words') return [];

  const category = VOCAB_HUB.categories.find(cat => cat.title === topic);
  if (!category) return [];
  
  const task = category.tasks.find(t => t.level === level);
  if (!task) return [];
  
  return task.words || [];
};

const getAllWordsForLevel = (level) => {
  return VOCAB_HUB.categories.flatMap(category => {
    const task = (category.tasks || []).find(t => t.level === level);
    return task?.words || [];
  });
};

const FlashcardBlock = ({ 
   data, 
   showFilters = true,
   onComplete,
   onNavigateToMyWords,
   sections = [],
   activeSectionIndex = 0,
   setActiveSectionIndex,
   setActivePassageIndex,
   setIsReviewMode,
   setActiveSkillTab,
   availableSkills = [],
 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionOffset, setSessionOffset] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const updateVocabMastery = useExamStore(state => state.updateVocabMastery);
  const vocabProgress = useExamStore(state => state.vocabProgress);

  const initialWords = useMemo(() => data?.words || data?.questions || [], [data?.words, data?.questions]);
  const initialTopic = data?.topic || data?.categoryTitle || 'All Topics';
  const initialLevel = data?.level || 'B1';

  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);

  const availableTopics = useMemo(() => {
    return VOCAB_HUB.categories.map(cat => cat.title);
  }, []);

  const getFilteredWords = useMemo(() => {
    return getWordsForSelection(selectedTopic, selectedLevel);
  }, [selectedTopic, selectedLevel]);

  const allTopicWords = useMemo(() => {
    return getAllWordsForLevel(selectedLevel);
  }, [selectedLevel]);

  const shouldUseInitialWords = !showFilters || selectedTopic === 'Due Words';

  const sourceWords = shouldUseInitialWords
    ? initialWords
    : selectedTopic === 'All Topics'
      ? allTopicWords
      : getFilteredWords;

  const prepareWords = useCallback((wordsToPrepare) => {
    const prioritizedWords = prioritizeWords(wordsToPrepare, vocabProgress);
    return data?.isRandomMix
      ? shuffleArray(prioritizedWords)
      : prioritizedWords;
  }, [data?.isRandomMix, vocabProgress]);

  const words = useMemo(() => prepareWords(sourceWords), [prepareWords, sourceWords]);

  const maxSessionOffset = Math.max(0, words.length - 10);
  const safeSessionOffset = Math.min(sessionOffset, maxSessionOffset);
  const visibleWords = words.slice(safeSessionOffset, safeSessionOffset + 10);

  const currentCardIndex = Math.min(currentIndex, Math.max(0, visibleWords.length - 1));
  const currentWord = visibleWords[currentCardIndex];
  const hasMoreWords = safeSessionOffset + visibleWords.length < words.length;
  const nextSetCount = Math.max(1, Math.min(10, words.length - (safeSessionOffset + visibleWords.length)));

  useEffect(() => {
    console.log('[FlashcardBlock] words changed - new length:', words.length, 'currentCardIndex:', currentCardIndex, 'currentWord:', currentWord?.term);
  }, [words, currentCardIndex, currentWord]);
  
  const vocabSubtitle = showFilters
    ? `${selectedTopic} - Level ${selectedLevel}`
    : `${data?.title || 'Test Vocabulary'}${data?.level ? ` - Level ${data.level}` : ''}`;
  
  const handlePrevArrow = () => {
    let newSectionIndex;
    
    if (activeSectionIndex > 0) {
      newSectionIndex = activeSectionIndex - 1;
    } else if (sections.length > 1) {
      newSectionIndex = sections.length - 1;
    } else {
      return;
    }
    
    const newSection = sections[newSectionIndex];
    const newSkill = newSection?.skill;
    if (newSkill && setActiveSkillTab && availableSkills) {
      const skillIndex = availableSkills.indexOf(newSkill);
      if (skillIndex !== -1) setActiveSkillTab(skillIndex);
    }
    
    if (setActiveSectionIndex) setActiveSectionIndex(newSectionIndex);
    if (setActivePassageIndex) setActivePassageIndex(0);
    if (setIsReviewMode) setIsReviewMode(false);
    setCurrentIndex(0);
  };

  const handleNextArrow = () => {
    let newSectionIndex;
    
    if (activeSectionIndex < sections.length - 1) {
      newSectionIndex = activeSectionIndex + 1;
    } else if (sections.length > 1) {
      newSectionIndex = 0;
    } else {
      return;
    }
    
    const newSection = sections[newSectionIndex];
    const newSkill = newSection?.skill;
    if (newSkill && setActiveSkillTab && availableSkills) {
      const skillIndex = availableSkills.indexOf(newSkill);
      if (skillIndex !== -1) setActiveSkillTab(skillIndex);
    }
    
    if (setActiveSectionIndex) setActiveSectionIndex(newSectionIndex);
    if (setActivePassageIndex) setActivePassageIndex(0);
    if (setIsReviewMode) setIsReviewMode(false);
    setCurrentIndex(0);
  };

  const handleTopicFilterChange = (topic) => {
    setSelectedTopic(topic);
    setSessionOffset(0);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleLevelFilterChange = (level) => {
    setSelectedLevel(level);
    setSessionOffset(0);
    setCurrentIndex(0);
    setIsFlipped(false);
  };
  
  if (visibleWords.length === 0) {
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
    if (!currentWord) return;
    setIsFlipped(prev => !prev);
  };

  const handleDifficulty = (level) => {
    console.log('[FlashcardBlock] handleDifficulty called with level:', level);
    console.log('[FlashcardBlock] currentWord:', currentWord?.term, 'currentCardIndex:', currentCardIndex, 'visibleWords length:', visibleWords.length);
    console.log('[FlashcardBlock] vocabProgress before:', JSON.parse(JSON.stringify(vocabProgress)));
    
    if (!currentWord) {
      console.error('[FlashcardBlock] ERROR: currentWord is undefined!');
      return;
    }
    
    updateVocabMastery(currentWord.term, level);
    setIsFlipped(false);

    setTimeout(() => {
      console.log('[FlashcardBlock] Timeout executing, currentCardIndex was:', currentCardIndex, 'visibleWords length:', visibleWords.length);
      if (currentCardIndex < visibleWords.length - 1) {
        setCurrentIndex(prev => Math.min(prev + 1, visibleWords.length - 1));
      }
    }, 300);
  };

  const handleContinue = () => {
    if (hasMoreWords) {
      setSessionOffset(safeSessionOffset + 10);
      setCurrentIndex(0);
      setIsFlipped(false);
      return;
    }

    if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  return (
    <div className="invictus-flashcard-session-layout">
      <main className="flashcard-main-content">
        <div className="flashcard-main-content-inner">
          <section className="flashcard-section">
            <div className="flashcard-section-header">
              <h2 className="flashcard-section-title">{vocabSubtitle}</h2>
              <div className="flashcard-header-actions">
                {showFilters && (
                  <div className="flashcard-filter-group">
                    <select
                      className="topic-filter-select"
                      value={selectedTopic}
                      onChange={(e) => handleTopicFilterChange(e.target.value)}
                      aria-label="Filter vocabulary by topic"
                    >
                      <option value="All Topics">All Topics</option>
                      {selectedTopic === 'Due Words' && (
                        <option value="Due Words">Due Words</option>
                      )}
                      {availableTopics.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>

                    <select
                      className="level-filter-select"
                      value={selectedLevel}
                      onChange={(e) => handleLevelFilterChange(e.target.value)}
                      aria-label="Filter vocabulary by level"
                    >
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C1">C1</option>
                    </select>
                  </div>
                )}

                {onNavigateToMyWords && (
                  <button 
                    className="my-words-btn"
                    onClick={onNavigateToMyWords}
                  >
                    <span className="material-symbols-outlined">book</span>
                    My Words
                  </button>
                )}
              </div>
            </div>

            <div 
              className={`flashcard-container ${isFlipped ? 'flipped' : ''}`} 
              onClick={handleCardClick}
            >
              <div className="flashcard-counter">
                <span className="counter-text">
                  WORD {currentCardIndex + 1} <span className="counter-divider">OF</span> {visibleWords.length}
                </span>
              </div>
              <button
                className="flashcard-nav-arrow flashcard-nav-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentCardIndex > 0) {
                    setCurrentIndex(prev => Math.max(prev - 1, 0));
                    setIsFlipped(false);
                  }
                }}
                disabled={currentCardIndex === 0}
                aria-label="Previous card"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
                
              <button
                className="flashcard-nav-arrow flashcard-nav-next"
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentCardIndex < visibleWords.length - 1) {
                    setCurrentIndex(prev => Math.min(prev + 1, visibleWords.length - 1));
                    setIsFlipped(false);
                  }
                }}
                disabled={currentCardIndex === visibleWords.length - 1}
                aria-label="Next card"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
              <div className="grid-texture"></div>
                
              <div className="flashcard-inner">
                <div className="flashcard-front">
                  <h1 className="flashcard-term">{currentWord.term}</h1>
                  <div className="flashcard-divider"></div>
                  <p className="flashcard-hint">
                    Click for definition and usage examples.
                  </p>
                </div>
                  
                <div className="flashcard-back">
                  <div className="flashcard-definition">
                    <p className="definition-label">Definition</p>
                    <p className="definition-text">{currentWord.definition}</p>
                  </div>
                    
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
                </div>
              </div>

              <div className="card-accent-bottom">
                <div className="accent-dot"></div>
                <div className="accent-dot"></div>
                <div className="accent-dot"></div>
              </div>
            </div>

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
            {currentCardIndex === visibleWords.length - 1 && (
              <div className="flashcard-continue-row">
                <button
                  className="flashcard-continue-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContinue();
                  }}
                >
                  {hasMoreWords ? `Continue to Next ${nextSetCount}` : 'Finish Vocabulary Training'}
                </button>
              </div>
            )}
            <div className="flashnav">  
              {availableSkills?.length > 1 && (
                <div className="carousel-nav-footer">
                  <div className="carousel-nav-arrows">
                    <button onClick={handlePrevArrow} className="carousel-nav-arrow">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={handleNextArrow} className="carousel-nav-arrow">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FlashcardBlock;
