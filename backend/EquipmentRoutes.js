// backend/equipmentRoutes.js
const express = require('express');
const router = express.Router();
const Equipment = require('./Equipment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ==================== MULTER SETUP (Image Upload) ====================
// Create uploads directory if it doesn't exist
const uploadDir = 'uploads/equipment';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'equipment-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ==================== HELPER FUNCTIONS ====================

// Build filter query from request params
const buildFilterQuery = (params) => {
  const query = { status: { $ne: 'deleted' } };

  // Text search
  if (params.query || params.search) {
    const searchTerm = params.query || params.search;
    query.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { 'specifications.brand': { $regex: searchTerm, $options: 'i' } },
    ];
  }

  // Category filter
  if (params.category && params.category !== 'all') {
    query.category = params.category;
  }

  // Condition filter
  if (params.condition) {
    const conditions = params.condition.split(',');
    query.condition = { $in: conditions };
  }

  // Price range
  if (params.minPrice || params.maxPrice) {
    query.rentalPrice = {};
    if (params.minPrice) query.rentalPrice.$gte = Number(params.minPrice);
    if (params.maxPrice) query.rentalPrice.$lte = Number(params.maxPrice);
  }

  // Location filter
  if (params.location) {
    query.location = { $regex: params.location, $options: 'i' };
  }

  if (params.state) {
    query['locationDetails.state'] = params.state;
  }

  if (params.district) {
    query['locationDetails.district'] = { $regex: params.district, $options: 'i' };
  }

  // Availability
  if (params.available === 'true') {
    query.available = true;
  }

  // Fuel type
  if (params.fuelType) {
    query['specifications.fuelType'] = params.fuelType;
  }

  // Brand
  if (params.brand) {
    query['specifications.brand'] = { $regex: params.brand, $options: 'i' };
  }

  // Delivery available
  if (params.deliveryAvailable === 'true') {
    query['delivery.available'] = true;
  }

  // Featured only
  if (params.featured === 'true') {
    query.isFeatured = true;
  }

  // Verified only
  if (params.verified === 'true') {
    query.isVerified = true;
  }

  // Status filter (for admin)
  if (params.status) {
    query.status = params.status;
  } else {
    query.status = 'active';
  }

  return query;
};

// Build sort query
const buildSortQuery = (sortParam) => {
  switch (sortParam) {
    case 'price_low':
      return { rentalPrice: 1 };
    case 'price_high':
      return { rentalPrice: -1 };
    case 'newest':
      return { createdAt: -1 };
    case 'oldest':
      return { createdAt: 1 };
    case 'rating':
      return { 'ratings.average': -1 };
    case 'popular':
      return { 'stats.timesRented': -1 };
    case 'views':
      return { 'stats.views': -1 };
    case 'name_asc':
      return { name: 1 };
    case 'name_desc':
      return { name: -1 };
    default:
      return { createdAt: -1 };
  }
};

// ==================== ROUTES ====================

// GET /api/equipment - Get all equipment with filters, sorting, pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = 'newest',
      ...filterParams
    } = req.query;

    const query = buildFilterQuery(filterParams);
    const sortQuery = buildSortQuery(sort);

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Execute queries in parallel
    const [equipment, totalCount] = await Promise.all([
      Equipment.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum)
        .populate('owner', 'name profileImage phone')
        .lean(),
      Equipment.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      equipment,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch equipment',
      message: error.message,
    });
  }
});

// GET /api/equipment/featured - Get featured equipment
router.get('/featured', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;

    const equipment = await Equipment.find({
      status: 'active',
      available: true,
      isFeatured: true,
    })
      .sort({ 'ratings.average': -1, createdAt: -1 })
      .limit(limit)
      .lean();

    // If not enough featured, fill with latest
    if (equipment.length < limit) {
      const additional = await Equipment.find({
        status: 'active',
        available: true,
        _id: { $nin: equipment.map(e => e._id) },
      })
        .sort({ createdAt: -1 })
        .limit(limit - equipment.length)
        .lean();

      equipment.push(...additional);
    }

    res.json({
      success: true,
      equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured equipment',
    });
  }
});

// GET /api/equipment/categories - Get all categories with counts
router.get('/categories', async (req, res) => {
  try {
    const categories = await Equipment.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          minPrice: { $min: '$rentalPrice' },
          maxPrice: { $max: '$rentalPrice' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
    });
  }
});

// GET /api/equipment/filters - Get filter options
router.get('/filters', async (req, res) => {
  try {
    const [categories, brands, locations, states, priceStats] = await Promise.all([
      Equipment.distinct('category', { status: 'active' }),
      Equipment.distinct('specifications.brand', { status: 'active', 'specifications.brand': { $ne: null } }),
      Equipment.distinct('location', { status: 'active' }),
      Equipment.distinct('locationDetails.state', { status: 'active', 'locationDetails.state': { $ne: null } }),
      Equipment.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$rentalPrice' },
            maxPrice: { $max: '$rentalPrice' },
            avgPrice: { $avg: '$rentalPrice' },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      filters: {
        categories: categories.filter(Boolean),
        brands: brands.filter(Boolean),
        locations: locations.filter(Boolean),
        states: states.filter(Boolean),
        conditions: ['new', 'excellent', 'good', 'fair', 'needs_repair'],
        fuelTypes: ['diesel', 'petrol', 'electric', 'manual', 'solar'],
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 10000, avgPrice: 2500 },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch filter options',
    });
  }
});

// GET /api/equipment/stats - Get statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Equipment.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          totalEquipment: { $sum: 1 },
          availableEquipment: {
            $sum: { $cond: ['$available', 1, 0] },
          },
          totalViews: { $sum: '$stats.views' },
          avgPrice: { $avg: '$rentalPrice' },
          avgRating: { $avg: '$ratings.average' },
        },
      },
    ]);

    const categoryStats = await Equipment.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      stats: stats[0] || {},
      categoryStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats',
    });
  }
});

// GET /api/equipment/:id - Get single equipment by ID
router.get('/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('owner', 'name profileImage phone email');

    if (!equipment) {
      return res.status(404).json({
        success: false,
        error: 'Equipment not found',
      });
    }

    // Increment view count
    equipment.stats.views += 1;
    await equipment.save();

    res.json({
      success: true,
      equipment,
    });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch equipment',
    });
  }
});

// POST /api/equipment - Create new equipment
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const body = req.body;

    // Parse JSON strings if sent as form data
    const parseIfString = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch (e) {
          return field;
        }
      }
      return field;
    };

    const specifications = parseIfString(body.specifications) || {};
    const pricing = parseIfString(body.pricing) || {};
    const locationDetails = parseIfString(body.locationDetails) || parseIfString(body.location) || {};
    const contact = parseIfString(body.contact) || {};
    const delivery = parseIfString(body.delivery) || {};
    const features = parseIfString(body.features) || [];

    // Process uploaded images
    let images = [];
    let imageUrl = '/placeholder-equipment.jpg';

    if (req.files && req.files.length > 0) {
      const primaryIndex = Number(body.primaryImageIndex) || 0;

      images = req.files.map((file, index) => ({
        url: `/uploads/equipment/${file.filename}`,
        isPrimary: index === primaryIndex,
      }));

      imageUrl = images[0].url;
    }

    // Create equipment document
    const equipmentData = {
      name: body.name,
      category: body.category,
      condition: body.condition || 'good',
      description: body.description,

      specifications: {
        brand: body.brand || specifications.brand,
        model: body.model || specifications.model,
        year: body.year || specifications.year,
        horsePower: body.horsePower || specifications.horsePower,
        fuelType: body.fuelType || specifications.fuelType,
        weight: body.weight || specifications.weight,
        dimensions: body.dimensions || specifications.dimensions,
        features: features.length > 0 ? features : (specifications.features || []),
      },

      imageUrl,
      images,

      rentalPrice: Number(body.pricePerDay || body.rentalPrice || pricing.perDay),
      pricing: {
        perHour: pricing.perHour || body.pricePerHour,
        perDay: pricing.perDay || body.pricePerDay || body.rentalPrice,
        perWeek: pricing.perWeek || body.pricePerWeek,
        perMonth: pricing.perMonth || body.pricePerMonth,
        securityDeposit: pricing.securityDeposit || body.securityDeposit || 0,
        negotiable: body.negotiable === 'true' || body.negotiable === true || pricing.negotiable,
      },

      location: body.district && body.state
        ? `${body.village ? body.village + ', ' : ''}${body.district}, ${body.state}`
        : (typeof body.location === 'string' ? body.location : `${locationDetails.district || ''}, ${locationDetails.state || ''}`),

      locationDetails: {
        address: body.address || locationDetails.address,
        village: body.village || locationDetails.village,
        district: body.district || locationDetails.district,
        state: body.state || locationDetails.state,
        pincode: body.pincode || locationDetails.pincode,
        coordinates: body.coordinates ? parseIfString(body.coordinates) : locationDetails.coordinates,
      },

      contact: {
        phone: body.contactPhone || contact.phone,
        alternatePhone: body.alternatePhone || contact.alternatePhone,
        whatsappAvailable: body.whatsappAvailable === 'true' || contact.whatsappAvailable,
      },

      available: body.available !== 'false' && body.available !== false,
      quantity: Number(body.quantity) || 1,

      delivery: {
        available: body.deliveryAvailable === 'true' || delivery.available,
        radius: Number(body.deliveryRadius) || delivery.radius || 0,
        charges: Number(body.deliveryCharges) || delivery.charges || 0,
      },

      owner: body.owner || null,
      ownerName: body.ownerName,
      ownerPhone: body.contactPhone || body.ownerPhone,

      status: 'active',
      termsAccepted: body.termsAccepted === 'true' || body.termsAccepted === true,
    };

    const equipment = new Equipment(equipmentData);
    await equipment.save();

    res.status(201).json({
      success: true,
      message: 'Equipment added successfully!',
      equipment,
    });

  } catch (error) {
    console.error('Error creating equipment:', error);
    res.status(400).json({
      success: false,
      error: 'Failed to add equipment',
      message: error.message,
      details: error.errors,
    });
  }
});

// PUT /api/equipment/:id - Update equipment
router.put('/:id', upload.array('images', 10), async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        error: 'Equipment not found',
      });
    }

    const body = req.body;

    // Parse JSON strings
    const parseIfString = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch (e) {
          return field;
        }
      }
      return field;
    };

    // Update fields
    if (body.name) equipment.name = body.name;
    if (body.category) equipment.category = body.category;
    if (body.condition) equipment.condition = body.condition;
    if (body.description) equipment.description = body.description;

    // Update specifications
    const specs = parseIfString(body.specifications) || {};
    if (body.brand || specs.brand) equipment.specifications.brand = body.brand || specs.brand;
    if (body.model || specs.model) equipment.specifications.model = body.model || specs.model;
    if (body.year || specs.year) equipment.specifications.year = body.year || specs.year;
    if (body.horsePower || specs.horsePower) equipment.specifications.horsePower = body.horsePower || specs.horsePower;
    if (body.fuelType || specs.fuelType) equipment.specifications.fuelType = body.fuelType || specs.fuelType;

    // Update pricing
    if (body.rentalPrice || body.pricePerDay) {
      equipment.rentalPrice = Number(body.pricePerDay || body.rentalPrice);
      equipment.pricing.perDay = equipment.rentalPrice;
    }

    // Update availability
    if (body.available !== undefined) {
      equipment.available = body.available === 'true' || body.available === true;
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/equipment/${file.filename}`,
        isPrimary: index === 0 && equipment.images.length === 0,
      }));
      equipment.images.push(...newImages);

      if (!equipment.imageUrl || equipment.imageUrl === '/placeholder-equipment.jpg') {
        equipment.imageUrl = newImages[0].url;
      }
    }

    equipment.updatedAt = new Date();
    await equipment.save();

    res.json({
      success: true,
      message: 'Equipment updated successfully',
      equipment,
    });

  } catch (error) {
    console.error('Error updating equipment:', error);
    res.status(400).json({
      success: false,
      error: 'Failed to update equipment',
      message: error.message,
    });
  }
});

// DELETE /api/equipment/:id - Delete equipment (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        error: 'Equipment not found',
      });
    }

    // Soft delete
    equipment.status = 'deleted';
    await equipment.save();

    res.json({
      success: true,
      message: 'Equipment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete equipment',
    });
  }
});

// PATCH /api/equipment/:id/toggle-availability - Toggle availability
router.patch('/:id/toggle-availability', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        error: 'Equipment not found',
      });
    }

    equipment.available = !equipment.available;
    await equipment.save();

    res.json({
      success: true,
      message: `Equipment marked as ${equipment.available ? 'available' : 'unavailable'}`,
      available: equipment.available,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to toggle availability',
    });
  }
});

// PATCH /api/equipment/:id/feature - Toggle featured status
router.patch('/:id/feature', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        error: 'Equipment not found',
      });
    }

    equipment.isFeatured = !equipment.isFeatured;
    await equipment.save();

    res.json({
      success: true,
      message: `Equipment ${equipment.isFeatured ? 'featured' : 'unfeatured'}`,
      isFeatured: equipment.isFeatured,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to toggle featured status',
    });
  }
});

module.exports = router;