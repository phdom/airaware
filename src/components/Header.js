import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
  CircularProgress,
  MenuItem,
  Box,
  Stack,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import {
  Search,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { Autocomplete } from '@mui/material';
import { getCities } from '../utils/citySearch';
import { ThemeContext } from '../context/ThemeContext';
import { LocationContext } from '../context/LocationContext';
import darkLogo from '../assets/logo-dark.png';
import lightLogo from '../assets/logo-light.png';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import axios from 'axios';

const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { setLocation } = useContext(LocationContext);
  const [cityInput, setCityInput] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchCities = async () => {
      if (cityInput.length > 2) {
        setCityLoading(true);
        try {
          const results = await getCities(cityInput);
          setCityOptions([
            { name: 'Current Location', isCurrentLocation: true },
            ...results,
          ]);
        } catch (error) {
          console.error('Error fetching cities:', error);
          setCityOptions([]);
        } finally {
          setCityLoading(false);
        }
      } else {
        setCityOptions([{ name: 'Current Location', isCurrentLocation: true }]);
      }
    };
    fetchCities();
  }, [cityInput]);

  const reverseGeocode = async (latitude, longitude) => {
    const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`;

    try {
      const response = await axios.get(url, {
        params: {
          access_token: accessToken,
          types: 'place',
          limit: 1,
        },
      });

      if (response.data.features && response.data.features.length > 0) {
        return response.data.features[0].place_name;
      } else {
        return 'Your Location';
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return 'Your Location';
    }
  };

  const handleCitySelect = async (event, value) => {
    setSelectedCity(value);
    if (value) {
      if (value.isCurrentLocation) {
        setLocationLoading(true);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const cityName = await reverseGeocode(latitude, longitude);
                setLocation({
                  lat: latitude,
                  lon: longitude,
                  city: cityName || 'Your Location',
                });
              } catch (error) {
                console.error('Error reverse geocoding:', error);
                setLocation({
                  lat: latitude,
                  lon: longitude,
                  city: 'Your Location',
                });
              } finally {
                setLocationLoading(false);
              }
            },
            (error) => {
              console.error('Error getting current location:', error);
              // Fallback to default location (New York)
              setLocation({
                lat: 40.7128,
                lon: -74.0060,
                city: 'New York',
              });
              setLocationLoading(false);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
          // Fallback to default location (New York)
          setLocation({
            lat: 40.7128,
            lon: -74.0060,
            city: 'New York',
          });
          setLocationLoading(false);
        }
      } else {
        // Handle regular city selection
        setLocation({
          lat: value.lat,
          lon: value.lon,
          city: value.name,
        });
      }
    } else {
      // User cleared the selection
      setSelectedCity(null);
    }
  };

  const logoSrc = darkMode ? lightLogo : darkLogo;

  return (
    <AppBar position="static" elevation={4}>
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            paddingLeft: { xs: 0, sm: 0 },
            paddingRight: { xs: 0, sm: 0 },
            paddingTop: { xs: 2, sm: 3 },
            paddingBottom: { xs: 2, sm: 3 },
            flexDirection: isSmallScreen ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack
            direction={isSmallScreen ? 'column' : 'row'}
            alignItems={isSmallScreen ? 'center' : 'flex-start'}
            spacing={2}
            sx={{
              flexGrow: 1,
              width: '100%',
              mb: isSmallScreen ? 2 : 0,
            }}
          >
            <Box
              component="img"
              src={logoSrc}
              alt="AirAware Logo"
              sx={{
                height: {
                  xs: '40px',
                  sm: '60px',
                  md: '80px',
                },
                mr: isSmallScreen ? 0 : 2,
              }}
            />
            <Box
              sx={{
                textAlign: isSmallScreen ? 'center' : 'left',
                width: '100%',
              }}
            >
              <Typography
                variant="h4"
                component="div"
                color="inherit"
                sx={{
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  fontSize: {
                    xs: '1.2rem',
                    sm: '1.6rem',
                    md: '2.2rem',
                  },
                }}
              >
                AirAware
              </Typography>
              <Typography
                variant="subtitle1"
                color="inherit"
                sx={{
                  fontWeight: 400,
                  fontSize: {
                    xs: '0.9rem',
                    sm: '1rem',
                    md: '1.2rem',
                  },
                }}
              >
                Open your windows strategically to decrease indoor humidity.
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction={isSmallScreen ? 'column' : 'row'}
            alignItems="center"
            spacing={2}
            sx={{
              width: isSmallScreen ? '100%' : 'auto',
              mt: isSmallScreen ? 2 : 0,
            }}
          >
            <Autocomplete
              options={cityOptions}
              getOptionLabel={(option) =>
                option.isCurrentLocation ? 'Current Location' : option.name
              }
              onInputChange={(event, newInputValue) => {
                setCityInput(newInputValue);
                if (newInputValue === '') {
                  setSelectedCity(null);
                }
              }}
              onChange={handleCitySelect}
              loading={cityLoading || locationLoading}
              value={selectedCity}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name && option.lat === value.lat
              }
              sx={{
                width: isSmallScreen ? '100%' : '300px',
                backgroundColor: 'background.paper',
                borderRadius: 1,
              }}
              renderOption={(props, option) => (
                <MenuItem {...props}>
                  {option.isCurrentLocation ? (
                    <Box display="flex" alignItems="center">
                      <MyLocationIcon sx={{ marginRight: 1 }} />
                      Current Location
                    </Box>
                  ) : (
                    option.name
                  )}
                </MenuItem>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search City"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {cityLoading || locationLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    input: {
                      color: 'text.primary',
                    },
                  }}
                />
              )}
              noOptionsText="No results"
            />

            <IconButton
              color="inherit"
              onClick={toggleDarkMode}
              sx={{
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
              aria-label="toggle theme"
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
