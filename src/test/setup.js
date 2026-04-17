import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { vi, h } from 'vitest'
import React from 'react'

// Mock components that rely on browser APIs not available in jsdom
vi.mock('../components/engine/QuestionCarousel', () => ({
  default: ({ questions, renderQuestion }) => {
    const items = questions.map((q, idx) => 
      React.createElement('div', { key: q.id || idx, 'data-testid': `question-${idx}` }, renderQuestion(q))
    )
    return React.createElement('div', { 'data-testid': 'question-carousel' }, items)
  }
}))

vi.mock('../components/engine/SplitPane', () => ({
  default: ({ content, exercise }) => {
    return React.createElement('div', null, [
      React.createElement('div', { key: 'split-pane-content', 'data-testid': 'split-pane-content' }, content),
      React.createElement('div', { key: 'split-pane-exercise', 'data-testid': 'split-pane-exercise' }, exercise)
    ])
  }
}))

afterEach(() => {
  cleanup()
})
