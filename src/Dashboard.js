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
  Box,
} from '@mui/material';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/bookings')
      .then(response => setBookings(response.data.bookings))
      .catch(err => {
        console.error(err);
        setError('Could not fetch bookings.');
      });
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4, p: 3 }}>
      <Box
        sx={{
          backgroundColor: '#f9f9f9',
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#333', mb: 2 }}>
          Your Booked Equipment
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {bookings.length === 0 ? (
          <Typography align="center">No bookings found.</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ backgroundColor: '#fff' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#1976d2' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Equipment Name</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Start Date</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>End Date</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow
                    key={booking._id}
                    sx={{
                      '&:nth-of-type(even)': { backgroundColor: '#f3f3f3' },
                      '&:hover': { backgroundColor: '#e0f7fa' },
                    }}
                  >
                    <TableCell>
                      {booking.equipmentName || booking.equipmentId}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {booking.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
