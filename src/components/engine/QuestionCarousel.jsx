import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const QuestionCarousel = ({ questions, renderQuestion, showInstruction = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  // Reset to first question when questions change (e.g., moving to a new section)
  useEffect(() => {
    setCurrentIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'auto' });
    }
  }, [questions]);

  if (!questions || questions.length === 0) {
    return null;
  }

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
                Question {idx + 1} of {questions.length}
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
        flexShrink: 0
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
        <button
          onClick={goToNext}
          disabled={currentIndex === questions.length - 1}
          aria-label="Next question"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            background: currentIndex === questions.length - 1 ? '#f1f5f9' : '#e0e7ff',
            color: currentIndex === questions.length - 1 ? '#94a3b8' : '#4338ca',
            cursor: currentIndex === questions.length - 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default QuestionCarousel;
