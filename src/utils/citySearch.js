// src/utils/citySearch.js

import axios from 'axios';

export const getCities = async (query) => {
  const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

  console.log('Mapbox Access Token:', accessToken);

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;

  try {
    // Manually append the access token to the params
    const response = await axios.get(url, {
      params: {
        access_token: accessToken || 'pk.eyJ1IjoiZG9taW5pY21vcnJpcyIsImEiOiJjbTFqNGtnNHcwdGd3MmxzaXB2c2IyOW1oIn0.YwmW8uLj_DM1JDnjwnAjwA', // Replace with your token for testing
        types: 'place',
        limit: 5,
      },
    });

    console.log('Mapbox Response:', response.data);

    return response.data.features.map((feature) => ({
      name: feature.place_name,
      lat: feature.center[1],
      lon: feature.center[0],
    }));
  } catch (error) {
    console.error('Error fetching city data:', error);

    return [];
  }
};
