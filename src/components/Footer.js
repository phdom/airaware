// src/components/Footer.js

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Umbrella } from '@mui/icons-material';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      py: 2,
      textAlign: 'center',
      backgroundColor: 'background.paper',
    }}
  >
    <Typography variant="body2" color="textSecondary">
      <Umbrella sx={{ verticalAlign: 'middle', animation: 'wave 2s infinite' }} />{' '}
      Developed in the humid, rainy and charming Aveiro, Portugal.  © {new Date().getFullYear()}
    </Typography>
  </Box>
);

export default Footer;
