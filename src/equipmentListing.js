import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const EquipmentListing = () => {
  const [equipment, setEquipment] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || '';
  const isSearching = searchQuery.trim() !== '';

  useEffect(() => {
    const url = searchQuery 
      ? `http://localhost:5000/api/equipment?query=${encodeURIComponent(searchQuery)}`
      : 'http://localhost:5000/api/equipment';
      
    axios.get(url)
      .then(response => {
        setEquipment([...response.data.equipment]);
      })
      .catch(err => setError('Failed to fetch equipment.'));
  }, [searchQuery]);

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, backgroundColor: '#f9f9f9', p: 3, borderRadius: 2 }}>
      {error && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Only show slider if there is no search query */}
      {!isSearching && equipment.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h5" sx={{ mb: 2, mt: 4, color: 'primary.main' }}>
            Featured Equipment
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Slider {...sliderSettings}>
              {equipment.slice(0, 3).map(item => (
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
                      <Typography variant="subtitle1">
                        ₹{item.rentalPrice}/day
                      </Typography>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Slider>
          </Box>
        </motion.div>
      )}

      {/* All Equipment Grid */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h5" sx={{ mb: 2, mt: isSearching ? 4 : 0, color: 'primary.main' }}>
          All Equipment {isSearching && `(Filtered: ${searchQuery})`}
        </Typography>
        <Grid container spacing={4}>
          {equipment.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
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
                      <strong>₹{item.rentalPrice}/day</strong>
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
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default EquipmentListing;
