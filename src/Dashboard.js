// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Skeleton,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Agriculture as TractorIcon,
  Inventory as InventoryIcon,
  EventAvailable as CalendarIcon,
  CurrencyRupee as RupeeIcon,
  PendingActions as PendingIcon,
  CheckCircle as CompletedIcon,
  Build as MaintenanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccessTime as TimeIcon,
  Speed as SpeedIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  LocalShipping as DeliveryIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart,
  Line,
  ComposedChart,
  Area,
} from 'recharts';

// ==================== THEME COLORS ====================
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
    dark: '#6D4C41',
  },
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#00BCD4',
  background: {
    default: '#F5F5F0',
    paper: '#FFFFFF',
    card: '#FAFAF5',
  },
  text: {
    primary: '#2D3436',
    secondary: '#636E72',
    light: '#B2BEC3',
  },
  earthy: {
    olive: '#808000',
    brown: '#8B4513',
    sand: '#F4A460',
    beige: '#F5F5DC',
  },
};

// ==================== REUSABLE COMPONENTS ====================

// Stat Card Component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = theme.primary.main,
  gradient,
  subtitle 
}) => {
  const isPositive = trend === 'up';
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '16px',
        background: gradient || theme.background.paper,
        border: '1px solid rgba(0,0,0,0.05)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(46, 125, 50, 0.15)',
        },
        '&::before': gradient ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '16px',
        } : {},
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ zIndex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: gradient ? 'rgba(255,255,255,0.85)' : theme.text.secondary,
              fontWeight: 500,
              mb: 0.5,
              fontSize: '0.85rem',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: gradient ? '#fff' : theme.text.primary,
              mb: 1,
              fontSize: { xs: '1.75rem', md: '2rem' },
            }}
          >
            {value}
          </Typography>
          {(trend || subtitle) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend && (
                <>
                  {isPositive ? (
                    <TrendingUpIcon sx={{ fontSize: 16, color: gradient ? '#A5D6A7' : theme.success }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 16, color: gradient ? '#FFCDD2' : theme.error }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: gradient 
                        ? (isPositive ? '#A5D6A7' : '#FFCDD2')
                        : (isPositive ? theme.success : theme.error),
                      fontWeight: 600,
                    }}
                  >
                    {trendValue}
                  </Typography>
                </>
              )}
              {subtitle && (
                <Typography
                  variant="caption"
                  sx={{ color: gradient ? 'rgba(255,255,255,0.7)' : theme.text.secondary }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}
        </Box>
        <Avatar
          sx={{
            bgcolor: gradient ? 'rgba(255,255,255,0.2)' : `${color}15`,
            width: 52,
            height: 52,
            zIndex: 1,
          }}
        >
          <Icon sx={{ color: gradient ? '#fff' : color, fontSize: 28 }} />
        </Avatar>
      </Box>
    </Paper>
  );
};

// Circular Progress Card Component
const CircularProgressCard = ({ title, value, color, icon: Icon, size = 120 }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        background: theme.background.paper,
        border: '1px solid rgba(0,0,0,0.05)',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
        },
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#E8F5E9"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={`url(#gradient-${title.replace(/\s/g, '')})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
          <defs>
            <linearGradient id={`gradient-${title.replace(/\s/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.primary.main} />
              <stop offset="100%" stopColor="#00897B" />
            </linearGradient>
          </defs>
        </svg>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text.primary }}>
            {value}%
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" sx={{ color: theme.text.secondary, fontWeight: 500 }}>
        {title}
      </Typography>
    </Paper>
  );
};

// Chart Card Wrapper Component
const ChartCard = ({ title, subtitle, children, action }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: '16px',
      background: theme.background.paper,
      border: '1px solid rgba(0,0,0,0.05)',
      height: '100%',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text.primary }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: theme.text.secondary }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
    {children}
  </Paper>
);

// Metric Card (Smaller operational insights)
const MetricCard = ({ title, value, icon: Icon, description, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: '12px',
      background: theme.background.paper,
      border: '1px solid rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar sx={{ bgcolor: `${color}15`, width: 44, height: 44 }}>
        <Icon sx={{ color, fontSize: 22 }} />
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ color: theme.text.secondary, fontSize: '0.8rem' }}>
          {title}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text.primary }}>
          {value}
        </Typography>
        {description && (
          <Typography variant="caption" sx={{ color: theme.text.light }}>
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  </Paper>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return { color: '#4CAF50', bg: '#E8F5E9', label: 'Active' };
      case 'completed':
        return { color: '#2196F3', bg: '#E3F2FD', label: 'Completed' };
      case 'pending':
        return { color: '#FF9800', bg: '#FFF3E0', label: 'Pending' };
      case 'cancelled':
        return { color: '#F44336', bg: '#FFEBEE', label: 'Cancelled' };
      case 'maintenance':
        return { color: '#9C27B0', bg: '#F3E5F5', label: 'Maintenance' };
      default:
        return { color: '#9E9E9E', bg: '#F5F5F5', label: status };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        bgcolor: config.bg,
        color: config.color,
        fontWeight: 600,
        fontSize: '0.75rem',
        height: 26,
        borderRadius: '8px',
      }}
    />
  );
};

// ==================== MOCK DATA ====================
const mockAnalyticsData = [
  { month: 'Jan', rentals: 45, earnings: 125000 },
  { month: 'Feb', rentals: 52, earnings: 148000 },
  { month: 'Mar', rentals: 61, earnings: 175000 },
  { month: 'Apr', rentals: 78, earnings: 220000 },
  { month: 'May', rentals: 95, earnings: 285000 },
  { month: 'Jun', rentals: 88, earnings: 265000 },
  { month: 'Jul', rentals: 102, earnings: 310000 },
  { month: 'Aug', rentals: 115, earnings: 355000 },
  { month: 'Sep', rentals: 98, earnings: 298000 },
  { month: 'Oct', rentals: 85, earnings: 255000 },
  { month: 'Nov', rentals: 72, earnings: 218000 },
  { month: 'Dec', rentals: 68, earnings: 205000 },
];

const mockRecentRentals = [
  {
    id: 1,
    equipment: 'John Deere Tractor 5050D',
    renter: 'Rajesh Kumar',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    status: 'Active',
    amount: 15000,
    image: '🚜',
  },
  {
    id: 2,
    equipment: 'Mahindra Rotavator',
    renter: 'Suresh Patel',
    startDate: '2024-01-10',
    endDate: '2024-01-14',
    status: 'Completed',
    amount: 8000,
    image: '⚙️',
  },
  {
    id: 3,
    equipment: 'Power Tiller Honda',
    renter: 'Amit Singh',
    startDate: '2024-01-18',
    endDate: '2024-01-25',
    status: 'Pending',
    amount: 12000,
    image: '🔧',
  },
  {
    id: 4,
    equipment: 'Seed Drill Machine',
    renter: 'Vikram Yadav',
    startDate: '2024-01-12',
    endDate: '2024-01-16',
    status: 'Completed',
    amount: 6500,
    image: '🌾',
  },
  {
    id: 5,
    equipment: 'Spray Pump Electric',
    renter: 'Mohan Das',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    status: 'Active',
    amount: 3000,
    image: '💨',
  },
];

const equipmentUtilization = [
  { name: 'In Use', value: 68, color: '#4CAF50' },
  { name: 'Available', value: 22, color: '#81C784' },
  { name: 'Maintenance', value: 10, color: '#FF9800' },
];

// ==================== MAIN DASHBOARD COMPONENT ====================
const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalEquipment: 156,
    activeRentals: 42,
    availableEquipment: 98,
    totalEarnings: 2845000,
    pendingRequests: 12,
    completedRentals: 328,
    maintenanceDue: 8,
    newListings: 15,
  });

  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Uncomment below for real API
        // const response = await axios.get('http://localhost:5000/api/bookings');
        // setBookings(response.data.bookings);
        
        setBookings(mockRecentRentals);
      } catch (err) {
        console.error(err);
        setError('Could not fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const formatCurrency = (value) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          sx={{
            p: 2,
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            border: 'none',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: entry.color,
                }}
              />
              <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                {entry.name}: {entry.name === 'Earnings' ? formatCurrency(entry.value) : entry.value}
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: theme.background.default, minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          <Skeleton variant="text" width={300} height={50} sx={{ mb: 2 }} />
          <Skeleton variant="text" width={200} height={30} sx={{ mb: 4 }} />
          <Grid container spacing={3}>
            {[...Array(8)].map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rounded" height={140} sx={{ borderRadius: '16px' }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: theme.background.default, minHeight: '100vh', pb: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          background: theme.primary.gradient,
          pt: 4,
          pb: 8,
          px: 2,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            background: theme.background.default,
            borderRadius: '40px 40px 0 0',
          },
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#fff',
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                🌾 Farm Equipment Dashboard
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: 'rgba(255,255,255,0.85)', fontSize: { xs: '0.9rem', md: '1rem' } }}
              >
                Manage rentals, equipment, and earnings in one place
              </Typography>
            </Box>
            <Tooltip title="Refresh Data">
              <IconButton
                onClick={handleRefresh}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -6, position: 'relative', zIndex: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        {/* Summary Stats Cards */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Equipment"
              value={stats.totalEquipment}
              icon={TractorIcon}
              trend="up"
              trendValue="+12 this month"
              gradient={theme.primary.gradient}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Rentals"
              value={stats.activeRentals}
              icon={DeliveryIcon}
              trend="up"
              trendValue="+8.5%"
              color={theme.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Available Equipment"
              value={stats.availableEquipment}
              icon={InventoryIcon}
              subtitle="Ready to rent"
              color={theme.success}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Earnings"
              value={formatCurrency(stats.totalEarnings)}
              icon={RupeeIcon}
              trend="up"
              trendValue="+15.2%"
              color={theme.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Requests"
              value={stats.pendingRequests}
              icon={PendingIcon}
              subtitle="Awaiting approval"
              color={theme.warning}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Completed Rentals"
              value={stats.completedRentals}
              icon={CompletedIcon}
              trend="up"
              trendValue="+23 this week"
              color={theme.success}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Maintenance Due"
              value={stats.maintenanceDue}
              icon={MaintenanceIcon}
              subtitle="Needs attention"
              color={theme.error}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="New Listings"
              value={stats.newListings}
              icon={CalendarIcon}
              trend="up"
              trendValue="+5 today"
              color={theme.info}
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Equipment Utilization Donut Chart */}
          <Grid item xs={12} md={4}>
            <ChartCard title="Equipment Utilization" subtitle="Current distribution">
              <Box sx={{ height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={equipmentUtilization}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {equipmentUtilization.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {equipmentUtilization.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: item.color,
                        }}
                      />
                      <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                        {item.name} ({item.value}%)
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              {/* Center text overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -30%)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.primary.main }}>
                  68%
                </Typography>
                <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                  Utilization
                </Typography>
              </Box>
            </ChartCard>
          </Grid>

          {/* Rental Analytics Combined Chart */}
          <Grid item xs={12} md={8}>
            <ChartCard
              title="Rental Analytics"
              subtitle="Monthly rentals and earnings overview"
              action={
                <Chip
                  label="2024"
                  size="small"
                  sx={{
                    bgcolor: '#E8F5E9',
                    color: theme.primary.main,
                    fontWeight: 600,
                  }}
                />
              }
            >
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={mockAnalyticsData}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.primary.main} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={theme.primary.main} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: theme.text.secondary, fontSize: 12 }}
                    />
                    <YAxis
                      yAxisId="left"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: theme.text.secondary, fontSize: 12 }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: theme.text.secondary, fontSize: 12 }}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="rentals"
                      name="Rentals"
                      fill={theme.primary.light}
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="earnings"
                      name="Earnings"
                      stroke={theme.primary.dark}
                      strokeWidth={2}
                      fill="url(#colorEarnings)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="earnings"
                      name="Earnings"
                      stroke={theme.primary.dark}
                      strokeWidth={2}
                      dot={{ fill: theme.primary.dark, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: theme.primary.main }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Side Metrics & Progress Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Operational Metrics */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text.primary, mb: 2 }}>
              Operational Insights
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <MetricCard
                  title="Most Rented Equipment"
                  value="John Deere Tractor"
                  icon={TractorIcon}
                  description="45 rentals this month"
                  color={theme.primary.main}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MetricCard
                  title="Avg. Rental Duration"
                  value="4.5 Days"
                  icon={TimeIcon}
                  description="Up from 3.8 days"
                  color={theme.info}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MetricCard
                  title="Revenue per Equipment"
                  value="₹18,240"
                  icon={RupeeIcon}
                  description="Monthly average"
                  color={theme.success}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MetricCard
                  title="Equipment Idle Time"
                  value="2.3 Days"
                  icon={SpeedIcon}
                  description="Avg. between rentals"
                  color={theme.warning}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Circular Progress Charts */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text.primary, mb: 2 }}>
              Equipment Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <CircularProgressCard
                  title="Equipment Availability"
                  value={78}
                  color={theme.success}
                  icon={InventoryIcon}
                />
              </Grid>
              <Grid item xs={6}>
                <CircularProgressCard
                  title="Maintenance Completion"
                  value={92}
                  color={theme.primary.main}
                  icon={MaintenanceIcon}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Activity Table */}
        <ChartCard
          title="Recent Rentals"
          subtitle="Latest equipment rental activities"
          action={
            <Chip
              label="View All"
              size="small"
              clickable
              sx={{
                bgcolor: '#E8F5E9',
                color: theme.primary.main,
                fontWeight: 600,
                '&:hover': { bgcolor: '#C8E6C9' },
              }}
            />
          }
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: theme.text.primary,
                      borderBottom: `2px solid ${theme.primary.light}`,
                      bgcolor: '#F8FFF8',
                    }}
                  >
                    Equipment
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: theme.text.primary,
                      borderBottom: `2px solid ${theme.primary.light}`,
                      bgcolor: '#F8FFF8',
                    }}
                  >
                    Renter
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: theme.text.primary,
                      borderBottom: `2px solid ${theme.primary.light}`,
                      bgcolor: '#F8FFF8',
                    }}
                  >
                    Rental Period
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: theme.text.primary,
                      borderBottom: `2px solid ${theme.primary.light}`,
                      bgcolor: '#F8FFF8',
                    }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: theme.text.primary,
                      borderBottom: `2px solid ${theme.primary.light}`,
                      bgcolor: '#F8FFF8',
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: theme.text.primary,
                      borderBottom: `2px solid ${theme.primary.light}`,
                      bgcolor: '#F8FFF8',
                      textAlign: 'center',
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(bookings.length > 0 ? bookings : mockRecentRentals).map((rental, index) => (
                  <TableRow
                    key={rental.id || index}
                    sx={{
                      '&:hover': {
                        bgcolor: '#F8FFF8',
                      },
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: '#E8F5E9',
                            width: 40,
                            height: 40,
                            fontSize: '1.2rem',
                          }}
                        >
                          {rental.image || '🚜'}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {rental.equipment || rental.equipmentName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: theme.secondary.light }}>
                          <PersonIcon sx={{ fontSize: 16 }} />
                        </Avatar>
                        <Typography variant="body2">{rental.renter}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                        {new Date(rental.startDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        -{' '}
                        {new Date(rental.endDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.primary.main }}>
                        ₹{rental.amount?.toLocaleString('en-IN')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={rental.status} />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" sx={{ color: theme.primary.main }}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More Options">
                        <IconButton size="small" sx={{ color: theme.text.secondary }}>
                          <MoreIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ChartCard>
      </Container>
    </Box>
  );
};

export default Dashboard;