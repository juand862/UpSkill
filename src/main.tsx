import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/theme/ThemeContext'
import { ExplorerProvider } from '@/state/explorerContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ExplorerProvider>
        <App />
      </ExplorerProvider>
    </ThemeProvider>
  </StrictMode>,
)
