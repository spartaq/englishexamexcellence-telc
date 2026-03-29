import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import './QuestionCarousel.css';

const QuestionCarousel = ({ 
  questions, 
  renderQuestion, 
  showInstruction = true, 
  onIndexChange,
  hasNextPassage = false,
  hasNextSection = false,
  onNextPart,
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
  console.log('QuestionCarousel props:', { questionsLength: questions?.length, showCheckAnswers, hasNextPassage, hasNextSection, hasOnCheckAnswers: !!onCheckAnswers });
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const prevQuestionsRef = useRef(null);

  // Reset to first question when questions actually change (not on every render)
  useEffect(() => {
    // Check if questions array has actually changed
    const questionsChanged = prevQuestionsRef.current !== questions &&
      JSON.stringify(prevQuestionsRef.current) !== JSON.stringify(questions);
    
    if (questionsChanged || (prevQuestionsRef.current === null && questions)) {
      setCurrentIndex(0);
      if (carouselRef.current) {
        carouselRef.current.scrollTo({ left: 0, behavior: 'auto' });
      }
      // Notify parent of index change
      if (onIndexChange) onIndexChange(0);
    }
    
    prevQuestionsRef.current = questions;
  }, [questions]);

  // Notify parent when index changes
  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentIndex, questions.length);
    }
  }, [currentIndex, onIndexChange, questions.length]);

  if (!questions || questions.length === 0) {
    return null;
  }

  const isLastQuestion = currentIndex === questions.length - 1;
  const showNextPart = isLastQuestion && (hasNextPassage || hasNextSection);
  
  // Calculate parts tabs visibility - use current section's skill
  const currentSkill = sections[activeSectionIndex]?.skill || availableSkills[activeSkillTab];
  const skillSections = sections.filter(s => s.skill === currentSkill);
  const showPartsTabs = skillSections.length > 1;

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const slideWidth = e.target.clientWidth;
    const newIndex = Math.round(scrollLeft / slideWidth);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < questions.length) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="question-carousel-wrapper">
      <div 
        className="question-carousel"
        ref={carouselRef}
        onScroll={handleScroll}
      >
        {questions.map((q, idx) => (
          <div key={q.id || idx} className="question-slide">
            {showInstruction && (
              <div className="question-instruction-div">
                
              </div>
            )}
            {renderQuestion(q, idx)}
          </div>
        ))}
      </div>
      
      {/* Footer with parts tabs and check answers button */}
      {(onCheckAnswers || showPartsTabs) && (
        <div className="carousel-nav-footer">
          {/* Parts tabs */}
          {showPartsTabs && (
            <div className="carousel-parts-tabs">
              {skillSections.map((s, idx) => {
                const sidx = sections.findIndex(sec => sec === s);
                return (
                  <button 
                    key={idx} 
                    onClick={() => { 
                      if (setActiveSectionIndex) setActiveSectionIndex(sidx); 
                      if (setActivePassageIndex) setActivePassageIndex(0); 
                      if (setIsReviewMode) setIsReviewMode(false); 
                    }} 
                    className={`carousel-part-tab ${activeSectionIndex === sidx ? 'active' : ''}`}>
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          )}
          
          {/* Check Answers button */}
          {onCheckAnswers && (
            <button
              onClick={() => { console.log('[QuestionCarousel] Check Answers button clicked'); onCheckAnswers(); }}
              aria-label={isReviewMode ? "Hide Answers" : "Check Answers"}
              className="carousel-check-btn"
            >
              <Check size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCarousel;
