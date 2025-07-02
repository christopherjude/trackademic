import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider as MsalAuthProvider } from './auth/hooks/auth-provider'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MsalAuthProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MsalAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)