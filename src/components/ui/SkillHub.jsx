import React from 'react';
import { ArrowLeft, Trophy, Dumbbell, Zap, Layers } from 'lucide-react';
import { VOCAB_HUB } from '../../data/vocabulary';
import './hub.css';

const icons = { 'mock-tests': Trophy, 'skill-drills': Dumbbell };

// Helper to get random items from array
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const SkillHub = ({ data, onBack, onSelectSection, backButtonText = 'Back' }) => {
  // Use the passed data prop directly
  const hub = data;

  if (!hub) return <div style={{padding: '40px'}}>Hub data coming soon!</div>;

  // Safety check: ensure categories is an array
  const categories = hub.categories || [];

  // Check if this is Vocab Lab
  const isVocabLab = hub.title === 'Vocab Lab';

  // Get all words from a category (for VOCAB_LEVELS structure)
  const getAllWordsFromCategory = (category) => {
    // If category has tasks with words, use those
    if (category.tasks && category.tasks.length > 0) {
      const words = [];
      category.tasks.forEach(task => {
        if (task.words && !task.isQuickFlash) {
          task.words.forEach(word => {
            words.push({ ...word, _sourceTask: task.title, _sourceTopic: category.title });
          });
        }
      });
      return words;
    }
    return [];
  };

  // Get words from VOCAB_HUB based on level
  const getWordsByLevel = (level) => {
    const words = [];
    VOCAB_HUB.categories.forEach(cat => {
      cat.tasks.forEach(task => {
        if (task.level === level && task.words) {
          task.words.forEach(word => {
            words.push({ ...word, _sourceTask: task.title, _sourceTopic: cat.title });
          });
        }
      });
    });
    return words;
  };

  // Handle quick flash - starts immediately with 15 random words
  const handleQuickFlash = (category) => {
    // Get words based on level from VOCAB_HUB
    let level = category.level;
    
    // If no level property, try to get from title
    if (!level) {
      if (category.title && category.title.includes('C1')) {
        level = 'C1';
      } else if (category.title && category.title.includes('B2')) {
        level = 'B2';
      } else {
        level = 'B2'; // default
      }
    }
    
    // Get all words from VOCAB_HUB for this level
    let allWords = [];
    try {
      if (VOCAB_HUB && VOCAB_HUB.categories) {
        VOCAB_HUB.categories.forEach(cat => {
          if (cat.tasks) {
            cat.tasks.forEach(task => {
              if (task.level === level && task.words) {
                task.words.forEach(word => {
                  allWords.push({ 
                    ...word, 
                    _sourceTask: task.title, 
                    _sourceTopic: cat.title 
                  });
                });
              }
            });
          }
        });
      }
    } catch (e) {
      console.error('Error getting words:', e);
    }
    
    // If no words found, try to get from category tasks directly
    if (allWords.length === 0 && category.tasks) {
      category.tasks.forEach(task => {
        if (task.words && !task.isQuickFlash) {
          task.words.forEach(word => {
            allWords.push({ ...word, _sourceTask: task.title });
          });
        }
      });
    }
    
    // Get random words - use all if less than 15
    const wordCount = Math.min(15, allWords.length);
    const randomWords = getRandomItems(allWords, wordCount || allWords.length);
    
    // Only start the task if there are words available
    if (randomWords.length === 0) {
      return; // Abort if no words available
    }
    
    // Create and start the task immediately
    onSelectSection({
      id: `quickflash_level_${level.toLowerCase()}`,
      type: 'VOCAB_FLASHCARDS',
      title: `Quick Flash - ${level}`,
      tier: 'bronze',
      level: level,
      isRandomMix: true,
      isQuickFlash: true,
      xp: randomWords.length * 10,
      words: randomWords
    });
  };

  // Handle browse - go to category list (existing behavior)
  const handleBrowse = (category) => {
    onSelectSection && onSelectSection(category);
  };

  return (
    <>
      <title>{hub.title} - Skill Training Hub</title>
      <meta name="description" content={hub.description} />
      <div className="hub-container">
      <header className="hub-header">
        <div className="hub-badge" style={{textTransform: 'capitalize'}}>{hub.title}</div>
      </header>

      <div className="hub-hero">
        <h1>{hub.title}</h1>
        <p>{hub.description}</p>
      </div>

<div className="hub-sections">
  {(categories || []).map(cat => {
    const Icon = icons[cat.id] || Trophy;
    const isVocabCategory = isVocabLab;
    
    return (
      <div 
        key={cat.id} 
        className={`hub-section-card ${isVocabCategory ? 'vocab-topic-card' : ''}`}
      >
        <div className="section-icon-wrapper">
          <Icon size={24} color="var(--lab-indigo)" />
        </div>
        <div className="section-info">
          <h3>{cat.title}</h3>
          <p>{cat.description}</p>
          
          {/* Two buttons for Vocab Lab topics: Browse and Quick Flash */}
          {isVocabCategory && (
            <div className="vocab-topic-actions">
              <button 
                className="vocab-action-btn browse-btn"
                onClick={() => handleBrowse(cat)}
              >
                <Layers size={14} /> Browse
              </button>
              <button 
                className="vocab-action-btn flash-btn"
                onClick={() => handleQuickFlash(cat)}
              >
                <Zap size={14} /> Quick Flash
              </button>
            </div>
          )}
        </div>
      </div>
    );
  })}
</div>


     </div>
    </>
  );
};

export default SkillHub;
