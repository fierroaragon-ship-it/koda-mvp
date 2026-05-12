import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import KodaMvpEngine from './KodaMvpEngine.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <KodaMvpEngine />
  </React.StrictMode>,
)
