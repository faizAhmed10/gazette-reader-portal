import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ContextProvider } from './utils/ReaderContext.jsx'
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
  <StrictMode>
    <ContextProvider>
    <App /> 
    </ContextProvider>
  </StrictMode>
    </BrowserRouter>
)
