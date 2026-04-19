import React from 'react';
import { BookOpen, Mic, Headset, PenTool, Zap, FileText } from 'lucide-react';

/**
 * LessonHeaderTabs Component
 * 
 * Renders the section/skill tabs in the header during lessons.
 * Handles both:
 * - Multiple skills flow (Vocab/Reading/Writing/Speaking/Listening)
 * - Single skill flow (Part 1/2/3)
 */
const LessonHeaderTabs = ({
  activeLesson,
  activeSectionIndex,
  activeSkillTab,
  setActiveSectionIndex,
  setActiveSkillTab,
  setIsReviewMode,
  setActivePassageIndex
}) => {
  if (!activeLesson) return null;

  console.log('[LessonHeaderTabs] Render - activeLesson:', activeLesson?.title);
  console.log('[LessonHeaderTabs] Sections:', activeLesson?.sections?.map(s => ({ skill: s.skill, type: s.type, title: s.title })));
  
  const sections = activeLesson.sections || activeLesson.passages || [];
  const hasMultipleSkills = sections.some(s => s.skill);

  // Combined flow: Vocab, Reading, Writing, Speaking, Listening
  if (hasMultipleSkills) {
    const skillOrder = ['vocab', 'reading', 'language-elements', 'listening', 'speaking', 'writing'];
    const availableSkills = skillOrder.filter(skill => 
      sections.some(s => s.skill === skill)
    );

    return (
      <div className="header-tabs">
        {availableSkills.map((skill, idx) => (
          <button 
            key={skill} 
            onClick={() => { 
              const skillSectionIdx = sections.findIndex(s => s.skill === skill);
              setActiveSkillTab(idx);
              setActiveSectionIndex(skillSectionIdx >= 0 ? skillSectionIdx : 0); 
              if (setActivePassageIndex) setActivePassageIndex(0); 
              setIsReviewMode(false); 
            }} 
            className={`header-tab ${sections[activeSectionIndex]?.skill === skill ? 'active' : ''}`}
          >
            {skill === 'vocab' ? (
              <><Zap size={14} /></>
            ) : skill === 'reading' ? (
              <><BookOpen size={14} /></>
            ) : skill === 'listening' ? (
              <><Headset size={14} /></>
            ) : skill === 'writing' ? (
              <><PenTool size={14} /></>
            ) : skill === 'speaking' ? (
              <><Mic size={14} /></>
            ) : skill === 'language-elements' ? (
              <><FileText size={14} /></>
            ) : (
              skill
            )}
          </button>
        ))}
      </div>
    );
  }

  // Single skill flow: show section tabs and passage tabs
  if (sections.length > 1) {
    return (
      <div className="header-tabs">
        {sections.map((s, idx) => (
          <button 
            key={idx} 
            onClick={() => { 
              setActiveSectionIndex(idx); 
              if (setActivePassageIndex) setActivePassageIndex(0); 
              setIsReviewMode(false); 
            }} 
           className={`header-tab ${sections[activeSectionIndex]?.skill === skill ? 'active' : ''}`}
          >
            {s.skill === 'vocab' ? (
              <><Zap size={14} /> Vocab</>
            ) : s.skill === 'language-elements' ? (
              <><PenTool size={14} /></>
            ) : s.skill === 'reading' ? (
              <><BookOpen size={14} /></>
            ) : s.skill === 'listening' ? (
              <><Headset size={14} /></>
            ) : s.skill === 'writing' ? (
              <><PenTool size={14} /></>
            ) : s.skill === 'speaking' ? (
              <><Mic size={14} /></>
            ) : s.type === 'discussion' ? (
              <><Mic size={14} /> Part 3</>
            ) : s.type === 'interview' ? (
              <><Mic size={14} /> Part 1</>
            ) : s.type === 'long-turn' ? (
              <><Mic size={14} /> Part 2</>
            ) : s.type === 'LISTENING' ? (
              <><Headset size={14} /> Listening</>
            ) : s.type === 'WRITING' ? (
              <><PenTool size={14} /> Writing</>
            ) : s.type === 'LANGUAGE_ELEMENTS' ? (
              <><FileText size={14} /></>
            ) : s.type === 'VOCAB' ? (
              <><Zap size={14} /> Vocab</>
            ) : (s.type && (s.type.includes('reading') || s.type === 'reading-practice' || s.type.includes('ielts'))) ? (
              <><BookOpen size={14} /> Reading</>
            ) : (
              `Part ${idx + 1}`
            )}
          </button>
        ))}
      </div>
    );
  }

  return null;
};

export default LessonHeaderTabs;
