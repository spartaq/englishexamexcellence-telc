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
  availableSkills = [],
  // Force show parts tabs (for Language Elements)
  showPartsTabs = false
}) => {
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
      // Don't call onIndexChange here - it causes parent to reset part index
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
  
  // Calculate parts tabs visibility - use prop or calculate from sections
  const currentSkill = sections[activeSectionIndex]?.skill || availableSkills[activeSkillTab];
  const skillSections = sections.filter(s => s.skill === currentSkill);
  const computedShowPartsTabs = skillSections.length > 1 || questions.length > 1;
  const shouldShowPartsTabs = showPartsTabs || computedShowPartsTabs;

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
      {(onCheckAnswers || shouldShowPartsTabs) && (
        <div className="carousel-nav-footer">
          {/* Parts tabs */}
          {shouldShowPartsTabs && (
            <div className="carousel-parts-tabs">
              {/* When showPartsTabs is explicitly true OR skillSections is empty but sections exist, use sections directly */}
              {((showPartsTabs && sections.length > 0) || skillSections.length > 0 ? (skillSections.length > 0 ? skillSections : sections) : questions).map((s, idx) => {
                const sidx = sections.length > 0 ? sections.findIndex(sec => sec === s) : idx;
                return (
                  <button 
                    key={idx} 
                    onClick={() => { 
                      if (setActiveSectionIndex) setActiveSectionIndex(sidx); 
                      if (setActivePassageIndex) setActivePassageIndex(0); 
                      if (setIsReviewMode) setIsReviewMode(false);
                      setCurrentIndex(idx);
                      if (carouselRef.current) {
                        const slideWidth = carouselRef.current.clientWidth || 300;
                        carouselRef.current.scrollTo({ left: idx * slideWidth, behavior: 'smooth' });
                      }
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
