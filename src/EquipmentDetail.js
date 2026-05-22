import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Divider,
  Chip,
  Skeleton,
  Alert,
  Button,
  Grid,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CheckCircle as AvailableIcon,
  Cancel as NotAvailableIcon,
  ArrowBack as BackIcon,
  CurrencyRupee as RupeeIcon,
} from '@mui/icons-material';
import axios from 'axios';
import PaymentButton from './PaymentButton';
import API_BASE_URL from './config';

// ==================== IMAGE URL HELPER ====================
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder-equipment.jpg';

  // ✅ Fix Windows backslash
  const fixedUrl = imageUrl.replace(/\\/g, '/');

  if (fixedUrl.startsWith('http://') || fixedUrl.startsWith('https://')) {
    return fixedUrl;
  }
  if (fixedUrl.startsWith('/')) {
    return `${API_BASE_URL}${fixedUrl}`;
  }
  return `${API_BASE_URL}/${fixedUrl}`;
};

// ==================== CONDITION COLORS ====================
const conditionColors = {
  new: '#10B981',
  excellent: '#22C55E',
  good: '#3B82F6',
  fair: '#F59E0B',
  needs_repair: '#EF4444',
};

const conditionNames = {
  new: 'Brand New',
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
  needs_repair: 'Needs Repair',
};

// ==================== LOADING SKELETON ====================
const LoadingSkeleton = () => (
  <Box p={4} display="flex" justifyContent="center">
    <Card sx={{ maxWidth: 600, width: '100%', borderRadius: 2 }}>
      <Skeleton variant="rectangular" height={300} />
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="40%" height={32} sx={{ mt: 2 }} />
        <Divider sx={{ my: 2 }} />
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="rounded" height={48} sx={{ mt: 3 }} />
      </CardContent>
    </Card>
  </Box>
);

// ==================== MAIN COMPONENT ====================
const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError('');

        console.log('Fetching equipment ID:', id);

        const response = await axios.get(
          `${API_BASE_URL}/api/equipment/${id}`
        );

        if (response.data.success !== false) {
          setEquipment(response.data.equipment);
        } else {
          setError('Equipment not found.');
        }

      } catch (err) {
        console.error('Error fetching equipment details:', err);

        if (err.response?.status === 404) {
          setError('Equipment not found.');
        } else {
          setError(
            err.response?.data?.message ||
            'Failed to fetch equipment details. Please try again.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEquipment();
    }
  }, [id]);

  // ✅ Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // ✅ Error state
  if (error) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <Box maxWidth={600} width="100%">
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate(-1)}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    );
  }

  // ✅ No equipment found
  if (!equipment) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <Typography variant="body1" color="text.secondary">
          Equipment not found.
        </Typography>
      </Box>
    );
  }

  // ✅ Safe price calculation - handles both string and number
  const getRentalPrice = () => {
    if (!equipment.rentalPrice && equipment.rentalPrice !== 0) {
      return 0;
    }
    return parseFloat(
      String(equipment.rentalPrice).replace(/[^0-9.]/g, '')
    ) || 0;
  };

  // ✅ Get primary image - handles both old and new format
  const primaryImage =
    equipment.images?.[0]?.url ||
    equipment.imageUrl ||
    '/placeholder-equipment.jpg';

  // ✅ Get location - handles both old and new format
  const getLocation = () => {
    if (
      equipment.locationDetails?.district &&
      equipment.locationDetails?.state
    ) {
      return `${equipment.locationDetails.district}, ${equipment.locationDetails.state}`;
    }
    return equipment.location || 'Location not specified';
  };

  const rentalPrice = getRentalPrice();
  const condition = equipment.condition || 'good';
  const conditionColor = conditionColors[condition] || '#3B82F6';
  const conditionName = conditionNames[condition] || 'Good';

  return (
    <Box
      p={4}
      display="flex"
      justifyContent="center"
      sx={{
        background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
        minHeight: '100vh',
      }}
    >
      <Box maxWidth={600} width="100%">

        {/* Back Button */}
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 2,
            textTransform: 'none',
            color: '#2E7D32',
            fontWeight: 600,
          }}
        >
          Back to Listings
        </Button>

        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>

          {/* Equipment Image */}
          <CardMedia
            component="img"
            height="300"
            image={getImageUrl(primaryImage)}
            alt={equipment.name}
            sx={{ objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = '/placeholder-equipment.jpg';
            }}
          />

          <CardContent sx={{ p: 3 }}>

            {/* Name and Condition */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1,
              flexWrap: 'wrap',
              gap: 1,
            }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 'bold', color: '#1E293B' }}
              >
                {equipment.name}
              </Typography>

              {/* ✅ Condition chip */}
              {equipment.condition && (
                <Chip
                  label={conditionName}
                  size="small"
                  sx={{
                    bgcolor: `${conditionColor}20`,
                    color: conditionColor,
                    fontWeight: 600,
                    border: `1px solid ${conditionColor}`,
                  }}
                />
              )}
            </Box>

            {/* Description */}
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 2, lineHeight: 1.6 }}
            >
              {equipment.description || 'No description available'}
            </Typography>

            {/* Price */}
            <Box sx={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 0.5,
              mb: 2,
            }}>
              <RupeeIcon sx={{ color: '#2E7D32', fontSize: 28 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: '#2E7D32' }}
              >
                {rentalPrice.toLocaleString('en-IN')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                / day
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Details Grid */}
            <Grid container spacing={2} sx={{ mb: 2 }}>

              {/* Availability */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* ✅ Fixed: using 'available' not 'availability' */}
                  {equipment.available ? (
                    <AvailableIcon sx={{ color: '#10B981', fontSize: 20 }} />
                  ) : (
                    <NotAvailableIcon sx={{ color: '#EF4444', fontSize: 20 }} />
                  )}
                  <Typography variant="body1">
                    <strong>Status: </strong>
                    <span style={{
                      color: equipment.available ? '#10B981' : '#EF4444',
                      fontWeight: 600,
                    }}>
                      {equipment.available ? 'Available' : 'Not Available'}
                    </span>
                  </Typography>
                </Box>
              </Grid>

              {/* Location */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon sx={{ color: '#64748B', fontSize: 20 }} />
                  <Typography variant="body1">
                    <strong>Location: </strong>
                    {getLocation()}
                  </Typography>
                </Box>
              </Grid>

              {/* Brand - if exists */}
              {equipment.specifications?.brand && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Brand: </strong>
                    {equipment.specifications.brand}
                  </Typography>
                </Grid>
              )}

              {/* Horsepower - if exists */}
              {equipment.specifications?.horsePower && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Horse Power: </strong>
                    {equipment.specifications.horsePower} HP
                  </Typography>
                </Grid>
              )}

              {/* Category - if exists */}
              {equipment.category && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Category: </strong>
                    {equipment.category.charAt(0).toUpperCase() +
                      equipment.category.slice(1)}
                  </Typography>
                </Grid>
              )}

              {/* Delivery - if exists */}
              {equipment.delivery?.available && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Delivery: </strong>
                    <span style={{ color: '#10B981' }}>Available</span>
                    {equipment.delivery.charges > 0 && (
                      <span> (₹{equipment.delivery.charges})</span>
                    )}
                  </Typography>
                </Grid>
              )}

            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Payment Section */}
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, color: '#1E293B' }}
              >
                Book & Pay
              </Typography>

              {equipment.available ? (
                <PaymentButton amount={rentalPrice} />
              ) : (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                  This equipment is currently not available for rent.
                </Alert>
              )}
            </Box>

          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default EquipmentDetail;