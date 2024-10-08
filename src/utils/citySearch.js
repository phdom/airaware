// src/utils/citySearch.js

import axios from 'axios';

export const getCities = async (query) => {
  const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: accessToken,
        types: 'place',
        limit: 5,
      },
    });

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
