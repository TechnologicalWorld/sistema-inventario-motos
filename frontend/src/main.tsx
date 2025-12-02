import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
<<<<<<< HEAD
    <BrowserRouter>
=======
    <BrowserRouter> 
>>>>>>> b14e233d7fd2965735bb145a546165113e09007e
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
