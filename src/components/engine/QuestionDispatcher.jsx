import React from 'react';

// Import all Interactive Blocks
import ShortAnswerBlock from './InteractiveBlocks/ShortAnswerBlock';
import MCQBlock from './InteractiveBlocks/MCQBlock';
import MatchingInfoBlock from './InteractiveBlocks/MatchingInfoBlock';
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
import SentenceMatchingBlock from './InteractiveBlocks/SentenceMatchingBlock';
import SentenceInsertBlock from './InteractiveBlocks/SentenceInsertBlock';
import LanguageElementsBlock from './LanguageElementsBlock';

/**
 * The Universal Question Dispatcher
 * 
 * Props:
 * @param {Object} data - The raw question/task object from the JSON
 * @param {Object} userAnswers - The global state object containing answers
 * @param {Function} onUpdate - Function (id, value) => updateState
 * @param {Function} onCheckAnswers - Function to trigger grading
 * @param {Boolean} isReviewMode - Whether to show answers/corrections
 * @param {Boolean} showCheckAnswers - Whether to show the Check Answers button
 * @param {String|Array} passageContent - (Optional) The text content for context-heavy questions
 */
const QuestionDispatcher = ({ 
  data, 
  userAnswers = {}, 
  onUpdate, 
  onCheckAnswers,
  isReviewMode = false,
  showCheckAnswers = true,
  passageContent = null,
  activeGap,
  onActiveGapChange
}) => {
  if (!data) return null;

  // Standardize the ID and Type
  const qId = data.id;
  const qType = data.type?.toLowerCase();
  
  console.log('[QuestionDispatcher] Rendering question with id:', qId, 'type:', qType, 'data.type raw:', data.type);
  console.log('[QuestionDispatcher] Data keys:', Object.keys(data));
  console.log('[QuestionDispatcher] subTasks:', data.subTasks);

  // Helper to get current value for this specific question
  const currentValue = userAnswers[qId];

  switch (qType) {
    case 'mcq':
    case 'multiple-choice':
      return (
        <MCQBlock 
          data={data} 
          userAnswers={userAnswers}
          onUpdate={onUpdate}
          isReviewMode={isReviewMode}
        />
      );

    case 'short-answer':
      return (
        <ShortAnswerBlock 
          data={data} 
          userAnswers={userAnswers}
          onUpdate={onUpdate}
          isReviewMode={isReviewMode}
        />
      );

    case 'gap-fill':
    case 'sentence-complete':
      return (
        <SentenceCompleteBlock 
          data={data} 
          userAnswers={userAnswers}
          onUpdate={onUpdate}
          isReviewMode={isReviewMode}
        />
      );

case 'gap-fill-tokens':
        
        let normalizedPassage = data.passage;
        const isStandalone = !!normalizedPassage && !passageContent;
        if (passageContent) {
          if (Array.isArray(passageContent)) {
            // Extract text from content objects and join
            normalizedPassage = passageContent.map(item => 
              item && typeof item === 'object' ? (item.text || item.passage || '') : item
            ).join('\n\n');
          } else if (typeof passageContent === 'string') {
            normalizedPassage = passageContent;
          }
          // If passageContent is truthy but not string/array, fall back to data.passage
        }
        return (
          <GapFillBlock 
            data={{ ...data, passage: normalizedPassage }} 
            userAnswers={userAnswers} 
            onUpdate={onUpdate}
            isReviewMode={isReviewMode}
            showPassage={false}
            inlinePassage={isStandalone}
            activeGap={activeGap}
            onActiveGapChange={onActiveGapChange}
          />
        );

    case 'language_elements':
      // Language Elements - Use LanguageElementsBlock for both MCQ and gap-fill formats
      // LanguageElementsBlock handles the SplitPane layout and carousel navigation
      console.log('[QuestionDispatcher] Using LanguageElementsBlock for language_elements');
      return (
        <LanguageElementsBlock
          data={data}
          userAnswers={userAnswers}
          onUpdate={onUpdate}
          onCheckAnswers={onCheckAnswers}
          isReviewMode={isReviewMode}
          showCheckAnswers={showCheckAnswers}
          sections={sections}
          activeSkillTab={activeSkillTab}
          activeSectionIndex={activeSectionIndex}
          setActiveSectionIndex={setActiveSectionIndex}
          setActivePassageIndex={setActivePassageIndex}
          setIsReviewMode={setIsReviewMode}
          availableSkills={availableSkills}
        />
      );

    case 'heading-match':
      return (
        <HeadingMatchBlock 
          data={data} 
          userAnswers={userAnswers} // Note: This expects paraId keys in userAnswers
          onUpdate={onUpdate}
          isReviewMode={isReviewMode}
        />
      );

    case 'matching-info':
    case 'matching-choice':
      return (
        <MatchingInfoBlock 
          data={{ ...data, parentContent: passageContent || data.content }} 
          userAnswers={userAnswers}
          onUpdate={onUpdate}
          isReviewMode={isReviewMode}
        />
      );

    case 'matching-features':
      return (
        <MatchingFeaturesBlock 
          data={data} 
          userAnswers={userAnswers}
          onUpdate={onUpdate}
          isReviewMode={isReviewMode}
        />
      );

    case 'trinary':
    case 'true-false-not-given':
    case 'yes-no-not-given':
      return (
        <TrinaryBlock 
          data={data} 
          userAnswers={userAnswers}
          onUpdate={onUpdate}
          isReviewMode={isReviewMode}
        />
      );

    case 'token-select':
      return (
        <TokenSelectBlock 
          data={data} 
          isReviewMode={isReviewMode}
          onUpdate={(val) => onUpdate(qId, val)}
        />
      );

    case 'diagram-label':
      return (
        <DiagramLabelBlock 
          data={data} 
          userAnswers={userAnswers}
          onUpdate={onUpdate}
          isReviewMode={isReviewMode}
        />
      );

    case 'table':
    case 'table-completion':
      return (
        <TableCompletionBlock 
          data={data} 
          userAnswers={userAnswers}
          onUpdate={onUpdate}
          isReviewMode={isReviewMode}
        />
      );

    case 'flowchart':
    case 'flow-chart':
      return (
        <FlowChartCompletionBlock 
          data={data} 
          userAnswers={userAnswers}
          onUpdate={onUpdate}
          isReviewMode={isReviewMode}
        />
      );

    case 'notes':
    case 'notes-completion':
      return (
        <NotesCompletionBlock 
          data={data} 
          userAnswers={userAnswers}
          onUpdate={onUpdate}
          isReviewMode={isReviewMode}
        />
      );

    case 'punctuation':
    case 'punctuation-correction':
      return (
        <PunctuationCorrectionBlock 
          data={data} 
          isReviewMode={isReviewMode}
          onUpdate={(val) => onUpdate(qId, val)}
        />
      );

    case 'sentence-matching':
      return (
        <SentenceMatchingBlock 
          data={data} 
          userAnswers={userAnswers}
          onUpdate={onUpdate}
          isReviewMode={isReviewMode}
        />
      );

    case 'sentence-insert':
      console.log('[QuestionDispatcher] sentence-insert, data:', Object.keys(data));
      console.log('[QuestionDispatcher] passageContent:', passageContent);
      return (
        <SentenceInsertBlock 
          data={data} 
          userAnswers={userAnswers}
          onUpdate={onUpdate}
          isReviewMode={isReviewMode}
          passageContent={passageContent}
        />
      );

    default:
      // Fallback for nested questions structure
      if (data.questions && Array.isArray(data.questions)) {
        return (
          <div className="nested-questions-container">
            {data.instruction && <p className="instruction-text">{data.instruction}</p>}
            {data.questions.map((subQ, index) => (
              <QuestionDispatcher 
                key={subQ.id || index} 
                data={subQ} 
                userAnswers={userAnswers} 
                onUpdate={onUpdate} 
                isReviewMode={isReviewMode}
                passageContent={passageContent}
              />
            ))}
          </div>
        );
      }
      
      console.warn(`[QuestionDispatcher] Unknown question type: ${qType}`, data);
      return <div className="error-text">Unsupported question type: {qType}</div>;
  }
};

// Wrapper component that adds Check Answers button
const QuestionDispatcherWithCheck = ({
  data,
  userAnswers = {},
  onUpdate,
  onCheckAnswers,
  isReviewMode = false,
  showCheckAnswers = true,
  passageContent = null,
  activeGap,
  onActiveGapChange
}) => {
  if (!data) return null;

  const qId = data.id;

  return (
    <div className="question-dispatcher-wrapper">
      <QuestionDispatcher
        data={data}
        userAnswers={userAnswers}
        onUpdate={onUpdate}
        isReviewMode={isReviewMode}
        passageContent={passageContent}
        activeGap={activeGap}
        onActiveGapChange={onActiveGapChange}
      />
      
      {/* Check Answers Button - Toggle via onCheckAnswers (handles toggle in App.jsx) */}
      {showCheckAnswers && onCheckAnswers && (
        <div className="check-answers-container">
          <button 
            className="check-answers-btn"
            onClick={() => onCheckAnswers()}
          >
            {isReviewMode ? 'Hide Answers' : 'Check Answers'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionDispatcherWithCheck;