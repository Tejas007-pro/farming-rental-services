// backend/Equipment.js
const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  // ==================== BASIC INFO ====================
  name: {
    type: String,
    required: [true, 'Equipment name is required'],
    trim: true,
    maxlength: 100,
  },

  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'tractors',
      'harvesters',
      'tillers',
      'plows',
      'seeders',
      'sprayers',
      'irrigation',
      'threshers',
      'balers',
      'loaders',
      'trailers',
      'other',
    ],
  },

  condition: {
    type: String,
    enum: ['new', 'excellent', 'good', 'fair', 'needs_repair'],
    default: 'good',
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 2000,
  },

  // ==================== SPECIFICATIONS ====================
  specifications: {
    brand: { type: String, trim: true },
    model: { type: String, trim: true },
    year: { type: Number },
    horsePower: { type: Number },
    fuelType: {
      type: String,
      enum: ['diesel', 'petrol', 'electric', 'manual', 'solar'],
    },
    weight: { type: Number },
    dimensions: { type: String },
    features: [{ type: String }],
  },

  // ==================== IMAGES ====================
  // Single image (backward compatible)
  imageUrl: {
    type: String,
    default: '/placeholder-equipment.jpg',
  },

  // Multiple images (new)
  images: [{
    url: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
  }],

  // ==================== PRICING ====================
  // Backward compatible (keep rentalPrice as main)
  rentalPrice: {
    type: Number,
    required: [true, 'Rental price is required'],
  },

  // Extended pricing options
  pricing: {
    perHour: { type: Number },
    perDay: { type: Number },
    perWeek: { type: Number },
    perMonth: { type: Number },
    securityDeposit: { type: Number, default: 0 },
    negotiable: { type: Boolean, default: false },
  },

  // ==================== LOCATION ====================
  // Simple location (backward compatible)
  location: {
    type: String,
    required: [true, 'Location is required'],
  },

  // Detailed location (new)
  locationDetails: {
    address: { type: String },
    village: { type: String },
    district: { type: String },
    state: { type: String },
    pincode: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },

  // ==================== CONTACT ====================
  contact: {
    phone: { type: String },
    alternatePhone: { type: String },
    whatsappAvailable: { type: Boolean, default: false },
  },

  // ==================== AVAILABILITY ====================
  available: {
    type: Boolean,
    default: true,
  },

  quantity: {
    type: Number,
    default: 1,
    min: 0,
  },

  // ==================== DELIVERY ====================
  delivery: {
    available: { type: Boolean, default: false },
    radius: { type: Number, default: 0 },
    charges: { type: Number, default: 0 },
  },

  // ==================== OWNER ====================
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  ownerName: { type: String },
  ownerPhone: { type: String },

  // ==================== RATINGS & STATS ====================
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },

  stats: {
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    timesRented: { type: Number, default: 0 },
  },

  // ==================== STATUS ====================
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'rented', 'maintenance', 'deleted'],
    default: 'active',
  },

  isVerified: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },

  // ==================== TIMESTAMPS ====================
  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// ==================== INDEXES ====================
equipmentSchema.index({ name: 'text', description: 'text', 'specifications.brand': 'text' });
equipmentSchema.index({ category: 1, status: 1 });
equipmentSchema.index({ rentalPrice: 1 });
equipmentSchema.index({ location: 1 });
equipmentSchema.index({ createdAt: -1 });
equipmentSchema.index({ available: 1 });

// ==================== VIRTUALS ====================
equipmentSchema.virtual('primaryImage').get(function () {
  if (this.images && this.images.length > 0) {
    const primary = this.images.find(img => img.isPrimary);
    return primary ? primary.url : this.images[0].url;
  }
  return this.imageUrl || '/placeholder-equipment.jpg';
});

// ==================== PRE-SAVE ====================
equipmentSchema.pre('save', function (next) {
  this.updatedAt = new Date();

  // Sync rentalPrice with pricing.perDay
  if (this.pricing && this.pricing.perDay) {
    this.rentalPrice = this.pricing.perDay;
  }

  // Set primary image
  if (this.images && this.images.length > 0 && !this.images.some(img => img.isPrimary)) {
    this.images[0].isPrimary = true;
  }

  next();
});

// ==================== METHODS ====================
equipmentSchema.methods.incrementViews = async function () {
  this.stats.views += 1;
  return this.save();
};

// ==================== STATICS ====================
equipmentSchema.statics.getFeatured = function (limit = 6) {
  return this.find({
    status: 'active',
    isFeatured: true,
    available: true,
  })
    .sort({ 'ratings.average': -1 })
    .limit(limit);
};

module.exports = mongoose.model('Equipment', equipmentSchema);