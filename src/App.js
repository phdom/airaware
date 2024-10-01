// src/App.js

import React from 'react';
import Header from './components/Header';
import WeatherDisplay from './components/WeatherDisplay';
import Footer from './components/Footer';
import { Box } from '@mui/material';
import { UnitProvider } from './context/UnitContext';
import { LocationProvider } from './context/LocationContext';
import { WeatherProvider } from './context/WeatherContext';

function App() {
  return (
    <UnitProvider>
      <LocationProvider>
        <WeatherProvider>
          <Box display="flex" flexDirection="column" minHeight="100vh">
            <Header />
            <Box flexGrow={1}>
              <WeatherDisplay />
            </Box>
            <Footer />
          </Box>
        </WeatherProvider>
      </LocationProvider>
    </UnitProvider>
  );
}

export default App;
