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
      
      {/* Navigation with arrows */}
      <div className="carousel-dots" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '16px'
      }}>
        {/* Left Arrow */}
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          aria-label="Previous question"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: currentIndex === 0 ? '#f1f5f9' : '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: currentIndex === 0 ? 0.5 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          <ChevronLeft size={24} color={currentIndex === 0 ? '#94a3b8' : '#5850ec'} />
        </button>

        {/* Question counter */}
        <span style={{
          fontSize: '14px',
          color: '#64748b',
          minWidth: '80px',
          textAlign: 'center'
        }}>
          {currentIndex + 1} / {questions.length}
        </span>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          disabled={currentIndex === questions.length - 1}
          aria-label="Next question"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: currentIndex === questions.length - 1 ? '#f1f5f9' : '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: currentIndex === questions.length - 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: currentIndex === questions.length - 1 ? 0.5 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          <ChevronRight size={24} color={currentIndex === questions.length - 1 ? '#94a3b8' : '#5850ec'} />
        </button>
      </div>
    </div>
  );
};

export default QuestionCarousel;
