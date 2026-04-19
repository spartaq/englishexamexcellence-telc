import React from 'react';
import QuestionCarousel from './QuestionCarousel';
import SplitPane from './SplitPane';
import QuestionDispatcher from './QuestionDispatcher';
import { flattenQuestions } from '../../utils/questionFlattener';
import './LanguageElementsBlock.css';
import './engine.css';

const LanguageElementsBlock = ({
  data,
  userAnswers = {},
  onUpdate = () => {},
  onQuestionIndexChange,
  navigationProps,
  showCheckAnswers = false,
  onCheckAnswers,
  isReviewMode = false,
  // Props from Engine
  sections = [],           // LE parts array (2–3 items)
  allSections = [],        // full global sections array (vocab, reading, LE parts, listening…)
  activeSkillTab = 0,
  activeSectionIndex = 0,
  setActiveSectionIndex,
  setActivePassageIndex,
  setIsReviewMode,
  availableSkills = []
}) => {
  // Map global activeSectionIndex to local LE part index
  const lePartIds = sections.map(p => p.id);
  const currentGlobalSection = allSections[activeSectionIndex];
  const localIndex = currentGlobalSection ? lePartIds.indexOf(currentGlobalSection.id) : 0;
  const currentPart = sections[localIndex] || sections[0] || {};

  // Wrap onUpdate for both object and key-value formats
  const handleLeUpdate = (updates) => {
    if (typeof updates === 'object' && !Array.isArray(updates)) {
      Object.entries(updates).forEach(([key, val]) => {
        onUpdate(key, val);
      });
    } else {
      onUpdate(updates);
    }
  };

  // Content resolution (full mock uses passages[0], atoms use direct)
  const currentPassage = currentPart?.passages?.[0] || currentPart || {};
  const content = currentPassage?.content || data?.content;
  const title = currentPart?.title || data?.title;
  const subtitle = currentPassage?.subtitle || data?.subtitle;
  const subTasks = currentPassage?.subTasks || currentPart?.subTasks || [];

  // Gap-fill tokens
  const isGapFillTokens = subTasks[0]?.type === 'gap-fill-tokens';
  const renderInteractiveGaps = (text) => {
    if (!text || !isGapFillTokens) return <div className="invictus-passage-text" dangerouslySetInnerHTML={{ __html: text }} />;
    const parts = text.split(/____\((\d+)\)____/g);
    return (
      <div className="invictus-passage-text">
        {parts.map((part, idx) => {
          if (idx % 2 === 0) return <span key={idx} dangerouslySetInnerHTML={{ __html: part }} />;
          const gapNum = parseInt(part);
          const answerKey = gapNum <= 30 ? gapNum : gapNum - 30;
          const selectedToken = userAnswers?.[answerKey] || userAnswers?.[String(answerKey)];
          return (
            <span key={idx} className={`interactive-gap ${selectedToken ? 'filled' : 'empty'}`}>
              {selectedToken || '____'}
            </span>
          );
        })}
      </div>
    );
  };

  // Flatten questions
  const flatQuestions = flattenQuestions(subTasks);
  const useCarousel = true;

  // Question range display
  const getQuestionRange = () => {
    if (flatQuestions.length === 0) return 'Questions';
    const extractIds = (items) => {
      const ids = [];
      items.forEach(item => {
        if (item.questions) item.questions.forEach(q => {
          const numId = parseInt(String(q.id).replace(/\D/g, ''), 10);
          ids.push(numId);
        });
        else if (item.labels) item.labels.forEach(l => {
          const numId = parseInt(String(l.id).replace(/\D/g, ''), 10);
          ids.push(numId);
        });
        else if (item.id) {
          const numId = parseInt(String(item.id).replace(/\D/g, ''), 10);
          ids.push(numId);
        }
      });
      return ids.filter(id => !isNaN(id));
    };
    const ids = extractIds(flatQuestions).sort((a, b) => a - b);
    return ids.length ? `Questions ${ids[0]}${ids.length > 1 ? `-${ids[ids.length-1]}` : ''}` : 'Questions';
  };

  return (
    <div className="invictus-language-elements-layout language-elements-wrapper">
      <SplitPane
        content={
          <>
            {(title || subtitle) && (
              <div className="invictus-content-header">
                {subtitle && <p className="invictus-content-subtitle">{subtitle}</p>}
                {title && <h2 className="invictus-content-title">{title}</h2>}
              </div>
            )}
            {/* Passage content */}
            {typeof content === 'string' ? (
              isGapFillTokens ? renderInteractiveGaps(content) : <div className="invictus-passage-text" dangerouslySetInnerHTML={{ __html: content }} />
            ) : Array.isArray(content) ? (
              content.map((item, index) => {
                const pId = typeof item === 'object' ? item.id : null;
                const pText = typeof item === 'object' ? (item.text || item.passage) : item;
                return (
                  <div key={index} className="invictus-paragraph-wrapper">
                    {pId && <span className="invictus-paragraph-letter">{pId}</span>}
                    {isGapFillTokens ? renderInteractiveGaps(pText) : <div className="invictus-passage-text" dangerouslySetInnerHTML={{ __html: pText }} />}
                  </div>
                );
              })
            ) : (
              <div className="invictus-passage-text">No content available</div>
            )}
          </>
        }
        exercise={
          <div className="invictus-question-column">
            <h2 className="invictus-total-range">{getQuestionRange()}</h2>
            {flatQuestions.length > 0 ? (
              useCarousel ? (
                <QuestionCarousel
                  key={flatQuestions.map(q => q.id).join('-')}
                  questions={flatQuestions}
                  renderQuestion={(q) => (
                    <QuestionDispatcher
                      data={q}
                      userAnswers={userAnswers}
                      onUpdate={handleLeUpdate}
                      isReviewMode={isReviewMode}
                      passageContent={content}
                    />
                  )}
                  showInstruction={true}
                  onIndexChange={onQuestionIndexChange}
                  hasNextPassage={navigationProps?.hasNextPassage}
                  hasNextSection={navigationProps?.hasNextSection}
                  onNextPart={navigationProps?.onNextPart}
                  showCheckAnswers={showCheckAnswers}
                  onCheckAnswers={onCheckAnswers}
                  isReviewMode={isReviewMode}
                  sections={allSections}                // full global sections
                  activeSkillTab={activeSkillTab}
                  activeSectionIndex={activeSectionIndex}  // global index
                  setActiveSectionIndex={setActiveSectionIndex}
                  setActivePassageIndex={setActivePassageIndex}
                  setIsReviewMode={setIsReviewMode}
                  availableSkills={availableSkills}
                  sectionParts={sections}                 // only LE parts for tab rendering
                  showPartsTabs={sections.length > 1}
                />
              ) : (
                <div className="invictus-static-list">
                  {flatQuestions.map((q, idx) => (
                    <QuestionDispatcher
                      key={q.id || idx}
                      data={q}
                      userAnswers={userAnswers}
                      onUpdate={handleLeUpdate}
                      isReviewMode={isReviewMode}
                      passageContent={content}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="no-questions-message">
                <p>No questions available for this section.</p>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

export default LanguageElementsBlock;