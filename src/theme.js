// src/theme.js

import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: '#0288d1',
            },
            secondary: {
              main: '#ff7043',
            },
            background: {
              default: '#fafafa',
            },
          }
        : {
            primary: {
              main: '#90caf9',
            },
            secondary: {
              main: '#ffab91',
            },
            background: {
              default: '#121212',
            },
          }),
    },
    typography: {
      fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Roboto", sans-serif',
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h2: {
        fontFamily: '"Roboto", sans-serif',
        fontWeight: 700,
        fontSize: '2rem',
      },
      h3: {
        fontFamily: '"Roboto", sans-serif',
        fontWeight: 700,
        fontSize: '1.75rem',
      },
      h4: {
        fontFamily: '"Roboto", sans-serif',
        fontWeight: 700,
        fontSize: '1.5rem',
      },
      h5: {
        fontFamily: '"Roboto", sans-serif',
        fontWeight: 500,
        fontSize: '1.25rem',
      },
      h6: {
        fontFamily: '"Roboto", sans-serif',
        fontWeight: 500,
        fontSize: '1rem',
      },
      body1: {
        fontFamily: '"Lato", sans-serif',
        fontSize: '1rem',
      },
      body2: {
        fontFamily: '"Lato", sans-serif',
        fontSize: '0.875rem',
      },
    },
    spacing: 8,
  });
};

export default getTheme;
