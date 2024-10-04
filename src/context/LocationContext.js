// src/context/LocationContext.js

import React, { createContext, useState } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    lat: 40.7128, // Default latitude (New York)
    lon: -74.0060, // Default longitude
    city: 'New York',
  });

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
