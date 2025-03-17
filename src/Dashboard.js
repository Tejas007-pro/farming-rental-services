// src/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/bookings')
      .then(response => setBookings(response.data.bookings))
      .catch(err => setError('Could not fetch bookings.'));
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4, backgroundColor: '#f9f9f9', p: 3, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#333' }}>
        Your Booked Equipment
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {bookings.length === 0 ? (
        <Typography align="center">No bookings found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2, backgroundColor: '#fff' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ color: '#fff' }}>Equipment Name</TableCell>
                <TableCell sx={{ color: '#fff' }}>Start Date</TableCell>
                <TableCell sx={{ color: '#fff' }}>End Date</TableCell>
                <TableCell sx={{ color: '#fff' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map(booking => (
                <TableRow key={booking._id} sx={{ '&:nth-of-type(even)': { backgroundColor: '#f3f3f3' } }}>
                  <TableCell>{booking.equipmentName || booking.equipmentId}</TableCell>
                  <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(booking.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Dashboard;
