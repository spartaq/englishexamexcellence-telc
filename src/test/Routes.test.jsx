import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Routes, Route, MemoryRouter } from 'react-router-dom'
import LandingPage from '../components/LandingPage/LandingPage'
import TestPage from '../components/TestPage'
import App from '../App'

// Helper to render with router
const renderWithRouter = (ui, { initialEntries = ['/'] } = {}) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {ui}
    </MemoryRouter>
  )
}

describe('Route Tests', () => {
  it('renders landing page at root route', () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>,
      { initialEntries: ['/'] }
    )
    
    // Landing page should have a heading or content
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('renders dashboard at /dashboard route', () => {
    renderWithRouter(
      <Routes>
        <Route path="/dashboard" element={<App />} />
      </Routes>,
      { initialEntries: ['/dashboard'] }
    )
    
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('renders test page at /test route', () => {
    renderWithRouter(
      <Routes>
        <Route path="/test" element={<TestPage />} />
      </Routes>,
      { initialEntries: ['/test'] }
    )
    
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  // Test IELTS routes
  it('renders IELTS general mini test route', () => {
    renderWithRouter(
      <Routes>
        <Route path="/dashboard/ielts-general-mini-test" element={<App initialView="ielts-general-mini-test" />} />
      </Routes>,
      { initialEntries: ['/dashboard/ielts-general-mini-test'] }
    )
    
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('renders IELTS academic mini test route', () => {
    renderWithRouter(
      <Routes>
        <Route path="/dashboard/ielts-academic-mini-test" element={<App initialView="ielts-academic-mini-test" />} />
      </Routes>,
      { initialEntries: ['/dashboard/ielts-academic-mini-test'] }
    )
    
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('renders reading-ac route', () => {
    renderWithRouter(
      <Routes>
        <Route path="/dashboard/reading-ac" element={<App initialView="reading-ac" />} />
      </Routes>,
      { initialEntries: ['/dashboard/reading-ac'] }
    )
    
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('renders reading-gt route', () => {
    renderWithRouter(
      <Routes>
        <Route path="/dashboard/reading-gt" element={<App initialView="reading-gt" />} />
      </Routes>,
      { initialEntries: ['/dashboard/reading-gt'] }
    )
    
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('renders writing-ac route', () => {
    renderWithRouter(
      <Routes>
        <Route path="/dashboard/writing-ac" element={<App initialView="writing-ac" />} />
      </Routes>,
      { initialEntries: ['/dashboard/writing-ac'] }
    )
    
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('renders writing-gt route', () => {
    renderWithRouter(
      <Routes>
        <Route path="/dashboard/writing-gt" element={<App initialView="writing-gt" />} />
      </Routes>,
      { initialEntries: ['/dashboard/writing-gt'] }
    )
    
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('renders listening route', () => {
    renderWithRouter(
      <Routes>
        <Route path="/dashboard/listening" element={<App initialView="listening" />} />
      </Routes>,
      { initialEntries: ['/dashboard/listening'] }
    )
    
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('renders speaking route', () => {
    renderWithRouter(
      <Routes>
        <Route path="/dashboard/speaking" element={<App initialView="speaking" />} />
      </Routes>,
      { initialEntries: ['/dashboard/speaking'] }
    )
    
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  // Test hub routes
  it('renders ielts-hub route', () => {
    renderWithRouter(
      <Routes>
        <Route path="/dashboard/ielts-hub" element={<App initialView="ielts-hub" />} />
      </Routes>,
      { initialEntries: ['/dashboard/ielts-hub'] }
    )
    
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('renders langcert-hub route', () => {
    renderWithRouter(
      <Routes>
        <Route path="/dashboard/langcert-hub" element={<App initialView="langcert-hub" />} />
      </Routes>,
      { initialEntries: ['/dashboard/langcert-hub'] }
    )
    
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('renders vocabulary route', () => {
    renderWithRouter(
      <Routes>
        <Route path="/dashboard/vocabulary" element={<App initialView="vocabulary" />} />
      </Routes>,
      { initialEntries: ['/dashboard/vocabulary'] }
    )
    
    expect(document.querySelector('body')).toBeInTheDocument()
  })
})
