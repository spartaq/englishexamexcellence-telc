// src/components/engine/ResultScreen.jsx
import React, { useState } from 'react';
import { Trophy, CheckCircle, XCircle, ArrowRight, Star, Eye, EyeOff } from 'lucide-react';
import './ResultScreen.css';

const ResultScreen = ({ lesson, results, userAnswers = {}, onClaim, activeSectionIndex = 0, activePassageIndex = 0 }) => {
  const [showReview, setShowReview] = useState(false);
  const hasTELCScore = results.telcScore !== undefined && results.telcScore !== null;
  
  // Function to extract all questions from the lesson for review
  const getQuestionsForReview = () => {
    const questionMap = new Map(); // Use Map to deduplicate by question ID
    
    // Helper to check if an object is actually a question (has text and answer)
    const isQuestion = (obj) => {
      if (!obj || typeof obj !== 'object') return false;
      const hasText = obj.text || obj.question || obj.prompt || obj.stem;
      const hasAnswer = obj.answer !== undefined;
      return hasText && hasAnswer;
    };
    
    // Helper to extract questions from different lesson structures
    const extractQuestions = (source, passageTitle = '') => {
      if (!source) return;
      
      // Handle sections with passages (Reading structure: lesson.reading.sections)
      if (source.sections) {
        source.sections.forEach(section => {
          // Handle reading passages
          if (section.passages) {
            section.passages.forEach(passage => {
              extractQuestions(passage, passage.title || passage.heading || 'Passage');
            });
          } 
          // Handle listening parts (sections with questions directly)
          else if (section.questions) {
            section.questions.forEach(q => {
              // Only add if it's actually a question
              if (isQuestion(q) && !questionMap.has(q.id)) {
                questionMap.set(q.id, { ...q, passage: section.title || section.id || 'Listening' });
              }
            });
          }
          // Handle nested sections
          else if (section.sections) {
            extractQuestions(section, section.title);
          }
        });
      }
      
      // Handle passages directly
      if (source.passages) {
        source.passages.forEach(passage => {
          extractQuestions(passage, passage.title || passage.heading || 'Passage');
        });
      }
      
      // Handle subTasks (common in IELTS reading)
      if (source.subTasks) {
        source.subTasks.forEach(st => {
          if (st.questions) {
            st.questions.forEach(q => {
              // Only add if it's actually a question
              if (isQuestion(q) && !questionMap.has(q.id)) {
                questionMap.set(q.id, { 
                  ...q, 
                  passage: st.title || st.instruction || `Task ${st.id}` 
                });
              }
            });
          }
          // Handle nested questions in subTask (like labels in diagram-label)
          if (st.labels) {
            st.labels.forEach(label => {
              // Only add if it's actually a question
              if (isQuestion(label) && !questionMap.has(label.id)) {
                questionMap.set(label.id, {
                  ...label,
                  question: label.text,
                  passage: st.title || st.instruction || `Task ${st.id}`
                });
              }
            });
          }
        });
      }
      
      // Handle questions directly
      if (source.questions) {
        source.questions.forEach(q => {
          // Only add if it's actually a question
          if (isQuestion(q) && !questionMap.has(q.id)) {
            questionMap.set(q.id, { ...q, passage: passageTitle });
          }
        });
      }
    };
    
    // First check if lesson has reading or listening directly, then extract
    // Use a flag to track what's been processed to avoid duplicates
    const processed = new Set();
    
    // For ielts-complex or random-mock tests, extract from current section/passage
    const isIeltsComplex = lesson.type === 'ielts-complex' || lesson.type === 'full-mock';
    
    if (isIeltsComplex && lesson.sections) {
      // Extract from the current section based on activeSectionIndex
      const currentSection = lesson.sections[activeSectionIndex];
      if (currentSection) {
        const passages = currentSection.passages || [];
        const currentPassage = passages[activePassageIndex] || currentSection;
        if (currentPassage) {
          extractQuestions(currentPassage, currentPassage.title || currentSection.title || 'Current Passage');
        }
      }
    } else if (lesson.reading && !processed.has('reading')) {
      processed.add('reading');
      extractQuestions(lesson.reading, 'Reading');
    } else if (lesson.listening && !processed.has('listening')) {
      processed.add('listening');
      extractQuestions(lesson.listening, 'Listening');
    } else {
      // Only extract from lesson directly if neither reading nor listening exists
      extractQuestions(lesson);
    }
    
    const questions = Array.from(questionMap.values());
    console.log('Extracted questions for review:', questions.length, questions.map(q => q.id));
    return questions;
  };
  
  // Determine which skill this lesson is for
  const isReading = lesson?.skill === 'reading' || 
                    lesson?.type === 'READING' ||
                    lesson?.type === 'reading' ||
                    lesson?.type === 'academic-reading-mock' ||
                    lesson?.type === 'general-reading-mock' ||
                    lesson?.reading !== undefined;
  const isListening = lesson?.skill === 'listening' || 
                     lesson?.type === 'LISTENING' ||
                     lesson?.type === 'ielts-listening-mock' ||
                     lesson?.listening !== undefined;
  
  // Filter questions to only show relevant ones for the current test
  const allQuestions = getQuestionsForReview();
  const questions = allQuestions.filter(q => {
    // If we have reading only, filter to reading-related passages
    if (isReading && !isListening) {
      return q.passage && !q.passage.toLowerCase().includes('listening');
    }
    // If we have listening only, filter to listening-related passages
    if (isListening && !isReading) {
      return q.passage && q.passage.toLowerCase().includes('listening');
    }
    return true;
  });
  
  // Check if a specific answer is correct
  const checkAnswer = (question) => {
    const userAnswer = userAnswers[question.id];
    const correctAnswer = question.answer;
    
    if (question.correctIndex !== undefined) {
      // Multiple choice with index
      return userAnswer === question.correctIndex;
    }
    
    if (question.correctIndices) {
      // Multiple correct answers
      const userAns = userAnswer || [];
      return JSON.stringify(userAns.sort()) === JSON.stringify(question.correctIndices.sort());
    }
    
    // Text comparison
    if (correctAnswer !== undefined) {
      return String(userAnswer)?.toLowerCase().trim() === String(correctAnswer).toLowerCase().trim();
    }
    
    return false;
  };

  return (
    <div className="results-container">
      <div className="results-card">
        <h2 className="results-title">{results.accuracy === 100 ? 'Perfect!' : 'Complete!'}</h2>
        
        {/* TELC Score Display */}
        {hasTELCScore && (
          <div className="telc-score-display">
            <div className="telc-score-header">
              <Star size={20} fill="#fbbf24" color="#fbbf24" />
              <span>TELC Score</span>
            </div>
            
            <div className="telc-total-score">
              {results.telcScore.points} <span className="telc-max">/ {results.telcScore.max}</span>
            </div>
            
            <div className="telc-percent">
              {results.telcScore.percent}% {results.telcScore.passed ? '✓' : '✗'}
            </div>
            
            <div className="telc-breakdown">
              <div className="telc-skill-row">
                <span className="telc-skill-name">{results.telcScore.skill}</span>
                <span className="telc-skill-correct">
                  {results.telcScore.correct}/{results.telcScore.total} correct
                </span>
                <span className={`telc-skill-status ${results.telcScore.passed ? 'passed' : 'failed'}`}>
                  {results.telcScore.passed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
                </span>
              </div>
            </div>
            
            <div className="telc-requirements">
              <small>Passing: 60% ({Math.round(results.telcScore.max * 0.6)}/{results.telcScore.max} points)</small>
            </div>
          </div>
        )}
        
        <div className="results-stats">
          <div className="stat-item">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{results.accuracy}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">XP Earned</span>
            <span className="stat-value text-indigo">+{results.earnedXP}</span>
          </div>
        </div>

        {/* Toggle Review Button */}
        {questions.length > 0 && (
          <button 
            className="review-toggle-btn"
            onClick={() => setShowReview(!showReview)}
          >
            {showReview ? (
              <> <EyeOff size={18} /> Hide Answers </>
            ) : (
              <> <Eye size={18} /> Review Answers ({questions.length}) </>
            )}
          </button>
        )}
        
        {/* Answer Review Section */}
        {showReview && questions.length > 0 && (
          <div className="answer-review">
            <h3>Answer Review</h3>
            <div className="review-list">
              {questions.map((q, index) => {
                const isCorrect = checkAnswer(q);
                const userAnswer = userAnswers[q.id];
                const correctAnswer = q.answer ?? q.correctIndex ?? q.correctIndices;
                
                return (
                  <div key={q.id || index} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="review-header">
                      <span className="review-number">Q{index + 1}</span>
                      <span className="review-status">
                        {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <div className="review-question">
                      {q.question || q.text || q.stem || q.prompt || 'Question'}
                    </div>
                    <div className="review-answers">
                      <div className="your-answer">
                        <strong>Your answer:</strong> {userAnswer !== undefined ? (Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer) : '(no answer)'}
                      </div>
                      <div className="correct-answer">
                        <strong>Correct answer:</strong> {correctAnswer !== undefined ? (Array.isArray(correctAnswer) ? correctAnswer.join(', ') : correctAnswer) : 'N/A'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="answer-review">
           {/* Logic to show which words were missed */}
           {results.accuracy < 100 && !showReview && (
             <p>Tip: Review your answers to improve!</p>
           )}
        </div>

        <button className="claim-btn" onClick={onClaim}>Claim Rewards</button>
      </div>
    </div>
  );
};

export default ResultScreen;

