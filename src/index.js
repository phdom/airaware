// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure React 18 compatibility
import App from './App';
import { CustomThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CustomThemeProvider>
      <App />
    </CustomThemeProvider>
  </React.StrictMode>
);
