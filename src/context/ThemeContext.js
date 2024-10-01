// src/context/ThemeContext.js

import React, { createContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/poppins/400.css'; // Regular
import '@fontsource/poppins/600.css'; // Semi-Bold
import '@fontsource/poppins/700.css'; // Bold

// Create the ThemeContext
export const ThemeContext = createContext();

// CustomThemeProvider component
export const CustomThemeProvider = ({ children }) => {
  // State to manage dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Toggle function to switch themes
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Memoize the theme to optimize performance
  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: 'Poppins, sans-serif',
          h3: {
            fontWeight: 600, // Semi-Bold for App Name
          },
          subtitle1: {
            fontWeight: 400, // Regular for Tagline
          },
        },
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
            contrastText: '#ffffff', // Ensure contrastText is white
          },
          secondary: {
            main: '#dc004e',
          },
          background: {
            default: darkMode ? '#121212' : '#fafafa',
            paper: darkMode ? '#1e1e1e' : '#fff',
          },
          text: {
            primary: darkMode ? '#ffffff' : '#000000', // White in dark mode, Black in light mode
            secondary: darkMode ? '#bbbbbb' : '#555555', // Light gray in dark mode, Dark gray in light mode
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline /> {/* Ensures base styles adapt to the theme */}
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
