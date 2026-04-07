// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import Routes
const equipmentRoutes = require('./EquipmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== CREATE UPLOAD DIRECTORIES ====================
const uploadDirs = ['uploads', 'uploads/equipment', 'uploads/profiles'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// ==================== MIDDLEWARE ====================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Serve Static Files (Uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request Logger (Development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
  });
}

// ==================== MONGODB CONNECTION ====================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://fegadetejas0012:fegadetejas007%40.com@rental-services.h4cap.mongodb.net/users?retryWrites=true&w=majority&appName=rental-services';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

// ==================== USER SCHEMA & MODEL ====================
const userSchema = new mongoose.Schema({
  // Basic Info
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
  },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },

  // Profile
  profileImage: { type: String, default: '' },
  userType: {
    type: String,
    enum: ['farmer', 'owner', 'both', 'admin'],
    default: 'farmer',
  },

  // Location
  location: {
    address: { type: String },
    village: { type: String },
    district: { type: String },
    state: { type: String },
    pincode: { type: String },
  },

  // Status
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },

  // Favorites
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
  }],

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

// ==================== BOOKING SCHEMA & MODEL ====================
const bookingSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true,
  },
  equipmentName: { type: String },
  equipmentId: { type: String },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userName: { type: String },
  userPhone: { type: String },
  userEmail: { type: String },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  totalDays: { type: Number },
  pricePerDay: { type: Number },
  totalAmount: { type: Number },
  securityDeposit: { type: Number },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected'],
    default: 'pending',
  },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending',
  },

  notes: { type: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model('Booking', bookingSchema);

// ==================== JWT HELPER ====================
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SECRET_KEY_CHANGE_IN_PRODUCTION';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      userType: user.userType,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// ==================== AUTH MIDDLEWARE ====================
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired. Please login again.'
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid token.'
    });
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      req.user = user;
    }
    next();
  } catch (error) {
    next();
  }
};

// ==================== API ROUTES ====================

// Health Check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚜 FarmRent API is running!',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
  });
});

// ==================== AUTH ROUTES ====================

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const {
      username,
      firstName,
      lastName,
      email,
      phone,
      password,
      userType,
      location,
    } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      username: username || `${firstName || ''} ${lastName || ''}`.trim() || email.split('@')[0],
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      userType: userType || 'farmer',
      location: location || {},
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    // Response (exclude password)
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: userResponse,
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration.',
      message: error.message,
    });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password.'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Response (exclude password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: userResponse,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login.'
    });
  }
});

// Get Current User
app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('favorites', 'name imageUrl rentalPrice location');

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error.'
    });
  }
});

// Update User Profile
app.put('/api/me', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;

    // Fields that cannot be updated directly
    delete updates.password;
    delete updates.email;
    delete updates._id;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update profile.'
    });
  }
});

// Change Password
app.post('/api/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current and new password are required.'
      });
    }

    const user = await User.findById(req.user._id);

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect.'
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to change password.'
    });
  }
});

// ==================== FAVORITES ROUTES ====================

// Add to favorites
app.post('/api/favorites/:equipmentId', authMiddleware, async (req, res) => {
  try {
    const { equipmentId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(equipmentId)) {
      user.favorites.push(equipmentId);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Added to favorites!',
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to add to favorites.'
    });
  }
});

// Remove from favorites
app.delete('/api/favorites/:equipmentId', authMiddleware, async (req, res) => {
  try {
    const { equipmentId } = req.params;

    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(id => id.toString() !== equipmentId);
    await user.save();

    res.json({
      success: true,
      message: 'Removed from favorites!',
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to remove from favorites.'
    });
  }
});

// Get favorites
app.get('/api/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites');

    res.json({
      success: true,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch favorites.'
    });
  }
});

// ==================== BOOKING ROUTES ====================

// Create Booking
app.post('/api/bookings', optionalAuth, async (req, res) => {
  try {
    const {
      equipmentId,
      equipmentName,
      startDate,
      endDate,
      userName,
      userPhone,
      userEmail,
      pricePerDay,
      securityDeposit,
      notes,
    } = req.body;

    // Calculate days and total
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const totalAmount = totalDays * (pricePerDay || 0);

    const booking = new Booking({
      equipment: equipmentId,
      equipmentId,
      equipmentName,
      user: req.user?._id,
      userName,
      userPhone,
      userEmail,
      startDate: start,
      endDate: end,
      totalDays,
      pricePerDay,
      totalAmount,
      securityDeposit,
      notes,
      status: 'pending',
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully!',
      booking,
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking.',
      message: error.message,
    });
  }
});

// Get All Bookings (for dashboard)
app.get('/api/bookings', optionalAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (req.user) {
      query.$or = [
        { user: req.user._id },
        { owner: req.user._id },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('equipment', 'name imageUrl rentalPrice')
        .populate('user', 'username email phone'),
      Booking.countDocuments(query),
    ]);

    res.json({
      success: true,
      bookings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings.',
    });
  }
});

// Get Single Booking
app.get('/api/bookings/:id', optionalAuth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('equipment')
      .populate('user', 'username email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found.',
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking.',
    });
  }
});

// Update Booking Status
app.patch('/api/bookings/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found.',
      });
    }

    res.json({
      success: true,
      message: `Booking ${status}!`,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update booking.',
    });
  }
});

// Cancel Booking
app.delete('/api/bookings/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found.',
      });
    }

    booking.status = 'cancelled';
    booking.updatedAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to cancel booking.',
    });
  }
});

// ==================== DASHBOARD STATS ====================

app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const Equipment = require('./Equipment');

    const userId = req.user._id;

    // Get stats
    const [
      totalEquipment,
      activeEquipment,
      totalBookings,
      pendingBookings,
      activeBookings,
      completedBookings,
    ] = await Promise.all([
      Equipment.countDocuments({ owner: userId, status: { $ne: 'deleted' } }),
      Equipment.countDocuments({ owner: userId, available: true, status: 'active' }),
      Booking.countDocuments({ $or: [{ user: userId }, { owner: userId }] }),
      Booking.countDocuments({ $or: [{ user: userId }, { owner: userId }], status: 'pending' }),
      Booking.countDocuments({ $or: [{ user: userId }, { owner: userId }], status: 'active' }),
      Booking.countDocuments({ $or: [{ user: userId }, { owner: userId }], status: 'completed' }),
    ]);

    // Calculate earnings
    const earnings = await Booking.aggregate([
      {
        $match: {
          owner: userId,
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        totalEquipment,
        activeEquipment,
        availableEquipment: activeEquipment,
        totalBookings,
        pendingBookings,
        activeBookings,
        completedBookings,
        totalEarnings: earnings[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats.',
    });
  }
});

// ==================== EQUIPMENT ROUTES (Use Separate File) ====================
app.use('/api/equipment', equipmentRoutes);

// ==================== ERROR HANDLING ====================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File too large. Maximum size is 5MB.',
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'Too many files uploaded.',
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate entry. This record already exists.',
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// ==================== START SERVER ====================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚜 FarmRent API Server                          ║
║                                                   ║
║   ✅ Server running on port ${PORT}                 ║
║   📁 Static files: /uploads                       ║
║   🔗 API Base: http://localhost:${PORT}/api         ║
║                                                   ║
║   Available Routes:                               ║
║   • GET  /api/health                              ║
║   • POST /api/register                            ║
║   • POST /api/login                               ║
║   • GET  /api/me                                  ║
║   • GET  /api/equipment                           ║
║   • POST /api/equipment                           ║
║   • GET  /api/equipment/:id                       ║
║   • GET  /api/bookings                            ║
║   • POST /api/bookings                            ║
║   • GET  /api/dashboard/stats                     ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

// ==================== GRACEFUL SHUTDOWN ====================
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

module.exports = app;