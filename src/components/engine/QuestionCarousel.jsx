import React, { useState, useRef } from 'react';

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
      
      {/* Navigation dots */}
      <div className="carousel-dots">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToQuestion(idx)}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: 'none',
              background: idx === currentIndex ? '#5850ec' : '#cbd5e1',
              cursor: 'pointer',
              padding: 0,
              transition: 'background 0.2s'
            }}
            aria-label={`Go to question ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCarousel;
