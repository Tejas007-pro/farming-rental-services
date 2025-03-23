import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Container,
} from '@mui/material';

const EquipmentListing = () => { // Removed searchQuery prop
  const [equipment, setEquipment] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/equipment')
      .then(response => {
        setEquipment([...response.data.equipment]);
      })
      .catch(err => setError('Failed to fetch equipment.'));
  }, []);

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Featured Equipment Slider */}
      <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
        Featured Equipment
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Slider {...sliderSettings}>
          {equipment.map(item => (
            <Box key={item._id} sx={{ px: 2 }}>
              <Card sx={{ position: 'relative', boxShadow: 3, borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={
                    item.imageUrl &&
                    typeof item.imageUrl === 'string' &&
                    (item.imageUrl.startsWith('/uploads') || item.imageUrl.startsWith('uploads'))
                      ? `http://localhost:5000${item.imageUrl.startsWith('/') ? item.imageUrl : '/' + item.imageUrl}`
                      : item.imageUrl || 'https://via.placeholder.com/150'
                  }
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    color: '#fff',
                    p: 1,
                  }}
                >
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="subtitle1">Price: {item.rentalPrice}</Typography>
                </Box>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* All Equipment Grid */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        All Equipment
      </Typography>
      <Grid container spacing={4}>
        {equipment.map(item => (
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
              <Box sx={{ p: 2 }}>
                <Button 
                  component={Link} 
                  to={`/equipment/${item._id}`} 
                  variant="contained" 
                  color="primary"
                  fullWidth
                >
                  Rent Now
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EquipmentListing;
