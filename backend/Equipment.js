// backend/Equipment.js
const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: 'https://via.placeholder.com/150' },
  rentalPrice: { type: Number, required: true }, // Changed to Number for calculations
  available: { type: Boolean, default: true },
  category: { type: String, required: true }, // Added category field
  location: { type: String, required: true }, // Added location field
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Equipment', equipmentSchema);
