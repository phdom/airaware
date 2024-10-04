// src/context/IndoorContext.js

import React, { createContext, useState, useEffect } from 'react';

// Create the IndoorContext
export const IndoorContext = createContext();

// IndoorProvider component
export const IndoorProvider = ({ children }) => {
  const [indoorConditions, setIndoorConditions] = useState({
    temperature: '',
    humidity: '',
  });

  // Load indoor conditions from localStorage on mount
  useEffect(() => {
    const savedConditions = localStorage.getItem('indoorConditions');
    if (savedConditions) {
      setIndoorConditions(JSON.parse(savedConditions));
    }
  }, []);

  // Save indoor conditions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('indoorConditions', JSON.stringify(indoorConditions));
  }, [indoorConditions]);

  return (
    <IndoorContext.Provider value={{ indoorConditions, setIndoorConditions }}>
      {children}
    </IndoorContext.Provider>
  );
};
