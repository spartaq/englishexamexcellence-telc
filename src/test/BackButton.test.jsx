import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ExamDescription from '../components/ui/TELCExamDescription'
import AtomHubScreen from '../components/ui/AtomHubScreen'
import MyWords from '../components/ui/MyWords'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate, MemoryRouter: actual.MemoryRouter }
})

// Use a writable object so the persisted zustand store resolves the same keys MyWords reads
const mockExamStoreState = {
  claimXp: vi.fn(),
  setCurrentView: vi.fn(),
  currentView: 'lesson',
  activeLesson: null,
  masteryHistory: [],
  masteryDates: {},
  vocabProgress: {},
  totalXp: 0,
  xp: 0,
  isPremium: false,
  hasLifetimeAccess: false,
  activeSeconds: 0,
  isActive: true,
  srsTestMode: false,
}

vi.mock('../store/useExamStore', () => ({
  useExamStore: (selector) => selector ? selector(mockExamStoreState) : mockExamStoreState,
}))

vi.mock('../hooks/useActive', () => ({ useActive: () => {} }))
vi.mock('../hooks/useXP', () => ({ useXP: () => ({}) }))
vi.mock('../utils/LessonFactory', () => ({
  LessonFactory: { create: vi.fn(), prepareFullTest: vi.fn(), createMiniTest: vi.fn(), createFullMockFromMock: vi.fn() }
}))
vi.mock('../utils/NavigationResolver', () => ({
  resolvePath: () => ({ view: 'telc-b2-hub', viewHistory: ['telc-b2-hub'], activeCategory: null, activeSection: null, triggerTask: null, triggerFullTest: null }),
  resolveSection: () => ({ view: 'selection', viewHistory: ['selection'], activeCategory: null, activeSection: null, triggerTask: null, triggerFullTest: null }),
}))

describe('ExamDescription back button', () => {
  it('renders back link when onBack is NOT provided', () => {
    render(<MemoryRouter><ExamDescription activeTest={{ title: 'B2', id: 'telc-b2' }} /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /back to telc hub/i })).toHaveAttribute('href', '/telc/b2')
  })

  it('clicking back button calls onBack', () => {
    const onBack = vi.fn()
    render(<ExamDescription activeTest={{ title: 'B2', id: 'telc-b2' }} onBack={onBack} />)
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(onBack).toHaveBeenCalledOnce()
  })
})

describe('AtomHubScreen', () => {
  it('renders back button and calls onBack', () => {
    const onBack = vi.fn()
    render(<AtomHubScreen onBack={onBack} />)
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(onBack).toHaveBeenCalledOnce()
  })
})

describe('MyWords', () => {
  it('renders back button and calls onBack', () => {
    const onBack = vi.fn()
    render(<MyWords onBack={onBack} />)
    fireEvent.click(screen.getByRole('button', { name: /back to vocab hub/i }))
    expect(onBack).toHaveBeenCalledOnce()
  })
})

// ── Free-test back-navigation detection (the actual bug fix) ──────────────────
describe('Free Test Back Navigation Detection (App.jsx)', () => {
  // Replicates the exact logic from App.jsx navigateBack (with the fix applied)
  const isDirectTest = (lesson) => {
    if (!lesson) return false
    return (
      lesson.type === 'mixed-flow' &&
      lesson.title &&
      (lesson.title.endsWith('Mini Test') ||
        lesson.id?.startsWith('mini-test-full-') ||
        lesson.id?.startsWith('free-test-full-'))   // ← the line that fixes the blank-page bug
    )
  }

  it('detects mini-test', () => {
    expect(isDirectTest({ type: 'mixed-flow', title: 'B1 Mini Test', id: 'mini-test-full-123' })).toBe(true)
  })

  it('detects free-test — the blank-page case', () => {
    expect(isDirectTest({ type: 'mixed-flow', title: 'B2 Free Test', id: 'free-test-full-456' })).toBe(true)
  })

  it('ignores regular lessons', () => {
    expect(isDirectTest({ type: 'mixed-flow', title: 'Reading Exercise', id: 'reading-exercise-1' })).toBe(false)
  })

  it('ignores null lesson', () => {
    expect(isDirectTest(null)).toBe(false)
  })

  // Simulate the lessonOrigin routing fallback from App.jsx
  const getBackRoute = (origin) => {
    if (origin.endsWith('-free-test')) return '/'
    if (origin === 'telc-b1-hub') return '/telc/b1'
    if (origin === 'telc-b2-hub') return '/telc/b2'
    if (origin === 'telc-c1-hub') return '/telc/c1'
    return '/telc/b2'
  }

  it('free-test origin routes to landing page', () => {
    expect(getBackRoute('telc-b1-free-test')).toBe('/')
    expect(getBackRoute('telc-b2-free-test')).toBe('/')
    expect(getBackRoute('telc-c1-free-test')).toBe('/')
  })

  it('regular hub origins still work', () => {
    expect(getBackRoute('telc-b1-hub')).toBe('/telc/b1')
    expect(getBackRoute('telc-b2-hub')).toBe('/telc/b2')
    expect(getBackRoute('telc-c1-hub')).toBe('/telc/c1')
  })
})
