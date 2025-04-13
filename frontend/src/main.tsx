import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Toaster } from "react-hot-toast";
import '@mantine/core/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
    <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
)
