// src/UserProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  Avatar,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    // You can add more fields like profilePicture URL if needed
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Retrieve token from localStorage (assuming you're using JWT authentication)
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
      setUser(response.data.user);
      setFormData({
        username: response.data.user.username,
        email: response.data.user.email,
      });
    })
    .catch(err => {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch user profile.');
    });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    axios.put('http://localhost:5000/api/profile', formData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
      setMessage('Profile updated successfully!');
      setUser(response.data.user);
      setEditMode(false);
    })
    .catch(err => {
      console.error('Update error:', err);
      setError('Failed to update profile.');
    });
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography variant="h6" align="center">
          Loading profile...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{ width: 80, height: 80, mb: 2 }}
              src={user.profilePicture || ''}
            >
              {user.username[0].toUpperCase()}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {user.username}
            </Typography>
          </Box>
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {editMode ? (
            <Box component="form" onSubmit={handleUpdate} noValidate>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
              />
              {/* Additional fields (like profile picture URL) can be added here */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
                <Button variant="text" color="secondary" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Email:</strong> {user.email}
              </Typography>
              {/* You can display additional user information here */}
              <Button
                variant="contained"
                sx={{ mt: 3 }}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserProfile;
