import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      p={4}
      bgcolor="background.default"
    >
      <Typography variant="h3" color="primary" gutterBottom>
        Welcome to Farming Rental Service
      </Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        Rent high-quality farming equipment easily.
      </Typography>
      <Button
        component={Link}
        to="/equipment"
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 3 }}
      >
        Explore Equipment
      </Button>
    </Box>
  );
};

export default Home;
