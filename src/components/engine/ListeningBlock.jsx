import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Headphones } from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';
import QuestionCarousel from './QuestionCarousel';
import SplitPane from './SplitPane';
import QuestionDispatcher from './QuestionDispatcher'; // Universal Waiter
import './ListeningBlock.css';
import './engine.css';

const ListeningBlock = ({ 
  data, 
  userAnswers = {}, 
  onUpdate = () => {}, 
  onQuestionIndexChange, 
  showCheckAnswers = false, 
  onCheckAnswers, 
  isReviewMode = false,
  // Navigation & Skill Tabs
  sections = [],
  activeSkillTab = 0,
  activeSectionIndex = 0,
  setActiveSectionIndex,
  setActivePassageIndex,
  setIsReviewMode,
  availableSkills = []
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const isActive = useExamStore(state => state.isActive);

  // 1. Audio Logic
  useEffect(() => {
    if (!isActive && isPlaying) handlePause();
  }, [isActive]);

  const handlePlay = () => { if (audioRef.current) { audioRef.current.play(); setIsPlaying(true); } };
  const handlePause = () => { if (audioRef.current) { audioRef.current.pause(); setIsPlaying(false); } };
  const handleTimeUpdate = () => {
    if (!audioRef.current?.duration) return;
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
  };

  // 2. Question Flattening
  // Listening often needs "One Slide Per Question" (flattening blocks into individual items)
  const getAllQs = () => {
    const rawItems = data.sections || data.questions || [];
    const flattened = [];

    rawItems.forEach(item => {
      // If it's a block with sub-questions (like MCQ groups or Short Answer groups)
      if (item.questions && Array.isArray(item.questions)) {
        item.questions.forEach(q => flattened.push({ ...q, type: q.type || item.type }));
      } 
      // If it's a Diagram/Map - expand each label into a slide
      else if (item.type === 'diagram-label' && item.labels) {
        item.labels.forEach(l => flattened.push({
          ...l,
          type: 'short-answer', // Labels in listening act like short-answers
          instruction: item.instruction,
          diagram: item.diagram
        }));
      }
      // If it's Notes - expand each gap into a slide
      else if (item.type === 'notes-completion' && item.notes) {
        item.notes.forEach(n => {
          if (n.type === 'gap') {
            flattened.push({
              ...n,
              type: 'short-answer',
              text: n.label,
              instruction: item.instruction || "Complete the notes."
            });
          }
        });
      }
      // Otherwise, just push the task as is
      else if (item.type) {
        flattened.push(item);
      }
    });
    return flattened;
  };

  const allQs = getAllQs();
  const totalQs = allQs.length;

  return (
    <div className="listening-container">
      <SplitPane
        content={
          <>
            {/* Header Section */}
            {data.title && (
               <div className="invictus-content-header">
                {data.subtitle && <p className="invictus-content-subtitle">{data.subtitle}</p>}
                <h2 className="invictus-content-title">{data.title}</h2>
                {data.description && <p className="listening-description">{data.description}</p>}
              </div>
            )}

            {/* Sticky Audio Player */}
            <div className="audio-sticky-bar">
              <div className="player-controls">
                <button className="play-btn" onClick={isPlaying ? handlePause : handlePlay}>
                  {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" style={{marginLeft: '2px'}} />}
                </button>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <Headphones size={18} className="headphones-icon" />
                <audio 
                  ref={audioRef} 
                  src={data.audioUrl} 
                  onTimeUpdate={handleTimeUpdate} 
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
            </div>

            {/* Visual Aids (Maps/Diagrams) */}
            {data.imageUrl && (
              <div className="listening-diagram">
                <img src={data.imageUrl} alt="Exam Visual" />
              </div>
            )}

            {/* Training Context */}
            <div className="protip-box">
              <div className="protip-icon"><span className="material-symbols-outlined">lightbulb</span></div>
              <div className="protip-content">
                <h4 className="protip-title">Listening Focus</h4>
                <p className="protip-text">Answers usually appear in the order they are heard. Keep your eyes on the next question while listening.</p>
              </div>
            </div>
          </>
        }
        exercise={
          <div className="listening-exercise-panel">
            <div className="exercise-header">
              <h2 className="exercise-title">
                Questions {data.questionStart || 1}–{data.questionStart ? data.questionStart + totalQs - 1 : totalQs}
              </h2>
            </div>

            {/* Core Interaction */}
            <QuestionCarousel 
              key={allQs.map(q => q.id).join('-')}
              questions={allQs} 
              renderQuestion={(q) => (
                <QuestionDispatcher 
                  data={q} 
                  userAnswers={userAnswers} 
                  onUpdate={onUpdate} 
                  isReviewMode={isReviewMode} 
                />
              )}
              onIndexChange={onQuestionIndexChange}
              showCheckAnswers={showCheckAnswers}
              onCheckAnswers={onCheckAnswers}
              isReviewMode={isReviewMode}
              sections={sections}
              activeSkillTab={activeSkillTab}
              activeSectionIndex={activeSectionIndex}
              setActiveSectionIndex={setActiveSectionIndex}
              setActivePassageIndex={setActivePassageIndex}
              setIsReviewMode={setIsReviewMode}
              availableSkills={availableSkills}
            />
          </div>
        }
      />
    </div>
  );
};

export default ListeningBlock;