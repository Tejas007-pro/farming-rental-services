import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardMedia, CardContent, Typography, Button, TextField, Divider } from '@mui/material';
import axios from 'axios';

const EquipmentDetail = () => {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("Equipment ID from URL:", id);
    axios.get(`http://localhost:5000/api/Equipment/${id}`)
      .then(response => {
        setEquipment(response.data.equipment);
      })
      .catch(err => {
        console.error('Error fetching equipment details:', err);
        setError('Failed to fetch equipment details.');
      });
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
    <Box 
      p={4} 
      display="flex" 
      justifyContent="center" 
      sx={{ background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', minHeight: '100vh' }}
    >
      <Card sx={{ maxWidth: 600, width: '100%', boxShadow: 3, borderRadius: 2 }}>
        {/* Equipment Image */}
        <CardMedia
          component="img"
          height="300"
          image={
            equipment.imageUrl && equipment.imageUrl.startsWith('http')
              ? equipment.imageUrl
              : `http://localhost:5000/${equipment.imageUrl}`
          }
          alt={equipment.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ p: 3 }}>
          {/* Equipment Basic Details */}
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            {equipment.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
            {equipment.description}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
            Price: {equipment.rentalPrice}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Additional Equipment Details */}
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Availability:</strong> {equipment.availability ? "Available" : "Not Available"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Location:</strong> {equipment.location || "Not specified"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Usage:</strong> {equipment.usage || "Not specified"}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Payment Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Payment Details</Typography>
            <TextField
              fullWidth
              label="Card Number"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Expiry Date"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="CVV"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ py: 1.5, fontWeight: 'bold', '&:hover': { backgroundColor: '#1565c0' } }}
            >
              Proceed to Pay
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EquipmentDetail;
