const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const Equipment = require('./Equipment');
const Booking = require('./Booking');
const equipmentRoutes = require('./EquipmentRoutes'); // Import equipment routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
const MONGODB_URI = 'mongodb+srv://fegadetejas0012:fegadetejas007%40.com@rental-services.h4cap.mongodb.net/users?retryWrites=true&w=majority&appName=rental-services';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// 🟢 API Routes

// ✅ Equipment Search (for Suggestions)
app.get('/api/equipment/search', async (req, res) => {
  try {
    const query = req.query.query || '';
    if (!query) return res.json([]);

    const equipment = await Equipment.find({
      name: { $regex: query, $options: 'i' }
    }).select('name _id');

    res.json(equipment);
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Add Equipment (with Image Upload)
app.post('/api/equipment', upload.single('image'), async (req, res) => {
  const { name, description, rentalPrice } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const newEquipment = new Equipment({
      name,
      description,
      imageUrl,
      rentalPrice,
      available: true,
    });

    await newEquipment.save();
    res.status(201).json({ message: 'Equipment added successfully!', equipment: newEquipment });
  } catch (error) {
    console.error('Error adding equipment:', error);
    res.status(500).json({ error: 'Server error while adding equipment.' });
  }
});

// ✅ Fetch All Equipment with optional filtering
app.get('/api/equipment', async (req, res) => {
  try {
    const { query } = req.query; // Read query parameter if provided
    let equipmentList;
    if (query) {
      // Filter equipment by name (case-insensitive search)
      equipmentList = await Equipment.find({ name: { $regex: query, $options: 'i' } });
    } else {
      equipmentList = await Equipment.find();
    }
    res.status(200).json({ equipment: equipmentList });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Server error while fetching equipment.' });
  }
});

// ✅ Create Booking
app.post('/api/bookings', async (req, res) => {
  const { equipmentId, userId, startDate, endDate } = req.body;
  if (!equipmentId || !userId || !startDate || !endDate) {
    return res.status(400).json({ error: 'Please provide all required booking details.' });
  }

  try {
    const newBooking = new Booking({
      equipmentId,
      userId,
      startDate,
      endDate,
      status: 'pending',
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully!', booking: newBooking });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Server error during booking creation.' });
  }
});

// ✅ Fetch All Bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId', 'username email');
    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Server error fetching bookings.' });
  }
});

// ✅ User Registration
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please provide username, email, and password.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// ✅ User Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'YOUR_SECRET_KEY',
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Login successful!', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// ✅ Equipment Routes (additional routes, if any)
app.use('/api/equipment', equipmentRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
