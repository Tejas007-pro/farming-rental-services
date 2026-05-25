import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  Chip,
  Skeleton,
  Alert,
  Button,
  Grid,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Breadcrumbs,
  Rating,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CheckCircle as AvailableIcon,
  Cancel as NotAvailableIcon,
  ArrowBack as BackIcon,
  CurrencyRupee as RupeeIcon,
  LocalShipping as DeliveryIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Agriculture as AgricultureIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import axios from 'axios';
import PaymentButton from './PaymentButton';
import API_BASE_URL from './config';

// ==================== IMAGE URL HELPER ====================
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder-equipment.jpg';
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
  <Box sx={{ bgcolor: '#F5F5F0', minHeight: '100vh', py: 3 }}>
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {/* Left - Image */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" width={80} height={70} sx={{ borderRadius: 1 }} />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Right - Details */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Skeleton variant="text" width="70%" height={50} />
            <Skeleton variant="text" width="40%" height={30} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="30%" height={50} sx={{ mt: 2 }} />
            <Divider sx={{ my: 2 }} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="rounded" height={56} sx={{ mt: 3 }} />
            <Skeleton variant="rounded" height={56} sx={{ mt: 2 }} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

// ==================== TRUST BADGE ====================
const TrustBadge = ({ icon, title, subtitle }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      p: 2,
      borderRadius: 2,
      bgcolor: '#F8FFF8',
      border: '1px solid #E8F5E9',
      flex: 1,
    }}
  >
    <Box sx={{ color: '#2E7D32' }}>{icon}</Box>
    <Box>
      <Typography variant="body2" fontWeight={700} color="#1E293B">
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  </Box>
);

// ==================== SPEC ROW ====================
const SpecRow = ({ label, value }) => (
  <TableRow
    sx={{
      '&:nth-of-type(odd)': { bgcolor: '#F8FAFC' },
      '&:hover': { bgcolor: '#F1F8E9' },
    }}
  >
    <TableCell
      sx={{
        fontWeight: 600,
        color: '#64748B',
        border: 'none',
        py: 1.5,
        width: '40%',
      }}
    >
      {label}
    </TableCell>
    <TableCell
      sx={{
        color: '#1E293B',
        fontWeight: 500,
        border: 'none',
        py: 1.5,
      }}
    >
      {value}
    </TableCell>
  </TableRow>
);

// ==================== MAIN COMPONENT ====================
const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${API_BASE_URL}/api/equipment/${id}`);
        if (response.data.success !== false) {
          setEquipment(response.data.equipment);
        } else {
          setError('Equipment not found.');
        }
      } catch (err) {
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

    if (id) fetchEquipment();
  }, [id]);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <Box sx={{ bgcolor: '#F5F5F0', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={() => window.location.reload()}>
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
        </Container>
      </Box>
    );
  }

  if (!equipment) {
    return (
      <Box sx={{ bgcolor: '#F5F5F0', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Typography variant="body1" color="text.secondary">
            Equipment not found.
          </Typography>
        </Container>
      </Box>
    );
  }

  // ==================== HELPERS ====================
  const getRentalPrice = () => {
    if (!equipment.rentalPrice && equipment.rentalPrice !== 0) return 0;
    return parseFloat(String(equipment.rentalPrice).replace(/[^0-9.]/g, '')) || 0;
  };

  const getLocation = () => {
    if (equipment.locationDetails?.district && equipment.locationDetails?.state) {
      return `${equipment.locationDetails.district}, ${equipment.locationDetails.state}`;
    }
    return equipment.location || 'Location not specified';
  };

  // Get all images
  const allImages = equipment.images?.length > 0
    ? equipment.images.map((img) => img.url || img)
    : [equipment.imageUrl || '/placeholder-equipment.jpg'];

  const rentalPrice = getRentalPrice();
  const condition = equipment.condition || 'good';
  const conditionColor = conditionColors[condition] || '#3B82F6';
  const conditionName = conditionNames[condition] || 'Good';

  return (
    <Box sx={{ bgcolor: '#F5F5F0', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">

        {/* ==================== BREADCRUMB ==================== */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 2 }}
        >
          <Typography
            variant="body2"
            sx={{ cursor: 'pointer', color: '#2E7D32', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => navigate('/')}
          >
            Home
          </Typography>
          <Typography
            variant="body2"
            sx={{ cursor: 'pointer', color: '#2E7D32', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => navigate('/equipment')}
          >
            Equipment
          </Typography>
          <Typography variant="body2" color="text.primary" fontWeight={600}>
            {equipment.name}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={3}>

          {/* ==================== LEFT - IMAGE SECTION ==================== */}
          <Grid item xs={12} md={5}>

            {/* Sticky image panel */}
            <Box sx={{ position: { md: 'sticky' }, top: { md: 80 } }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  bgcolor: '#fff',
                }}
              >
                {/* Main Image */}
                <Box
                  sx={{
                    position: 'relative',
                    bgcolor: '#FAFAFA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 380,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={getImageUrl(allImages[selectedImage])}
                    alt={equipment.name}
                    onError={(e) => { e.target.src = '/placeholder-equipment.jpg'; }}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      transition: 'all 0.3s ease',
                    }}
                  />

                  {/* Availability Badge on Image */}
                  <Chip
                    icon={equipment.available ? <AvailableIcon /> : <NotAvailableIcon />}
                    label={equipment.available ? 'Available' : 'Not Available'}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      bgcolor: equipment.available ? '#DCFCE7' : '#FEE2E2',
                      color: equipment.available ? '#15803D' : '#DC2626',
                      fontWeight: 700,
                      border: `1px solid ${equipment.available ? '#BBF7D0' : '#FECACA'}`,
                    }}
                  />

                  {/* Condition Badge */}
                  <Chip
                    label={conditionName}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: `${conditionColor}20`,
                      color: conditionColor,
                      fontWeight: 700,
                      border: `1px solid ${conditionColor}40`,
                    }}
                  />
                </Box>

                {/* Thumbnail Images */}
                {allImages.length > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      p: 2,
                      overflowX: 'auto',
                      borderTop: '1px solid #F1F5F9',
                    }}
                  >
                    {allImages.map((img, index) => (
                      <Box
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        sx={{
                          width: 72,
                          height: 72,
                          borderRadius: 2,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: selectedImage === index
                            ? '2px solid #2E7D32'
                            : '2px solid #E2E8F0',
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                          '&:hover': { borderColor: '#2E7D32' },
                        }}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`view-${index}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = '/placeholder-equipment.jpg'; }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>

              {/* Trust Badges below image */}
              <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
                <TrustBadge
                  icon={<SecurityIcon />}
                  title="Safe Rental"
                  subtitle="Verified listing"
                />
                <TrustBadge
                  icon={<SupportIcon />}
                  title="24/7 Support"
                  subtitle="Always here"
                />
              </Box>
            </Box>
          </Grid>

          {/* ==================== RIGHT - DETAILS SECTION ==================== */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={2.5}>

              {/* ==================== MAIN INFO CARD ==================== */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #E2E8F0',
                    bgcolor: '#fff',
                  }}
                >
                  {/* Category Chip */}
                  {equipment.category && (
                    <Chip
                      icon={<AgricultureIcon sx={{ fontSize: '16px !important' }} />}
                      label={equipment.category.charAt(0).toUpperCase() + equipment.category.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: '#E8F5E9',
                        color: '#2E7D32',
                        fontWeight: 600,
                        mb: 1.5,
                      }}
                    />
                  )}

                  {/* Equipment Name */}
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    color="#1E293B"
                    sx={{ lineHeight: 1.3, mb: 1 }}
                  >
                    {equipment.name}
                  </Typography>

                  {/* Rating Row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating value={4.5} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="#2E7D32" fontWeight={600}>
                      4.5
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      (128 ratings)
                    </Typography>
                    <Chip
                      icon={<VerifiedIcon sx={{ fontSize: '14px !important' }} />}
                      label="Verified"
                      size="small"
                      sx={{
                        bgcolor: '#EFF6FF',
                        color: '#1D4ED8',
                        fontWeight: 600,
                        height: 22,
                      }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Price Section */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      Rental Price
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                      <Typography
                        variant="h3"
                        fontWeight={800}
                        sx={{ color: '#2E7D32' }}
                      >
                        ₹{rentalPrice.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="h6" color="text.secondary" fontWeight={400}>
                        / day
                      </Typography>
                    </Box>

                    {/* Delivery Info */}
                    {equipment.delivery?.available && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                        <DeliveryIcon sx={{ fontSize: 16, color: '#2E7D32' }} />
                        <Typography variant="body2" color="#2E7D32" fontWeight={600}>
                          {equipment.delivery.charges > 0
                            ? `Delivery available at ₹${equipment.delivery.charges}`
                            : 'Free Delivery Available'}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Location */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationIcon sx={{ color: '#64748B', fontSize: 20 }} />
                    <Typography variant="body1" color="#1E293B">
                      <strong>Location:</strong>{' '}
                      <span style={{ color: '#64748B' }}>{getLocation()}</span>
                    </Typography>
                  </Box>

                  {/* Description */}
                  <Box
                    sx={{
                      bgcolor: '#F8FAFC',
                      borderRadius: 2,
                      p: 2,
                      mb: 2,
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <Typography variant="body2" fontWeight={700} color="#1E293B" mb={0.5}>
                      About this Equipment
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                      {equipment.description || 'No description available.'}
                    </Typography>
                  </Box>

                  {/* Book & Pay */}
                  <Box
                    sx={{
                      bgcolor: '#F0FDF4',
                      borderRadius: 2,
                      p: 2.5,
                      border: '1px solid #BBF7D0',
                    }}
                  >
                    <Typography variant="h6" fontWeight={700} color="#1E293B" mb={2}>
                      🚜 Book This Equipment
                    </Typography>

                    {equipment.available ? (
                      <Box>
                        <PaymentButton amount={rentalPrice} />
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => navigate('/equipment')}
                          sx={{
                            mt: 1.5,
                            borderRadius: 2,
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderColor: '#2E7D32',
                            color: '#2E7D32',
                            '&:hover': {
                              bgcolor: '#F0FDF4',
                              borderColor: '#1B5E20',
                            },
                          }}
                        >
                          Browse More Equipment
                        </Button>
                      </Box>
                    ) : (
                      <Alert severity="warning" sx={{ borderRadius: 2 }}>
                        This equipment is currently not available for rent.
                        <Button
                          size="small"
                          sx={{ mt: 1, display: 'block', textTransform: 'none' }}
                          onClick={() => navigate('/equipment')}
                        >
                          Browse Similar Equipment →
                        </Button>
                      </Alert>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* ==================== SPECIFICATIONS CARD ==================== */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #E2E8F0',
                    bgcolor: '#fff',
                  }}
                >
                  <Typography variant="h6" fontWeight={700} color="#1E293B" mb={2}>
                    📋 Specifications
                  </Typography>

                  <Table size="small">
                    <TableBody>
                      <SpecRow label="Category" value={
                        equipment.category
                          ? equipment.category.charAt(0).toUpperCase() + equipment.category.slice(1)
                          : 'N/A'
                      } />
                      <SpecRow label="Condition" value={
                        <Chip
                          label={conditionName}
                          size="small"
                          sx={{
                            bgcolor: `${conditionColor}20`,
                            color: conditionColor,
                            fontWeight: 600,
                            border: `1px solid ${conditionColor}40`,
                          }}
                        />
                      } />
                      <SpecRow label="Availability" value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {equipment.available
                            ? <><AvailableIcon sx={{ color: '#10B981', fontSize: 16 }} /><span style={{ color: '#10B981', fontWeight: 600 }}>Available Now</span></>
                            : <><NotAvailableIcon sx={{ color: '#EF4444', fontSize: 16 }} /><span style={{ color: '#EF4444', fontWeight: 600 }}>Not Available</span></>
                          }
                        </Box>
                      } />
                      <SpecRow label="Location" value={getLocation()} />
                      {equipment.specifications?.brand && (
                        <SpecRow label="Brand" value={equipment.specifications.brand} />
                      )}
                      {equipment.specifications?.horsePower && (
                        <SpecRow label="Horse Power" value={`${equipment.specifications.horsePower} HP`} />
                      )}
                      {equipment.specifications?.year && (
                        <SpecRow label="Year" value={equipment.specifications.year} />
                      )}
                      {equipment.specifications?.fuelType && (
                        <SpecRow label="Fuel Type" value={equipment.specifications.fuelType} />
                      )}
                      {equipment.delivery?.available && (
                        <SpecRow label="Delivery" value={
                          equipment.delivery.charges > 0
                            ? `Available (₹${equipment.delivery.charges})`
                            : 'Free Delivery'
                        } />
                      )}
                      <SpecRow
                        label="Rental Price"
                        value={`₹${rentalPrice.toLocaleString('en-IN')} per day`}
                      />
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>

              {/* ==================== POLICIES CARD ==================== */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #E2E8F0',
                    bgcolor: '#fff',
                  }}
                >
                  <Typography variant="h6" fontWeight={700} color="#1E293B" mb={2}>
                    🛡️ Rental Policies
                  </Typography>

                  <Grid container spacing={2}>
                    {[
                      { icon: '✅', title: 'Verified Equipment', desc: 'All equipment is verified before listing' },
                      { icon: '🔄', title: 'Easy Returns', desc: 'Return equipment hassle-free after use' },
                      { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden charges, pay only what you see' },
                      { icon: '📞', title: '24/7 Support', desc: 'Our team is always available to help you' },
                    ].map((policy, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          <Typography fontSize={20}>{policy.icon}</Typography>
                          <Box>
                            <Typography variant="body2" fontWeight={700} color="#1E293B">
                              {policy.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {policy.desc}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>

            </Grid>
          </Grid>
        </Grid>

        {/* ==================== BACK BUTTON ==================== */}
        <Box sx={{ mt: 4, mb: 2 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              textTransform: 'none',
              color: '#2E7D32',
              fontWeight: 600,
              '&:hover': { bgcolor: '#F0FDF4' },
            }}
          >
            Back to Listings
          </Button>
        </Box>

      </Container>
    </Box>
  );
};

export default EquipmentDetail;