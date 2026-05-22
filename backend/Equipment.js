// backend/Equipment.js
const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({

  // ==================== BASIC INFO ====================
  name: {
    type: String,
    required: [true, 'Equipment name is required'], // ✅ keep required (old data has it)
    trim: true,
    maxlength: 100,
  },

  category: {
    type: String,
    required: false,       // ✅ CHANGED - old data has no category
    default: 'other',      // ✅ ADDED - default for old data
    enum: [
      'tractors', 'harvesters', 'tillers',
      'plows', 'seeders', 'sprayers',
      'irrigation', 'threshers', 'balers',
      'loaders', 'trailers', 'other',
    ],
  },

  condition: {
    type: String,
    enum: ['new', 'excellent', 'good', 'fair', 'needs_repair'],
    default: 'good',       // ✅ already has default - OK
  },

  description: {
    type: String,
    required: false,       // ✅ CHANGED - safer for old data
    default: '',
    maxlength: 2000,
  },

  // ==================== SPECIFICATIONS ====================
  specifications: {
    brand: { type: String, trim: true, default: '' },
    model: { type: String, trim: true, default: '' },
    year: { type: Number },
    horsePower: { type: Number },
    fuelType: {
      type: String,
      enum: ['diesel', 'petrol', 'electric', 'manual', 'solar', ''],
      default: '',
    },
    weight: { type: Number },
    dimensions: { type: String },
    features: [{ type: String }],
  },

  // ==================== IMAGES ====================
  imageUrl: {
    type: String,
    default: '/placeholder-equipment.jpg',
    // ✅ Fix Windows backslash on save
    set: (v) => v ? v.replace(/\\/g, '/') : '/placeholder-equipment.jpg',
  },

  images: [{
    url: {
      type: String,
      required: false,    // ✅ CHANGED - no longer required
      default: '',
      // ✅ Fix Windows backslash
      set: (v) => v ? v.replace(/\\/g, '/') : '',
    },
    isPrimary: { type: Boolean, default: false },
  }],

  // ==================== PRICING ====================
  rentalPrice: {
    type: Number,
    required: false,      // ✅ CHANGED - old data has string price
    default: 0,
    // ✅ Auto convert string "350" to number 350
    set: (v) => {
      const num = Number(String(v).replace(/[^0-9.]/g, ''));
      return isNaN(num) ? 0 : num;
    },
  },

  pricing: {
    perHour: { type: Number, default: 0 },
    perDay: { type: Number, default: 0 },
    perWeek: { type: Number, default: 0 },
    perMonth: { type: Number, default: 0 },
    securityDeposit: { type: Number, default: 0 },
    negotiable: { type: Boolean, default: false },
  },

  // ==================== LOCATION ====================
  location: {
    type: String,
    required: false,      // ✅ CHANGED - old data has no location
    default: '',
  },

  locationDetails: {
    address: { type: String, default: '' },
    village: { type: String, default: '' },
    district: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },

  // ==================== CONTACT ====================
  contact: {
    phone: { type: String, default: '' },
    alternatePhone: { type: String, default: '' },
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
    default: null,
  },

  ownerName: { type: String, default: '' },
  ownerPhone: { type: String, default: '' },

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
    default: 'active',    // ✅ already has default - old data gets 'active'
  },

  isVerified: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  termsAccepted: { type: Boolean, default: false },

}, {
  timestamps: true,
  // ✅ IMPORTANT - allows old data fields that aren't in schema
  strict: false,
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

  // ✅ Fix imageUrl backslash
  if (this.imageUrl) {
    this.imageUrl = this.imageUrl.replace(/\\/g, '/');
  }

  // ✅ Sync rentalPrice with pricing.perDay
  if (this.pricing && this.pricing.perDay && !this.rentalPrice) {
    this.rentalPrice = this.pricing.perDay;
  }

  // ✅ Set status to active if not set (fixes old data)
  if (!this.status) {
    this.status = 'active';
  }

  // ✅ Set category to other if not set (fixes old data)
  if (!this.category) {
    this.category = 'other';
  }

  // ✅ Set primary image
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