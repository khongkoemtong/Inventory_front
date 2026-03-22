import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './MyRouter'
import MyRouter from './MyRouter'


createRoot(document.getElementById('root')).render(
  <StrictMode>

    <MyRouter/>

  </StrictMode>,
)
