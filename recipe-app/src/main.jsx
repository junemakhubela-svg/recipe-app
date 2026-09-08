import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * main.jsx — the bootstrapping orchestrator.
 * createRoot is the React 18 concurrent entry point. StrictMode is kept on in
 * development because it double-invokes effects, which is precisely how the
 * localStorage cleanup logic in App.jsx was verified as idempotent.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
