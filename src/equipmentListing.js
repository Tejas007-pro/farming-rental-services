import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from './utils/imageUrlHelper';
import API_BASE_URL from './config';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Container,
  TextField,
  Chip,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const EquipmentListing = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const queryFromURL = queryParams.get('query') || '';
  const categoryFromURL = queryParams.get('category') || 'all';

  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(queryFromURL);
  const [category, setCategory] = useState(categoryFromURL);

  const isSearching = !!searchTerm.trim();

  const getCategories = items => {
    const unique = new Set(items.map(it => it.category || 'Other'));
    return ['all', ...Array.from(unique)];
  };

  useEffect(() => {
    const url = queryFromURL
      ? `${API_BASE_URL}/api/equipment?query=${encodeURIComponent(queryFromURL)}`
      : `${API_BASE_URL}/api/equipment`;

    setLoading(true);
    setError('');

    axios.get(url)
      .then(response => {
        const list = response.data.equipment || [];
        setEquipment(list);
        setLoading(false);
      })
      .catch(() => {
        setError(t('errors.fetchEquipment') || 'Failed to fetch equipment.');
        setLoading(false);
      });
  }, [queryFromURL, t]);

  useEffect(() => {
    const list = equipment.filter(item => {
      const matchesSearch = searchTerm
        ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
          || (item.description || '').toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesCategory = category === 'all' || (item.category || 'Other') === category;
      return matchesSearch && matchesCategory;
    });

    setFilteredEquipment(list);
  }, [equipment, searchTerm, category]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('query', searchTerm.trim());
    if (category && category !== 'all') params.set('category', category);
    navigate(`/equipment?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCategory('all');
    navigate('/equipment');
  };

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const categories = getCategories(equipment);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, backgroundColor: '#f9f9f9', p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 3 }}>
        <TextField
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          size="small"
          placeholder={t('placeholders.searchEquipment') || 'Search equipment...'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">🔍</InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  ✕
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 240, flex: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>{t('labels.category') || 'Category'}</InputLabel>
          <Select
            value={category}
            label={t('labels.category') || 'Category'}
            onChange={e => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>
                {cat === 'all' ? t('labels.all') || 'All' : cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleSearch} sx={{ minWidth: 120 }}>
          {t('buttons.applyFilters') || 'Apply'}
        </Button>
      </Box>

      {error && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>{t('messages.loading') || 'Loading equipment...'}</Typography>
        </Box>
      ) : (
        <>
          {!isSearching && filteredEquipment.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h5" sx={{ mb: 2, mt: 1, color: 'primary.main' }}>
                {t('titles.featuredEquipment') || 'Featured Equipment'}
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Slider {...sliderSettings}>
                  {filteredEquipment.slice(0, 3).map(item => (
                    <Box key={item._id} sx={{ px: 1 }}>
                      <Card sx={{ position: 'relative', boxShadow: 3, borderRadius: 2 }}>
                        <CardMedia
                          component="img"
                          height="300"
                          image={getImageUrl(item.imageUrl)}
                          alt={item.name}
                          sx={{ objectFit: 'cover' }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.72))',
                            color: '#fff',
                            p: 1,
                          }}
                        >
                          <Typography variant="h6">{t(`equipment.${item.name.toLowerCase()}`, item.name)}</Typography>
                          <Typography variant="subtitle1">₹{item.rentalPrice}/day</Typography>
                        </Box>
                      </Card>
                    </Box>
                  ))}
                </Slider>
              </Box>
            </motion.div>
          )}

      {/* All Equipment Grid */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h5" sx={{ mb: 2, mt: isSearching ? 4 : 0, color: 'primary.main' }}>
          {t("titles.allEquipment")} {isSearching && `(${t("titles.filtered")}: ${searchQuery})`}
        </Typography>
        <Grid container spacing={4}>
          {equipment.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={
                      item.imageUrl &&
                      typeof item.imageUrl === 'string' &&
                      (item.imageUrl.startsWith('/uploads') || item.imageUrl.startsWith('uploads'))
                        ? `http://192.168.98.48:5000${item.imageUrl.startsWith('/') ? item.imageUrl : '/' + item.imageUrl}`
                        : item.imageUrl || 'https://via.placeholder.com/150'
                    }
                    alt={item.name}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {t(`equipment.${item.name.toLowerCase()}`, item.name)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.description}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      <strong>₹{item.rentalPrice}/day</strong>
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Button 
                      component={Link} 
                      to={`/equipment/${item._id}`} 
                      variant="contained" 
                      color="primary"
                      fullWidth
                    >
                      {t("buttons.rentNow")}
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default EquipmentListing;
