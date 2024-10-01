// src/utils/humidity.js

/**
 * Calculates the actual vapor pressure (E) in hPa.
 * @param {number} temperature - Temperature in degrees Celsius.
 * @param {number} rh - Relative humidity in percentage (0-100).
 * @returns {number} - Vapor pressure in hPa.
 */
export const calculateVaporPressure = (temperature, rh) => {
  // Saturation vapor pressure using the Magnus formula
  const Es = 6.112 * Math.exp((17.67 * temperature) / (temperature + 243.5));
  // Actual vapor pressure
  const E = Es * (rh / 100);
  return E;
};

/**
 * Calculates the absolute humidity (AH) in grams per cubic meter (g/m³).
 * @param {number} temperature - Temperature in degrees Celsius.
 * @param {number} vaporPressure - Vapor pressure in hPa.
 * @returns {number} - Absolute humidity in g/m³.
 */
export const calculateAbsoluteHumidity = (temperature, vaporPressure) => {
  // Convert temperature to Kelvin
  const tempK = temperature + 273.15;
  // Calculate absolute humidity using the ideal gas law for water vapor
  const AH = (2165 * (vaporPressure / tempK));
  return parseFloat(AH.toFixed(2));
};
