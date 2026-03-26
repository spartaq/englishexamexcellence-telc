import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  isReviewMode = false
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
  


  const scrollToQuestion = (index) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * carouselRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      scrollToQuestion(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      scrollToQuestion(currentIndex + 1);
    }
  };

  const handleNextPart = () => {
    if (onNextPart) {
      onNextPart();
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
      
      {/* Navigation arrows below the question */}
      <div className="carousel-nav-footer">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          aria-label="Previous question"
          className={`carousel-nav-btn prev`}
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        
        {/* Check Answers button - always show when available */}
        {onCheckAnswers && (
          <button
            onClick={() => { console.log('[QuestionCarousel] Check Answers button clicked'); onCheckAnswers(); }}
            aria-label={isReviewMode ? "Hide Answers" : "Check Answers"}
            className="carousel-check-btn"
          >
            {isReviewMode ? "Hide Answers" : "Check Answers"}
          </button>
        )}
        
        <button
          onClick={goToNext}
          disabled={isLastQuestion}
          aria-label="Next question"
          className={`carousel-nav-btn next`}
        >
          Next
          {!isLastQuestion && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default QuestionCarousel;

