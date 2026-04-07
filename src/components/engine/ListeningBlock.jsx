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
  // Extract listening data from full mock or direct
  const listeningData = data.listening || data;
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

  // 2. Question Flattening - NOT flattening all parts together
  // We keep the structure: each listening part is a separate "passage"
  // The QuestionCarousel will handle navigation between parts
  const listeningSections = listeningData.sections || [];
  
  // Get current part's data
  const currentPart = listeningSections[activeSectionIndex];
  const currentAudioUrl = currentPart?.audioUrl || listeningData.audioUrl;
  const currentTitle = currentPart?.title;
  const currentSubtitle = currentPart?.subtitle;
  const currentDescription = currentPart?.description;
  const currentTranscript = currentPart?.transcript;
  
  // Get questions for current part only (based on activeSectionIndex)
  const getQsForPart = (partIndex) => {
    const section = listeningSections[partIndex];
    if (!section) return [];
    
    const rawItems = section.subTasks || section.questions || [];
    const selfContainedTypes = ['sentence-matching', 'diagram-label', 'flowchart', 'heading-match', 'sentence-complete', 'gap-fill', 'short-answer', 'notes-completion'];
    
    const flattened = [];
    rawItems.forEach(item => {
      // Notes-completion should always be treated as self-contained, don't flatten
      if (item.type === 'notes-completion') {
        flattened.push({ ...item });
      }
      else if (selfContainedTypes.includes(item.type) && (!item.questions || !Array.isArray(item.questions))) {
        flattened.push({ ...item });
      }
      else if (item.questions && Array.isArray(item.questions)) {
        item.questions.forEach(q => flattened.push({ ...q, type: q.type || item.type }));
      }
      else if (item.type) {
        flattened.push(item);
      }
    });
    return flattened;
  };

  // For the carousel, use the current part's questions only
  const allQs = getQsForPart(activeSectionIndex);
  const totalQs = allQs.length;

  // Inside ListeningBlock component, before getQuestionRange
const extractIds = (items) => {
  const ids = [];
  items.forEach(item => {
    if (item.questions) { // Check if it's a subtask with nested questions
      item.questions.forEach(q => {
        const numId = parseInt(String(q.id).replace(/\D/g, ''), 10);
        if (!isNaN(numId)) ids.push(numId);
      });
    } else if (item.id) { // Direct question or subtask with single ID
      const numId = parseInt(String(item.id).replace(/\D/g, ''), 10);
      if (!isNaN(numId)) ids.push(numId);
    }
    // Add similar logic for 'labels' if listening questions also use them
    else if (item.labels) {
       item.labels.forEach(l => {
         const numId = parseInt(String(l.id).replace(/\D/g, ''), 10);
         if (!isNaN(numId)) ids.push(numId);
       });
    }
  });
  return ids.filter(id => !isNaN(id));
};
  
  // Replace your current getQuestionRange in ListeningBlock with this:
const getQuestionRange = () => {
  if (allQs.length === 0) return 'Questions';

  const ids = extractIds(allQs).sort((a, b) => a - b);
  
  if (ids.length === 0) return 'Questions'; // Fallback if no valid IDs found

  const minId = ids[0];
  const maxId = ids[ids.length - 1];

  return ids.length > 1 ? `Questions ${minId}–${maxId}` : `Question ${minId}`;
};

  return (
    <div className="listening-container">
      <SplitPane
        content={
          <>
            {/* Header Section - Show current part info */}
            {(currentTitle || currentSubtitle || currentDescription) ? (
               <div className="invictus-content-header">
                 {currentSubtitle && <p className="invictus-content-subtitle">{currentSubtitle}</p>}
                 {currentTitle && <h2 className="invictus-content-title">{currentTitle}</h2>}
                 {currentDescription && <p className="listening-description">{currentDescription}</p>}
               </div>
            ) : listeningData.title ? (
              <div className="invictus-content-header">
                {listeningData.subtitle && <p className="invictus-content-subtitle">{listeningData.subtitle}</p>}
                <h2 className="invictus-content-title">{listeningData.title}</h2>
                {listeningData.description && <p className="listening-description">{listeningData.description}</p>}
              </div>
            ) : null}

            {/* Sticky Audio Player - Use current part's audio */}
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
                  src={currentAudioUrl}
                  onTimeUpdate={handleTimeUpdate} 
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
            </div>

            {/* Visual Aids (Maps/Diagrams) */}
            {currentPart?.imageUrl ? (
              <div className="listening-diagram">
                <img src={currentPart.imageUrl} alt="Exam Visual" />
              </div>
            ) : listeningData.imageUrl ? (
              <div className="listening-diagram">
                <img src={listeningData.imageUrl} alt="Exam Visual" />
              </div>
            ) : null}

            {/* Transcript Display */}
            {currentTranscript ? (
              <div className="listening-transcript">
                <div className="transcript-content">
                  <h4>Transcript</h4>
                  <pre>{currentTranscript}</pre>
                </div>
              </div>
            ) : null}

           
          </>
        }
        exercise={
          <div className="invictus-question-column">
            <h2 className="invictus-total-range">{getQuestionRange()}</h2>

            {/* Core Interaction */}
            <QuestionCarousel 
              key={`${activeSectionIndex}-${allQs.map(q => q.id).join('-')}`}
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
              hasNextPassage={activeSectionIndex < listeningSections.length - 1}
              hasNextSection={false}
            />
          </div>
        }
      />
    </div>
  );
};

export default ListeningBlock;