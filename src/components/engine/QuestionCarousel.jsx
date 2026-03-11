import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const QuestionCarousel = ({ questions, renderQuestion, showInstruction = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

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
            {/* Navigation arrows overlay on slide */}
            {currentIndex > 0 && (
              <button
                onClick={goToPrevious}
                aria-label="Previous question"
                className="carousel-nav-arrow carousel-nav-prev"
              >
                <ChevronLeft size={32} color="#4338ca" />
              </button>
            )}
            {currentIndex < questions.length - 1 && (
              <button
                onClick={goToNext}
                aria-label="Next question"
                className="carousel-nav-arrow carousel-nav-next"
              >
                <ChevronRight size={32} color="#4338ca" />
              </button>
            )}
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
      
      {/* Navigation dots - hidden on mobile */}
      <div className="carousel-dots desktop-only" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '8px',
        padding: '4px 0'
      }}>
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToQuestion(idx)}
            aria-label={`Go to question ${idx + 1}`}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: 'none',
              background: idx === currentIndex ? '#6366f1' : '#cbd5e1',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.2s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCarousel;
