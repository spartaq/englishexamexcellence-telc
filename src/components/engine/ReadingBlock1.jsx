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

const ReadingBlock = ({ content, questions, isMiniTest = false, renderQuestionBlock: externalRenderBlock, userAnswers = {}, onUpdate = () => {}, onQuestionIndexChange, navigationProps, showCheckAnswers = false, onCheckAnswers }) => {
  // If externalRenderBlock is provided (from App.jsx), use it
  // Otherwise, use internal rendering
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
          />
        );
      case 'matching-info':
        // matching-info: Which paragraph contains the following information
        return (
          <MatchingChoiceBlock
            key={q.id || idx}
            data={{...q, type: 'matching-info'}}
            userAnswers={{}}
            onUpdate={() => {}}
            isReviewMode={false}
            hideInstruction={true}
          />
        );
      case 'mcq':
      case 'multiple-choice':
        return (
          <MCQBlock
            key={q.id || idx}
            data={q}
            isReviewMode={false}
            hideInstruction={true}
          />
        );
      case 'matching-choice':
        return (
          <MatchingChoiceBlock
            key={q.id || idx}
            data={q}
            isReviewMode={false}
            hideInstruction={true}
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
          />
        );
      case 'sentence-complete':
        return (
          <SentenceCompleteBlock
            key={q.id || idx}
            data={q}
            isReviewMode={false}
            hideInstruction={true}
          />
        );
      case 'gap-fill':
        return (
          <GapFillBlock
            key={q.id || idx}
            data={q}
            isReviewMode={false}
            hideInstruction={true}
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
          />
        );
      case 'matching-features':
        return (
          <MatchingFeaturesBlock
            key={q.id || idx}
            data={q}
            isReviewMode={false}
            hideInstruction={true}
          />
        );
      case 'token-select':
        return (
          <TokenSelectBlock
            key={q.id || idx}
            data={q}
            isReviewMode={false}
            hideInstruction={true}
          />
        );
      case 'diagram-label':
        return (
          <DiagramLabelBlock
            key={q.id || idx}
            data={q}
            isReviewMode={false}
            hideInstruction={true}
          />
        );
      case 'table-completion':
        return (
          <TableCompletionBlock
            key={q.id || idx}
            data={q}
            isReviewMode={false}
            hideInstruction={true}
          />
        );
      case 'flow-chart':
        return (
          <FlowChartCompletionBlock
            key={q.id || idx}
            data={q}
            isReviewMode={false}
            hideInstruction={true}
          />
        );
      case 'notes-completion':
        return (
          <NotesCompletionBlock
            key={q.id || idx}
            data={q}
            isReviewMode={false}
            hideInstruction={true}
          />
        );
      case 'punctuation':
        return (
          <PunctuationCorrectionBlock
            key={q.id || idx}
            data={q}
            isReviewMode={false}
            hideInstruction={true}
          />
        );
      default:
        // For matching-info type (IELTS reading)
        if (q.questions && Array.isArray(q.questions)) {
          return (
            <div key={q.id || idx}>
              {q.instruction && (
                <div className="question-instruction" style={{ 
                  marginBottom: '12px', 
                  padding: '10px', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#475569'
                }}>
                  {q.instruction}
                </div>
              )}
              {q.questions.map((sq, sqIdx) => (
                <div key={sq.id || sqIdx} style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: '500', marginBottom: '8px' }}>
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
          <div key={q.id || idx} style={{ padding: '10px', backgroundColor: '#fef3c7', borderRadius: '6px' }}>
            Unknown question type: {qt}
          </div>
        );
    }
  };

  const renderContent = () => {
    // CASE 1: Single String (Now supports HTML inside the string)
    if (typeof content === 'string') {
      return (
        <div 
          className="passage-text" 
          dangerouslySetInnerHTML={{ __html: content }} 
          style={{ whiteSpace: 'pre-line' }} // Honors \n if HTML isn't used
        />
      );
    }

    if (Array.isArray(content)) {
      // Check if the array contains Objects (Matching Info format) or Strings (HTML format)
      const isObjectFormat = typeof content[0] === 'object' && content[0] !== null;

      if (isObjectFormat) {
        // CASE 2: Matching Info format (Objects with id and text)
        return content.map((paragraph) => (
          <div key={paragraph.id} style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
            <span style={{ fontWeight: 800, color: 'var(--lab-indigo)', fontSize: '14px' }}>
              {paragraph.id}
            </span>
            <p className="passage-text" style={{ margin: 0 }}>
              {paragraph.text}
            </p>
          </div>
        ));
      } else {
        // CASE 3: New HTML Array format (Array of strings like the Enron/Theranos example)
        return content.map((htmlSnippet, index) => (
          <div 
            key={index} 
            className="passage-text"
            style={{ marginBottom: '20px' }}
            dangerouslySetInnerHTML={{ __html: htmlSnippet }} 
          />
        ));
      }
    }
    return null;
  };

  // Flatten questions from subTasks - expand nested question structures
  const flattenQuestions = () => {
    if (!questions || !Array.isArray(questions)) return [];
    
    const flatQs = [];
    questions.forEach((task) => {
      // heading-match needs special handling - keep the whole task with headings
      if (task.type === 'heading-match') {
        if (task.headings && Array.isArray(task.headings) && task.questions && Array.isArray(task.questions)) {
          flatQs.push({
            ...task,
            type: 'heading-match'
          });
        }
      // flow-chart needs special handling - keep all steps together instead of flattening
      } else if (task.type === 'flow-chart') {
        // Keep the flow-chart as a single unit with all its questions/steps
        flatQs.push({
          ...task,
          type: 'flow-chart'
        });
      // matching-features needs special handling - preserve features for each question
      } else if (task.type === 'matching-features' && task.features && Array.isArray(task.features)) {
        // For matching-features - MUST come before general questions check
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
      // If task has nested questions array (like matching-info), expand them
      } else if (task.questions && Array.isArray(task.questions)) {
        // matching-info uses short-answer style questions
        const isMatchingInfo = task.type === 'matching-info';
        // trinary questions also have nested questions - preserve the type
        const isTrinary = task.type === 'trinary';
        task.questions.forEach((q) => {
          flatQs.push({
            ...q,
            type: isMatchingInfo ? 'matching-info' : (isTrinary ? 'trinary' : task.type), // Use task.type as fallback
            mode: task.mode, // Preserve mode (tfng or yesno) for trinary
            parentType: task.type,
            parentInstruction: task.instruction,
            parentId: task.id
          });
        });
      } else {
        // Flat structure - add directly
        flatQs.push({...task});
      }
    });
    return flatQs;
  };

  const flatQuestions = flattenQuestions();
  const useCarousel = flatQuestions.length > 1;
  


  return (
    <div className="reading-block">
      <SplitPane
        content={
          <div className="reading-passage">
            {renderContent()}
          </div>
        }
        exercise={
          flatQuestions.length > 0 && (
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
              <div className="questions-list">
                {flatQuestions.map((q, idx) => internalRenderQuestionBlock(q, idx))}
              </div>
            )
          )
        }
      />
    </div>
  );
};

export default ReadingBlock;
