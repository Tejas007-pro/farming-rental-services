// equipmentRoutes.js
const express = require('express');
const router = express.Router();
const Equipment = require('./Equipment'); // This is your Equipment model

// GET /:id - Fetch equipment details by ID
router.get('/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json({ equipment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
