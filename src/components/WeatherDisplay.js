// src/components/WeatherDisplay.js

import React, { useState, useEffect, useContext } from 'react';
import { UnitContext } from '../context/UnitContext';
import { LocationContext } from '../context/LocationContext';
import { WeatherContext } from '../context/WeatherContext';
import { calculateVaporPressure, calculateAbsoluteHumidity } from '../utils/humidity';
import { getRecommendation } from '../utils/recommendation';
import HumidityChart from './HumidityChart';
import {
  Container,
  TextField,
  Grid,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  Collapse,
  Box,
  Fade,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Thermostat,
  Opacity,
  Air,
  Grain,
  HomeWork,
  OpacityOutlined,
  InfoOutlined, // For empty state icon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiFog,
  WiThunderstorm,
  WiThermometer,
} from 'react-icons/wi';

// Utility function to categorize humidity levels
const getHumidityLevel = (humidity) => {
  if (humidity < 30) return 'Low';
  if (humidity >= 30 && humidity < 60) return 'Moderate';
  if (humidity >= 60 && humidity < 80) return 'High';
  return 'Very High';
};

// Utility function to get color based on humidity level
const getHumidityColor = (humidity, theme) => {
  if (humidity < 30) return theme.palette.info.main; // Blue
  if (humidity >= 30 && humidity < 60) return theme.palette.success.main; // Green
  if (humidity >= 60 && humidity < 80) return theme.palette.warning.main; // Orange
  return theme.palette.error.main; // Red
};

// Helper Function to Map Precipitation Probability to Description
const getPrecipitationDescription = (probability) => {
  if (probability >= 90) return 'Very likely to rain';
  if (probability >= 70) return 'High chance of rain';
  if (probability >= 40) return 'Some rain';
  if (probability >= 10) return 'Low chance of rain';
  return 'No rain today';
};

const WeatherDisplay = () => {
  const theme = useTheme();
  const { unit } = useContext(UnitContext);
  const { location } = useContext(LocationContext);
  const { outdoorWeather, hourlyData } = useContext(WeatherContext);
  const [indoorConditions, setIndoorConditions] = useState({ temperature: '', humidity: '' });
  const [recommendation, setRecommendation] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [detailedExplanation, setDetailedExplanation] = useState('');

  // Calculate absolute humidity and get recommendation
  useEffect(() => {
    if (outdoorWeather && indoorConditions.temperature && indoorConditions.humidity) {
      const indoorTempC =
        unit === 'metric'
          ? parseFloat(indoorConditions.temperature)
          : ((parseFloat(indoorConditions.temperature) - 32) * 5) / 9;
      const outdoorTempC =
        unit === 'metric'
          ? outdoorWeather.temperature
          : ((outdoorWeather.temperature - 32) * 5) / 9;

      const indoorRH = parseFloat(indoorConditions.humidity);
      const outdoorRH = outdoorWeather.humidity;

      // Ensure outdoorRH is defined
      if (typeof outdoorRH !== 'undefined') {
        const indoorE = calculateVaporPressure(indoorTempC, indoorRH);
        const outdoorE = calculateVaporPressure(outdoorTempC, outdoorRH);

        const indoorAH = calculateAbsoluteHumidity(indoorTempC, indoorE);
        const outdoorAH = calculateAbsoluteHumidity(outdoorTempC, outdoorE);

        const advice = getRecommendation(indoorAH, outdoorAH);
        setRecommendation(advice);

        // Prepare detailed explanation with updated wording and correct AH formula
        const explanation = `
Your indoor absolute humidity is **${indoorAH.toFixed(2)} g/m³**, while the outdoor absolute humidity is **${outdoorAH.toFixed(2)} g/m³**.

${
  indoorAH > outdoorAH
    ? 'Since the indoor absolute humidity is higher, opening the windows could help reduce indoor humidity levels.'
    : "Since the outdoor absolute humidity is higher, it's better to keep the windows closed to prevent increasing indoor humidity."
}

**How We Calculated This:**

- **Indoor Temperature**: ${indoorTempC.toFixed(1)}°C
- **Indoor Relative Humidity**: ${indoorRH}%
- **Outdoor Temperature**: ${outdoorTempC.toFixed(1)}°C
- **Outdoor Relative Humidity**: ${outdoorRH}%

We used these values to calculate the absolute humidity, which measures the actual amount of water vapor in the air, using the formula:

\`\`\`
AH = (2.16679 * E) / (T + 273.15)
\`\`\`

Where:

- **E** is the vapor pressure, calculated from temperature and relative humidity.
- **T** is the temperature in Celsius.

This calculation helps us understand whether opening windows will increase or decrease indoor humidity.
        `;
        setDetailedExplanation(explanation);
      } else {
        setRecommendation('Unable to retrieve outdoor humidity data.');
        setDetailedExplanation('Sorry, we could not fetch the outdoor humidity data at this time.');
      }
    }
  }, [outdoorWeather, indoorConditions, unit]);

  // Function to get weather condition description
  const getConditionDescription = (code) => {
    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return weatherCodes[code] || 'Unknown';
  };

  // Function to get weather icon
  const getWeatherIcon = (code) => {
    if (code === 0 || code === 1) {
      return <WiDaySunny size={48} />;
    } else if (code >= 2 && code <= 3) {
      return <WiCloudy size={48} />;
    } else if (code >= 45 && code <= 48) {
      return <WiFog size={48} />;
    } else if (code >= 51 && code <= 67) {
      return <WiRain size={48} />;
    } else if (code >= 71 && code <= 86) {
      return <WiSnow size={48} />;
    } else if (code >= 95 && code <= 99) {
      return <WiThunderstorm size={48} />;
    } else {
      return <WiDaySunny size={48} />;
    }
  };

  // Function to get wind direction
  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
    return directions[index];
  };

  // Handle input change for indoor conditions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIndoorConditions((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle details section
  const handleToggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  // Get icon for recommendation
  const getRecommendationIcon = () => {
    if (recommendation.includes('open')) {
      return <Air sx={{ fontSize: 40, marginRight: 2 }} />;
    } else if (recommendation.includes('close')) {
      return <HomeWork sx={{ fontSize: 40, marginRight: 2 }} />;
    } else {
      return <Opacity sx={{ fontSize: 40, marginRight: 2 }} />;
    }
  };

  // Function to format temperature based on unit
  const formatTemperature = (temp) => {
    return `${temp}°${unit === 'metric' ? 'C' : 'F'}`;
  };

  return (
    <Container sx={{ marginTop: 4, marginBottom: 4 }}>
      {outdoorWeather ? (
        <Grid container spacing={4}>
          {/* Left Panel */}
          <Grid item xs={12} md={6}>
            {/* Adjusted Title for Current Weather */}
            <Typography variant="h5" component="h2" gutterBottom>
              Current Weather in {location.city}
            </Typography>

            {/* Outdoor Weather Card */}
            <Card>
              {/* Removed CardHeader */}
              <CardContent>
                <Box display="flex" alignItems="center">
                  {getWeatherIcon(outdoorWeather.condition)}
                  <Typography variant="h6" sx={{ marginLeft: 2 }}>
                    {getConditionDescription(outdoorWeather.condition)}
                  </Typography>
                </Box>
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                  {/* 1. Temperature */}
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <Thermostat sx={{ marginRight: 1 }} />
                      <Typography variant="subtitle1">
                        Temperature: {formatTemperature(outdoorWeather.temperature)}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* 2. Feels Like */}
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <Thermostat sx={{ marginRight: 1 }} />
                      <Typography variant="subtitle1">
                        Feels Like: {formatTemperature(outdoorWeather.apparent_temperature)}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* 3. Precipitation */}
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <Grain sx={{ marginRight: 1 }} />
                      <Typography variant="subtitle1">
                        {getPrecipitationDescription(outdoorWeather.precipitation_probability)}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* 4. Humidity */}
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <Tooltip title={getHumidityLevel(outdoorWeather.humidity)} arrow>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: getHumidityColor(outdoorWeather.humidity, theme),
                            cursor: 'default',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Opacity
                            sx={{
                              marginRight: 1,
                              color: getHumidityColor(outdoorWeather.humidity, theme),
                            }}
                          />
                          Humidity: {outdoorWeather.humidity}%
                        </Typography>
                      </Tooltip>
                    </Box>
                  </Grid>

                  {/* 5. Dew Point */}
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <OpacityOutlined sx={{ marginRight: 1 }} />
                      <Typography variant="subtitle1">
                        Dew Point: {outdoorWeather.dew_point}°
                        {unit === 'metric' ? 'C' : 'F'}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* 6. Wind */}
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <Air sx={{ marginRight: 1 }} />
                      <Typography variant="subtitle1">
                        Wind: {outdoorWeather.wind_speed} m/s,{' '}
                        {getWindDirection(outdoorWeather.wind_direction)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Humidity Chart */}
            <Card sx={{ marginTop: 4 }}>
              <CardContent>
                {/* Adjusted Title for Humidity Chart */}
                <Typography variant="h6" component="h3" gutterBottom>
                  Today's Humidity Levels
                </Typography>
                {hourlyData.length > 0 ? (
                  <HumidityChart data={hourlyData} unit={unit} theme={theme} />
                ) : (
                  <Typography>Loading humidity chart...</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Panel */}
          <Grid item xs={12} md={6}>
            {/* Adjusted Title for Indoor Conditions */}
            <Typography variant="h5" component="h2" gutterBottom>
              Submit Your Indoor Conditions
            </Typography>

            {/* Input Indoor Conditions */}
            <Card>
              {/* Removed CardHeader */}
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={`Temperature (°${unit === 'metric' ? 'C' : 'F'})`}
                      variant="filled"
                      fullWidth
                      name="temperature"
                      value={indoorConditions.temperature}
                      onChange={handleInputChange}
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Thermostat />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Humidity (%)"
                      variant="filled"
                      fullWidth
                      name="humidity"
                      value={indoorConditions.humidity}
                      onChange={handleInputChange}
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Opacity />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Recommendation */}
            {recommendation ? (
              <Fade in={!!recommendation} timeout={1000}>
                <Box sx={{ marginTop: 4 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                      color: '#fff',
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        {getRecommendationIcon()}
                        <Typography variant="h6">{recommendation}</Typography>
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                        sx={{ marginTop: 2 }}
                      >
                        <Button
                          color="inherit"
                          endIcon={showDetails ? <HomeWork /> : <Air />}
                          onClick={handleToggleDetails}
                          sx={{
                            textTransform: 'none',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            },
                          }}
                        >
                          {showDetails ? 'Hide Details' : 'See the Math Behind This Recommendation'}
                        </Button>
                      </Box>
                      <Collapse in={showDetails} timeout="auto" unmountOnExit>
                        <Box sx={{ marginTop: 3 }}>
                          <Typography variant="body2" component="div">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: detailedExplanation.replace(/\n/g, '<br/>'),
                              }}
                            />
                          </Typography>
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>
                </Box>
              </Fade>
            ) : (
              // Enhanced Empty State Resembling Recommendation Card
              <Box sx={{ marginTop: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    background: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderStyle: 'dashed',
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <InfoOutlined sx={{ fontSize: 40, color: theme.palette.grey[400] }} />
                      <Typography variant="h6">No Recommendations Yet</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                      Please input your indoor conditions to receive a recommendation.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Grid>
        </Grid>
      ) : (
        <Typography sx={{ marginTop: 4 }}>Loading outdoor weather data...</Typography>
      )}
    </Container>
  );
};

export default WeatherDisplay;
