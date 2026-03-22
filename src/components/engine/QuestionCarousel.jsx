import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const QuestionCarousel = ({ 
  questions, 
  renderQuestion, 
  showInstruction = true, 
  onIndexChange,
  hasNextPassage = false,
  hasNextSection = false,
  onNextPart,
  showCheckAnswers = false,
  onCheckAnswers
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
              <div style={{ 
                marginBottom: '10px',
                paddingBottom: '8px',
                borderBottom: '1px solid #e2e8f0',
                fontSize: '14px',
                color: '#64748b'
              }}>
                
              </div>
            )}
            {renderQuestion(q, idx)}
          </div>
        ))}
      </div>
      
      {/* Navigation arrows below the question */}
      <div className="carousel-nav-footer" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0 0 12px',
        flexShrink: 0,
        gap: '8px'
      }}>
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          aria-label="Previous question"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            background: currentIndex === 0 ? '#f1f5f9' : '#e0e7ff',
            color: currentIndex === 0 ? '#94a3b8' : '#4338ca',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        
        {/* Check Answers button - always show when available */}
        {onCheckAnswers && (
          <button
            onClick={() => { console.log('[QuestionCarousel] Check Answers button clicked'); onCheckAnswers(); }}
            aria-label="Check Answers"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              background: '#22c55e',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            Check Answers
          </button>
        )}
        
        <button
          onClick={goToNext}
          disabled={isLastQuestion}
          aria-label="Next question"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            background: isLastQuestion ? '#f1f5f9' : '#e0e7ff',
            color: isLastQuestion ? '#94a3b8' : '#4338ca',
            cursor: isLastQuestion ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          Next
          {!isLastQuestion && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default QuestionCarousel;
