// src/context/WeatherContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LocationContext } from './LocationContext';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const { location } = useContext(LocationContext);
  const [outdoorWeather, setOutdoorWeather] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);

  const fetchWeather = async () => {
    if (location.lat != null && location.lon != null) {
      try {
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude: location.lat,
            longitude: location.lon,
            hourly: 'relativehumidity_2m,temperature_2m',
            current_weather: true,
            timezone: 'auto',
          },
        });

        const data = response.data;
        const currentWeather = data.current_weather;
        const currentTime = new Date(currentWeather.time);

        // Convert hourly times to Date objects
        const hourlyTimes = data.hourly.time.map((time) => new Date(time));

        // Find the index of the time closest to the current time
        let closestIndex = 0;
        let minDiff = Math.abs(currentTime - hourlyTimes[0]);
        for (let i = 1; i < hourlyTimes.length; i++) {
          const diff = Math.abs(currentTime - hourlyTimes[i]);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
          }
        }

        // Get current humidity
        const currentHumidity = data.hourly.relativehumidity_2m[closestIndex];

        setOutdoorWeather({
          temperature: currentWeather.temperature,
          humidity: currentHumidity,
          wind_speed: currentWeather.windspeed,
          wind_direction: currentWeather.winddirection,
          precipitation: currentWeather.precipitation || 0,
          condition: currentWeather.weathercode,
        });

        // Prepare hourly data for the chart
        const today = new Date().toISOString().split('T')[0];
        const hourlyDataArray = data.hourly.time
          .map((time, index) => {
            const date = time.split('T')[0];
            if (date === today) {
              return {
                time: new Date(time).getHours(),
                humidity: data.hourly.relativehumidity_2m[index],
                temperature: data.hourly.temperature_2m[index],
              };
            } else {
              return null;
            }
          })
          .filter((item) => item !== null);

        setHourlyData(hourlyDataArray);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setOutdoorWeather(null);
      }
    }
  };

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <WeatherContext.Provider value={{ outdoorWeather, hourlyData }}>
      {children}
    </WeatherContext.Provider>
  );
};
