// src/components/EducationalSection.js

import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const EducationalSection = ({ indoorAH, outdoorAH, indoorTemp, indoorRH, outdoorTemp, outdoorRH }) => {
  /**
   * Formats numbers to two decimal places.
   * @param {number} num - The number to format.
   * @returns {string} - Formatted number as a string.
   */
  const formatNumber = (num) => num.toFixed(2);

  /**
   * Calculates Vapor Pressure (E).
   * @param {number} temperature - Temperature in °C.
   * @param {number} relativeHumidity - Relative Humidity in %.
   * @returns {number} - Vapor Pressure in hPa.
   */
  const calculateVaporPressure = (temperature, relativeHumidity) => {
    return 6.112 * Math.exp((17.67 * temperature) / (temperature + 243.5)) * (relativeHumidity / 100);
  };

  /**
   * Calculates Absolute Humidity (AH).
   * @param {number} vaporPressure - Vapor Pressure in hPa.
   * @param {number} temperature - Temperature in °C.
   * @returns {number} - Absolute Humidity in g/m³.
   */
  const calculateAbsoluteHumidity = (vaporPressure, temperature) => {
    return (2.16679 * vaporPressure) / (temperature + 273.15);
  };

  // Calculate Vapor Pressures
  const indoorVaporPressure = calculateVaporPressure(indoorTemp, indoorRH);
  const outdoorVaporPressure = calculateVaporPressure(outdoorTemp, outdoorRH);

  // Calculate Absolute Humidity
  const calculatedIndoorAH = calculateAbsoluteHumidity(indoorVaporPressure, indoorTemp);
  const calculatedOutdoorAH = calculateAbsoluteHumidity(outdoorVaporPressure, outdoorTemp);

  // Calculate Difference
  const difference = calculatedIndoorAH - calculatedOutdoorAH;

  return (
    <Accordion sx={{ marginTop: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Learn the Science Behind Your Result</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Simple Explanation */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Simple Explanation
          </Typography>
          <Typography paragraph>
            AirAware compares your indoor and outdoor humidity levels by calculating the Absolute Humidity (AH) for both environments. Absolute Humidity measures the actual amount of moisture in the air. By understanding the difference between indoor and outdoor AH, the app can recommend whether to open or close your windows to maintain a comfortable and healthy indoor environment.
          </Typography>
        </Box>

        {/* Detailed Explanation */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Detailed Explanation
          </Typography>
          <Typography paragraph>
            Here's how AirAware calculates your humidity levels and provides recommendations:
          </Typography>

          {/* Step 1 */}
          <Box mb={2}>
            <Typography variant="subtitle1">
              Step 1: Calculate Vapor Pressure (E)
            </Typography>
            <Typography variant="body2" paragraph>
              Vapor Pressure (E) represents the partial pressure of water vapor in the air. It's calculated using the temperature and relative humidity with the following formula:
            </Typography>
            <Typography component="code" variant="body2" display="block" mb={1}>
              E = 6.112 × e^(17.67 × T / (T + 243.5)) × (RH / 100)
            </Typography>
            <Typography variant="body2" paragraph>
              Where:
            </Typography>
            <ul>
              <li><strong>T</strong> = Temperature in °C</li>
              <li><strong>RH</strong> = Relative Humidity in %</li>
            </ul>
            <Typography variant="body2" paragraph>
              <strong>Example Calculation:</strong>
            </Typography>
            <Typography component="code" variant="body2" display="block" mb={1}>
              Indoor E = 6.112 × e^(17.67 × 24 / (24 + 243.5)) × (64 / 100) ≈ 19.55 hPa
              <br />
              Outdoor E = 6.112 × e^(17.67 × 22 / (22 + 243.5)) × (85 / 100) ≈ 23.20 hPa
            </Typography>
          </Box>

          {/* Step 2 */}
          <Box mb={2}>
            <Typography variant="subtitle1">
              Step 2: Calculate Absolute Humidity (AH)
            </Typography>
            <Typography variant="body2" paragraph>
              Absolute Humidity (AH) measures the actual amount of water vapor in the air. It's calculated using the vapor pressure from Step 1 and the temperature:
            </Typography>
            <Typography component="code" variant="body2" display="block" mb={1}>
              AH = (2.16679 × E) / (T + 273.15)
            </Typography>
            <Typography variant="body2" paragraph>
              Where:
            </Typography>
            <ul>
              <li><strong>E</strong> = Vapor Pressure from Step 1 (hPa)</li>
              <li><strong>T</strong> = Temperature in °C</li>
            </ul>
            <Typography variant="body2" paragraph>
              <strong>Example Calculation:</strong>
            </Typography>
            <Typography component="code" variant="body2" display="block" mb={1}>
              Indoor AH = (2.16679 × 19.55) / (24 + 273.15) ≈ 0.155 g/m³
              <br />
              Outdoor AH = (2.16679 × 23.20) / (22 + 273.15) ≈ 0.184 g/m³
            </Typography>
          </Box>

          {/* Step 3 */}
          <Box mb={2}>
            <Typography variant="subtitle1">
              Step 3: Determine Humidity Difference
            </Typography>
            <Typography variant="body2" paragraph>
              Calculate the difference between indoor and outdoor AH:
            </Typography>
            <Typography component="code" variant="body2" display="block" mb={1}>
              Difference = Indoor AH - Outdoor AH
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Example:</strong>
            </Typography>
            <Typography component="code" variant="body2" display="block" mb={1}>
              Difference = 0.155 - 0.184 = -0.029 g/m³
            </Typography>
            <Typography variant="body2" paragraph>
              A positive difference indicates higher indoor humidity, while a negative difference indicates higher outdoor humidity.
            </Typography>
          </Box>

          {/* Step 4 */}
          <Box mb={2}>
            <Typography variant="subtitle1">
              Step 4: Generate Humidity Management Advice
            </Typography>
            <Typography variant="body2" paragraph>
              Based on the humidity difference, AirAware provides tailored advice:
            </Typography>
            <ul>
              <li><strong>Difference &gt; 0.5 g/m³:</strong> Open your windows to significantly lower indoor humidity.</li>
              <li><strong>0.3 &lt; Difference ≤ 0.5 g/m³:</strong> Consider opening your windows to moderately reduce indoor humidity.</li>
              <li><strong>0.1 &lt; Difference ≤ 0.3 g/m³:</strong> You might want to open a window or two to slightly decrease indoor humidity.</li>
              <li><strong>-0.1 ≤ Difference ≤ 0.1 g/m³:</strong> No action needed as indoor and outdoor humidity levels are balanced.</li>
              <li><strong>-0.5 ≤ Difference &lt; -0.1 g/m³:</strong> Keep your windows closed to maintain a comfortable indoor environment.</li>
              <li><strong>Difference &lt; -0.5 g/m³:</strong> Keep your windows closed to prevent indoor humidity from rising significantly.</li>
            </ul>
            <Typography variant="body2" paragraph>
              Understanding these differences helps you make informed decisions about managing your indoor environment.
            </Typography>
          </Box>

          {/* Example Scenario */}
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Example Scenario
            </Typography>
            <Typography variant="body2" paragraph>
              Let's walk through an example using your current humidity and temperature readings:
            </Typography>
            <Typography component="code" variant="body2" display="block" mb={1}>
              **Indoor Temperature**: {indoorTemp}°C
              <br />
              **Indoor Relative Humidity**: {indoorRH}%
              <br />
              **Outdoor Temperature**: {outdoorTemp}°C
              <br />
              **Outdoor Relative Humidity**: {outdoorRH}%
            </Typography>
            <Typography variant="body2" paragraph>
              **Calculations:**
            </Typography>
            <Typography component="code" variant="body2" display="block" mb={1}>
              AH (Indoor) = {formatNumber(calculatedIndoorAH)} g/m³
              <br />
              AH (Outdoor) = {formatNumber(calculatedOutdoorAH)} g/m³
              <br />
              Difference = {formatNumber(difference)} g/m³
            </Typography>
            <Typography variant="body2" paragraph>
              **Interpretation:**
            </Typography>
            <Typography variant="body2" paragraph>
              Since the difference is <strong>{formatNumber(difference)} g/m³</strong>, which falls within the <strong>{difference > 0.1 ? 'positive' : 'negative'}</strong> range, the app recommends to:
            </Typography>
            <Typography variant="body2" paragraph>
              {difference > 0.1
                ? 'Open your windows to lower the humidity and make your space more comfortable.'
                : difference < -0.1
                ? 'Keep your windows closed to prevent indoor humidity from rising significantly.'
                : 'No action needed as indoor and outdoor humidity levels are balanced.'}
            </Typography>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default EducationalSection;
