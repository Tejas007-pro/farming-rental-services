// AddEquipment.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  IconButton,
  InputAdornment,
  Switch,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Fade,
  Grow,
  Tooltip,
  Avatar,
  Divider,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  useMediaQuery,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Agriculture as TractorIcon,
  PhotoCamera as CameraIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Build as BuildIcon,
  Inventory as InventoryIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Publish as PublishIcon,
  DragIndicator as DragIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  LocalOffer as TagIcon,
  Speed as SpeedIcon,
  LocalGasStation as FuelIcon,
  DateRange as DateIcon,
  VerifiedUser as VerifiedIcon,
  Lightbulb as TipIcon,
  Warning as WarningIcon,
  Map as MapIcon,
  Home as HomeIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CurrencyRupee as RupeeIcon,
  AccessTime as TimeIcon,
  CalendarMonth as CalendarIcon,
  Straighten as SizeIcon,
  ColorLens as ColorIcon,
  Numbers as NumberIcon,
  Percent as PercentIcon,
  Security as SecurityIcon,
  LocalShipping as DeliveryIcon,
  Phone as PhoneIcon,
  ContentCopy as CopyIcon,
  Undo as UndoIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import API_BASE_URL from './config';

// ==================== THEME COLORS (Green Farm Theme) ====================
const theme = {
  primary: {
    main: '#2E7D32',
    light: '#4CAF50',
    dark: '#1B5E20',
    gradient: 'linear-gradient(135deg, #2E7D32 0%, #00897B 100%)',
    lightGradient: 'linear-gradient(135deg, #E8F5E9 0%, #E0F2F1 100%)',
  },
  secondary: {
    main: '#8D6E63',
    light: '#A1887F',
    dark: '#6D4C41',
  },
  background: {
    default: '#F5F5F0',
    paper: '#FFFFFF',
    card: '#FAFAF5',
  },
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    light: '#94A3B8',
  },
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#0EA5E9',
};

// ==================== EQUIPMENT CATEGORIES ====================
const equipmentCategories = [
  { id: 'tractors', name: 'Tractors', icon: '🚜', description: 'Farm tractors of all sizes' },
  { id: 'harvesters', name: 'Harvesters', icon: '🌾', description: 'Combine harvesters & reapers' },
  { id: 'tillers', name: 'Tillers & Cultivators', icon: '⚙️', description: 'Rotavators & power tillers' },
  { id: 'plows', name: 'Plows', icon: '🔧', description: 'Disc plows & moldboard plows' },
  { id: 'seeders', name: 'Seeders & Planters', icon: '🌱', description: 'Seed drills & planters' },
  { id: 'sprayers', name: 'Sprayers', icon: '💨', description: 'Pesticide & fertilizer sprayers' },
  { id: 'irrigation', name: 'Irrigation Equipment', icon: '💧', description: 'Pumps & irrigation systems' },
  { id: 'threshers', name: 'Threshers', icon: '🌿', description: 'Grain threshers & separators' },
  { id: 'balers', name: 'Balers', icon: '📦', description: 'Hay & straw balers' },
  { id: 'loaders', name: 'Loaders', icon: '🏗️', description: 'Front loaders & forklifts' },
  { id: 'trailers', name: 'Trailers', icon: '🚛', description: 'Farm trailers & carts' },
  { id: 'other', name: 'Other Equipment', icon: '🔨', description: 'Miscellaneous farm tools' },
];

// ==================== EQUIPMENT CONDITIONS ====================
const equipmentConditions = [
  { id: 'new', name: 'Brand New', color: '#10B981', description: 'Never used, factory fresh' },
  { id: 'excellent', name: 'Excellent', color: '#22C55E', description: 'Like new, minimal wear' },
  { id: 'good', name: 'Good', color: '#3B82F6', description: 'Well maintained, fully functional' },
  { id: 'fair', name: 'Fair', color: '#F59E0B', description: 'Some wear, works properly' },
  { id: 'needs_repair', name: 'Needs Repair', color: '#EF4444', description: 'Requires maintenance' },
];

// ==================== FUEL TYPES ====================
const fuelTypes = [
  { id: 'diesel', name: 'Diesel' },
  { id: 'petrol', name: 'Petrol' },
  { id: 'electric', name: 'Electric' },
  { id: 'manual', name: 'Manual/No Fuel' },
  { id: 'solar', name: 'Solar Powered' },
];

// ==================== INDIAN STATES ====================
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

// ==================== STEP DEFINITIONS ====================
const steps = [
  { label: 'Basic Info', icon: CategoryIcon },
  { label: 'Specifications', icon: BuildIcon },
  { label: 'Images', icon: CameraIcon },
  { label: 'Pricing', icon: MoneyIcon },
  { label: 'Location', icon: LocationIcon },
  { label: 'Preview', icon: PreviewIcon },
];

// ==================== STYLED COMPONENTS ====================
const StyledStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: '#E2E8F0',
    borderTopWidth: 3,
    borderRadius: 2,
  },
  '&.Mui-active .MuiStepConnector-line': {
    borderColor: '#2E7D32',
  },
  '&.Mui-completed .MuiStepConnector-line': {
    borderColor: '#10B981',
  },
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#F8FAFC',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: '#E2E8F0',
      borderWidth: '1.5px',
    },
    '&:hover fieldset': {
      borderColor: '#4CAF50',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2E7D32',
      borderWidth: '2px',
    },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 0 0 4px rgba(46, 125, 50, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#64748B',
    '&.Mui-focused': {
      color: '#2E7D32',
    },
  },
});

const ImageDropZone = styled(Box)(({ isDragActive, hasImages }) => ({
  border: `2px dashed ${isDragActive ? '#2E7D32' : '#CBD5E1'}`,
  borderRadius: '16px',
  padding: hasImages ? '16px' : '40px',
  textAlign: 'center',
  backgroundColor: isDragActive ? 'rgba(46, 125, 50, 0.05)' : '#FAFAFA',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#2E7D32',
    backgroundColor: 'rgba(46, 125, 50, 0.02)',
  },
}));

// ==================== TIPS DATA ====================
const stepTips = {
  0: [
    { icon: '💡', text: 'Choose the correct category for better visibility' },
    { icon: '📝', text: 'Write a detailed description to attract renters' },
    { icon: '✅', text: 'Be honest about the equipment condition' },
  ],
  1: [
    { icon: '🔧', text: 'Include brand and model for credibility' },
    { icon: '📊', text: 'Accurate specifications help farmers choose' },
    { icon: '⚡', text: 'Mention horsepower for tractors and engines' },
  ],
  2: [
    { icon: '📸', text: 'Upload clear, well-lit photos' },
    { icon: '🖼️', text: 'Show equipment from multiple angles' },
    { icon: '⭐', text: 'First image will be the cover photo' },
  ],
  3: [
    { icon: '💰', text: 'Research market rates before pricing' },
    { icon: '📅', text: 'Offer discounts for longer rentals' },
    { icon: '🔒', text: 'Security deposit protects your equipment' },
  ],
  4: [
    { icon: '📍', text: 'Accurate location helps nearby farmers find you' },
    { icon: '🚚', text: 'Mention if delivery is available' },
    { icon: '📞', text: 'Provide contact for coordination' },
  ],
  5: [
    { icon: '👀', text: 'Review all details before publishing' },
    { icon: '✏️', text: 'You can edit after publishing' },
    { icon: '🚀', text: 'Your listing will be live immediately' },
  ],
};

// ==================== REUSABLE COMPONENTS ====================

// Section Header
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
      <Avatar sx={{ bgcolor: 'rgba(46, 125, 50, 0.1)', width: 40, height: 40 }}>
        <Icon sx={{ color: theme.primary.main, fontSize: 22 }} />
      </Avatar>
      <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text.primary }}>
        {title}
      </Typography>
    </Box>
    {subtitle && (
      <Typography variant="body2" sx={{ color: theme.text.secondary, ml: 7 }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

// Category Card
const CategoryCard = ({ category, selected, onClick }) => (
  <Paper
    elevation={0}
    onClick={onClick}
    sx={{
      p: 2,
      borderRadius: '12px',
      border: `2px solid ${selected ? theme.primary.main : '#E2E8F0'}`,
      bgcolor: selected ? 'rgba(46, 125, 50, 0.05)' : '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: theme.primary.light,
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography sx={{ fontSize: '2rem' }}>{category.icon}</Typography>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.text.primary }}>
          {category.name}
        </Typography>
        <Typography variant="caption" sx={{ color: theme.text.secondary }}>
          {category.description}
        </Typography>
      </Box>
      {selected && <CheckCircleIcon sx={{ color: theme.primary.main }} />}
    </Box>
  </Paper>
);

// Condition Badge
const ConditionBadge = ({ condition, selected, onClick }) => (
  <Chip
    label={condition.name}
    onClick={onClick}
    sx={{
      px: 2,
      py: 2.5,
      borderRadius: '10px',
      fontSize: '0.9rem',
      fontWeight: 500,
      border: `2px solid ${selected ? condition.color : '#E2E8F0'}`,
      bgcolor: selected ? `${condition.color}15` : '#fff',
      color: selected ? condition.color : theme.text.secondary,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        bgcolor: `${condition.color}10`,
        borderColor: condition.color,
      },
    }}
  />
);

// Price Input Card
const PriceInputCard = ({ duration, icon, value, onChange, suggested }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      bgcolor: '#FAFAFA',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
      <Typography sx={{ fontSize: '1.25rem' }}>{icon}</Typography>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.text.primary }}>
        {duration}
      </Typography>
    </Box>
    <StyledTextField
      fullWidth
      placeholder="0"
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <RupeeIcon sx={{ color: theme.text.light, fontSize: 20 }} />
          </InputAdornment>
        ),
      }}
      sx={{ mb: 1 }}
    />
    {suggested && (
      <Typography variant="caption" sx={{ color: theme.text.secondary }}>
        Suggested: ₹{suggested}
      </Typography>
    )}
  </Paper>
);

// Image Preview Card
const ImagePreviewCard = ({ image, index, isPrimary, onSetPrimary, onDelete, onView }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.2 }}
  >
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        border: isPrimary ? `3px solid ${theme.primary.main}` : '2px solid #E2E8F0',
        aspectRatio: '1',
      }}
    >
      <img
        src={image.preview}
        alt={`Equipment ${index + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Primary Badge */}
      {isPrimary && (
        <Chip
          icon={<StarIcon sx={{ fontSize: 16 }} />}
          label="Cover"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            bgcolor: theme.primary.main,
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        />
      )}

      {/* Action Buttons */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 1,
          display: 'flex',
          gap: 0.5,
          justifyContent: 'center',
          bgcolor: 'rgba(0,0,0,0.6)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          '.MuiPaper-root:hover &': {
            opacity: 1,
          },
        }}
      >
        {!isPrimary && (
          <Tooltip title="Set as cover">
            <IconButton size="small" onClick={() => onSetPrimary(index)} sx={{ color: '#fff' }}>
              <StarBorderIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="View">
          <IconButton size="small" onClick={() => onView(image)} sx={{ color: '#fff' }}>
            <ViewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={() => onDelete(index)} sx={{ color: '#FF6B6B' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Drag Handle */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          cursor: 'grab',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          '.MuiPaper-root:hover &': {
            opacity: 1,
          },
        }}
      >
        <DragIcon sx={{ color: '#fff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
      </Box>
    </Paper>
  </motion.div>
);

// Location Map Placeholder
const LocationMapPlaceholder = ({ address, onGetLocation }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: '16px',
      border: '1px solid #E2E8F0',
      bgcolor: '#F8FAFC',
      textAlign: 'center',
    }}
  >
    <Box
      sx={{
        width: '100%',
        height: 200,
        borderRadius: '12px',
        bgcolor: '#E8F5E9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%234CAF50\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }}
    >
      <MapIcon sx={{ fontSize: 48, color: theme.primary.main, mb: 1 }} />
      <Typography variant="body2" sx={{ color: theme.text.secondary }}>
        {address ? 'Location selected' : 'Map will appear here'}
      </Typography>
    </Box>
    <Button
      variant="outlined"
      startIcon={<MyLocationIcon />}
      onClick={onGetLocation}
      sx={{
        borderRadius: '10px',
        borderColor: theme.primary.main,
        color: theme.primary.main,
        textTransform: 'none',
        fontWeight: 500,
        '&:hover': {
          borderColor: theme.primary.dark,
          bgcolor: 'rgba(46, 125, 50, 0.05)',
        },
      }}
    >
      Use Current Location
    </Button>
  </Paper>
);

// Preview Section Card
const PreviewSection = ({ title, children }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      mb: 2,
    }}
  >
    <Typography
      variant="subtitle2"
      sx={{
        fontWeight: 600,
        color: theme.text.secondary,
        mb: 1.5,
        textTransform: 'uppercase',
        fontSize: '0.75rem',
        letterSpacing: '0.5px',
      }}
    >
      {title}
    </Typography>
    {children}
  </Paper>
);

// ==================== MAIN COMPONENT ====================
const AddEquipment = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [showDraftSnackbar, setShowDraftSnackbar] = useState(false);
  const [imageViewDialog, setImageViewDialog] = useState({ open: false, image: null });
  const [successDialog, setSuccessDialog] = useState(false);

  const fileInputRef = useRef(null);
  const isMobile = useMediaQuery('(max-width:900px)');

  // Form Data State
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    category: '',
    condition: '',
    description: '',

    // Specifications
    brand: '',
    model: '',
    year: '',
    horsePower: '',
    fuelType: '',
    weight: '',
    dimensions: '',
    features: [],

    // Images
    images: [],
    primaryImageIndex: 0,

    // Pricing
    pricePerHour: '',
    pricePerDay: '',
    pricePerWeek: '',
    pricePerMonth: '',
    securityDeposit: '',
    minimumRentalPeriod: 'day',
    negotiable: false,

    // Location
    address: '',
    village: '',
    district: '',
    state: '',
    pincode: '',
    coordinates: null,
    deliveryAvailable: false,
    deliveryRadius: 10,
    contactPhone: '',
    alternatePhone: '',

    // Availability
    available: true,
    quantity: 1,

    // Terms
    termsAccepted: false,
    guidelines: '',
  });

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('equipmentDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        // Don't restore images from draft (binary data)
        setFormData(prev => ({
          ...prev,
          ...draft,
          images: [],
        }));
        setShowDraftSnackbar(true);
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      const draftData = { ...formData, images: [] }; // Don't save images
      localStorage.setItem('equipmentDraft', JSON.stringify(draftData));
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({ ...prev, category: categoryId }));
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  // Handle condition selection
  const handleConditionSelect = (conditionId) => {
    setFormData(prev => ({ ...prev, condition: conditionId }));
    if (errors.condition) {
      setErrors(prev => ({ ...prev, condition: '' }));
    }
  };

  // Handle image upload
  const handleImageUpload = useCallback((files) => {
    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 10), // Max 10 images
    }));
  }, []);

  // Handle drag and drop
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      handleImageUpload(imageFiles);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files);
    }
  };

  // Delete image
  const handleDeleteImage = (index) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        primaryImageIndex: prev.primaryImageIndex >= newImages.length
          ? Math.max(0, newImages.length - 1)
          : prev.primaryImageIndex,
      };
    });
  };

  // Set primary image
  const handleSetPrimaryImage = (index) => {
    setFormData(prev => ({ ...prev, primaryImageIndex: index }));
  };

  // Get current location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
          setMessage('Location captured successfully!');
          setTimeout(() => setMessage(''), 3000);
        },
        (error) => {
          setError('Failed to get location. Please enter manually.');
          setTimeout(() => setError(''), 3000);
        }
      );
    }
  };

  // Validate step
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0: // Basic Info
        if (!formData.name.trim()) newErrors.name = 'Equipment name is required';
        if (!formData.category) newErrors.category = 'Please select a category';
        if (!formData.condition) newErrors.condition = 'Please select condition';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        else if (formData.description.length < 50) newErrors.description = 'Description should be at least 50 characters';
        break;

      case 1: // Specifications
        if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
        if (!formData.fuelType) newErrors.fuelType = 'Please select fuel type';
        break;

      case 2: // Images
        if (formData.images.length === 0) newErrors.images = 'Please upload at least one image';
        break;

      case 3: // Pricing
        if (!formData.pricePerDay) newErrors.pricePerDay = 'Daily rental price is required';
        if (!formData.securityDeposit) newErrors.securityDeposit = 'Security deposit is required';
        break;

      case 4: // Location
        if (!formData.district.trim()) newErrors.district = 'District is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.contactPhone) newErrors.contactPhone = 'Contact phone is required';
        else if (!/^[6-9]\d{9}$/.test(formData.contactPhone)) newErrors.contactPhone = 'Invalid phone number';
        break;

      case 5: // Preview
        if (!formData.termsAccepted) newErrors.termsAccepted = 'Please accept the terms and guidelines';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save draft manually
  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setMessage('Draft saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  // Clear draft
  const handleClearDraft = () => {
    localStorage.removeItem('equipmentDraft');
    setFormData({
      name: '',
      category: '',
      condition: '',
      description: '',
      brand: '',
      model: '',
      year: '',
      horsePower: '',
      fuelType: '',
      weight: '',
      dimensions: '',
      features: [],
      images: [],
      primaryImageIndex: 0,
      pricePerHour: '',
      pricePerDay: '',
      pricePerWeek: '',
      pricePerMonth: '',
      securityDeposit: '',
      minimumRentalPeriod: 'day',
      negotiable: false,
      address: '',
      village: '',
      district: '',
      state: '',
      pincode: '',
      coordinates: null,
      deliveryAvailable: false,
      deliveryRadius: 10,
      contactPhone: '',
      alternatePhone: '',
      available: true,
      quantity: 1,
      termsAccepted: false,
      guidelines: '',
    });
    setActiveStep(0);
    setShowDraftSnackbar(false);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setLoading(true);
    setError('');

    try {
      const data = new FormData();

      // Append text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images' && key !== 'features' && key !== 'coordinates') {
          data.append(key, formData[key]);
        }
      });

      // Append features as JSON
      data.append('features', JSON.stringify(formData.features));

      // Append coordinates
      if (formData.coordinates) {
        data.append('coordinates', JSON.stringify(formData.coordinates));
      }

      // Append images
      formData.images.forEach((image, index) => {
        data.append('images', image.file);
        if (index === formData.primaryImageIndex) {
          data.append('primaryImage', image.file.name);
        }
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Uncomment for real API
      // const response = await axios.post(`${API_BASE_URL}/api/equipment`, data, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });

      // Clear draft
      localStorage.removeItem('equipmentDraft');

      // Show success
      setSuccessDialog(true);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add equipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add feature
  const handleAddFeature = (feature) => {
    if (feature.trim() && !formData.features.includes(feature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()],
      }));
    }
  };

  // Remove feature
  const handleRemoveFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature),
    }));
  };

  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      // ========== STEP 0: BASIC INFO ==========
      case 0:
        return (
          <Fade in timeout={500}>
            <Box>
              <SectionHeader
                icon={CategoryIcon}
                title="Basic Information"
                subtitle="Tell us about your equipment"
              />

              {/* Equipment Name */}
              <StyledTextField
                fullWidth
                name="name"
                label="Equipment Name"
                placeholder="e.g., John Deere 5050D Tractor"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TractorIcon sx={{ color: theme.text.light }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              {/* Category Selection */}
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: theme.text.primary }}>
                Category *
              </Typography>
              <Grid container spacing={1.5} sx={{ mb: 2 }}>
                {equipmentCategories.map(category => (
                  <Grid item xs={12} sm={6} key={category.id}>
                    <CategoryCard
                      category={category}
                      selected={formData.category === category.id}
                      onClick={() => handleCategorySelect(category.id)}
                    />
                  </Grid>
                ))}
              </Grid>
              {errors.category && (
                <Typography variant="caption" sx={{ color: theme.error, display: 'block', mb: 2 }}>
                  {errors.category}
                </Typography>
              )}

              {/* Condition Selection */}
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: theme.text.primary }}>
                Condition *
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {equipmentConditions.map(condition => (
                  <ConditionBadge
                    key={condition.id}
                    condition={condition}
                    selected={formData.condition === condition.id}
                    onClick={() => handleConditionSelect(condition.id)}
                  />
                ))}
              </Box>
              {errors.condition && (
                <Typography variant="caption" sx={{ color: theme.error, display: 'block', mb: 2 }}>
                  {errors.condition}
                </Typography>
              )}

              {/* Description */}
              <StyledTextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Description"
                placeholder="Describe your equipment in detail - include features, usage history, any modifications, etc."
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description || `${formData.description.length}/500 characters (minimum 50)`}
                inputProps={{ maxLength: 500 }}
                sx={{ mb: 2 }}
              />

              {/* Character count progress */}
              <LinearProgress
                variant="determinate"
                value={Math.min((formData.description.length / 50) * 100, 100)}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: '#E2E8F0',
                  mb: 3,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: formData.description.length >= 50 ? theme.success : theme.warning,
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          </Fade>
        );

      // ========== STEP 1: SPECIFICATIONS ==========
      case 1:
        return (
          <Fade in timeout={500}>
            <Box>
              <SectionHeader
                icon={BuildIcon}
                title="Specifications"
                subtitle="Technical details about your equipment"
              />

              <Grid container spacing={2}>
                {/* Brand */}
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    name="brand"
                    label="Brand / Manufacturer"
                    placeholder="e.g., John Deere"
                    value={formData.brand}
                    onChange={handleChange}
                    error={!!errors.brand}
                    helperText={errors.brand}
                  />
                </Grid>

                {/* Model */}
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    name="model"
                    label="Model"
                    placeholder="e.g., 5050D"
                    value={formData.model}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Year */}
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    name="year"
                    label="Year of Manufacture"
                    placeholder="e.g., 2020"
                    type="number"
                    value={formData.year}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateIcon sx={{ color: theme.text.light }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Horsepower */}
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    name="horsePower"
                    label="Horsepower (HP)"
                    placeholder="e.g., 50"
                    type="number"
                    value={formData.horsePower}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SpeedIcon sx={{ color: theme.text.light }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Fuel Type */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.fuelType}>
                    <InputLabel>Fuel Type *</InputLabel>
                    <Select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      label="Fuel Type *"
                      sx={{
                        borderRadius: '12px',
                        bgcolor: '#F8FAFC',
                        '& fieldset': { borderColor: '#E2E8F0' },
                        '&:hover fieldset': { borderColor: '#4CAF50' },
                        '&.Mui-focused fieldset': { borderColor: '#2E7D32' },
                      }}
                      startAdornment={
                        <InputAdornment position="start">
                          <FuelIcon sx={{ color: theme.text.light }} />
                        </InputAdornment>
                      }
                    >
                      {fuelTypes.map(fuel => (
                        <MenuItem key={fuel.id} value={fuel.id}>{fuel.name}</MenuItem>
                      ))}
                    </Select>
                    {errors.fuelType && <FormHelperText>{errors.fuelType}</FormHelperText>}
                  </FormControl>
                </Grid>

                {/* Weight */}
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    name="weight"
                    label="Weight (kg)"
                    placeholder="e.g., 2500"
                    type="number"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Dimensions */}
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    name="dimensions"
                    label="Dimensions (L x W x H)"
                    placeholder="e.g., 4m x 2m x 2.5m"
                    value={formData.dimensions}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SizeIcon sx={{ color: theme.text.light }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Features/Tags */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: theme.text.primary }}>
                    Features & Tags
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                    <StyledTextField
                      fullWidth
                      placeholder="Add a feature (press Enter)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TagIcon sx={{ color: theme.text.light }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 0 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        onDelete={() => handleRemoveFeature(feature)}
                        sx={{
                          bgcolor: '#E8F5E9',
                          color: theme.primary.main,
                          fontWeight: 500,
                          '& .MuiChip-deleteIcon': {
                            color: theme.primary.main,
                          },
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ color: theme.text.secondary, mt: 1, display: 'block' }}>
                    Suggested: 4WD, Power Steering, AC Cabin, Hydraulic, GPS Enabled
                  </Typography>
                </Grid>

                {/* Quantity */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: theme.text.primary }}>
                    Quantity Available
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                      onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                      sx={{ border: '1px solid #E2E8F0', borderRadius: '10px' }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 600, minWidth: 40, textAlign: 'center' }}>
                      {formData.quantity}
                    </Typography>
                    <IconButton
                      onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                      sx={{ border: '1px solid #E2E8F0', borderRadius: '10px' }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Grid>

                {/* Availability Toggle */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: theme.text.primary }}>
                    Availability Status
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        name="available"
                        checked={formData.available}
                        onChange={handleChange}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: theme.primary.main,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: theme.primary.main,
                          },
                        }}
                      />
                    }
                    label={
                      <Chip
                        label={formData.available ? 'Available for Rent' : 'Not Available'}
                        size="small"
                        sx={{
                          bgcolor: formData.available ? '#E8F5E9' : '#FFEBEE',
                          color: formData.available ? theme.success : theme.error,
                          fontWeight: 600,
                        }}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );

      // ========== STEP 2: IMAGES ==========
      case 2:
        return (
          <Fade in timeout={500}>
            <Box>
              <SectionHeader
                icon={CameraIcon}
                title="Equipment Images"
                subtitle="Upload clear photos from multiple angles"
              />

              {/* Drop Zone */}
              <ImageDropZone
                isDragActive={isDragActive}
                hasImages={formData.images.length > 0}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleFileInputChange}
                />

                {formData.images.length === 0 ? (
                  <>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: isDragActive ? 'rgba(46, 125, 50, 0.1)' : '#F1F5F9',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <UploadIcon sx={{ fontSize: 40, color: isDragActive ? theme.primary.main : theme.text.light }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text.primary, mb: 0.5 }}>
                      {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.text.secondary, mb: 2 }}>
                      or click to browse from your device
                    </Typography>
                    <Chip
                      label="PNG, JPG, JPEG up to 5MB each"
                      size="small"
                      sx={{ bgcolor: '#F1F5F9', color: theme.text.secondary }}
                    />
                  </>
                ) : (
                  <Grid container spacing={1.5}>
                    {formData.images.map((image, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <ImagePreviewCard
                          image={image}
                          index={index}
                          isPrimary={index === formData.primaryImageIndex}
                          onSetPrimary={handleSetPrimaryImage}
                          onDelete={handleDeleteImage}
                          onView={(img) => setImageViewDialog({ open: true, image: img })}
                        />
                      </Grid>
                    ))}

                    {/* Add More Button */}
                    {formData.images.length < 10 && (
                      <Grid item xs={6} sm={4} md={3}>
                        <Paper
                          elevation={0}
                          onClick={() => fileInputRef.current?.click()}
                          sx={{
                            aspectRatio: '1',
                            borderRadius: '12px',
                            border: '2px dashed #CBD5E1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: theme.primary.main,
                              bgcolor: 'rgba(46, 125, 50, 0.02)',
                            },
                          }}
                        >
                          <AddIcon sx={{ fontSize: 32, color: theme.text.light, mb: 0.5 }} />
                          <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                            Add More
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                )}
              </ImageDropZone>

              {errors.images && (
                <Typography variant="caption" sx={{ color: theme.error, mt: 1, display: 'block' }}>
                  {errors.images}
                </Typography>
              )}

              {/* Image Count & Tips */}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                  {formData.images.length}/10 images uploaded
                </Typography>
                <Chip
                  icon={<StarIcon sx={{ fontSize: 16 }} />}
                  label="First image = Cover photo"
                  size="small"
                  sx={{ bgcolor: '#FEF3C7', color: '#D97706' }}
                />
              </Box>

              {/* Image Guidelines */}
              <Paper
                elevation={0}
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <TipIcon sx={{ color: theme.primary.main, fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.primary.dark }}>
                    Photo Tips for Better Visibility
                  </Typography>
                </Box>
                <Grid container spacing={1}>
                  {[
                    'Take photos in good natural lighting',
                    'Show front, back, sides, and any unique features',
                    'Include photos of engine/motor area',
                    'Capture any damages or wear honestly',
                  ].map((tip, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: theme.success }} />
                        <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                          {tip}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Box>
          </Fade>
        );

      // ========== STEP 3: PRICING ==========
      case 3:
        return (
          <Fade in timeout={500}>
            <Box>
              <SectionHeader
                icon={MoneyIcon}
                title="Pricing & Rental Terms"
                subtitle="Set competitive prices for different rental durations"
              />

              {/* Pricing Cards */}
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: theme.text.primary }}>
                Rental Prices
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <PriceInputCard
                    duration="Per Hour"
                    icon="⏱️"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerHour: e.target.value }))}
                    suggested="500"
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <PriceInputCard
                    duration="Per Day"
                    icon="📅"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                    suggested="2,500"
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <PriceInputCard
                    duration="Per Week"
                    icon="📆"
                    value={formData.pricePerWeek}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerWeek: e.target.value }))}
                    suggested="15,000"
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <PriceInputCard
                    duration="Per Month"
                    icon="🗓️"
                    value={formData.pricePerMonth}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerMonth: e.target.value }))}
                    suggested="50,000"
                  />
                </Grid>
              </Grid>
              {errors.pricePerDay && (
                <Typography variant="caption" sx={{ color: theme.error, display: 'block', mb: 2 }}>
                  {errors.pricePerDay}
                </Typography>
              )}

              {/* Security Deposit */}
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SecurityIcon sx={{ color: theme.primary.main }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.text.primary }}>
                    Security Deposit *
                  </Typography>
                </Box>
                <StyledTextField
                  fullWidth
                  name="securityDeposit"
                  placeholder="Enter security deposit amount"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  error={!!errors.securityDeposit}
                  helperText={errors.securityDeposit || 'Refundable deposit to protect your equipment'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RupeeIcon sx={{ color: theme.text.light }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 0 }}
                />
              </Paper>

              {/* Minimum Rental Period */}
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: theme.text.primary }}>
                Minimum Rental Period
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {['hour', 'day', 'week', 'month'].map(period => (
                  <Chip
                    key={period}
                    label={period.charAt(0).toUpperCase() + period.slice(1)}
                    onClick={() => setFormData(prev => ({ ...prev, minimumRentalPeriod: period }))}
                    sx={{
                      px: 2,
                      py: 2,
                      borderRadius: '10px',
                      border: `2px solid ${formData.minimumRentalPeriod === period ? theme.primary.main : '#E2E8F0'}`,
                      bgcolor: formData.minimumRentalPeriod === period ? 'rgba(46, 125, 50, 0.08)' : '#fff',
                      color: formData.minimumRentalPeriod === period ? theme.primary.main : theme.text.secondary,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Box>

              {/* Negotiable */}
              <FormControlLabel
                control={
                  <Checkbox
                    name="negotiable"
                    checked={formData.negotiable}
                    onChange={handleChange}
                    sx={{
                      color: theme.text.light,
                      '&.Mui-checked': { color: theme.primary.main },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                    Price is negotiable for long-term rentals
                  </Typography>
                }
              />

              {/* Pricing Tips */}
              <Paper
                elevation={0}
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: '#FEF3C7',
                  border: '1px solid #FDE68A',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <InfoIcon sx={{ color: '#D97706', fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#92400E' }}>
                    Pricing Tips
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#92400E' }}>
                  • Research similar equipment prices in your area<br />
                  • Offer 10-15% discount for weekly/monthly rentals<br />
                  • Security deposit is typically 20-30% of equipment value
                </Typography>
              </Paper>
            </Box>
          </Fade>
        );

      // ========== STEP 4: LOCATION ==========
      case 4:
        return (
          <Fade in timeout={500}>
            <Box>
              <SectionHeader
                icon={LocationIcon}
                title="Location & Contact"
                subtitle="Where can renters pick up the equipment?"
              />

              {/* Map Placeholder */}
              <LocationMapPlaceholder
                address={formData.address}
                onGetLocation={handleGetLocation}
              />
              {formData.coordinates && (
                <Chip
                  icon={<CheckCircleIcon />}
                  label={`Location captured: ${formData.coordinates.lat.toFixed(4)}, ${formData.coordinates.lng.toFixed(4)}`}
                  sx={{ mt: 1, bgcolor: '#E8F5E9', color: theme.success }}
                />
              )}

              <Divider sx={{ my: 3 }} />

              {/* Address Fields */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    name="address"
                    label="Address / Landmark"
                    placeholder="Enter full address or nearby landmark"
                    value={formData.address}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon sx={{ color: theme.text.light }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    name="village"
                    label="Village / Town"
                    placeholder="Your village or town"
                    value={formData.village}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    name="district"
                    label="District *"
                    placeholder="District name"
                    value={formData.district}
                    onChange={handleChange}
                    error={!!errors.district}
                    helperText={errors.district}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.state}>
                    <InputLabel>State *</InputLabel>
                    <Select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      label="State *"
                      sx={{
                        borderRadius: '12px',
                        bgcolor: '#F8FAFC',
                      }}
                    >
                      {indianStates.map(state => (
                        <MenuItem key={state} value={state}>{state}</MenuItem>
                      ))}
                    </Select>
                    {errors.state && <FormHelperText>{errors.state}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    name="pincode"
                    label="PIN Code"
                    placeholder="6-digit PIN code"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Contact Information */}
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: theme.text.primary }}>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    name="contactPhone"
                    label="Contact Phone *"
                    placeholder="10-digit phone number"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    error={!!errors.contactPhone}
                    helperText={errors.contactPhone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: theme.text.light }} />
                          <Typography sx={{ color: theme.text.secondary, ml: 0.5, fontSize: '0.9rem' }}>
                            +91
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    name="alternatePhone"
                    label="Alternate Phone"
                    placeholder="Optional"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: theme.text.light }} />
                          <Typography sx={{ color: theme.text.secondary, ml: 0.5, fontSize: '0.9rem' }}>
                            +91
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Delivery Options */}
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: theme.text.primary }}>
                Delivery Options
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    name="deliveryAvailable"
                    checked={formData.deliveryAvailable}
                    onChange={handleChange}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: theme.primary.main,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: theme.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DeliveryIcon sx={{ color: formData.deliveryAvailable ? theme.primary.main : theme.text.light }} />
                    <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                      I can deliver equipment to renter's location
                    </Typography>
                  </Box>
                }
              />

              {formData.deliveryAvailable && (
                <Box sx={{ mt: 2, pl: 5 }}>
                  <Typography variant="body2" sx={{ color: theme.text.secondary, mb: 1 }}>
                    Delivery Radius: {formData.deliveryRadius} km
                  </Typography>
                  <Slider
                    value={formData.deliveryRadius}
                    onChange={(e, value) => setFormData(prev => ({ ...prev, deliveryRadius: value }))}
                    min={5}
                    max={100}
                    step={5}
                    marks={[
                      { value: 5, label: '5km' },
                      { value: 50, label: '50km' },
                      { value: 100, label: '100km' },
                    ]}
                    sx={{
                      color: theme.primary.main,
                      '& .MuiSlider-thumb': {
                        bgcolor: '#fff',
                        border: `2px solid ${theme.primary.main}`,
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          </Fade>
        );

      // ========== STEP 5: PREVIEW ==========
      case 5:
        return (
          <Fade in timeout={500}>
            <Box>
              <SectionHeader
                icon={PreviewIcon}
                title="Preview & Publish"
                subtitle="Review your listing before publishing"
              />

              {/* Preview Card */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  mb: 3,
                }}
              >
                {/* Preview Image */}
                {formData.images.length > 0 && (
                  <Box sx={{ position: 'relative', height: 200 }}>
                    <img
                      src={formData.images[formData.primaryImageIndex]?.preview}
                      alt="Equipment Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Chip
                      label={equipmentCategories.find(c => c.id === formData.category)?.name || 'Equipment'}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: 'rgba(255,255,255,0.95)',
                        fontWeight: 600,
                      }}
                    />
                    {formData.available && (
                      <Chip
                        label="Available"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: theme.success,
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                )}

                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text.primary, mb: 1 }}>
                    {formData.name || 'Equipment Name'}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationIcon sx={{ fontSize: 18, color: theme.text.light }} />
                    <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                      {[formData.village, formData.district, formData.state].filter(Boolean).join(', ') || 'Location'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.primary.main }}>
                      ₹{formData.pricePerDay || '0'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                      / day
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Quick Specs */}
                  <Grid container spacing={2}>
                    {formData.brand && (
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" sx={{ color: theme.text.light }}>Brand</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.brand}</Typography>
                      </Grid>
                    )}
                    {formData.horsePower && (
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" sx={{ color: theme.text.light }}>Power</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.horsePower} HP</Typography>
                      </Grid>
                    )}
                    {formData.condition && (
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" sx={{ color: theme.text.light }}>Condition</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {equipmentConditions.find(c => c.id === formData.condition)?.name}
                        </Typography>
                      </Grid>
                    )}
                    {formData.year && (
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" sx={{ color: theme.text.light }}>Year</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.year}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Paper>

              {/* Sections Summary */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <PreviewSection title="Pricing">
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.pricePerHour && (
                        <Chip label={`₹${formData.pricePerHour}/hr`} size="small" />
                      )}
                      {formData.pricePerDay && (
                        <Chip label={`₹${formData.pricePerDay}/day`} size="small" sx={{ bgcolor: '#E8F5E9' }} />
                      )}
                      {formData.pricePerWeek && (
                        <Chip label={`₹${formData.pricePerWeek}/week`} size="small" />
                      )}
                      {formData.pricePerMonth && (
                        <Chip label={`₹${formData.pricePerMonth}/month`} size="small" />
                      )}
                    </Box>
                    {formData.securityDeposit && (
                      <Typography variant="body2" sx={{ mt: 1, color: theme.text.secondary }}>
                        Security Deposit: ₹{formData.securityDeposit}
                      </Typography>
                    )}
                  </PreviewSection>
                </Grid>

                <Grid item xs={12} md={6}>
                  <PreviewSection title="Contact">
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 16 }} /> +91 {formData.contactPhone}
                    </Typography>
                    {formData.deliveryAvailable && (
                      <Chip
                        icon={<DeliveryIcon />}
                        label={`Delivery available (${formData.deliveryRadius}km)`}
                        size="small"
                        sx={{ mt: 1, bgcolor: '#E8F5E9' }}
                      />
                    )}
                  </PreviewSection>
                </Grid>

                <Grid item xs={12}>
                  <PreviewSection title="Description">
                    <Typography variant="body2" sx={{ color: theme.text.secondary, whiteSpace: 'pre-line' }}>
                      {formData.description || 'No description provided'}
                    </Typography>
                  </PreviewSection>
                </Grid>

                {formData.features.length > 0 && (
                  <Grid item xs={12}>
                    <PreviewSection title="Features">
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {formData.features.map((feature, index) => (
                          <Chip key={index} label={feature} size="small" sx={{ bgcolor: '#E8F5E9' }} />
                        ))}
                      </Box>
                    </PreviewSection>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <PreviewSection title="Images">
                    <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
                      {formData.images.map((image, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '8px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            border: index === formData.primaryImageIndex ? `2px solid ${theme.primary.main}` : '1px solid #E2E8F0',
                          }}
                        >
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                      ))}
                    </Box>
                    <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                      {formData.images.length} images uploaded
                    </Typography>
                  </PreviewSection>
                </Grid>
              </Grid>

              {/* Terms & Conditions */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '12px',
                  border: errors.termsAccepted ? `2px solid ${theme.error}` : '1px solid #E2E8F0',
                  bgcolor: '#FAFAFA',
                  mt: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      sx={{
                        color: errors.termsAccepted ? theme.error : theme.text.light,
                        '&.Mui-checked': { color: theme.primary.main },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                      I confirm that the information provided is accurate and I agree to the{' '}
                      <Link href="/terms" style={{ color: theme.primary.main, fontWeight: 500 }}>
                        Listing Guidelines
                      </Link>{' '}
                      and{' '}
                      <Link href="/terms" style={{ color: theme.primary.main, fontWeight: 500 }}>
                        Terms of Service
                      </Link>
                    </Typography>
                  }
                />
                {errors.termsAccepted && (
                  <Typography variant="caption" sx={{ color: theme.error, ml: 4 }}>
                    {errors.termsAccepted}
                  </Typography>
                )}
              </Paper>
            </Box>
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: theme.background.default, minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* ==================== LEFT SIDEBAR (Tips & Progress) ==================== */}
          {!isMobile && (
            <Grid item md={3}>
              <Box sx={{ position: 'sticky', top: 24 }}>
                {/* Progress Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    background: theme.primary.gradient,
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                    🚜 Add Equipment
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mb: 3 }}>
                    List your equipment and start earning
                  </Typography>

                  {/* Progress Steps */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {steps.map((step, index) => {
                      const StepIcon = step.icon;
                      const isCompleted = index < activeStep;
                      const isActive = index === activeStep;

                      return (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: '10px',
                            bgcolor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                            cursor: isCompleted ? 'pointer' : 'default',
                            transition: 'all 0.3s ease',
                            '&:hover': isCompleted ? {
                              bgcolor: 'rgba(255,255,255,0.1)',
                            } : {},
                          }}
                          onClick={() => isCompleted && setActiveStep(index)}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: isCompleted
                                ? 'rgba(255,255,255,0.9)'
                                : isActive
                                  ? 'rgba(255,255,255,0.3)'
                                  : 'rgba(255,255,255,0.1)',
                              color: isCompleted ? theme.success : '#fff',
                            }}
                          >
                            {isCompleted ? (
                              <CheckCircleIcon sx={{ fontSize: 18 }} />
                            ) : (
                              <StepIcon sx={{ fontSize: 16 }} />
                            )}
                          </Avatar>
                          <Typography
                            variant="body2"
                            sx={{
                              color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                              fontWeight: isActive ? 600 : 400,
                            }}
                          >
                            {step.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Paper>

                {/* Tips Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TipIcon sx={{ color: theme.warning }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.text.primary }}>
                      Helpful Tips
                    </Typography>
                  </Box>
                  <List dense sx={{ p: 0 }}>
                    {stepTips[activeStep]?.map((tip, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Typography>{tip.icon}</Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary={tip.text}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: theme.text.secondary,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>

                {/* Quick Actions */}
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<SaveIcon />}
                    onClick={handleSaveDraft}
                    disabled={saving}
                    sx={{
                      flex: 1,
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      color: theme.text.secondary,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#F8FAFC',
                        borderColor: theme.primary.light,
                      },
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Draft'}
                  </Button>
                  <Tooltip title="Clear form">
                    <IconButton
                      onClick={handleClearDraft}
                      sx={{
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        '&:hover': {
                          borderColor: theme.error,
                          color: theme.error,
                        },
                      }}
                    >
                      <UndoIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>
          )}

          {/* ==================== MAIN CONTENT ==================== */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.text.primary, mb: 0.5 }}>
                {steps[activeStep].label}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                Step {activeStep + 1} of {steps.length}
              </Typography>
            </Box>

            {/* Stepper (Mobile) */}
            {isMobile && (
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                connector={<StyledStepConnector />}
                sx={{ mb: 3 }}
              >
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepLabel
                      StepIconComponent={() => {
                        const StepIcon = step.icon;
                        const isCompleted = index < activeStep;
                        const isActive = index === activeStep;
                        return (
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: isCompleted
                                ? theme.success
                                : isActive
                                  ? theme.primary.main
                                  : '#E2E8F0',
                            }}
                          >
                            {isCompleted ? (
                              <CheckCircleIcon sx={{ color: '#fff', fontSize: 20 }} />
                            ) : (
                              <StepIcon sx={{ color: isActive ? '#fff' : theme.text.light, fontSize: 18 }} />
                            )}
                          </Avatar>
                        );
                      }}
                    />
                  </Step>
                ))}
              </Stepper>
            )}

            {/* Alerts */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert
                    severity="error"
                    onClose={() => setError('')}
                    sx={{ mb: 2, borderRadius: '12px' }}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert
                    severity="success"
                    onClose={() => setMessage('')}
                    sx={{ mb: 2, borderRadius: '12px' }}
                  >
                    {message}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Content */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 4 },
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                mb: 3,
              }}
            >
              {renderStepContent(activeStep)}
            </Paper>

            {/* Navigation Buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: '12px',
                    border: '2px solid #E2E8F0',
                    color: theme.text.secondary,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: theme.primary.light,
                      bgcolor: '#F8FAFC',
                    },
                  }}
                >
                  Back
                </Button>
              )}

              <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                {isMobile && (
                  <Button
                    onClick={handleSaveDraft}
                    startIcon={<SaveIcon />}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      color: theme.text.secondary,
                      textTransform: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Save
                  </Button>
                )}

                {activeStep < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    endIcon={<ArrowForwardIcon />}
                    variant="contained"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: '12px',
                      background: theme.primary.gradient,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: `0 8px 24px rgba(46, 125, 50, 0.3)`,
                      '&:hover': {
                        boxShadow: `0 12px 32px rgba(46, 125, 50, 0.4)`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    endIcon={loading ? null : <PublishIcon />}
                    variant="contained"
                    disabled={loading}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: '12px',
                      background: theme.primary.gradient,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: `0 8px 24px rgba(46, 125, 50, 0.3)`,
                      minWidth: 180,
                      '&:hover': {
                        boxShadow: `0 12px 32px rgba(46, 125, 50, 0.4)`,
                        transform: 'translateY(-2px)',
                      },
                      '&.Mui-disabled': {
                        background: theme.primary.gradient,
                        opacity: 0.7,
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: '#fff' }} />
                    ) : (
                      'Publish Listing'
                    )}
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ==================== DIALOGS & SNACKBARS ==================== */}

      {/* Image View Dialog */}
      <Dialog
        open={imageViewDialog.open}
        onClose={() => setImageViewDialog({ open: false, image: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Image Preview
          <IconButton onClick={() => setImageViewDialog({ open: false, image: null })}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {imageViewDialog.image && (
            <img
              src={imageViewDialog.image.preview}
              alt="Preview"
              style={{ width: '100%', borderRadius: '12px' }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={successDialog}
        onClose={() => setSuccessDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 5 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: '#E8F5E9',
              mx: 'auto',
              mb: 3,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 48, color: theme.success }} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text.primary, mb: 1 }}>
            🎉 Equipment Listed Successfully!
          </Typography>
          <Typography variant="body1" sx={{ color: theme.text.secondary, mb: 3 }}>
            Your equipment is now live and visible to farmers in your area.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setSuccessDialog(false);
                handleClearDraft();
              }}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Add Another
            </Button>
            <Button
              variant="contained"
              onClick={() => window.location.href = '/dashboard'}
              sx={{
                borderRadius: '10px',
                background: theme.primary.gradient,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Go to Dashboard
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Draft Restored Snackbar */}
      <Snackbar
        open={showDraftSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowDraftSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setShowDraftSnackbar(false)}
          severity="info"
          sx={{ borderRadius: '12px' }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleClearDraft}
              sx={{ fontWeight: 600 }}
            >
              Clear
            </Button>
          }
        >
          Draft restored from previous session
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddEquipment;