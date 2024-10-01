// src/components/Header.js

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
import darkLogo from '../assets/logo-dark.png'; // Logo optimized for light mode (dark background)
import lightLogo from '../assets/logo-light.png'; // Logo optimized for dark mode (light background)

const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { setLocation } = useContext(LocationContext);
  const [cityInput, setCityInput] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Determines if the screen size is small

  // Fetch city options when the user types
  useEffect(() => {
    const fetchCities = async () => {
      if (cityInput.length > 2) {
        setCityLoading(true);
        try {
          const results = await getCities(cityInput);
          setCityOptions(results);
        } catch (error) {
          console.error('Error fetching cities:', error);
          setCityOptions([]);
        } finally {
          setCityLoading(false);
        }
      } else {
        setCityOptions([]);
      }
    };
    fetchCities();
  }, [cityInput]);

  // Handle city selection
  const handleCitySelect = (event, value) => {
    if (value) {
      setLocation({
        lat: value.lat,
        lon: value.lon,
        city: value.name,
      });
    }
  };

  // Choose logo based on theme
  const logoSrc = darkMode ? lightLogo : darkLogo;

  return (
    <AppBar position="static" elevation={4}>
      <Toolbar
        sx={{
          paddingLeft: { xs: 2, sm: 4 },
          paddingRight: { xs: 2, sm: 4 },
          flexDirection: isSmallScreen ? 'column' : 'row', // Stack vertically on small screens
          alignItems: isSmallScreen ? 'center' : 'center', // Center items horizontally
        }}
      >
        {/* Logo and App Name/Subtitle Container */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            flexGrow: 1,
            width: '100%',
            justifyContent: isSmallScreen ? 'center' : 'flex-start', // Center on small screens, align left on larger
            mb: isSmallScreen ? 2 : 0, // Margin bottom when stacked
            color: 'inherit', // Ensure color is inherited by children
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src={logoSrc}
            alt="AirAware Logo"
            sx={{
              height: {
                xs: '90px', // Extra-small screens
                sm: '120px', // Small screens
                md: '160px', // Medium screens and up
              },
            }}
          />

          {/* App Name and Tagline Container */}
          <Box
            sx={{
              textAlign: isSmallScreen ? 'left' : 'left', // Align left within container
              width: '100%',
              maxWidth: isSmallScreen ? '300px' : 'none', // Limit width on small screens if needed
            }}
          >
            {/* App Name */}
            <Typography
              variant="h4" // Increased size
              component="div"
              color="inherit" // Inherit contrastText from AppBar
              sx={{
                fontWeight: 600, // Semi-Bold
                letterSpacing: '0.05em', // Adds space between letters
                textTransform: 'none', // Remove uppercase
                fontSize: {
                  xs: '1.5rem',
                  sm: '2rem',
                  md: '2.5rem',
                },
              }}
            >
              AirAware
            </Typography>
            {/* Tagline */}
            <Typography
              variant="subtitle1" // Adjusted for better visibility
              color="inherit" // Inherit contrastText from AppBar
              sx={{
                fontWeight: 400,
                fontSize: {
                  xs: '0.9rem',
                  sm: '1rem',
                  md: '1.2rem',
                },
              }}
            >
              Know when to ventilate your home to lower humidity.
            </Typography>
          </Box>
        </Stack>

        {/* City Search Bar and Theme Toggle */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            width: isSmallScreen ? '100%' : 'auto',
            justifyContent: isSmallScreen ? 'center' : 'flex-end',
            mt: isSmallScreen ? 2 : 0, // Margin top on small screens
          }}
        >
          {/* City Search Bar */}
          <Autocomplete
            options={cityOptions}
            getOptionLabel={(option) => option.name}
            onInputChange={(event, newInputValue) => {
              setCityInput(newInputValue);
            }}
            onChange={handleCitySelect}
            loading={cityLoading}
            sx={{
              width: isSmallScreen ? '100%' : '300px',
              backgroundColor: 'background.paper', // Theme-aware background
              borderRadius: 1,
            }}
            renderOption={(props, option) => (
              <MenuItem {...props}>{option.name}</MenuItem>
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
                      {cityLoading ? <CircularProgress color="inherit" size={20} /> : null}
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
                    color: 'text.primary', // Theme-aware text color
                  },
                }}
              />
            )}
            noOptionsText="No results"
          />

          {/* Theme Toggle Button */}
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
    </AppBar>
  );
};

export default Header;
