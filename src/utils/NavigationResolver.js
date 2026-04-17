/**
 * NavigationResolver - Centralized navigation logic
 * 
 * This module handles all "navigation thinking" - parsing routes,
 * determining which view to show, and what state to set.
 * It returns a "plan" object that App.jsx can execute.
 */

import { HUBS } from '../data/index';
import { getAtomsFromMocks } from './mockPlucker';

/**
 * Resolve a path/initialView into a navigation plan
 * 
 * @param {string} path - The route path (e.g., 'telc_b1_reading', 'drillshub', 'vocab-flashcards')
 * @returns {object} plan - The navigation plan
 * @returns {string} plan.view - The view to set ('telc-b1-hub', 'drillsHub', 'selection', 'lesson')
 * @returns {string[]} plan.viewHistory - The view history to set
 * @returns {object|null} plan.activeCategory - The active category/hub to set
 * @returns {object|null} plan.activeSection - The active section to set
 * @returns {object|null} plan.triggerTask - If present, call handleStartTask with this metadata
 * @returns {object|null} plan.triggerFullTest - If present, call handleFullTestSelection with this
 */
export const resolvePath = (path) => {
  // Default plan - go to telc-b2-hub
  const defaultPlan = {
    view: 'telc-b2-hub',
    viewHistory: ['telc-b2-hub'],
    activeCategory: null,
    activeSection: null,
    triggerTask: null,
    triggerFullTest: null,
  };

  if (!path || path === 'telc-b2-hub' || path === 'telcHub') {
    return defaultPlan;
  }

  // Handle mywords view
  if (path === 'mywords') {
    return {
      view: 'mywords',
      viewHistory: ['mywords'],
      activeCategory: null,
      activeSection: null,
      triggerTask: null,
      triggerFullTest: null,
    };
  }

  // Handle vocabulary hub route
  if (path === 'vocabulary') {
    return {
      view: 'drillsHub',
      viewHistory: ['drillsHub'],
      activeCategory: HUBS.vocabulary,
      activeSection: null,
      triggerTask: null,
      triggerFullTest: null,
    };
  }

  // TELC Level Hub routes
  if (path === 'telc-b1-hub') {
    return {
      view: 'telc-b1-hub',
      viewHistory: ['telc-b1-hub'],
      activeCategory: null,
      activeSection: null,
      triggerTask: null,
      triggerFullTest: null,
    };
  }

  if (path === 'telc-b2-hub') {
    return {
      view: 'telc-b2-hub',
      viewHistory: ['telc-b2-hub'],
      activeCategory: null,
      activeSection: null,
      triggerTask: null,
      triggerFullTest: null,
    };
  }

  if (path === 'telc-c1-hub') {
    return {
      view: 'telc-c1-hub',
      viewHistory: ['telc-c1-hub'],
      activeCategory: null,
      activeSection: null,
      triggerTask: null,
      triggerFullTest: null,
    };
  }

  // Mini test routes for each level
  if (path === 'telc-b1-mini-test') {
    return {
      view: 'lesson',
      viewHistory: ['lesson'],
      activeCategory: null,
      activeSection: null,
      triggerTask: { id: 'telc-b1-mini-test', skill: 'mini-test', level: 'b1' },
      triggerFullTest: null,
    };
  }

  if (path === 'telc-b2-mini-test') {
    return {
      view: 'lesson',
      viewHistory: ['lesson'],
      activeCategory: null,
      activeSection: null,
      triggerTask: { id: 'telc-b2-mini-test', skill: 'mini-test', level: 'b2' },
      triggerFullTest: null,
    };
  }

  if (path === 'telc-c1-mini-test') {
    return {
      view: 'lesson',
      viewHistory: ['lesson'],
      activeCategory: null,
      activeSection: null,
      triggerTask: { id: 'telc-c1-mini-test', skill: 'mini-test', level: 'c1' },
      triggerFullTest: null,
    };
  }

  // Normalize hubKey: convert hyphens to underscores to match HUBS keys
  const hubKey = path.replace(/-/g, '_');

  // Check if it's a hub route (HUBS object keys)
  if (HUBS[hubKey]) {
    const hub = HUBS[hubKey];
    
    // If hub has only 1 category, skip directly to selection
    if (hub.categories && hub.categories.length === 1) {
      return {
        view: 'selection',
        viewHistory: ['selection'],
        activeCategory: hub,
        activeSection: hub.categories[0],
        triggerTask: null,
        triggerFullTest: null,
      };
    }
    
    // Multiple categories - show the hub view
    return {
      view: 'drillsHub',
      viewHistory: ['drillsHub'],
      activeCategory: hub,
      activeSection: null,
      triggerTask: null,
      triggerFullTest: null,
    };
  }

  // Check for reading-drills or listening-drills
  if (path === 'reading-drills' || path === 'listening-drills') {
    const hydratedSection = getAtomsFromMocks(path);
    return {
      view: 'selection',
      viewHistory: ['selection'],
      activeCategory: null,
      activeSection: hydratedSection,
      triggerTask: null,
      triggerFullTest: null,
    };
  }

  // For any other route not matching known patterns, go to telc-b2-hub
  return defaultPlan;
};

/**
 * Check if a section should trigger immediate task starting
 * 
 * @param {object} section - The section object
 * @returns {boolean} - True if the section should start immediately
 */
export const shouldStartTaskImmediately = (section) => {
  if (!section) return false;
  
  // Check for VOCAB_FLASHCARDS type
  if (section.type === 'VOCAB_FLASHCARDS') {
    return true;
  }
  
  // Check for TASK type and other allowed task types
  const allowedTaskTypes = ['TASK', 'VOCAB_FLASHCARDS', 'VOCAB', 'reading-drill', 'punctuation-correction'];
  if (section.type && allowedTaskTypes.includes(section.type)) {
    return true;
  }
  
  return false;
};

/**
 * Resolve a section selection into a navigation plan
 * 
 * @param {object} section - The section object
 * @param {object} activeCategory - The current active category
 * @returns {object} plan - The navigation plan
 */
export const resolveSection = (section, activeCategory) => {
  // Check if this should trigger immediate task starting
  if (shouldStartTaskImmediately(section)) {
    return {
      view: 'lesson',
      viewHistory: ['lesson'],
      activeCategory: activeCategory,
      activeSection: null,
      triggerTask: section,
      triggerFullTest: null,
    };
  }
  
  // If this is from the DRILLS_HUB, use standard behavior
  if (activeCategory && activeCategory.title === "Drills Hub") {
    return {
      view: 'selection',
      viewHistory: ['selection'],
      activeCategory: activeCategory,
      activeSection: section,
      triggerTask: null,
      triggerFullTest: null,
    };
  }
  
  // If this is an 'atom' section, go pluck the tasks from the mocks
  if (section.id === 'reading-drills' || section.id === 'listening-drills') {
    const hydratedSection = getAtomsFromMocks(section.id);
    return {
      view: 'selection',
      viewHistory: ['selection'],
      activeCategory: activeCategory,
      activeSection: hydratedSection,
      triggerTask: null,
      triggerFullTest: null,
    };
  }
  
  // Standard behavior for normal lessons
  return {
    view: 'selection',
    viewHistory: ['selection'],
    activeCategory: activeCategory,
    activeSection: section,
    triggerTask: null,
    triggerFullTest: null,
  };
};