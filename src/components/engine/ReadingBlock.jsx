
import React from 'react';
import QuestionCarousel from './QuestionCarousel';
import SplitPane from './SplitPane';
import './ReadingBlock.css';

// Import the interactive blocks for different question types
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

const ReadingBlock = ({ data, isMiniTest = false, renderQuestionBlock: externalRenderBlock, userAnswers = {}, onUpdate = () => {}, onQuestionIndexChange, navigationProps, showCheckAnswers = false, onCheckAnswers }) => {
  // Data is always an object from the mock
  const content = data?.content || data?.passage;
  console.log('[ReadingBlock] content:', content ? (Array.isArray(content) ? 'array len: ' + content.length : 'string') : 'undefined');
  // Check both data.questions and data.subTasks for questions
  // IMPORTANT: Preserve the subTask type on each question so internalRenderQuestionBlock can route correctly
  const questions = data?.questions || (data?.subTasks ? data.subTasks.flatMap(st => (st.questions || []).map(q => ({...q, type: st.type}))) : []);
  const title = data?.title;
  const subtitle = data?.subtitle;
  
  const internalRenderQuestionBlock = (q, idx) => {
    const qt = q.type;
    switch (qt) {
      case 'short-answer':
        return (
          <ShortAnswerBlock
            key={q.id || idx}
            data={q}
            userAnswers={userAnswers}
            onUpdate={onUpdate}
            isReviewMode={false}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'matching-choice':
        // For matching-choice, we need to pass the passage content from the parent
        // Also pass the passage id so answers can be checked against it
        console.log('[ReadingBlock] matching-choice: content type:', typeof content, Array.isArray(content) ? 'array length: ' + content.length : '', 'data.id:', data?.id);
        return (
          <MatchingChoiceBlock
            key={q.id || idx}
            data={{
              ...q, 
              type: 'matching-choice', 
              content: content, 
              parentContent: content,
              passageId: data.id
            }}
            userAnswers={userAnswers}
            onUpdate={onUpdate}
            isReviewMode={false}
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
            userAnswers={userAnswers}
            onUpdate={onUpdate}
            isReviewMode={false}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'matching-choice':
        return (
          <MatchingChoiceBlock
            key={q.id || idx}
            data={q}
            userAnswers={userAnswers}
            onUpdate={onUpdate}
            isReviewMode={false}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'heading-match':
        return (
          <HeadingMatchBlock
            key={q.id || idx}
            data={q}
            userAnswers={userAnswers}
            onUpdate={onUpdate}
            isReviewMode={false}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'sentence-complete':
        return (
          <SentenceCompleteBlock
            key={q.id || idx}
            data={q}
            userAnswers={userAnswers}
            onUpdate={onUpdate}
            isReviewMode={false}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'gap-fill':
        return (
          <GapFillBlock
            key={q.id || idx}
            data={q}
            userAnswers={userAnswers}
            onUpdate={onUpdate}
            isReviewMode={false}
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
            onUpdate={onUpdate}
            isReviewMode={false}
            className="invictus-interactive-block"
          />
        );
      case 'matching-features':
        return (
          <MatchingFeaturesBlock
            key={q.id || idx}
            data={q}
            userAnswers={userAnswers}
            onUpdate={onUpdate}
            isReviewMode={false}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'token-select':
        return (
          <TokenSelectBlock
            key={q.id || idx}
            data={q}
            userAnswers={userAnswers}
            onUpdate={onUpdate}
            isReviewMode={false}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'diagram-label':
        return (
          <DiagramLabelBlock
            key={q.id || idx}
            data={q}
            userAnswers={userAnswers}
            onUpdate={onUpdate}
            isReviewMode={false}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'table-completion':
        return (
          <TableCompletionBlock
            key={q.id || idx}
            data={q}
            userAnswers={userAnswers}
            onUpdate={onUpdate}
            isReviewMode={false}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'flow-chart':
        return (
          <FlowChartCompletionBlock
            key={q.id || idx}
            data={q}
            userAnswers={userAnswers}
            onUpdate={onUpdate}
            isReviewMode={false}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'notes-completion':
        return (
          <NotesCompletionBlock
            key={q.id || idx}
            data={q}
            userAnswers={userAnswers}
            onUpdate={onUpdate}
            isReviewMode={false}
            hideInstruction={true}
            className="invictus-interactive-block"
          />
        );
      case 'punctuation':
        return (
          <PunctuationCorrectionBlock
            key={q.id || idx}
            data={q}
            userAnswers={userAnswers}
            onUpdate={onUpdate}
            isReviewMode={false}
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
                    {sq.id || sqIdx + 1}. {sq.text}
                  </div>
                  <ShortAnswerBlock
                    data={{...sq, type: 'short-answer'}}
                    userAnswers={userAnswers}
                    onUpdate={onUpdate}
                    isReviewMode={false}
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

  // Use the already-flattened questions (line 28 preserves type from subTasks)
  const flatQuestions = questions;
  const useCarousel = flatQuestions.length > 1;

  return (
    <div className="invictus-reading-layout">
      <SplitPane
        content={
          <div className="invictus-passage-column">
            {/* Task Header - Inside SplitPane */}
            {(title || subtitle) && (
              <div className="invictus-passage-header">
                {subtitle && <p className="invictus-passage-subtitle">{subtitle}</p>}
                {title && <h2 className="invictus-passage-title">{title}</h2>}
              </div>
            )}

            {/* Passage Content */}
            {typeof content === 'string' ? (
              <div 
                className="invictus-passage-text" 
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            ) : Array.isArray(content) ? (
              content.map((item, index) => {
                // Handle both object format {id: "A", text: "..."} and string format "<p>...</p>"
                const paragraphId = (typeof item === 'object' && item !== null) ? item.id : null;
                const paragraphText = (typeof item === 'object' && item !== null) ? item.text : item;
                
                return (
                  <div key={index} className="invictus-paragraph-wrapper">
                    {paragraphId && (
                      <span className="invictus-paragraph-letter">{paragraphId}</span>
                    )}
                    <div 
                      className="invictus-passage-text"
                      dangerouslySetInnerHTML={{ __html: paragraphText }} 
                    />
                  </div>
                );
              })
            ) : null}
          </div>
        }
        exercise={
          <div className="invictus-question-column">
            <h2 className="invictus-total-range">Questions 1–15</h2>
            {flatQuestions.length > 0 && (
              useCarousel ? (
                <QuestionCarousel
                  key={flatQuestions.map(q => q.id).join('-')}
                  questions={flatQuestions}
                  renderQuestion={(q, idx) => internalRenderQuestionBlock(q, idx)}
                  showInstruction={true}
                  onIndexChange={onQuestionIndexChange}
                  hasNextPassage={navigationProps?.hasNextPassage}
                  hasNextSection={navigationProps?.hasNextSection}
                  onNextPart={navigationProps?.onNextPart}
                  showCheckAnswers={showCheckAnswers}
                  onCheckAnswers={onCheckAnswers}
                />
              ) : (
                <div className="invictus-static-list">
                  {flatQuestions.map((q, idx) => internalRenderQuestionBlock(q, idx))}
                </div>
              )
            )}
          </div>
        }
      />
    </div>
  );
};

export default ReadingBlock;