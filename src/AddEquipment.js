import React, { useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';

const AddEquipment = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rentalPrice: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      // Create FormData to send text fields and file
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('rentalPrice', formData.rentalPrice);
      if (selectedFile) {
        data.append('image', selectedFile);
      }
      const response = await axios.post('http://localhost:5000/api/equipment', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(response.data.message);
      // Optionally clear the form fields here
    } catch (err) {
      setError(err.response?.data.error || 'Failed to add equipment.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 8, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Add Equipment
          </Typography>
          {error && (
            <Typography variant="body1" color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {message && (
            <Typography variant="body1" color="success.main" align="center" sx={{ mb: 2 }}>
              {message}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Rental Price"
              name="rentalPrice"
              value={formData.rentalPrice}
              onChange={handleChange}
              required
              margin="normal"
            />
            {/* Styled button for file upload */}
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              Upload Image
              <input
                type="file"
                name="image"
                hidden
                onChange={handleFileChange}
                required
              />
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
            >
              Add Equipment
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddEquipment;
