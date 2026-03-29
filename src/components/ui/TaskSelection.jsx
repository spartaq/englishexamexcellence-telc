import React from 'react';
import { ArrowLeft, Zap, Clock, Play, Lock } from 'lucide-react';
import { useExamStore } from '../../store/useExamStore'; // Adjust path to your store
import './TaskSelection.css';

const TaskSelection = ({ section, onBack, onSelectTask }) => {
  // 1. Get premium status from global store
  const isPremium = useExamStore(state => state.isPremium);

  if (!section) return null;

  // Check if a specific task was selected (from DrillsHub)
  const selectedTask = section.selectedTask;
  const tasksToShow = selectedTask ? [selectedTask] : (section.tasks || []);

  // Safety check for tasks array
  if (!tasksToShow || !Array.isArray(tasksToShow) || tasksToShow.length === 0) {
    return (
      <div className="task-selection-view">
        <header className="selection-header">
          <h2 className="selection-title">{section.title}</h2>
        </header>
        <div className="task-list">
          <p className="no-tasks-message">No tasks available for this section.</p>
        </div>
      </div>
    );
  }

  // Filter out quick flash tasks, but keep selectedTask if it exists
  const filteredTasks = tasksToShow.filter(task => {
    if (section.selectedTask && task.id === section.selectedTask.id) {
      return true; // Always include selectedTask
    }
    return !task.isQuickFlash;
  });

  return (
    <div className="task-selection-view">
      <header className="selection-header">
        <h2 className="selection-title">{section.title}</h2>
      </header>
      
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="no-tasks-message">No tasks available for this section.</p>
        ) : (
          filteredTasks.map(task => {
            // 2. Calculate if this specific task is locked
            // Task is locked if it's NOT bronze and user is NOT premium
            const isLocked = task.tier !== 'bronze' && !isPremium;

            return (
              <div 
                key={task.id} 
                className={`task-item-compact ${isLocked ? 'is-locked' : ''}`}
                onClick={() => onSelectTask(task)}
              >
              <div className="task-info-main">
                <div className="task-title-row">
                  <h4>{task.title}</h4>
                  {/* Visual Tier Indicator */}
                  <span className={`tier-badge ${task.tier || 'bronze'}`}>
                    {task.tier || 'bronze'}
                  </span>
                  {/* Level Badge (B2/C1) */}
                  {task.level && (
                    <span className={`level-badge ${task.level.toLowerCase()}`}>
                      {task.level}
                    </span>
                  )}
                </div>

                <div className="task-meta">
                  <span className="meta-item">
                    <Zap size={12} fill="var(--xp-amethyst)" color="var(--xp-amethyst)" /> 
                    {task.xpReward || task.xp || (task.words ? task.words.length * 10 : 0)} XP
                  </span>
                  {task.time && (
                    <span className="meta-item">
                      <Clock size={12} /> {task.time}
                    </span>
                  )}
                  {task.words && (
                    <span className="meta-item">
                      {task.words.length} words
                    </span>
                  )}
                </div>
              </div>

              {/* 3. Conditional Icon: Lock vs Play */}
              <div className={isLocked ? "lock-container" : "play-container"}>
                {isLocked ? (
                  <Lock size={16} />
                ) : (
                  <Play size={16} fill="currentColor" />
                )}
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
};

export default TaskSelection;