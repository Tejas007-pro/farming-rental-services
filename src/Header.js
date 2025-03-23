import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, TextField, Paper } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import logo from './logo.jpeg';

const Header = () => {
  const curvedButtonStyle = {
    borderRadius: '20px',
    marginLeft: '8px',
    color: 'black',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'blue',
      color: 'white',
    },
  };

  // Define a styled component for the logo image
  const Logo = styled('img')({
    height: '40px',
    marginRight: '16px',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch suggestions when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      fetch(`http://localhost:5000/api/equipment/search?query=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => setSuggestions(data))
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Clear search when the route changes to a page where search isn't used
  useEffect(() => {
    // If not on the equipment listing page, clear search query and suggestions.
    if (!location.pathname.startsWith('/equipment')) {
      setSearchQuery('');
      setSuggestions([]);
    }
  }, [location.pathname]);

  const handleSuggestionSelect = (name) => {
    setSearchQuery(name);
    setSuggestions([]);
    // Redirect to EquipmentListing with the search query as URL parameter
    navigate(`/equipment?query=${encodeURIComponent(name)}`);
  };

  return (
    <AppBar
      position="sticky"
      sx={{ bgcolor: 'white', boxShadow: 'none', color: 'black', padding: '16px', mb: 4 }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Logo src={logo} alt="Logo" />
          <Typography variant="h5" component="div" sx={{ color: 'black' }}>
            Farming Rental Services
          </Typography>
        </Box>

        {/* Search Bar with Suggestions */}
        <Box sx={{ position: 'relative', mr: 2 }}>
          <TextField
            placeholder="Search equipment..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => setTimeout(() => setSuggestions([]), 200)} // Delay to allow suggestion clicks
            sx={{ width: 250 }}
          />
          {suggestions.length > 0 && (
            <Paper
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 9999,
                maxHeight: 200,
                overflowY: 'auto',
              }}
            >
              {suggestions.map((item) => (
                <Box
                  key={item._id}
                  onMouseDown={() => handleSuggestionSelect(item.name)}
                  sx={{ p: 1, cursor: 'pointer', '&:hover': { backgroundColor: '#f0f0f0' } }}
                >
                  {item.name}
                </Box>
              ))}
            </Paper>
          )}
        </Box>

        {/* Navigation Buttons */}
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
