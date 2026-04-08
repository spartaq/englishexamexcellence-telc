import React, { useState, useMemo } from 'react';
import QuestionCarousel from './QuestionCarousel';
import SplitPane from './SplitPane';
import { CheckCircle, XCircle, Check } from 'lucide-react';
import './LanguageElementsBlock.css';

/**
 * LanguageElementsBlock - Layout for TELC Language Elements section
 * 
 * SplitPane layout:
 * - Left pane (content): Passage with gaps (the text to complete)
 * - Right pane (exercise): Token bank (words to select from)
 * 
 * Uses QuestionCarousel for navigation between parts (Part 1 and Part 2)
 */
const LanguageElementsBlock = ({ 
  data, 
  userAnswers = {}, 
  onUpdate = () => {}, 
  onQuestionIndexChange, 
  navigationProps, 
  showCheckAnswers = false, 
  onCheckAnswers, 
  isReviewMode = false,
  // Parts tabs props
  sections = [],
  activeSkillTab = 0,
  activeSectionIndex = 0,
  setActiveSectionIndex,
  setActivePassageIndex,
  setIsReviewMode,
  availableSkills = []
}) => {
  // Get all subTasks (each is a gap-fill task)
  const subTasks = data?.subTasks || [];
   
  if (subTasks.length === 0) {
    return (
      <div className="language-elements-error">
        <p>No language elements task found.</p>
      </div>
    );
  }

  // Prepare questions for carousel - each subTask is a "question" in the carousel
  const questions = subTasks.map((subTask, index) => ({
    id: subTask.id || `le-part${index + 1}`,
    type: subTask.type,
    subTaskData: subTask,
    title: subTask.title || `Part ${index + 1}`
  }));

  // Get current active subTask
  const activeIndex = activeSectionIndex || 0;
  const currentSubTask = subTasks[activeIndex];
   
  if (!currentSubTask) {
    return <div>No task found</div>;
  }

  const { title, instruction, passage, tokens = [], answers = [], xpReward = 50 } = currentSubTask;
   
  // Parse passage to find gap markers ____(n)____
  const parts = passage.split(/____\((\d+)\)____/g);
   
  // Track user's selections
  const selections = userAnswers[currentSubTask.id] || {};
   
  // Shuffle tokens for display
  const displayTokens = useMemo(() => {
    return [...tokens].sort(() => Math.random() - 0.5);
  }, [tokens]);

  // Handle token selection
  const handleTokenSelect = (token) => {
    if (isReviewMode) return;
     
    for (let i = 1; i <= answers.length; i++) {
      if (!selections[i]) {
        const newSelections = { ...selections, [i]: token };
        if (onUpdate) {
          onUpdate(currentSubTask.id, newSelections);
        }
        return;
      }
    }
  };

  // Handle gap click to clear
  const handleGapClick = (gapIndex) => {
    if (isReviewMode) return;
     
    const newSelections = { ...selections };
    delete newSelections[gapIndex];
    if (onUpdate) {
      onUpdate(currentSubTask.id, newSelections);
    }
  };

  // Calculate results
  const calculateResults = () => {
    let correct = 0;
    const gapResults = {};

    answers.forEach((answer, index) => {
      const gapIndex = index + 1;
      const userAnswer = selections[gapIndex];
      const isCorrect = userAnswer?.toLowerCase() === answer.toLowerCase();
       
      if (isCorrect) correct++;
       
      gapResults[gapIndex] = {
        userAnswer: userAnswer || null,
        correctAnswer: answer,
        isCorrect
      };
    });

    return { correct, total: answers.length, accuracy: Math.round((correct / answers.length) * 100), gapResults };
  };

  const handleCheck = () => {
    const results = calculateResults();
    if (onCheckAnswers) {
      onCheckAnswers(results);
    }
  };

  // Gap styling
  const getGapStyle = (gapIndex) => {
    const userAnswer = selections[gapIndex];
    const correctAnswer = answers[gapIndex - 1];
     
    if (!isReviewMode) {
      return userAnswer ? 'filled' : 'empty';
    }
     
    if (!userAnswer) return 'missing';
    return userAnswer.toLowerCase() === correctAnswer.toLowerCase() ? 'correct' : 'incorrect';
  };

  // Left pane - Passage with gaps
  const passageContent = (
    <div className="language-elements-passage-content">
      <div className="invictus-content-header">
        <h2 className="invictus-content-title">{title || data?.title}</h2>
        {data?.description && <p className="invictus-content-subtitle">{data?.description}</p>}
      </div>
       
      {instruction && <p className="gap-fill-instruction">{instruction}</p>}
       
      <div className="gap-fill-passage">
        {parts.map((part, index) => {
          if (index % 2 === 0) {
            return <span key={index} className="passage-text">{part}</span>;
          }
           
          const gapIndex = parseInt(part);
          const gapStyle = getGapStyle(gapIndex);
          const userAnswer = selections[gapIndex];
           
          return (
            <span
              key={index}
              className={`gap-line ${gapStyle}`}
              onClick={() => handleGapClick(gapIndex)}
            >
              {userAnswer || (isReviewMode ? '____' : '▼')}
            </span>
          );
        })}
      </div>
    </div>
  );

  // Right pane - Token bank with footer inside
  const tokenContent = (
    <div className="invictus-question-column">
      <h2 className="invictus-total-range">{title || data?.title || 'Language Elements'}</h2>
      
      <div className="language-elements-tokens-content">
        <div className="gap-fill-tokens">
          <p className="tokens-label">Select words to fill the gaps:</p>
          <div className="token-container">
            {displayTokens.map((token, idx) => {
              const isUsed = Object.values(selections).includes(token);
               
              return (
                <button
                  key={idx}
                  className={`token-button ${isUsed ? 'used' : ''}`}
                  onClick={() => handleTokenSelect(token)}
                  disabled={isUsed || isReviewMode}
                >
                  {token}
                </button>
              );
            })}
          </div>
        </div>

        {isReviewMode && (
          <div className="gap-fill-results">
            {(() => {
              const results = calculateResults();
              return (
                <>
                  <div className="results-header">
                    <h3>Results</h3>
                    <span className="results-score">
                      {results.correct}/{results.total} ({results.accuracy}%)
                    </span>
                  </div>
                  <div className="results-list">
                    {Object.entries(results.gapResults).map(([gapIndex, result]) => (
                      <div key={gapIndex} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                        <span className="result-icon">
                          {result.isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                        </span>
                        <span className="result-gap">Gap {gapIndex}:</span>
                        <span className="result-user">{result.userAnswer || '(no answer)'}</span>
                        {!result.isCorrect && (
                          <span className="result-correct">→ {result.correctAnswer}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Footer with part tabs - inside the question pane */}
      {subTasks.length > 1 && (
        <div className="carousel-nav-footer">
          <div className="carousel-parts-tabs">
            {subTasks.map((st, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (setActiveSectionIndex) setActiveSectionIndex(idx);
                  if (setActivePassageIndex) setActivePassageIndex(0);
                  if (setIsReviewMode) setIsReviewMode(false);
                }}
                className={`carousel-part-tab ${activeSectionIndex === idx ? 'active' : ''}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          {showCheckAnswers && !isReviewMode && (
            <button
              onClick={handleCheck}
              className="carousel-check-btn"
            >
              <Check size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );

  // Single task - no carousel needed
  if (subTasks.length === 1) {
    return (
      <div className="invictus-reading-layout reading-wrapper">
        <SplitPane
          content={passageContent}
          exercise={tokenContent}
        />
      </div>
    );
  }

  // Multiple subTasks - render based on current activeSectionIndex
  const currentST = subTasks[activeIndex];
   
  if (!currentST) {
    return <div>No task found</div>;
  }
   
  // Get data for current subTask
  const stParts = currentST.passage.split(/____\((\d+)\)____/g);
  const stTokens = [...currentST.tokens].sort(() => Math.random() - 0.5);
  const stAnswers = currentST.answers || [];
  const stSelections = userAnswers[currentST.id] || {};
   
  const stGetGapStyle = (gapIndex) => {
    const userAnswer = stSelections[gapIndex];
    const correctAnswer = stAnswers[gapIndex - 1];
    if (!isReviewMode) return userAnswer ? 'filled' : 'empty';
    if (!userAnswer) return 'missing';
    return userAnswer.toLowerCase() === correctAnswer?.toLowerCase() ? 'correct' : 'incorrect';
  };
   
  const stHandleTokenSelect = (token) => {
    if (isReviewMode) return;
    for (let i = 1; i <= stAnswers.length; i++) {
      if (!stSelections[i]) {
        const newSelections = { ...stSelections, [i]: token };
        if (onUpdate) onUpdate(currentST.id, newSelections);
        return;
      }
    }
  };
   
  const stHandleGapClick = (gapIndex) => {
    if (isReviewMode) return;
    const newSelections = { ...stSelections };
    delete newSelections[gapIndex];
    if (onUpdate) onUpdate(currentST.id, newSelections);
  };
   
  // Calculate results for current subTask
  const calculateSTResults = () => {
    let correct = 0;
    const gapResults = {};
    stAnswers.forEach((answer, index) => {
      const gapIndex = index + 1;
      const userAnswer = stSelections[gapIndex];
      const isCorrect = userAnswer?.toLowerCase() === answer.toLowerCase();
      if (isCorrect) correct++;
      gapResults[gapIndex] = { userAnswer: userAnswer || null, correctAnswer: answer, isCorrect };
    });
    return { correct, total: stAnswers.length, accuracy: Math.round((correct / stAnswers.length) * 100), gapResults };
  };

  // Left pane content for current subTask
  const stPassageContent = (
    <div className="language-elements-passage-content">
      <div className="invictus-content-header">
        <h2 className="invictus-content-title">{currentST.title || data?.title}</h2>
        {data?.description && <p className="invictus-content-subtitle">{data?.description}</p>}
      </div>
      {currentST.instruction && <p className="gap-fill-instruction">{currentST.instruction}</p>}
      <div className="gap-fill-passage">
        {stParts.map((part, index) => {
          if (index % 2 === 0) {
            return <span key={index} className="passage-text">{part}</span>;
          }
          const gapIndex = parseInt(part);
          const gapStyle = stGetGapStyle(gapIndex);
          const userAnswer = stSelections[gapIndex];
          return (
            <span key={index} className={`gap-line ${gapStyle}`} onClick={() => stHandleGapClick(gapIndex)}>
              {userAnswer || (isReviewMode ? '____' : '▼')}
            </span>
          );
        })}
      </div>
    </div>
  );

  // Right pane content for current subTask (with footer inside)
  const stTokenContent = (
    <div className="invictus-question-column">
      <h2 className="invictus-total-range">{currentST.title || data?.title || 'Language Elements'}</h2>
      
      <div className="language-elements-tokens-content">
        <div className="gap-fill-tokens">
          <p className="tokens-label">Select words to fill the gaps:</p>
          <div className="token-container">
            {stTokens.map((token, idx) => {
              const isUsed = Object.values(stSelections).includes(token);
              return (
                <button key={idx} className={`token-button ${isUsed ? 'used' : ''}`} onClick={() => stHandleTokenSelect(token)} disabled={isUsed || isReviewMode}>
                  {token}
                </button>
              );
            })}
          </div>
        </div>
        {isReviewMode && (
          <div className="gap-fill-results">
            {(() => {
              const results = calculateSTResults();
              return (
                <>
                  <div className="results-header">
                    <h3>Results</h3>
                    <span className="results-score">{results.correct}/{results.total} ({results.accuracy}%)</span>
                  </div>
                  <div className="results-list">
                    {Object.entries(results.gapResults).map(([gapIndex, result]) => (
                      <div key={gapIndex} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                        <span className="result-icon">{result.isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}</span>
                        <span className="result-gap">Gap {gapIndex}:</span>
                        <span className="result-user">{result.userAnswer || '(no answer)'}</span>
                        {!result.isCorrect && <span className="result-correct">→ {result.correctAnswer}</span>}
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Footer with part tabs - inside the question pane */}
      {subTasks.length > 1 && (
        <div className="carousel-nav-footer">
          <div className="carousel-parts-tabs">
            {subTasks.map((st, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (setActiveSectionIndex) setActiveSectionIndex(idx);
                  if (setActivePassageIndex) setActivePassageIndex(0);
                  if (setIsReviewMode) setIsReviewMode(false);
                }}
                className={`carousel-part-tab ${activeSectionIndex === idx ? 'active' : ''}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          {showCheckAnswers && !isReviewMode && (
            <button
              onClick={() => {
                const results = calculateSTResults();
                if (onCheckAnswers) onCheckAnswers(results);
              }}
              className="carousel-check-btn"
            >
              <Check size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="invictus-reading-layout reading-wrapper">
      <SplitPane
        content={stPassageContent}
        exercise={stTokenContent}
      />
    </div>
  );
};

export default LanguageElementsBlock;
