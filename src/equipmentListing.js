import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Box, TextField, Grid, Card, CardMedia, CardContent, CardActions, Typography, Button } from '@mui/material';
import tractorImage from './sss.jfif';
import harvesterImage from './harvester.jfif';
import plowImage from './plow.jfif';

const staticEquipment = [
  {
    _id: 'static-1',
    name: "Tractor",
    description: "Reliable tractor for farm tasks.",
    imageUrl: tractorImage,
    rentalPrice: "₹1200/day",
    available: true,
  },
  {
    _id: 'static-2',
    name: "Harvester",
    description: "Efficient harvester for crop collection.",
    imageUrl: harvesterImage,
    rentalPrice: "₹5000/day",
    available: true,
  },
  {
    _id: 'static-3',
    name: "Plow",
    description: "Durable plow for field preparation.",
    imageUrl: plowImage,
    rentalPrice: "₹500/day",
    available: true,
  },
];

const EquipmentListing = () => {
  const [equipment, setEquipment] = useState(staticEquipment);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/equipment')
      .then(response => {
        // Merge fetched data with static equipment
        setEquipment([...staticEquipment, ...response.data.equipment]);
      })
      .catch(err => setError('Failed to fetch equipment.'));
  }, []);

  // Filter equipment based on the search query
  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={4}>
      <TextField
        fullWidth
        placeholder="Search equipment..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        variant="outlined"
        margin="normal"
      />
      {error && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Grid container spacing={4}>
        {filteredEquipment.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              <CardMedia
                component="img"
                height="250"
                image={
                  item.imageUrl &&
                  typeof item.imageUrl === 'string' &&
                  (item.imageUrl.startsWith('/uploads') || item.imageUrl.startsWith('uploads'))
                    ? `http://localhost:5000${item.imageUrl.startsWith('/') ? item.imageUrl : '/' + item.imageUrl}`
                    : item.imageUrl || 'https://via.placeholder.com/150'
                }
                alt={item.name}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.description}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  <strong>{item.rentalPrice}</strong>
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  component={Link} 
                  to={`/equipment/${item._id}`} 
                  variant="contained" 
                  color="primary"
                >
                  Rent Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EquipmentListing;
