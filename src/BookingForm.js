import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    equipmentId: '',
    userId: '', // Ideally this comes from your authentication context
    startDate: '',
    endDate: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/bookings', formData);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data.error || 'Booking creation failed.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 8, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Create a Booking
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Equipment ID"
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="User ID"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              name="startDate"
              InputLabelProps={{ shrink: true }}
              value={formData.startDate}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              type="date"
              label="End Date"
              name="endDate"
              InputLabelProps={{ shrink: true }}
              value={formData.endDate}
              onChange={handleChange}
              required
              margin="normal"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
            >
              Book Equipment
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BookingForm;
