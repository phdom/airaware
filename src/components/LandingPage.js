import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  Stack,
  InputAdornment,
} from '@mui/material';
import { Search, Opacity, Thermostat } from '@mui/icons-material';
import { Autocomplete } from '@mui/material';
import { getCities } from '../utils/citySearch';
import { LocationContext } from '../context/LocationContext';
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext
import darkLogo from '../assets/logo-dark.png';
import lightLogo from '../assets/logo-light.png';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import axios from 'axios';
import { IndoorContext } from '../context/IndoorContext'; // Import IndoorContext
import { lightBlue } from '@mui/material/colors';
import Footer from '../components/Footer';  // Adjust the path if needed


// Article Data
const articles = [
  {
    id: 1,
    title: "Understanding Indoor Humidity",
    summary: "Learn how indoor humidity affects your health and comfort, and what you can do to control it.",
    link: "/article/indoor-humidity",
    image: "/images/indoor-humidity.jpg",
  },
  {
    id: 2,
    title: "How to Measure Humidity at Home",
    summary: "A guide to choosing the best devices to monitor and control your indoor humidity levels.",
    link: "/article/measure-humidity",
    image: "/images/measure-humidity.jpg",
  },
  {
    id: 3,
    title: "How Humidity Control Can Save Energy and Reduce Your Bills",
    summary: "Learn how managing indoor humidity can lead to significant energy savings and help lower your monthly utility bills.",
    link: "/article/saving-energy",
    image: "/images/saving-energy.jpg",
  },
  {
    id: 4,
    title: "Seasonal Changes in Humidity",
    summary: "Understand how seasonal shifts affect indoor humidity and how to manage them.",
    link: "/article/seasonal-humidity",
    image: "/images/seasonal-humidity.jpg",
  },
  {
    id: 5,
    title: "Dehumidifiers: Do You Need One?",
    summary: "Explore when and why you might need a dehumidifier and which type is best for your home.",
    link: "/article/dehumidifiers",
    image: "/images/dehumidifiers.jpg",
  },
  {
    id: 6,
    title: "Why Proper Ventilation is Key",
    summary: "Learn how proper ventilation helps in reducing indoor humidity and improving air quality.",
    link: "/article/proper-ventilation",
    image: "/images/proper-ventilation.jpg",
  },
  {
    id: 7,
    title: "How Humidity Affects Sleep",
    summary: "Discover how high or low humidity can affect the quality of your sleep and what you can do about it.",
    link: "/article/humidity-sleep",
    image: "/images/humidity-sleep.jpg",
  },
  {
    id: 8,
    title: "Humidity Myths Busted",
    summary: "Debunk common myths about humidity and find out the truth about managing it effectively.",
    link: "/article/humidity-myths",
    image: "/images/humidity-myths.jpg",
  },
];

const LandingPage = ({ onSubmit }) => {
  const { darkMode } = useContext(ThemeContext);
  const { setLocation } = useContext(LocationContext);
  const { indoorConditions, setIndoorConditions } = useContext(IndoorContext);

  const [cityInput, setCityInput] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Fetch cities based on input
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

  // Reverse geocode function
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
                setCityInput('');
                setSelectedCity(null);
              }
            },
            (error) => {
              console.error('Error getting current location:', error);
              setLocation({
                lat: 40.7128,
                lon: -74.0060, // Default to New York
                city: 'New York',
              });
              setLocationLoading(false);
              setCityInput('');
              setSelectedCity(null);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
          setLocation({
            lat: 40.7128,
            lon: -74.0060, // Default to New York
            city: 'New York',
          });
          setLocationLoading(false);
          setCityInput('');
          setSelectedCity(null);
        }
      } else {
        setLocation({
          lat: value.lat,
          lon: value.lon,
          city: value.name,
        });
        setCityInput('');
        setSelectedCity(value);
      }
    } else {
      setSelectedCity(null);
      setCityInput('');
    }
  };

  const handleSubmit = () => {
    if (
      selectedCity &&
      indoorConditions.temperature &&
      indoorConditions.humidity
    ) {
      onSubmit({
        temperature: indoorConditions.temperature,
        humidity: indoorConditions.humidity,
      });
    } else {
      alert('Please fill in all fields.');
    }
  };

  const logoSrc = darkMode ? lightLogo : darkLogo;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url('/images/background.jpg')`,
        backgroundSize: 'auto',
        backgroundPosition: 'center',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '50px 0', // Added padding to the top and bottom
        }}
      >
       <Container maxWidth="lg">
    <Stack
      direction="column"
      spacing={4}
      alignItems="center"
      justifyContent="center"
    >
      {/* Logo and App Name next to each other */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}  // Add some spacing between the logo and app name
        sx={{
          mb: 2,  // Adds margin below the logo/app name combo
        }}
      >
        <Box
          component="img"
          src={logoSrc}
          alt="AirAware Logo"
          sx={{
            height: {
              xs: '50px',
              sm: '70px',
              md: '80px',
            },
          }}
        />
        <Typography variant="h3" component="h1" align="center">
          AirAware
        </Typography>
      </Stack>
   
            <Typography variant="h6" align="center">
              Open your windows strategically to decrease indoor humidity.
            </Typography>

            {/* Search Bar */}
            <Autocomplete
              options={cityOptions}
              getOptionLabel={(option) =>
                option.isCurrentLocation ? 'Current Location' : option.name
              }
              inputValue={cityInput}
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
                width: '100%',
                maxWidth: 400,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 1,
              }}
              renderOption={(props, option) => (
                <li {...props}>
                  {option.isCurrentLocation ? (
                    <Box display="flex" alignItems="center">
                      <MyLocationIcon sx={{ marginRight: 1 }} />
                      Current Location
                    </Box>
                  ) : (
                    option.name
                  )}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search City"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              noOptionsText="No results"
            />

            {/* Indoor Conditions Inputs */}
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  placeholder="Indoor Temperature (°C)"  // Replaces the label
                  variant="outlined"  // Same variant as city input
                  fullWidth
                  name="temperature"
                  value={indoorConditions.temperature}
                  onChange={(e) =>
                    setIndoorConditions((prev) => ({
                      ...prev,
                      temperature: e.target.value,
                    }))
                  }
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Thermostat />
                      </InputAdornment>
                    ),
                  }}
                  size="small"  // Matches the city input size
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Same background as city input
                    borderRadius: 1,  // Same border radius as city input
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  placeholder="Indoor Humidity (%)"  // Replaces the label
                  variant="outlined"  // Same variant as city input
                  fullWidth
                  name="humidity"
                  value={indoorConditions.humidity}
                  onChange={(e) =>
                    setIndoorConditions((prev) => ({
                      ...prev,
                      humidity: e.target.value,
                    }))
                  }
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Opacity />
                      </InputAdornment>
                    ),
                  }}
                  size="small"  // Matches the city input size
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Same background as city input
                    borderRadius: 1,  // Same border radius as city input
                  }}
                  required
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
              sx={{ mt: 2 }}
            >
              Submit to See Results
            </Button>
          </Stack>
        </Container>
      </Box>

     

<Box
  sx={{
    backgroundColor: darkMode ? '#FAFAFA' : '#FFFFFF', // Light background for contrast
    padding: '80px 0', // Spacious padding for the section
    color: '#333333',  // Consistent with other sections
  }}
>
  <Container maxWidth="lg">
    <Typography
      variant="h4"
      align="left"
      sx={{
        fontWeight: 'bold',
        mb: 6,
        color: '#333333', // Bold main heading
      }}
    >
      Why I Built AirAware
    </Typography>

    <Grid container spacing={6} alignItems="center">
      {/* Image on the left */}
      <Grid item xs={12} md={6}>
        <Box
          component="img"
          src="/images/humid-climate.jpg" // Replace with your image path
          alt="Humid Climate"
          sx={{
            width: '100%',
            height: 'auto',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        />
      </Grid>

      {/* Text content on the right */}
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            textAlign: 'left',
            color: '#333333',
          }}
        >
                    <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              mb: 2,
            }}
          >
Timing Your Ventilation Can Be Challenging
</Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#666666' }}>
          It’s hard to know when to open windows to lower humidity. Conditions change quickly, and what seems right could make things worse. Indoor temperature, humidity, and time of day all matter, so it’s tough to get it right without a tool that tracks both in real time.          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            Living in a Humid Climate: A Real Struggle
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#666666' }}>
          I live in a humid climate where it’s hard to know when to open windows to reduce humidity. With stuffy rooms, mold, and rising energy bills, I knew there had to be a better way to manage it.
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            A Simple, Natural Solution
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#666666' }}>
          I wanted a tool to use natural methods—like opening windows at the right time—instead of relying on energy-hungry appliances. Lowering energy bills and preventing mold were also key goals.          </Typography>


        </Box>
      </Grid>
    </Grid>
  </Container>
</Box>




      {/* Articles Section */}
      <Box sx={{ backgroundColor: darkMode ? '#1E1E1E' : '#F9F9F9', padding: 4 }}>
        <Container maxWidth="lg">
        <Typography
  variant="h4"
  gutterBottom
  align="left"
  sx={{
    fontWeight: 'bold',
    mb: 6,
    color: '#333333',  // Fixed color to match article titles
  }}
>
  Learn More About Managing Humidity
</Typography>

          <Grid container spacing={4}>
            {articles.map((article) => (
              <Grid item xs={12} sm={6} md={3} key={article.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={article.image}
                    alt={article.title}
                    sx={{
                      height: 140,
                      width: '100%',
                      objectFit: 'cover',
                      borderTopLeftRadius: 'inherit',
                      borderTopRightRadius: 'inherit',
                    }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: '500',
                        color: darkMode ? '#FFF' : '#333',
                      }}
                    >
                      {article.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mb: 3, color: darkMode ? '#CCC' : '#666' }}
                    >
                      {article.summary}
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      sx={{
                        mt: 'auto',
                        alignSelf: 'center',
                        textTransform: 'none',
                      }}
                      href={article.link}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      < Footer/>

    </Box>
  );
};

export default LandingPage;
