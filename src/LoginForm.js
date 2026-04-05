// LoginForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
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
    card: '#FFFFFF',
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
    
    {/* Small circles */}
    {[...Array(6)].map((_, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          top: `${20 + i * 15}%`,
          left: `${10 + i * 12}%`,
          width: 12 + i * 4,
          height: 12 + i * 4,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          animation: `pulse ${2 + i * 0.5}s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
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
        bottom: '20%',
        right: '10%',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px',
      }}
    >
      {[...Array(25)].map((_, i) => (
        <Box
          key={i}
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
          }}
        />
      ))}
    </Box>
    
    {/* Curved lines */}
    <svg
      style={{
        position: 'absolute',
        bottom: '30%',
        left: '5%',
        width: '150px',
        height: '100px',
        opacity: 0.3,
      }}
    >
      <path
        d="M 10 80 Q 75 10, 140 80"
        stroke="white"
        strokeWidth="3"
        fill="transparent"
        strokeLinecap="round"
      />
      <path
        d="M 20 90 Q 75 30, 130 90"
        stroke="white"
        strokeWidth="2"
        fill="transparent"
        strokeLinecap="round"
      />
    </svg>
    
    {/* Floating rings */}
    <Box
      sx={{
        position: 'absolute',
        top: '40%',
        right: '15%',
        width: 60,
        height: 60,
        borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.2)',
        animation: 'rotate 10s linear infinite',
        '@keyframes rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    />
    
    {/* Triangle shape */}
    <Box
      sx={{
        position: 'absolute',
        top: '60%',
        left: '20%',
        width: 0,
        height: 0,
        borderLeft: '20px solid transparent',
        borderRight: '20px solid transparent',
        borderBottom: '35px solid rgba(255,255,255,0.15)',
        animation: 'float 5s ease-in-out infinite',
      }}
    />
  </Box>
);

// ==================== SOCIAL BUTTON COMPONENT ====================
const SocialButton = ({ icon: Icon, label, onClick, color }) => (
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
);

// ==================== CUSTOM TEXT FIELD ====================
const StyledTextField = ({ icon: Icon, ...props }) => (
  <TextField
    {...props}
    fullWidth
    variant="outlined"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Icon sx={{ color: theme.text.light, fontSize: 20 }} />
        </InputAdornment>
      ),
      ...props.InputProps,
    }}
    sx={{
      mb: 2.5,
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
        padding: '16px 14px',
      },
      ...props.sx,
    }}
  />
);

// ==================== MAIN LOGIN COMPONENT ====================
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulate API delay for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await axios.post('http://localhost:5000/api/login', {
        email: formData.email,
        password: formData.password,
      });
      
      setMessage(response.data.message || 'Login successful! Redirecting...');
      localStorage.setItem('token', response.data.token);
      
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      }
      
      // Redirect after success
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implement social login logic
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
          width: { xs: '100%', md: '45%' },
          minHeight: { xs: '30vh', md: '100vh' },
          background: theme.primary.gradient,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { xs: 4, md: 6 },
          overflow: 'hidden',
        }}
      >
        <DecorativeShapes />
        
        {/* Content */}
        <Fade in timeout={1000}>
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              textAlign: { xs: 'center', md: 'left' },
              maxWidth: 450,
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
                  width: 50,
                  height: 50,
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LogoIcon sx={{ color: '#fff', fontSize: 28 }} />
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
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.2,
                mb: 2,
                letterSpacing: '-1px',
              }}
            >
              Adventure{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #FDE68A 0%, #FCD34D 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                starts
              </Box>
              <br />
              here
            </Typography>
            
            {/* Subtext */}
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.6,
                maxWidth: 380,
                mx: { xs: 'auto', md: 0 },
              }}
            >
              Join our farming community and access the best equipment rentals for your agricultural needs.
            </Typography>
            
            {/* Stats */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 4,
                mt: 5,
              }}
            >
              {[
                { value: '10K+', label: 'Active Farmers' },
                { value: '500+', label: 'Equipment' },
                { value: '98%', label: 'Satisfaction' },
              ].map((stat, index) => (
                <Box key={index}>
                  <Typography
                    variant="h4"
                    sx={{
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1.75rem',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.85rem',
                    }}
                  >
                    {stat.label}
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
          width: { xs: '100%', md: '55%' },
          minHeight: { xs: 'auto', md: '100vh' },
          background: theme.background.default,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 3, sm: 4, md: 6 },
        }}
      >
        <Grow in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: 440,
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: '24px',
              background: '#fff',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.04)',
            }}
          >
            {/* Card Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              {/* Logo Icon */}
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '16px',
                  background: theme.primary.buttonGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2.5,
                  boxShadow: `0 8px 24px ${theme.primary.main}40`,
                }}
              >
                <LogoIcon sx={{ color: '#fff', fontSize: 32 }} />
              </Box>
              
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.text.primary,
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                }}
              >
                Hello! Welcome back
              </Typography>
              
              <Typography
                variant="body2"
                sx={{
                  color: theme.text.secondary,
                  fontSize: '0.95rem',
                }}
              >
                Sign in to continue to your account
              </Typography>
            </Box>

            {/* Alerts */}
            {error && (
              <Fade in>
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: '12px',
                    '& .MuiAlert-icon': {
                      alignItems: 'center',
                    },
                  }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              </Fade>
            )}
            
            {message && (
              <Fade in>
                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    borderRadius: '12px',
                    '& .MuiAlert-icon': {
                      alignItems: 'center',
                    },
                  }}
                >
                  {message}
                </Alert>
              </Fade>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Email Field */}
              <StyledTextField
                icon={EmailIcon}
                name="email"
                label="Email Address"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                autoComplete="email"
                autoFocus
              />

              {/* Password Field */}
              <StyledTextField
                icon={LockIcon}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                autoComplete="current-password"
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
                        sx={{
                          color: theme.text.light,
                          '&:hover': {
                            color: theme.primary.main,
                          },
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Remember Me & Forgot Password */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={formData.rememberMe}
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
                    <Typography
                      variant="body2"
                      sx={{ color: theme.text.secondary, fontSize: '0.9rem' }}
                    >
                      Remember me
                    </Typography>
                  }
                />
                
                <Link
                  href="/reset-password"
                  underline="none"
                  sx={{
                    color: theme.primary.main,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: theme.primary.dark,
                    },
                  }}
                >
                  Reset Password?
                </Link>
              </Box>

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.75,
                  borderRadius: '12px',
                  background: theme.primary.buttonGradient,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: `0 8px 24px ${theme.primary.main}40`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: theme.primary.buttonGradient,
                    boxShadow: `0 12px 32px ${theme.primary.main}50`,
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
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
                  'Login'
                )}
              </Button>

              {/* Divider */}
              <Divider
                sx={{
                  my: 3,
                  '&::before, &::after': {
                    borderColor: '#E2E8F0',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.text.light,
                    px: 2,
                    fontSize: '0.85rem',
                  }}
                >
                  or continue with
                </Typography>
              </Divider>

              {/* Social Login Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  mb: 3,
                }}
              >
                <SocialButton
                  icon={GoogleIcon}
                  label="Google"
                  onClick={() => handleSocialLogin('google')}
                  color="#EA4335"
                />
                <SocialButton
                  icon={FacebookIcon}
                  label="Facebook"
                  onClick={() => handleSocialLogin('facebook')}
                  color="#1877F2"
                />
                <SocialButton
                  icon={AppleIcon}
                  label="Apple"
                  onClick={() => handleSocialLogin('apple')}
                  color="#000000"
                />
              </Box>

              {/* Sign Up Link */}
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: theme.text.secondary,
                  fontSize: '0.95rem',
                }}
              >
                Don't have an account?{' '}
                <Link
                  href="/register"
                  underline="none"
                  sx={{
                    color: theme.primary.main,
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: theme.primary.dark,
                    },
                  }}
                >
                  Create Account
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Grow>
      </Box>
    </Box>
  );
};

export default LoginForm;