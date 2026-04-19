import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import './QuestionCarousel.css';

const SKILL_ORDER = ['vocab', 'reading', 'language-elements', 'listening', 'speaking', 'writing'];
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
  sections = [],
  sectionParts = [],
  activeSkillTab = 0,
  activeSectionIndex = 0,
  setActiveSectionIndex,
  setActivePassageIndex,
  setActiveSkillTab,
  setIsReviewMode,
  availableSkills = [],
  showPartsTabs = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const prevQuestionsRef = useRef(null);

  // Reset to first question when questions actually change
  useEffect(() => {
    const questionsChanged = prevQuestionsRef.current !== questions &&
      JSON.stringify(prevQuestionsRef.current) !== JSON.stringify(questions);
    
    if (questionsChanged || (prevQuestionsRef.current === null && questions)) {
      setCurrentIndex(0);
      if (carouselRef.current) {
        carouselRef.current.scrollTo({ left: 0, behavior: 'auto' });
      }
    }
    
    prevQuestionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentIndex, questions.length);
    }
  }, [currentIndex, onIndexChange, questions.length]);

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentSkill = sections[activeSectionIndex]?.skill || availableSkills[activeSkillTab];
  const skillSections = sections.filter(s => s.skill === currentSkill);
  const shouldShowPartsTabs = showPartsTabs || skillSections.length > 1 || questions.length > 1;
  const useSectionParts = sectionParts && sectionParts.length > 0;
  const partsToShow = useSectionParts ? sectionParts : (shouldShowPartsTabs ? (skillSections.length > 0 ? skillSections : sections) : []);

  const handlePrevArrow = () => {
    if (!setActiveSectionIndex || sections.length === 0) return;

 
    // Navigate to previous section (or skill)
    let newIndex;
    if (activeSectionIndex > 0) {
      newIndex = activeSectionIndex - 1;
    } else if (sections.length > 1) {
      newIndex = sections.length - 1;
    } else {
      return;
    }

   const newSection = sections[newIndex];
const newSkill = newSection?.skill;
if (newSkill && setActiveSkillTab) {
  const skillIdx = SKILL_ORDER.indexOf(newSkill);
  if (skillIdx !== -1) setActiveSkillTab(skillIdx);
}

    setActiveSectionIndex(newIndex);
    if (setActivePassageIndex) setActivePassageIndex(0);
    if (setIsReviewMode) setIsReviewMode(false);
    setCurrentIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const handleNextArrow = () => {
    if (!setActiveSectionIndex || sections.length === 0) return;

     // Navigate to next section (or skill)
    let newIndex;
    if (activeSectionIndex < sections.length - 1) {
      newIndex = activeSectionIndex + 1;
    } else if (sections.length > 1) {
      newIndex = 0;
    } else {
      return;
    }

const newSection = sections[newIndex];
const newSkill = newSection?.skill;
if (newSkill && setActiveSkillTab) {
  const skillIdx = SKILL_ORDER.indexOf(newSkill);
  if (skillIdx !== -1) setActiveSkillTab(skillIdx);
}

    setActiveSectionIndex(newIndex);
    if (setActivePassageIndex) setActivePassageIndex(0);
    if (setIsReviewMode) setIsReviewMode(false);
    setCurrentIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

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
      
      {(onCheckAnswers || partsToShow.length > 0) && (
        <div className="carousel-nav-footer">
          {partsToShow.length > 0 && (
            <div className="carousel-parts-tabs">

              {partsToShow.map((part, idx) => {
  // Find global index in full sections array for active state comparison and navigation
  let globalIdxForPart = -1;
  if (part.id) {
    globalIdxForPart = sections.findIndex(s => s.id === part.id && s.skill === part.skill);
    if (globalIdxForPart === -1) {
      globalIdxForPart = sections.findIndex(s => s.title === part.title && s.type === part.type && s.skill === part.skill);
    }
  } else {
    globalIdxForPart = sections.findIndex(s => s.title === part.title && s.type === part.type && s.skill === part.skill);
  }
  // Check if this part matches the currently active section
  const isActive = globalIdxForPart === activeSectionIndex;
  
  return (
    <button
      key={idx}
     
      onClick={() => {
  if (setActiveSectionIndex && globalIdxForPart !== -1) {
    setActiveSectionIndex(globalIdxForPart);
    if (setActivePassageIndex) setActivePassageIndex(0);
    if (setIsReviewMode) setIsReviewMode(false);
  }
        if (carouselRef.current) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }}
      className={`carousel-part-tab ${isActive ? 'active' : ''}`}
    >
      {idx + 1}
    </button>
  );
})}
            </div>
          )}

          {setActiveSectionIndex && sections.length > 1 && (
            <div className="carousel-nav-arrows">
              <button onClick={handlePrevArrow} aria-label="Previous" className="carousel-nav-arrow">
                <ChevronLeft size={18} />
              </button>
              <button onClick={handleNextArrow} aria-label="Next" className="carousel-nav-arrow">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
          
          {onCheckAnswers && (
            <button
              onClick={() => onCheckAnswers()}
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