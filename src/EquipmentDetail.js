import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import axios from 'axios';

const EquipmentDetail = () => {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/equipment/${id}`)
      .then(response => {
        setEquipment(response.data.equipment);
      })
      .catch(err => setError('Failed to fetch equipment details.'));
  }, [id]);

  if (error) {
    return (
      <Box p={4}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!equipment) {
    return (
      <Box p={4}>
        <Typography variant="body1">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={4} display="flex" justifyContent="center">
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardMedia
          component="img"
          height="300"
          image={
            equipment.imageUrl && equipment.imageUrl.startsWith('http')
              ? equipment.imageUrl
              : `http://localhost:5000/${equipment.imageUrl}`
          }
          alt={equipment.name}
        />
        <CardContent>
          <Typography variant="h4" component="div">
            {equipment.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            {equipment.description}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            {equipment.rentalPrice}
          </Typography>
        </CardContent>
        <Box p={2}>
          <Button variant="contained" color="primary" size="large">
            Rent Now
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default EquipmentDetail;
