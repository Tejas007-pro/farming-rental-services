import React, { useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import { motion } from 'framer-motion';

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
      // Clear the form fields after submission
      setFormData({ name: '', description: '', rentalPrice: '' });
      setSelectedFile(null);
    } catch (err) {
      setError(err.response?.data.error || 'Failed to add equipment.');
    }
  };

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card sx={{ mt: 8, boxShadow: 6, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
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
                autoComplete="off"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                autoComplete="off"
                value={formData.description}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Rental Price"
                name="rentalPrice"
                autoComplete="off"
                value={formData.rentalPrice}
                onChange={handleChange}
                required
                margin="normal"
              />
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mt: 2, mb: 1 }}
              >
                Upload Image
                <input
                  type="file"
                  name="image"
                  hidden
                  onChange={handleFileChange}
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
      </motion.div>
    </Container>
  );
};

export default AddEquipment;
