// src/App.js

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WeatherDisplay from './components/WeatherDisplay';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage'; // Import LandingPage
import { Box } from '@mui/material';
import { UnitProvider } from './context/UnitContext';
import { LocationProvider } from './context/LocationContext';
import { WeatherProvider } from './context/WeatherContext';
import { IndoorProvider } from './context/IndoorContext'; // Import IndoorProvider

function App() {
  const [showLanding, setShowLanding] = useState(true);

  // Retrieve saved indoor conditions from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('indoorConditions');
    if (savedData) {
     // setShowLanding(false); // If data exists, skip landing page
    }
  }, []);

  const handleLandingSubmit = (data) => {
    // Save indoor conditions to local storage
    localStorage.setItem('indoorConditions', JSON.stringify(data));
    setShowLanding(false);
  };

  return (
    <UnitProvider>
      <LocationProvider>
        <IndoorProvider> {/* Add IndoorProvider */}
          <WeatherProvider>
            <Box display="flex" flexDirection="column" minHeight="100vh">
              {showLanding ? (
                <LandingPage onSubmit={handleLandingSubmit} />
              ) : (
                <>
                  <Header />
                  <Box flexGrow={1}>
                    <WeatherDisplay />
                  </Box>
                  <Footer />
                </>
              )}
            </Box>
          </WeatherProvider>
        </IndoorProvider>
      </LocationProvider>
    </UnitProvider>
  );
}

export default App;
