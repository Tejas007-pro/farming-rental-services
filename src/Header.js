import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles'; // Updated import
import logo from './logo.jpeg';

const Header = ({ searchQuery, setSearchQuery }) => {
  const curvedButtonStyle = {
    borderRadius: '20px',
    marginLeft: '8px',
    color: 'black',
    textTransform: 'none', // Keeps button text normal case
    '&:hover': {
      backgroundColor: 'blue',
      color: 'white',
    },
  };

  const Logo = styled('img')({
    height: '40px',
    marginRight: '16px',
  });

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', boxShadow: 'none', color: 'black', padding: "16px", mb: 4}}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Logo src={logo} alt="Logo" />
          <Typography variant="h5" component="div" sx={{ color: 'black' }}>
            Farming Rental Services
          </Typography>
        </Box>

        {/* Search Bar */}
        <TextField
          placeholder="Search equipment..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 250, mr: 2 }}
        />

        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/equipment">Equipment</Button>
          <Button color="inherit" component={Link} to="/add-equipment">Add Equipment</Button>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/booking">Booking</Button>
          <Button component={Link} to="/login" sx={curvedButtonStyle}>Login</Button>
          <Button component={Link} to="/register" sx={curvedButtonStyle}>Sign Up</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
