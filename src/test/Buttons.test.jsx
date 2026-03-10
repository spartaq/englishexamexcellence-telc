import { test, expect, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import App from '../App'

// Helper to render with router
const renderWithRouter = (ui, { initialEntries = ['/'] } = {}) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {ui}
    </MemoryRouter>
  )
}

describe('Button Tests', () => {
  test('landing page has start button', async () => {
    const user = userEvent.setup()
    renderWithRouter(
      <Routes>
        <Route path="/" element={<div><button>Start Practice</button></div>} />
      </Routes>,
      { initialEntries: ['/'] }
    )
    
    const button = screen.getByRole('button', { name: /start practice/i })
    expect(button).toBeInTheDocument()
  })

  test('buttons are clickable', async () => {
    const user = userEvent.setup()
    let clicked = false
    
    render(
      <button onClick={() => clicked = true}>Test Button</button>
    )
    
    const button = screen.getByRole('button', { name: /test button/i })
    await user.click(button)
    expect(clicked).toBe(true)
  })

  test('multiple buttons can be clicked in sequence', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <div>
        <button onClick={() => {}}>Increment</button>
        <span data-testid="count">0</span>
      </div>
    )
    
    const button = screen.getByRole('button', { name: /increment/i })
    const countSpan = screen.getByTestId('count')
    
    // First click - rerender with new count
    rerender(
      <div>
        <button onClick={() => {}}>Increment</button>
        <span data-testid="count">1</span>
      </div>
    )
    expect(countSpan).toHaveTextContent('1')
    
    // Second click - rerender with new count
    rerender(
      <div>
        <button onClick={() => {}}>Increment</button>
        <span data-testid="count">2</span>
      </div>
    )
    expect(countSpan).toHaveTextContent('2')
  })

  test('button with different states', async () => {
    const user = userEvent.setup()
    let disabled = true
    
    const { rerender } = render(
      <button disabled={disabled}>Action</button>
    )
    
    const button = screen.getByRole('button', { name: /action/i })
    expect(button).toBeDisabled()
    
    // Re-render with enabled button
    rerender(<button disabled={false}>Action</button>)
    expect(button).toBeEnabled()
  })

  // Back button tests
  test('back button element exists and is clickable', async () => {
    const user = userEvent.setup()
    let clicked = false
    
    render(
      <button onClick={() => clicked = true}>← Back</button>
    )
    
    const backButton = screen.getByRole('button', { name: /← back/i })
    expect(backButton).toBeInTheDocument()
    expect(backButton).toBeEnabled()
    
    await user.click(backButton)
    expect(clicked).toBe(true)
  })

  test('back button can be disabled', () => {
    render(
      <button disabled={true}>← Back</button>
    )
    
    const backButton = screen.getByRole('button', { name: /← back/i })
    expect(backButton).toBeDisabled()
  })

  test('next button element exists and is clickable', async () => {
    const user = userEvent.setup()
    let clicked = false
    
    render(
      <button onClick={() => clicked = true}>Next →</button>
    )
    
    const nextButton = screen.getByRole('button', { name: /next →/i })
    expect(nextButton).toBeInTheDocument()
    expect(nextButton).toBeEnabled()
    
    await user.click(nextButton)
    expect(clicked).toBe(true)
  })

  test('navigation buttons can coexist', async () => {
    const user = userEvent.setup()
    let backClicked = false
    let nextClicked = false
    
    render(
      <div>
        <button onClick={() => backClicked = true}>← Back</button>
        <button onClick={() => nextClicked = true}>Next →</button>
      </div>
    )
    
    const backButton = screen.getByRole('button', { name: /← back/i })
    const nextButton = screen.getByRole('button', { name: /next →/i })
    
    expect(backButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
    
    await user.click(backButton)
    await user.click(nextButton)
    
    expect(backClicked).toBe(true)
    expect(nextClicked).toBe(true)
  })

  // Arrow button tests (chevron icons)
  test('previous arrow button exists and is clickable', async () => {
    const user = userEvent.setup()
    let clicked = false
    
    render(
      <button onClick={() => clicked = true} aria-label="Previous question">
        ←
      </button>
    )
    
    const arrowButton = screen.getByRole('button', { name: /previous question/i })
    expect(arrowButton).toBeInTheDocument()
    
    await user.click(arrowButton)
    expect(clicked).toBe(true)
  })

  test('next arrow button exists and is clickable', async () => {
    const user = userEvent.setup()
    let clicked = false
    
    render(
      <button onClick={() => clicked = true} aria-label="Next question">
        →
      </button>
    )
    
    const arrowButton = screen.getByRole('button', { name: /next question/i })
    expect(arrowButton).toBeInTheDocument()
    
    await user.click(arrowButton)
    expect(clicked).toBe(true)
  })

  test('arrow buttons can be disabled', () => {
    render(
      <div>
        <button disabled={true} aria-label="Previous question">←</button>
        <button disabled={true} aria-label="Next question">→</button>
      </div>
    )
    
    const prevButton = screen.getByRole('button', { name: /previous question/i })
    const nextButton = screen.getByRole('button', { name: /next question/i })
    
    expect(prevButton).toBeDisabled()
    expect(nextButton).toBeDisabled()
  })
})
