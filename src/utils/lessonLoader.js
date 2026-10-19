// Engine utilities for loading lessons

// Load a full lesson by merging metadata with content from the database
export const loadFullLesson = (metadata, lessonDatabase) => {
  // If we are loading a vocab lesson, we look in the database
  const content = lessonDatabase[metadata.id];
  
  if (!content) {
    console.error(`FATAL: No content found in database for ID: ${metadata.id}`);
    return metadata;
  }

  // Merge metadata first, then content
  const merged = { ...metadata, ...content };

  // Preserve metadata type for all drills - they use their own type field
  // Check for various drill naming patterns: 'drill', 'comma', 'find-'
  const isDrill = metadata.id?.includes('drill') || 
                  metadata.id?.includes('comma') || 
                  metadata.id?.includes('find-');
  if (metadata.type && !isDrill) {
    merged.type = metadata.type;
  }
  
  return merged;
};

// Get a hub from exam config
export const getHub = (examConfig, testType, skill) => {
  return examConfig[testType]?.modules[skill] || null;
};
