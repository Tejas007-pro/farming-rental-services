// RegisterForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  CircularProgress,
  Fade,
  Grow,
  Paper,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  LinearProgress,
  Chip,
  Avatar,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
  Agriculture as LogoIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  CameraAlt as CameraIcon,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  Map as MapIcon,
} from '@mui/icons-material';

// ==================== THEME COLORS ====================
const theme = {
  primary: {
    main: '#2563EB',
    light: '#3B82F6',
    dark: '#1D4ED8',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #EC4899 100%)',
    buttonGradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
  },
  secondary: {
    main: '#64748B',
    light: '#94A3B8',
    dark: '#475569',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    light: '#94A3B8',
  },
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
};

// ==================== PASSWORD STRENGTH CALCULATOR ====================
const calculatePasswordStrength = (password) => {
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  strength = Object.values(checks).filter(Boolean).length;

  if (strength <= 1) return { level: 'weak', color: '#EF4444', percent: 20, label: 'Weak' };
  if (strength <= 2) return { level: 'fair', color: '#F59E0B', percent: 40, label: 'Fair' };
  if (strength <= 3) return { level: 'good', color: '#3B82F6', percent: 60, label: 'Good' };
  if (strength <= 4) return { level: 'strong', color: '#10B981', percent: 80, label: 'Strong' };
  return { level: 'excellent', color: '#059669', percent: 100, label: 'Excellent' };
};

// ==================== DECORATIVE SHAPES COMPONENT ====================
const DecorativeShapes = () => (
  <Box
    sx={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}
  >
    {/* Large circle top right */}
    <Box
      sx={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        animation: 'float 6s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      }}
    />

    {/* Medium circle bottom left */}
    <Box
      sx={{
        position: 'absolute',
        bottom: '10%',
        left: '-5%',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        animation: 'float 8s ease-in-out infinite reverse',
      }}
    />

    {/* Small floating circles */}
    {[...Array(8)].map((_, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          top: `${15 + i * 10}%`,
          left: `${5 + i * 10}%`,
          width: 10 + i * 3,
          height: 10 + i * 3,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          animation: `pulse ${2 + i * 0.4}s ease-in-out infinite`,
          animationDelay: `${i * 0.2}s`,
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.6 },
            '50%': { transform: 'scale(1.2)', opacity: 1 },
          },
        }}
      />
    ))}

    {/* Dotted pattern */}
    <Box
      sx={{
        position: 'absolute',
        bottom: '15%',
        right: '8%',
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '6px',
      }}
    >
      {[...Array(36)].map((_, i) => (
        <Box
          key={i}
          sx={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
          }}
        />
      ))}
    </Box>

    {/* Curved lines */}
    <svg
      style={{
        position: 'absolute',
        top: '25%',
        left: '5%',
        width: '120px',
        height: '80px',
        opacity: 0.3,
      }}
    >
      <path
        d="M 10 60 Q 60 10, 110 60"
        stroke="white"
        strokeWidth="3"
        fill="transparent"
        strokeLinecap="round"
      />
      <path
        d="M 15 70 Q 60 25, 105 70"
        stroke="white"
        strokeWidth="2"
        fill="transparent"
        strokeLinecap="round"
      />
    </svg>

    {/* Floating ring */}
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        right: '12%',
        width: 50,
        height: 50,
        borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.2)',
        animation: 'rotate 12s linear infinite',
        '@keyframes rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    />

    {/* Hexagon shape */}
    <Box
      sx={{
        position: 'absolute',
        bottom: '35%',
        left: '15%',
        width: 40,
        height: 46,
        background: 'rgba(255,255,255,0.1)',
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        animation: 'float 7s ease-in-out infinite',
      }}
    />
  </Box>
);

// ==================== SOCIAL BUTTON COMPONENT ====================
const SocialButton = ({ icon: Icon, label, onClick, color }) => (
  <Tooltip title={`Sign up with ${label}`}>
    <IconButton
      onClick={onClick}
      sx={{
        width: 50,
        height: 50,
        border: '2px solid #E2E8F0',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: color,
          background: `${color}10`,
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 12px ${color}30`,
        },
      }}
    >
      <Icon sx={{ color: color, fontSize: 24 }} />
    </IconButton>
  </Tooltip>
);

// ==================== CUSTOM TEXT FIELD ====================
const StyledTextField = ({ icon: Icon, ...props }) => (
  <TextField
    {...props}
    fullWidth
    variant="outlined"
    InputProps={{
      startAdornment: Icon && (
        <InputAdornment position="start">
          <Icon sx={{ color: theme.text.light, fontSize: 20 }} />
        </InputAdornment>
      ),
      ...props.InputProps,
    }}
    sx={{
      mb: 2,
      '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#F8FAFC',
        transition: 'all 0.3s ease',
        '& fieldset': {
          borderColor: '#E2E8F0',
          borderWidth: '1.5px',
        },
        '&:hover fieldset': {
          borderColor: theme.primary.light,
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.primary.main,
          borderWidth: '2px',
        },
        '&.Mui-focused': {
          backgroundColor: '#fff',
          boxShadow: `0 0 0 4px ${theme.primary.main}15`,
        },
      },
      '& .MuiInputLabel-root': {
        color: theme.text.secondary,
        '&.Mui-focused': {
          color: theme.primary.main,
        },
      },
      '& .MuiOutlinedInput-input': {
        padding: '14px 14px',
      },
      ...props.sx,
    }}
  />
);

// ==================== STYLED SELECT ====================
const StyledSelect = ({ icon: Icon, label, children, ...props }) => (
  <FormControl
    fullWidth
    error={props.error}
    sx={{
      mb: 2,
      '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#F8FAFC',
        transition: 'all 0.3s ease',
        '& fieldset': {
          borderColor: '#E2E8F0',
          borderWidth: '1.5px',
        },
        '&:hover fieldset': {
          borderColor: theme.primary.light,
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.primary.main,
          borderWidth: '2px',
        },
        '&.Mui-focused': {
          backgroundColor: '#fff',
          boxShadow: `0 0 0 4px ${theme.primary.main}15`,
        },
      },
    }}
  >
    <InputLabel>{label}</InputLabel>
    <Select
      {...props}
      label={label}
      startAdornment={
        Icon && (
          <InputAdornment position="start">
            <Icon sx={{ color: theme.text.light, fontSize: 20 }} />
          </InputAdornment>
        )
      }
    >
      {children}
    </Select>
    {props.helperText && (
      <FormHelperText>{props.helperText}</FormHelperText>
    )}
  </FormControl>
);

// ==================== USER TYPE CARD ====================
const UserTypeCard = ({ type, icon: Icon, title, description, selected, onClick }) => (
  <Paper
    elevation={0}
    onClick={onClick}
    sx={{
      p: 2.5,
      borderRadius: '16px',
      border: `2px solid ${selected ? theme.primary.main : '#E2E8F0'}`,
      background: selected ? `${theme.primary.main}08` : '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: theme.primary.light,
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar
        sx={{
          width: 48,
          height: 48,
          bgcolor: selected ? theme.primary.main : '#F1F5F9',
          transition: 'all 0.3s ease',
        }}
      >
        <Icon sx={{ color: selected ? '#fff' : theme.text.secondary, fontSize: 24 }} />
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: theme.text.primary,
            mb: 0.25,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: theme.text.secondary }}
        >
          {description}
        </Typography>
      </Box>
      {selected && (
        <CheckCircleIcon sx={{ color: theme.primary.main, fontSize: 24 }} />
      )}
    </Box>
  </Paper>
);

// ==================== STEP INDICATOR ====================
const steps = ['Account Type', 'Personal Info', 'Security'];

// ==================== MAIN REGISTER COMPONENT ====================
const RegisterForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Account Type
    userType: '',
    
    // Step 2: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    district: '',
    village: '',
    
    // Step 3: Security
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    subscribeNewsletter: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');

  const passwordStrength = calculatePasswordStrength(formData.password);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.userType) {
        newErrors.userType = 'Please select an account type';
      }
    }

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
      if (!formData.state) {
        newErrors.state = 'State is required';
      }
      if (!formData.district) {
        newErrors.district = 'District is required';
      }
    }

    if (step === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle user type selection
  const handleUserTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, userType: type }));
    if (errors.userType) {
      setErrors(prev => ({ ...prev, userType: '' }));
    }
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!validateStep(activeStep)) return;

    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      if (profileImage) {
        submitData.append('profileImage', profileImage);
      }

      // Uncomment for real API
      // const response = await axios.post('http://localhost:5000/api/register', submitData);
      // setMessage(response.data.message);

      setMessage('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`Sign up with ${provider}`);
    // Implement social signup logic
  };

  // Indian states for dropdown
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  ];

  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in timeout={500}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.text.primary,
                  mb: 1,
                  textAlign: 'center',
                }}
              >
                Choose Your Account Type
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.text.secondary,
                  mb: 3,
                  textAlign: 'center',
                }}
              >
                Select how you want to use FarmRent
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <UserTypeCard
                  type="farmer"
                  icon={PersonIcon}
                  title="Farmer"
                  description="I want to rent farming equipment"
                  selected={formData.userType === 'farmer'}
                  onClick={() => handleUserTypeSelect('farmer')}
                />
                <UserTypeCard
                  type="owner"
                  icon={LogoIcon}
                  title="Equipment Owner"
                  description="I want to list my equipment for rent"
                  selected={formData.userType === 'owner'}
                  onClick={() => handleUserTypeSelect('owner')}
                />
                <UserTypeCard
                  type="both"
                  icon={BadgeIcon}
                  title="Both"
                  description="I want to rent and list equipment"
                  selected={formData.userType === 'both'}
                  onClick={() => handleUserTypeSelect('both')}
                />
              </Box>

              {errors.userType && (
                <Typography
                  variant="caption"
                  sx={{ color: theme.error, mt: 1, display: 'block', textAlign: 'center' }}
                >
                  {errors.userType}
                </Typography>
              )}
            </Box>
          </Fade>
        );

      case 1:
        return (
          <Fade in timeout={500}>
            <Box>
              {/* Profile Image Upload */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={profilePreview}
                    sx={{
                      width: 90,
                      height: 90,
                      bgcolor: '#F1F5F9',
                      border: '3px solid #E2E8F0',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 40, color: theme.text.light }} />
                  </Avatar>
                  <IconButton
                    component="label"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: theme.primary.main,
                      width: 32,
                      height: 32,
                      '&:hover': {
                        bgcolor: theme.primary.dark,
                      },
                    }}
                  >
                    <CameraIcon sx={{ fontSize: 16, color: '#fff' }} />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </IconButton>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: theme.text.secondary, display: 'block', mt: 1 }}
                >
                  Upload profile photo (optional)
                </Typography>
              </Box>

              {/* Name Fields */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StyledTextField
                    icon={PersonIcon}
                    name="firstName"
                    label="First Name"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StyledTextField
                    name="lastName"
                    label="Last Name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </Grid>
              </Grid>

              {/* Email */}
              <StyledTextField
                icon={EmailIcon}
                name="email"
                label="Email Address"
                placeholder="john.doe@example.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />

              {/* Phone */}
              <StyledTextField
                icon={PhoneIcon}
                name="phone"
                label="Phone Number"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: theme.text.light, fontSize: 20 }} />
                      <Typography
                        sx={{
                          color: theme.text.secondary,
                          ml: 1,
                          mr: 0.5,
                          fontSize: '0.9rem',
                        }}
                      >
                        +91
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Location */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StyledSelect
                    icon={MapIcon}
                    name="state"
                    label="State"
                    value={formData.state}
                    onChange={handleChange}
                    error={!!errors.state}
                    helperText={errors.state}
                  >
                    {indianStates.map(state => (
                      <MenuItem key={state} value={state}>{state}</MenuItem>
                    ))}
                  </StyledSelect>
                </Grid>
                <Grid item xs={6}>
                  <StyledTextField
                    icon={LocationIcon}
                    name="district"
                    label="District"
                    placeholder="Your district"
                    value={formData.district}
                    onChange={handleChange}
                    error={!!errors.district}
                    helperText={errors.district}
                  />
                </Grid>
              </Grid>

              {/* Village (Optional) */}
              <StyledTextField
                icon={HomeIcon}
                name="village"
                label="Village/Town (Optional)"
                placeholder="Your village or town"
                value={formData.village}
                onChange={handleChange}
              />
            </Box>
          </Fade>
        );

      case 2:
        return (
          <Fade in timeout={500}>
            <Box>
              {/* Password */}
              <StyledTextField
                icon={LockIcon}
                name="password"
                label="Password"
                placeholder="Create a strong password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: theme.text.light, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: theme.text.light }}
                      >
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Strength Indicator */}
              {formData.password && (
                <Box sx={{ mb: 2, mt: -1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                      Password Strength
                    </Typography>
                    <Chip
                      label={passwordStrength.label}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: `${passwordStrength.color}20`,
                        color: passwordStrength.color,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength.percent}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: '#E2E8F0',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: passwordStrength.color,
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {[
                      { check: formData.password.length >= 8, label: '8+ chars' },
                      { check: /[A-Z]/.test(formData.password), label: 'Uppercase' },
                      { check: /[a-z]/.test(formData.password), label: 'Lowercase' },
                      { check: /\d/.test(formData.password), label: 'Number' },
                      { check: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password), label: 'Special' },
                    ].map((item, index) => (
                      <Chip
                        key={index}
                        label={item.label}
                        size="small"
                        icon={item.check ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : undefined}
                        sx={{
                          height: 22,
                          fontSize: '0.65rem',
                          bgcolor: item.check ? '#DCFCE7' : '#F1F5F9',
                          color: item.check ? '#16A34A' : theme.text.light,
                          '& .MuiChip-icon': {
                            color: '#16A34A',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Confirm Password */}
              <StyledTextField
                icon={LockIcon}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter your password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: theme.text.light, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <CheckCircleIcon sx={{ color: theme.success, fontSize: 20, mr: 1 }} />
                      )}
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{ color: theme.text.light }}
                      >
                        {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Terms & Conditions */}
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    sx={{
                      color: errors.agreeTerms ? theme.error : theme.text.light,
                      '&.Mui-checked': {
                        color: theme.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                    I agree to the{' '}
                    <Link href="/terms" sx={{ color: theme.primary.main, fontWeight: 500 }}>
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" sx={{ color: theme.primary.main, fontWeight: 500 }}>
                      Privacy Policy
                    </Link>
                  </Typography>
                }
                sx={{ mb: 1 }}
              />
              {errors.agreeTerms && (
                <Typography variant="caption" sx={{ color: theme.error, ml: 4, display: 'block' }}>
                  {errors.agreeTerms}
                </Typography>
              )}

              {/* Newsletter */}
              <FormControlLabel
                control={
                  <Checkbox
                    name="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onChange={handleChange}
                    sx={{
                      color: theme.text.light,
                      '&.Mui-checked': {
                        color: theme.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                    Subscribe to newsletter for farming tips & offers
                  </Typography>
                }
              />
            </Box>
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {/* ==================== LEFT SECTION ==================== */}
      <Box
        sx={{
          width: { xs: '100%', md: '42%' },
          minHeight: { xs: '25vh', md: '100vh' },
          background: theme.primary.gradient,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { xs: 3, md: 5 },
          overflow: 'hidden',
        }}
      >
        <DecorativeShapes />

        <Fade in timeout={1000}>
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              textAlign: { xs: 'center', md: 'left' },
              maxWidth: 400,
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 4,
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LogoIcon sx={{ color: '#fff', fontSize: 26 }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                }}
              >
                FarmRent
              </Typography>
            </Box>

            {/* Main Heading */}
            <Typography
              variant="h2"
              sx={{
                color: '#fff',
                fontWeight: 800,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                lineHeight: 1.2,
                mb: 2,
                letterSpacing: '-1px',
              }}
            >
              Start your{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #FDE68A 0%, #FCD34D 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                farming
              </Box>
              <br />
              journey today
            </Typography>

            {/* Subtext */}
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 400,
                fontSize: { xs: '0.9rem', md: '1rem' },
                lineHeight: 1.6,
                maxWidth: 350,
                mx: { xs: 'auto', md: 0 },
              }}
            >
              Create an account to join our community of farmers and equipment owners. Access premium farming equipment at affordable rates.
            </Typography>

            {/* Features */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                gap: 2,
                mt: 4,
              }}
            >
              {[
                { icon: '🚜', text: 'Access 500+ farming equipment' },
                { icon: '💰', text: 'Best rental prices guaranteed' },
                { icon: '🔒', text: '100% secure transactions' },
                { icon: '🌾', text: 'Join 10,000+ happy farmers' },
              ].map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Typography sx={{ fontSize: '1.25rem' }}>{feature.icon}</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.9rem',
                    }}
                  >
                    {feature.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Fade>
      </Box>

      {/* ==================== RIGHT SECTION ==================== */}
      <Box
        sx={{
          width: { xs: '100%', md: '58%' },
          minHeight: { xs: 'auto', md: '100vh' },
          background: theme.background.default,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 2, sm: 3, md: 4 },
          overflowY: 'auto',
        }}
      >
        <Grow in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: 480,
              p: { xs: 3, sm: 4 },
              borderRadius: '24px',
              background: '#fff',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.04)',
              my: { xs: 2, md: 0 },
            }}
          >
            {/* Card Header */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.text.primary,
                  mb: 0.5,
                  fontSize: { xs: '1.4rem', sm: '1.6rem' },
                }}
              >
                Create Account
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.text.secondary,
                  fontSize: '0.9rem',
                }}
              >
                Fill in the details to get started
              </Typography>
            </Box>

            {/* Stepper */}
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                mb: 3,
                '& .MuiStepLabel-label': {
                  fontSize: '0.75rem',
                  color: theme.text.secondary,
                  mt: 0.5,
                },
                '& .MuiStepLabel-label.Mui-active': {
                  color: theme.primary.main,
                  fontWeight: 600,
                },
                '& .MuiStepLabel-label.Mui-completed': {
                  color: theme.success,
                },
                '& .MuiStepIcon-root': {
                  color: '#E2E8F0',
                  width: 28,
                  height: 28,
                },
                '& .MuiStepIcon-root.Mui-active': {
                  color: theme.primary.main,
                },
                '& .MuiStepIcon-root.Mui-completed': {
                  color: theme.success,
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Alerts */}
            {error && (
              <Fade in>
                <Alert
                  severity="error"
                  sx={{ mb: 2, borderRadius: '12px' }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {message && (
              <Fade in>
                <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>
                  {message}
                </Alert>
              </Fade>
            )}

            {/* Step Content */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {renderStepContent(activeStep)}

              {/* Navigation Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 3,
                  gap: 2,
                }}
              >
                {activeStep > 0 && (
                  <Button
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      py: 1.5,
                      px: 3,
                      borderRadius: '12px',
                      color: theme.text.secondary,
                      border: '2px solid #E2E8F0',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: theme.primary.light,
                        background: '#F8FAFC',
                      },
                    }}
                  >
                    Back
                  </Button>
                )}

                {activeStep < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    endIcon={<ArrowForwardIcon />}
                    variant="contained"
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: '12px',
                      background: theme.primary.buttonGradient,
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: `0 8px 24px ${theme.primary.main}40`,
                      ml: 'auto',
                      '&:hover': {
                        boxShadow: `0 12px 32px ${theme.primary.main}50`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    endIcon={!loading && <CheckCircleIcon />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: '12px',
                      background: theme.primary.buttonGradient,
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: `0 8px 24px ${theme.primary.main}40`,
                      ml: 'auto',
                      '&:hover': {
                        boxShadow: `0 12px 32px ${theme.primary.main}50`,
                        transform: 'translateY(-2px)',
                      },
                      '&.Mui-disabled': {
                        background: theme.primary.buttonGradient,
                        opacity: 0.7,
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: '#fff' }} />
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                )}
              </Box>
            </Box>

            {/* Divider - Only show on first step */}
            {activeStep === 0 && (
              <>
                <Divider sx={{ my: 3, '&::before, &::after': { borderColor: '#E2E8F0' } }}>
                  <Typography variant="body2" sx={{ color: theme.text.light, px: 2, fontSize: '0.8rem' }}>
                    or sign up with
                  </Typography>
                </Divider>

                {/* Social Signup Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                  <SocialButton
                    icon={GoogleIcon}
                    label="Google"
                    onClick={() => handleSocialSignup('google')}
                    color="#EA4335"
                  />
                  <SocialButton
                    icon={FacebookIcon}
                    label="Facebook"
                    onClick={() => handleSocialSignup('facebook')}
                    color="#1877F2"
                  />
                  <SocialButton
                    icon={AppleIcon}
                    label="Apple"
                    onClick={() => handleSocialSignup('apple')}
                    color="#000000"
                  />
                </Box>
              </>
            )}

            {/* Login Link */}
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: theme.text.secondary,
                fontSize: '0.9rem',
                mt: activeStep === 0 ? 0 : 3,
              }}
            >
              Already have an account?{' '}
              <Link
                href="/login"
                underline="none"
                sx={{
                  color: theme.primary.main,
                  fontWeight: 600,
                  '&:hover': { color: theme.primary.dark },
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Paper>
        </Grow>
      </Box>
    </Box>
  );
};

export default RegisterForm;