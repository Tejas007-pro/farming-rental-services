// EquipmentListing.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  Drawer,
  Divider,
  Skeleton,
  Pagination,
  Alert,
  Tooltip,
  Avatar,
  Rating,
  Fade,
  Grow,
  Collapse,
  CircularProgress,
  useMediaQuery,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  Sort as SortIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  CheckCircle as VerifiedIcon,
  LocalShipping as DeliveryIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Clear as ClearIcon,
  Agriculture as TractorIcon,
  Refresh as RefreshIcon,
  KeyboardArrowRight as ArrowRightIcon,
  CurrencyRupee as RupeeIcon,
  CalendarMonth as CalendarIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import API_BASE_URL from './config';

// ==================== THEME COLORS (Green Farm Theme) ====================
const theme = {
  primary: {
    main: '#2E7D32',
    light: '#4CAF50',
    dark: '#1B5E20',
    gradient: 'linear-gradient(135deg, #2E7D32 0%, #00897B 100%)',
  },
  secondary: {
    main: '#8D6E63',
    light: '#A1887F',
  },
  background: {
    default: '#F5F5F0',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    light: '#94A3B8',
  },
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

// ==================== CATEGORY DATA ====================
const categoryData = {
  tractors: { name: 'Tractors', icon: '🚜', color: '#4CAF50' },
  harvesters: { name: 'Harvesters', icon: '🌾', color: '#FF9800' },
  tillers: { name: 'Tillers', icon: '⚙️', color: '#2196F3' },
  plows: { name: 'Plows', icon: '🔧', color: '#9C27B0' },
  seeders: { name: 'Seeders', icon: '🌱', color: '#4CAF50' },
  sprayers: { name: 'Sprayers', icon: '💨', color: '#00BCD4' },
  irrigation: { name: 'Irrigation', icon: '💧', color: '#03A9F4' },
  threshers: { name: 'Threshers', icon: '🌿', color: '#8BC34A' },
  balers: { name: 'Balers', icon: '📦', color: '#795548' },
  loaders: { name: 'Loaders', icon: '🏗️', color: '#607D8B' },
  trailers: { name: 'Trailers', icon: '🚛', color: '#FF5722' },
  other: { name: 'Other', icon: '🔨', color: '#9E9E9E' },
};

// ==================== CONDITION DATA ====================
const conditionData = {
  new: { name: 'Brand New', color: '#10B981' },
  excellent: { name: 'Excellent', color: '#22C55E' },
  good: { name: 'Good', color: '#3B82F6' },
  fair: { name: 'Fair', color: '#F59E0B' },
  needs_repair: { name: 'Needs Repair', color: '#EF4444' },
};

// ==================== SORT OPTIONS ====================
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

// ==================== IMAGE URL HELPER ====================
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder-equipment.jpg';
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/')) return `${API_BASE_URL}${imageUrl}`;
  return `${API_BASE_URL}/${imageUrl}`;
};

// ==================== EQUIPMENT CARD COMPONENT ====================
const EquipmentCard = ({ equipment, viewMode, onFavorite, isFavorite, t }) => {
  const isListView = viewMode === 'list';

  const category = categoryData[equipment.category] || categoryData.other;
  const condition = conditionData[equipment.condition] || conditionData.good;

  const primaryImage = equipment.images?.[0]?.url || equipment.imageUrl || '/placeholder-equipment.jpg';

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Contact for price';
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  const getLocation = () => {
    if (equipment.locationDetails?.district && equipment.locationDetails?.state) {
      return `${equipment.locationDetails.district}, ${equipment.locationDetails.state}`;
    }
    return equipment.location || 'Location not specified';
  };

  // List View Card
  if (isListView) {
    return (
      <Fade in timeout={300}>
        <Card
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          {/* Image */}
          <Box sx={{ position: 'relative', width: { xs: '100%', sm: 280 }, flexShrink: 0 }}>
            <CardMedia
              component="img"
              sx={{
                height: { xs: 200, sm: '100%' },
                minHeight: { sm: 220 },
                objectFit: 'cover'
              }}
              image={getImageUrl(primaryImage)}
              alt={equipment.name}
              onError={(e) => {
                e.target.src = '/placeholder-equipment.jpg';
              }}
            />

            {/* Category Badge */}
            <Chip
              label={category.name}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                bgcolor: 'rgba(255,255,255,0.95)',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
              icon={<span style={{ marginLeft: 8 }}>{category.icon}</span>}
            />

            {/* Availability Badge */}
            {!equipment.available && (
              <Chip
                label="Rented Out"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 50,
                  bgcolor: '#FEE2E2',
                  color: '#EF4444',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            )}

            {/* Favorite Button */}
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFavorite(equipment._id);
              }}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(255,255,255,0.9)',
                '&:hover': { bgcolor: '#fff' },
              }}
            >
              {isFavorite ? (
                <FavoriteIcon sx={{ color: '#EF4444' }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: theme.text.secondary }} />
              )}
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text.primary, mb: 0.5 }}>
                  {equipment.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon sx={{ fontSize: 16, color: theme.text.light }} />
                  <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                    {getLocation()}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: theme.primary.main }}>
                  {formatPrice(equipment.rentalPrice)}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                  per day
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: theme.text.secondary,
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {equipment.description || 'No description available'}
            </Typography>

            {/* Tags */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip
                label={condition.name}
                size="small"
                sx={{
                  bgcolor: `${condition.color}15`,
                  color: condition.color,
                  fontWeight: 500,
                  fontSize: '0.75rem',
                }}
              />
              {equipment.specifications?.brand && (
                <Chip
                  label={equipment.specifications.brand}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
              {equipment.specifications?.horsePower && (
                <Chip
                  icon={<SpeedIcon sx={{ fontSize: 14 }} />}
                  label={`${equipment.specifications.horsePower} HP`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
              {equipment.delivery?.available && (
                <Chip
                  icon={<DeliveryIcon sx={{ fontSize: 14 }} />}
                  label="Delivery Available"
                  size="small"
                  sx={{ bgcolor: '#E8F5E9', color: theme.primary.main, fontSize: '0.75rem' }}
                />
              )}
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {equipment.ratings?.average > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {equipment.ratings.average.toFixed(1)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.text.light }}>
                      ({equipment.ratings.count})
                    </Typography>
                  </Box>
                )}
                {equipment.isVerified && (
                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                    label="Verified"
                    size="small"
                    sx={{ bgcolor: '#E8F5E9', color: theme.primary.main, fontSize: '0.7rem' }}
                  />
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ViewIcon sx={{ fontSize: 16, color: theme.text.light }} />
                  <Typography variant="caption" sx={{ color: theme.text.light }}>
                    {equipment.stats?.views || 0} views
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  to={`/equipment/${equipment._id}`}
                  variant="contained"
                  endIcon={<ArrowRightIcon />}
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    background: theme.primary.gradient,
                    fontWeight: 600,
                    px: 3,
                  }}
                >
                  {t('buttons.rentNow') || 'Rent Now'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Card>
      </Fade>
    );
  }

  // Grid View Card
  return (
    <Fade in timeout={300}>
      <Card
        sx={{
          height: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
            transform: 'translateY(-4px)',
          },
        }}
      >
        {/* Image Section */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={getImageUrl(primaryImage)}
            alt={equipment.name}
            sx={{ objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = '/placeholder-equipment.jpg';
            }}
          />

          {/* Overlay Badges */}
          <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1 }}>
            <Chip
              label={category.icon}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.95)',
                fontWeight: 600,
                minWidth: 36,
              }}
            />
            {!equipment.available && (
              <Chip
                label="Rented"
                size="small"
                sx={{ bgcolor: '#FEE2E2', color: '#EF4444', fontWeight: 600, fontSize: '0.7rem' }}
              />
            )}
            {equipment.isFeatured && (
              <Chip
                label="Featured"
                size="small"
                sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 600, fontSize: '0.7rem' }}
              />
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 0.5 }}>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFavorite(equipment._id);
              }}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                '&:hover': { bgcolor: '#fff' },
              }}
            >
              {isFavorite ? (
                <FavoriteIcon sx={{ fontSize: 18, color: '#EF4444' }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 18, color: theme.text.secondary }} />
              )}
            </IconButton>
          </Box>

          {/* Price Badge */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              p: 2,
              pt: 4,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                {formatPrice(equipment.rentalPrice)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                /day
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Content Section */}
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: theme.text.primary,
              mb: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {equipment.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
            <LocationIcon sx={{ fontSize: 14, color: theme.text.light }} />
            <Typography
              variant="caption"
              sx={{
                color: theme.text.secondary,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {getLocation()}
            </Typography>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: theme.text.secondary,
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.85rem',
              lineHeight: 1.5,
            }}
          >
            {equipment.description || 'No description available'}
          </Typography>

          {/* Tags */}
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
            <Chip
              label={condition.name}
              size="small"
              sx={{
                height: 22,
                bgcolor: `${condition.color}15`,
                color: condition.color,
                fontWeight: 500,
                fontSize: '0.7rem',
              }}
            />
            {equipment.specifications?.brand && (
              <Chip
                label={equipment.specifications.brand}
                size="small"
                variant="outlined"
                sx={{ height: 22, fontSize: '0.7rem' }}
              />
            )}
          </Box>

          {/* Stats */}
          <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {equipment.ratings?.average > 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StarIcon sx={{ fontSize: 16, color: '#F59E0B' }} />
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  {equipment.ratings.average.toFixed(1)}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.text.light }}>
                  ({equipment.ratings.count})
                </Typography>
              </Box>
            ) : (
              <Typography variant="caption" sx={{ color: theme.text.light }}>
                No reviews yet
              </Typography>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ViewIcon sx={{ fontSize: 14, color: theme.text.light }} />
              <Typography variant="caption" sx={{ color: theme.text.light }}>
                {equipment.stats?.views || 0}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        {/* Action Button */}
        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            component={Link}
            to={`/equipment/${equipment._id}`}
            variant="contained"
            fullWidth
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              background: theme.primary.gradient,
              py: 1.2,
            }}
          >
            {t('buttons.rentNow') || 'View & Rent'}
          </Button>
        </Box>
      </Card>
    </Fade>
  );
};

// ==================== SKELETON CARD ====================
const SkeletonCard = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <Card sx={{ display: 'flex', borderRadius: '16px', overflow: 'hidden', mb: 2 }}>
        <Skeleton variant="rectangular" width={280} height={220} />
        <Box sx={{ flex: 1, p: 3 }}>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Skeleton variant="rounded" width={80} height={24} />
            <Skeleton variant="rounded" width={80} height={24} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Skeleton variant="rounded" width={120} height={40} />
          </Box>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: '16px', overflow: 'hidden', height: '100%' }}>
      <Skeleton variant="rectangular" height={200} />
      <Box sx={{ p: 2.5 }}>
        <Skeleton variant="text" width="80%" height={28} />
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="90%" />
        <Box sx={{ display: 'flex', gap: 1, my: 1.5 }}>
          <Skeleton variant="rounded" width={60} height={22} />
          <Skeleton variant="rounded" width={70} height={22} />
        </Box>
        <Skeleton variant="rounded" height={42} sx={{ mt: 2 }} />
      </Box>
    </Card>
  );
};

// ==================== FEATURED SLIDER ====================
const FeaturedSlider = ({ equipment, t }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(equipment.length, 5));
    }, 4000);
    return () => clearInterval(timer);
  }, [equipment.length]);

  if (!equipment || equipment.length === 0) return null;

  const featured = equipment.slice(0, 5);
  const currentItem = featured[currentIndex];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '20px',
        overflow: 'hidden',
        mb: 4,
        position: 'relative',
        border: '1px solid #E2E8F0',
      }}
    >
      <Box sx={{ position: 'relative', height: { xs: 280, sm: 350, md: 400 } }}>
        <CardMedia
          component="img"
          image={getImageUrl(currentItem?.images?.[0]?.url || currentItem?.imageUrl)}
          alt={currentItem?.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            p: { xs: 3, md: 4 },
            pt: 8,
          }}
        >
          <Chip
            label="✨ Featured"
            size="small"
            sx={{
              bgcolor: '#FEF3C7',
              color: '#D97706',
              fontWeight: 600,
              mb: 2,
            }}
          />
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
            {currentItem?.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationIcon sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {currentItem?.location || 'Location not specified'}
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
              ₹{currentItem?.rentalPrice}/day
            </Typography>
          </Box>
          <Button
            component={Link}
            to={`/equipment/${currentItem?._id}`}
            variant="contained"
            sx={{
              bgcolor: '#fff',
              color: theme.primary.main,
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#f0f0f0',
              },
            }}
          >
            {t('buttons.rentNow') || 'Rent Now'}
          </Button>
        </Box>

        {/* Dots Indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            display: 'flex',
            gap: 1,
          }}
        >
          {featured.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: index === currentIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

// ==================== FILTER SIDEBAR ====================
const FilterSidebar = ({
  filters,
  filterOptions,
  onFilterChange,
  onClearFilters,
  onClose,
  isMobile,
  t,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    condition: true,
    location: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const FilterSection = ({ title, name, children }) => (
    <Box sx={{ mb: 2 }}>
      <Box
        onClick={() => toggleSection(name)}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          py: 1,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.text.primary }}>
          {title}
        </Typography>
        {expandedSections[name] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>
      <Collapse in={expandedSections[name]}>
        {children}
      </Collapse>
    </Box>
  );

  const content = (
    <Box sx={{ p: isMobile ? 2 : 0 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t('labels.filters') || 'Filters'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            onClick={onClearFilters}
            startIcon={<ClearIcon />}
            sx={{ textTransform: 'none', color: theme.text.secondary }}
          >
            {t('buttons.clearAll') || 'Clear All'}
          </Button>
          {isMobile && (
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Category Filter */}
      <FilterSection title={t('labels.category') || 'Category'} name="category">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Chip
            label={`📋 ${t('labels.all') || 'All Categories'}`}
            onClick={() => onFilterChange('category', '')}
            sx={{
              justifyContent: 'flex-start',
              bgcolor: !filters.category ? `${theme.primary.main}15` : '#F8FAFC',
              color: !filters.category ? theme.primary.main : theme.text.secondary,
              border: !filters.category ? `1px solid ${theme.primary.main}` : '1px solid transparent',
              fontWeight: !filters.category ? 600 : 400,
            }}
          />
          {Object.entries(categoryData).map(([key, value]) => (
            <Chip
              key={key}
              label={`${value.icon} ${value.name}`}
              onClick={() => onFilterChange('category', filters.category === key ? '' : key)}
              sx={{
                justifyContent: 'flex-start',
                bgcolor: filters.category === key ? `${theme.primary.main}15` : '#F8FAFC',
                color: filters.category === key ? theme.primary.main : theme.text.secondary,
                border: filters.category === key ? `1px solid ${theme.primary.main}` : '1px solid transparent',
                fontWeight: filters.category === key ? 600 : 400,
                '&:hover': {
                  bgcolor: `${theme.primary.main}10`,
                },
              }}
            />
          ))}
        </Box>
      </FilterSection>

      <Divider sx={{ my: 2 }} />

      {/* Price Range Filter */}
      <FilterSection title={`${t('labels.priceRange') || 'Price Range'} (₹/day)`} name="price">
        <Box sx={{ px: 1, py: 1 }}>
          <Slider
            value={[filters.minPrice || 0, filters.maxPrice || 10000]}
            onChange={(e, value) => {
              onFilterChange('minPrice', value[0]);
              onFilterChange('maxPrice', value[1]);
            }}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
            min={0}
            max={10000}
            step={100}
            sx={{
              color: theme.primary.main,
              '& .MuiSlider-thumb': {
                bgcolor: '#fff',
                border: `2px solid ${theme.primary.main}`,
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" sx={{ color: theme.text.secondary }}>
              ₹{(filters.minPrice || 0).toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.text.secondary }}>
              ₹{(filters.maxPrice || 10000).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </FilterSection>

      <Divider sx={{ my: 2 }} />

      {/* Condition Filter */}
      <FilterSection title={t('labels.condition') || 'Condition'} name="condition">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(conditionData).map(([key, value]) => (
            <Chip
              key={key}
              label={value.name}
              size="small"
              onClick={() => onFilterChange('condition', filters.condition === key ? '' : key)}
              sx={{
                bgcolor: filters.condition === key ? `${value.color}20` : '#F8FAFC',
                color: filters.condition === key ? value.color : theme.text.secondary,
                border: filters.condition === key ? `1px solid ${value.color}` : '1px solid transparent',
                fontWeight: filters.condition === key ? 600 : 400,
                '&:hover': {
                  bgcolor: `${value.color}10`,
                },
              }}
            />
          ))}
        </Box>
      </FilterSection>

      <Divider sx={{ my: 2 }} />

      {/* Location Filter */}
      <FilterSection title={t('labels.location') || 'Location'} name="location">
        <TextField
          fullWidth
          size="small"
          placeholder={t('placeholders.enterLocation') || 'Enter location...'}
          value={filters.location || ''}
          onChange={(e) => onFilterChange('location', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationIcon sx={{ color: theme.text.light, fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
            },
          }}
        />
      </FilterSection>

      <Divider sx={{ my: 2 }} />

      {/* Quick Filters */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: theme.text.primary }}>
        {t('labels.quickFilters') || 'Quick Filters'}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Chip
          label={t('labels.availableOnly') || 'Available Only'}
          icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
          onClick={() => onFilterChange('available', filters.available === 'true' ? '' : 'true')}
          sx={{
            justifyContent: 'flex-start',
            bgcolor: filters.available === 'true' ? '#E8F5E9' : '#F8FAFC',
            color: filters.available === 'true' ? theme.primary.main : theme.text.secondary,
            fontWeight: filters.available === 'true' ? 600 : 400,
          }}
        />
        <Chip
          label={t('labels.deliveryAvailable') || 'Delivery Available'}
          icon={<DeliveryIcon sx={{ fontSize: 16 }} />}
          onClick={() => onFilterChange('deliveryAvailable', filters.deliveryAvailable === 'true' ? '' : 'true')}
          sx={{
            justifyContent: 'flex-start',
            bgcolor: filters.deliveryAvailable === 'true' ? '#E8F5E9' : '#F8FAFC',
            color: filters.deliveryAvailable === 'true' ? theme.primary.main : theme.text.secondary,
            fontWeight: filters.deliveryAvailable === 'true' ? 600 : 400,
          }}
        />
        <Chip
          label={t('labels.verifiedOnly') || 'Verified Only'}
          icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
          onClick={() => onFilterChange('verified', filters.verified === 'true' ? '' : 'true')}
          sx={{
            justifyContent: 'flex-start',
            bgcolor: filters.verified === 'true' ? '#E8F5E9' : '#F8FAFC',
            color: filters.verified === 'true' ? theme.primary.main : theme.text.secondary,
            fontWeight: filters.verified === 'true' ? 600 : 400,
          }}
        />
      </Box>
    </Box>
  );

  if (isMobile) {
    return content;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        position: 'sticky',
        top: 24,
      }}
    >
      {content}
    </Paper>
  );
};

// ==================== MAIN COMPONENT ====================
const EquipmentListing = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:900px)');

  // Parse URL params
  const queryParams = new URLSearchParams(location.search);

  // State
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [viewMode, setViewMode] = useState('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    locations: [],
    brands: [],
  });

  // Filters state
  const [filters, setFilters] = useState({
    query: queryParams.get('query') || '',
    category: queryParams.get('category') || '',
    condition: queryParams.get('condition') || '',
    minPrice: queryParams.get('minPrice') ? Number(queryParams.get('minPrice')) : 0,
    maxPrice: queryParams.get('maxPrice') ? Number(queryParams.get('maxPrice')) : 10000,
    location: queryParams.get('location') || '',
    available: queryParams.get('available') || '',
    deliveryAvailable: queryParams.get('deliveryAvailable') || '',
    verified: queryParams.get('verified') || '',
    sort: queryParams.get('sort') || 'newest',
  });

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('equipmentFavorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }
  }, []);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/equipment/filters`);
        if (response.data.success) {
          setFilterOptions(response.data.filters);
        }
      } catch (err) {
        console.error('Failed to fetch filter options:', err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch equipment
  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();

      // Add all non-empty filters to params
      if (filters.query) params.append('query', filters.query);
      if (filters.category) params.append('category', filters.category);
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.minPrice > 0) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice < 10000) params.append('maxPrice', filters.maxPrice);
      if (filters.location) params.append('location', filters.location);
      if (filters.available) params.append('available', filters.available);
      if (filters.deliveryAvailable) params.append('deliveryAvailable', filters.deliveryAvailable);
      if (filters.verified) params.append('verified', filters.verified);
      if (filters.sort) params.append('sort', filters.sort);

      params.append('page', pagination.currentPage);
      params.append('limit', 12);

      const response = await axios.get(`${API_BASE_URL}/api/equipment?${params.toString()}`);

      if (response.data.success !== false) {
        setEquipment(response.data.equipment || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        } else {
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: response.data.equipment?.length || 0,
          });
        }
      } else {
        setEquipment([]);
      }
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError(t('errors.fetchEquipment') || 'Failed to load equipment. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, t]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query) params.append('query', filters.query);
    if (filters.category) params.append('category', filters.category);
    if (filters.condition) params.append('condition', filters.condition);
    if (filters.minPrice > 0) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice < 10000) params.append('maxPrice', filters.maxPrice);
    if (filters.location) params.append('location', filters.location);
    if (filters.available) params.append('available', filters.available);
    if (filters.sort && filters.sort !== 'newest') params.append('sort', filters.sort);

    const newUrl = `${location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [filters, location.pathname]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      query: '',
      category: '',
      condition: '',
      minPrice: 0,
      maxPrice: 10000,
      location: '',
      available: '',
      deliveryAvailable: '',
      verified: '',
      sort: 'newest',
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handle favorite toggle
  const handleFavorite = (id) => {
    setFavorites(prev => {
      const isFavorited = prev.includes(id);
      const newFavorites = isFavorited
        ? prev.filter(f => f !== id)
        : [...prev, id];

      localStorage.setItem('equipmentFavorites', JSON.stringify(newFavorites));

      setSnackbar({
        open: true,
        message: isFavorited
          ? (t('messages.removedFromFavorites') || 'Removed from favorites')
          : (t('messages.addedToFavorites') || 'Added to favorites'),
      });

      return newFavorites;
    });
  };

  // Handle page change
  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEquipment();
  };

  // Count active filters
  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => {
      if (key === 'sort' || key === 'query') return false;
      if (key === 'minPrice') return value > 0;
      if (key === 'maxPrice') return value < 10000;
      return !!value;
    }
  ).length;

  const isSearching = !!filters.query.trim();

  return (
    <Box sx={{ bgcolor: theme.background.default, minHeight: '100vh', pb: 6 }}>
      {/* Header */}
      <Box
        sx={{
          background: theme.primary.gradient,
          pt: 4,
          pb: 6,
          px: 2,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
            🚜 {t('titles.equipmentMarketplace') || 'Equipment Marketplace'}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 3 }}>
            {t('subtitles.findEquipment') || 'Find the perfect farming equipment for your needs'}
          </Typography>

          {/* Search Bar */}
          <Paper
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: '4px 8px',
              borderRadius: '14px',
              maxWidth: 700,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <InputAdornment position="start" sx={{ ml: 1 }}>
              <SearchIcon sx={{ color: theme.text.light }} />
            </InputAdornment>
            <TextField
              fullWidth
              placeholder={t('placeholders.searchEquipment') || 'Search equipment, brand, or location...'}
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{ ml: 1 }}
            />
            {filters.query && (
              <IconButton size="small" onClick={() => handleFilterChange('query', '')}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                background: theme.primary.gradient,
                px: 3,
                ml: 1,
              }}
            >
              {t('buttons.search') || 'Search'}
            </Button>
          </Paper>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -3 }}>
        <Grid container spacing={3}>
          {/* Filters Sidebar - Desktop */}
          {!isMobile && (
            <Grid item md={3}>
              <FilterSidebar
                filters={filters}
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isMobile={false}
                t={t}
              />
            </Grid>
          )}

          {/* Main Content */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            {/* Featured Slider - Only show when not searching and has equipment */}
            {!isSearching && !loading && equipment.length > 0 && (
              <FeaturedSlider
                equipment={equipment.filter(e => e.isFeatured || e.available).slice(0, 5)}
                t={t}
              />
            )}

            {/* Toolbar */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                {/* Mobile Filter Button */}
                {isMobile && (
                  <Button
                    startIcon={<FilterIcon />}
                    onClick={() => setMobileFiltersOpen(true)}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    {t('buttons.filters') || 'Filters'}
                    {activeFilterCount > 0 && (
                      <Badge
                        badgeContent={activeFilterCount}
                        color="primary"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Button>
                )}

                {/* Results Count */}
                <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                  {t('labels.showing') || 'Showing'}{' '}
                  <strong>
                    {equipment.length}
                  </strong>{' '}
                  {t('labels.of') || 'of'}{' '}
                  <strong>
                    {pagination.totalItems}
                  </strong>{' '}
                  {t('labels.equipment') || 'equipment'}
                  {isSearching && (
                    <span> ({t('labels.filtered') || 'filtered'}: "{filters.query}")</span>
                  )}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Sort Dropdown */}
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: '10px' }}
                    startAdornment={
                      <InputAdornment position="start">
                        <SortIcon sx={{ fontSize: 18, color: theme.text.light }} />
                      </InputAdornment>
                    }
                  >
                    {sortOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(`sort.${option.value}`) || option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* View Toggle */}
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, value) => value && setViewMode(value)}
                  size="small"
                >
                  <ToggleButton value="grid" sx={{ borderRadius: '10px 0 0 10px' }}>
                    <Tooltip title={t('labels.gridView') || 'Grid View'}>
                      <GridViewIcon fontSize="small" />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="list" sx={{ borderRadius: '0 10px 10px 0' }}>
                    <Tooltip title={t('labels.listView') || 'List View'}>
                      <ListViewIcon fontSize="small" />
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* Refresh Button */}
                <Tooltip title={t('buttons.refresh') || 'Refresh'}>
                  <IconButton
                    onClick={fetchEquipment}
                    sx={{ border: '1px solid #E2E8F0', borderRadius: '10px' }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>

            {/* Active Filters Chips */}
            {activeFilterCount > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {filters.category && (
                  <Chip
                    label={`${t('labels.category') || 'Category'}: ${categoryData[filters.category]?.name || filters.category}`}
                    onDelete={() => handleFilterChange('category', '')}
                    sx={{ bgcolor: '#E8F5E9', color: theme.primary.main }}
                  />
                )}
                {filters.condition && (
                  <Chip
                    label={`${t('labels.condition') || 'Condition'}: ${conditionData[filters.condition]?.name || filters.condition}`}
                    onDelete={() => handleFilterChange('condition', '')}
                  />
                )}
                {filters.location && (
                  <Chip
                    label={`${t('labels.location') || 'Location'}: ${filters.location}`}
                    onDelete={() => handleFilterChange('location', '')}
                  />
                )}
                {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
                  <Chip
                    label={`${t('labels.price') || 'Price'}: ₹${filters.minPrice.toLocaleString()} - ₹${filters.maxPrice.toLocaleString()}`}
                    onDelete={() => {
                      handleFilterChange('minPrice', 0);
                      handleFilterChange('maxPrice', 10000);
                    }}
                  />
                )}
                {filters.available === 'true' && (
                  <Chip
                    label={t('labels.availableOnly') || 'Available Only'}
                    onDelete={() => handleFilterChange('available', '')}
                    sx={{ bgcolor: '#E8F5E9' }}
                  />
                )}
                {filters.deliveryAvailable === 'true' && (
                  <Chip
                    label={t('labels.deliveryAvailable') || 'Delivery Available'}
                    onDelete={() => handleFilterChange('deliveryAvailable', '')}
                    sx={{ bgcolor: '#E8F5E9' }}
                  />
                )}
                <Chip
                  label={t('buttons.clearAll') || 'Clear All'}
                  onClick={handleClearFilters}
                  variant="outlined"
                  sx={{ color: theme.error, borderColor: theme.error }}
                />
              </Box>
            )}

            {/* Error State */}
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3, borderRadius: '12px' }}
                action={
                  <Button color="inherit" size="small" onClick={fetchEquipment}>
                    {t('buttons.retry') || 'Retry'}
                  </Button>
                }
              >
                {error}
              </Alert>
            )}

            {/* Loading State */}
            {loading ? (
              <Grid container spacing={3}>
                {[...Array(6)].map((_, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={viewMode === 'list' ? 12 : 6}
                    lg={viewMode === 'list' ? 12 : 4}
                    key={index}
                  >
                    <SkeletonCard viewMode={viewMode} />
                  </Grid>
                ))}
              </Grid>
            ) : equipment.length === 0 ? (
              /* Empty State */
              <Paper
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: '#F1F5F9',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <TractorIcon sx={{ fontSize: 40, color: theme.text.light }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('messages.noEquipmentFound') || 'No Equipment Found'}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.text.secondary, mb: 3, maxWidth: 400, mx: 'auto' }}>
                  {filters.query
                    ? `${t('messages.noResultsFor') || 'No results for'} "${filters.query}". ${t('messages.tryDifferentSearch') || 'Try a different search term.'}`
                    : t('messages.tryAdjustingFilters') || 'Try adjusting your filters or check back later for new listings.'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    sx={{ borderRadius: '10px', textTransform: 'none' }}
                  >
                    {t('buttons.clearFilters') || 'Clear Filters'}
                  </Button>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/add-equipment"
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      background: theme.primary.gradient,
                    }}
                  >
                    {t('buttons.listEquipment') || 'List Your Equipment'}
                  </Button>
                </Box>
              </Paper>
            ) : (
              /* Equipment Grid/List */
              <Grid container spacing={3}>
                {equipment.map((item) => (
                  <Grid
                    item
                    xs={12}
                    sm={viewMode === 'list' ? 12 : 6}
                    lg={viewMode === 'list' ? 12 : 4}
                    key={item._id}
                  >
                    <EquipmentCard
                      equipment={item}
                      viewMode={viewMode}
                      onFavorite={handleFavorite}
                      isFavorite={favorites.includes(item._id)}
                      t={t}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? 'small' : 'large'}
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: '10px',
                    },
                    '& .Mui-selected': {
                      background: `${theme.primary.gradient} !important`,
                      color: '#fff',
                    },
                  }}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="right"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        PaperProps={{
          sx: { width: '85%', maxWidth: 360 },
        }}
      >
        <FilterSidebar
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onClose={() => setMobileFiltersOpen(false)}
          isMobile={true}
          t={t}
        />
        <Box sx={{ p: 2, borderTop: '1px solid #E2E8F0' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setMobileFiltersOpen(false)}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              background: theme.primary.gradient,
              py: 1.5,
            }}
          >
            {t('buttons.applyFilters') || 'Apply Filters'} ({pagination.totalItems} {t('labels.results') || 'results'})
          </Button>
        </Box>
      </Drawer>

      {/* Snackbar for favorites */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default EquipmentListing;