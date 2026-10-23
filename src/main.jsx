import React from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App.jsx';
import './styles.css';

// Website only: the desktop app runs inside Electron and does not send page views.
const isDesktop = Boolean(window.pomodoro);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {!isDesktop && <Analytics />}
  </React.StrictMode>
);
