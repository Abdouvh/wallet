import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx' // <--- THIS LINE WAS MISSING
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)