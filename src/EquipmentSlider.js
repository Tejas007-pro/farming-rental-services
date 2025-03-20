// src/EquipmentSlider.js
import React from 'react';
import Slider from 'react-slick';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';

const EquipmentSlider = ({ equipmentList }) => {
  // Settings for react-slick slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Slider {...settings}>
        {equipmentList.map((item) => (
          <Box key={item._id} sx={{ px: 2 }}>
            <Card sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="300"
                image={item.imageUrl && item.imageUrl.startsWith('http')
                  ? item.imageUrl
                  : `http://localhost:5000/${item.imageUrl}`}
                alt={item.name}
              />
              <CardContent sx={{ position: 'absolute', bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.6)', width: '100%', color: '#fff' }}>
                <Typography variant="h5">{item.name}</Typography>
                <Typography variant="h6">Price: {item.rentalPrice}</Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default EquipmentSlider;
