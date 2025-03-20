// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Booking = require('./Booking');
const Equipment = require('./Equipment');
const multer = require('multer');
const equipmentRoutes = require('./EquipmentRoutes'); // Import your route file


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use('/api/equipment', equipmentRoutes);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// POST endpoint to add equipment with image upload
app.post('/api/equipment', upload.single('image'), async (req, res) => {
  const { name, description, rentalPrice } = req.body;
  // req.file contains the uploaded file information
  // Save file path (or URL if using cloud storage) in the database
  const imageUrl = req.file ? req.file.path : '';
  
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

// Connect to MongoDB
const MONGODB_URI = 'mongodb+srv://fegadetejas0012:fegadetejas007%40.com@rental-services.h4cap.mongodb.net/users?retryWrites=true&w=majority&appName=rental-services'; // If you use MongoDB Atlas, replace with your connection string
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define a Mongoose User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Endpoint to create a booking
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
      status: 'pending', // default status
    });
    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully!', booking: newBooking });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Server error during booking creation.' });
  }
});

// Endpoint to get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId', 'username email');
    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Server error fetching bookings.' });
  }
});

// Endpoint to add new equipment
app.post('/api/equipment', async (req, res) => {
  const { name, description, imageUrl, rentalPrice } = req.body;
  if (!name || !description || !rentalPrice) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }
  try {
    const newEquipment = new Equipment({ name, description, imageUrl, rentalPrice });
    await newEquipment.save();
    res.status(201).json({ message: 'Equipment added successfully!', equipment: newEquipment });
  } catch (error) {
    console.error('Error adding equipment:', error);
    res.status(500).json({ error: 'Server error while adding equipment.' });
  }
});

// Endpoint to fetch equipment
app.get('/api/equipment', async (req, res) => {
  try {
    const equipmentList = await Equipment.find();
    res.status(200).json({ equipment: equipmentList });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Server error while fetching equipment.' });
  }
});


// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please provide username, email, and password.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// Login endpoint
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

    // Create JWT token (in production, store your secret securely)
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
