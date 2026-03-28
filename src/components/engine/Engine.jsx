import React, { useState, useEffect, useMemo } from 'react';
import SplitPane from './SplitPane';
import ReadingBlock from './ReadingBlock';
import ListeningBlock from './ListeningBlock';
import WritingBlock from './WritingBlock';
import SpeakingBlock from './SpeakingBlock';
import VocabBlock from './VocabBlock';
import QuestionCarousel from './QuestionCarousel';
import './engine.css';

// Import interactive blocks
import ShortAnswerBlock from './InteractiveBlocks/ShortAnswerBlock';
import MCQBlock from './InteractiveBlocks/MCQBlock';
import MatchingChoiceBlock from './InteractiveBlocks/MatchingChoiceBlock';
import HeadingMatchBlock from './InteractiveBlocks/HeadingMatchBlock';
import SentenceCompleteBlock from './InteractiveBlocks/SentenceCompleteBlock';
import GapFillBlock from './InteractiveBlocks/GapFillBlock';
import TrinaryBlock from './InteractiveBlocks/TrinaryBlock';
import MatchingFeaturesBlock from './InteractiveBlocks/MatchingFeaturesBlock';
import TokenSelectBlock from './InteractiveBlocks/TokenSelectBlock';
import DiagramLabelBlock from './InteractiveBlocks/DiagramLabelBlock';
import TableCompletionBlock from './InteractiveBlocks/TableCompletionBlock';
import FlowChartCompletionBlock from './InteractiveBlocks/FlowChartCompletionBlock';
import NotesCompletionBlock from './InteractiveBlocks/NotesCompletionBlock';
import PunctuationCorrectionBlock from './InteractiveBlocks/PunctuationCorrectionBlock';

const Engine = ({
  activeLesson,
  activeSectionIndex,
  activePassageIndex,
  userAnswers,
  onUpdateAnswers,
  onCheckAnswers,
  isReviewMode = false,
  showCheckAnswers = true,
}) => {
  // State for interactive selections
  const [gapFillSelections, setGapFillSelections] = useState({});
  const [headingSelections, setHeadingSelections] = useState({});
  const [mcqSelections, setMcqSelections] = useState({});
  const [activeGap, setActiveGap] = useState(null);

  // Get current section and passage
  const sections = activeLesson?.sections || [];
  const currentSection = sections[activeSectionIndex] || activeLesson;
  const passages = currentSection?.passages || [];
  const currentPassage = passages[activePassageIndex] || currentSection;
  
  // Flatten questions for rendering
  const flattenQuestions = (questions) => {
    if (!questions || !Array.isArray(questions)) return [];
    
    const flatQs = [];
    questions.forEach((task) => {
      if (task.type === 'heading-match') {
        flatQs.push({...task, type: 'heading-match'});
      } else if (task.type === 'flow-chart') {
        flatQs.push({...task, type: 'flow-chart'});
      } else if (task.type === 'matching-features' && task.features && Array.isArray(task.features)) {
        if (task.questions && Array.isArray(task.questions)) {
          task.questions.forEach((q) => {
            flatQs.push({
              ...q,
              type: 'matching-features',
              parentType: 'matching-features',
              allFeatures: task.features,
              instruction: task.instruction
            });
          });
        }
      } else if (task.questions && Array.isArray(task.questions)) {
        const isMatchingInfo = task.type === 'matching-info';
        const isTrinary = task.type === 'trinary';
        task.questions.forEach((q) => {
          flatQs.push({
            ...q,
            type: isMatchingInfo ? 'matching-info' : (isTrinary ? 'trinary' : task.type),
            mode: task.mode,
            parentType: task.type,
            parentInstruction: task.instruction,
            parentId: task.id
          });
        });
      } else {
        flatQs.push({...task});
      }
    });
    return flatQs;
  };

  // Determine if we should use carousel
  const passageSubTasks = currentPassage?.subTasks || currentPassage?.questions || [];
  const flatQuestions = flattenQuestions(passageSubTasks);
  const useCarousel = flatQuestions.length > 1;

  // Calculate navigation
  const passagesInSection = passages.length || 1;
  const hasNextPassage = activePassageIndex < passagesInSection - 1;
  const hasNextSection = activeSectionIndex < (sections.length - 1);

  // Render individual question block
  const renderQuestionBlock = (q, idx) => {
    const qt = q.type;
    switch (qt) {
      case 'short-answer':
        return (
          <ShortAnswerBlock
            key={q.id || idx}
            data={q}
            userAnswers={userAnswers}
            onUpdate={onUpdateAnswers}
            isReviewMode={isReviewMode}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'matching-info':
        console.log('[Engine] rendering matching-info, currentPassage:', { content: currentPassage?.content?.slice(0,1) });
        return (
          <MatchingChoiceBlock
            key={q.id || idx}
            data={{...q, type: 'matching-choice', content: currentPassage?.content || currentPassage?.passage}}
            userAnswers={userAnswers || {}}
            onUpdate={onUpdateAnswers || (() => {})}
            showCheckAnswers={showCheckAnswers}
            onCheckAnswers={onCheckAnswers}
            isReviewMode={isReviewMode}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'mcq':
      case 'multiple-choice':
        return (
          <MCQBlock
            key={q.id || idx}
            data={q}
            userAnswers={userAnswers || {}}
            onUpdate={onUpdateAnswers || (() => {})}
            isReviewMode={isReviewMode}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'matching-choice':
        return (
          <MatchingChoiceBlock
            key={q.id || idx}
            data={{...q, content: currentPassage?.content || currentPassage?.passage}}
            userAnswers={userAnswers || {}}
            onUpdate={onUpdateAnswers || (() => {})}
            showCheckAnswers={showCheckAnswers}
            onCheckAnswers={onCheckAnswers}
            isReviewMode={isReviewMode}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'heading-match':
        return (
          <HeadingMatchBlock
            key={q.id || idx}
            data={q}
            userAnswers={headingSelections}
            onUpdate={(paraId, headingIdx) => {
              setHeadingSelections(prev => ({ ...prev, [paraId]: headingIdx }));
            }}
            isReviewMode={isReviewMode}
          />
        );
      case 'sentence-complete':
        return (
          <SentenceCompleteBlock
            key={q.id || idx}
            data={q}
            isReviewMode={isReviewMode}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'gap-fill':
        return (
          <GapFillBlock
            key={q.id || idx}
            data={q}
            isReviewMode={isReviewMode}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'trinary':
        return (
          <TrinaryBlock
            key={q.id || idx}
            data={q}
            userAnswers={userAnswers}
            onUpdate={onUpdateAnswers}
            isReviewMode={isReviewMode}
            className="invictus-interactive-block"
          />
        );
      case 'matching-features':
        return (
          <MatchingFeaturesBlock
            key={q.id || idx}
            data={q}
            isReviewMode={isReviewMode}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'token-select':
        return (
          <TokenSelectBlock
            key={q.id || idx}
            data={q}
            isReviewMode={isReviewMode}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'diagram-label':
        return (
          <DiagramLabelBlock
            key={q.id || idx}
            data={q}
            isReviewMode={isReviewMode}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'table-completion':
        return (
          <TableCompletionBlock
            key={q.id || idx}
            data={q}
            isReviewMode={isReviewMode}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'flow-chart':
        return (
          <FlowChartCompletionBlock
            key={q.id || idx}
            data={q}
            isReviewMode={isReviewMode}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'notes-completion':
        return (
          <NotesCompletionBlock
            key={q.id || idx}
            data={q}
            isReviewMode={isReviewMode}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'punctuation':
        return (
          <PunctuationCorrectionBlock
            key={q.id || idx}
            data={q}
            isReviewMode={isReviewMode}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      default:
        if (q.questions && Array.isArray(q.questions)) {
          return (
            <div key={q.id || idx} className="invictus-question-group">
              {q.instruction && (
                <div className="invictus-instruction-box">
                  {q.instruction}
                </div>
              )}
              {q.questions.map((sq, sqIdx) => (
                <div key={sq.id || sqIdx} className="invictus-sub-question">
                  <div className="invictus-question-number">
                    {String(sq.id || sqIdx + 1).replace(/^q/, '')}. {sq.text}
                  </div>
                  <ShortAnswerBlock
                    data={{...sq, type: 'short-answer'}}
                    userAnswers={userAnswers}
                    onUpdate={onUpdateAnswers}
                    isReviewMode={isReviewMode}
                    hideInstruction={true}
                  />
                </div>
              ))}
            </div>
          );
        }
        return (
          <div key={q.id || idx} className="invictus-error-fallback">
            Unknown question type: {qt}
          </div>
        );
    }
  };

  // Render passage content
  const renderContent = () => {
    const content = currentPassage?.content;
    
    if (typeof content === 'string') {
      return (
        <div 
          className="invictus-passage-text" 
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      );
    }

    if (Array.isArray(content)) {
      const isObjectFormat = typeof content[0] === 'object' && content[0] !== null;

      if (isObjectFormat) {
        return (
          <>
            {content.map((paragraph) => (
              <div key={paragraph.id} className="invictus-paragraph-container">
                <span className="invictus-paragraph-id">
                  {paragraph.id}
                </span>
                <p className="invictus-passage-text">
                  {paragraph.text}
                </p>
              </div>
            ))}
          </>
        );
      } else {
        return (
          <>
            {content.map((htmlSnippet, index) => (
              <div 
                key={index} 
                className="invictus-passage-text"
                dangerouslySetInnerHTML={{ __html: htmlSnippet }} 
              />
            ))}
          </>
        );
      }
    }
    return null;
  };

  // Handle gap fill word select
  const handleGapFillWordSelect = (word, parentId) => {
    const targetId = activeGap?.parentId || parentId;
    const targetGapIndex = activeGap?.gapId;
    if (targetId && targetGapIndex) {
      setGapFillSelections(prev => ({
        ...prev, 
        [targetId]: {
          ...(prev[targetId] || {}), 
          [targetGapIndex]: word
        }
      }));
      setActiveGap(null);
    }
  };

  // Render based on lesson type
  const renderLesson = () => {
    const lessonType = activeLesson?.type;
    const skill = activeLesson?.skill || currentSection?.skill;

    console.log('[Engine] renderLesson:', { lessonType, skill, currentSectionType: currentSection?.type });

    // IELTS Complex Reading
    if (lessonType === 'ielts-complex' || lessonType === 'READING' || skill === 'reading') {
      // Get passage title and subtitle
      const passageTitle = currentPassage?.title;
      const passageSubtitle = currentPassage?.subtitle;
      
      console.log('[Engine] IELTS Complex Reading:', { 
        lessonType, 
        skill,
        hasCurrentPassage: !!currentPassage,
        passageTitle, 
        passageSubtitle,
        currentPassageId: currentPassage?.id
      });
      
      return (
        <SplitPane
          content={
            <>
              {renderContent()}
            </>
          }
          exercise={
            <div className="engine-exercise-panel">
              <h2 className="invictus-total-range">
                Questions {currentPassage?.questionStart || 1}–{currentPassage?.questionEnd || flatQuestions.length}
              </h2>
              {flatQuestions.length > 0 && (
                useCarousel ? (
                  <QuestionCarousel
                    key={flatQuestions.map(q => q.id).join('-')}
                    questions={flatQuestions}
                    renderQuestion={(q, idx) => renderQuestionBlock(q, idx)}
                    showInstruction={true}
                    hasNextPassage={hasNextPassage}
                    hasNextSection={hasNextSection}
                    showCheckAnswers={showCheckAnswers}
                    onCheckAnswers={onCheckAnswers}
                    isReviewMode={isReviewMode}
                  />
                ) : (
                  <div className="invictus-static-list">
                    {flatQuestions.map((q, idx) => renderQuestionBlock(q, idx))}
                  </div>
                )
              )}
            </div>
          }
        />
      );
    }

    // Listening
    if (lessonType === 'LISTENING' || skill === 'listening') {
      return (
        <ListeningBlock 
          data={currentSection} 
          showCheckAnswers={showCheckAnswers}
          onCheckAnswers={onCheckAnswers}
          isReviewMode={isReviewMode}
        />
      );
    }

    // Writing
    if (lessonType === 'WRITING' || lessonType === 'writing' || lessonType === 'writing-mock') {
      const writingTask = currentSection?.sections?.length > 0
        ? { ...currentSection, ...currentSection.sections[activeSectionIndex] || currentSection.sections[0] }
        : currentSection;
      return (
        <WritingBlock 
          data={writingTask} 
          onComplete={onCheckAnswers}
        />
      );
    }

    // Speaking
    if (lessonType === 'SPEAKING' || skill === 'speaking' || lessonType === 'ielts-speaking') {
      return (
        <SpeakingBlock 
          data={currentSection} 
          onComplete={onCheckAnswers}
        />
      );
    }

    // Vocab
    if (lessonType === 'VOCAB' || lessonType === 'VOCAB_FLASHCARDS') {
      return (
        <VocabBlock 
          data={currentSection} 
          onComplete={onCheckAnswers}
        />
      );
    }


  };

  return (
    <div className="invictus-reading-layout">
      {renderLesson()}
    </div>
  );
};

export default Engine;
