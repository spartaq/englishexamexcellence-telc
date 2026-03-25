import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import './index.css'
import Router from './Router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider afterSignOutUrl="/">
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
