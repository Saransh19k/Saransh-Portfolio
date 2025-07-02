const express = require('express');
const router = express.Router();
const About = require('../models/About');

// GET /api/about
router.get('/', async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({});
    }
    res.json({ success: true, data: about.data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch about content.' });
  }
});

// PUT /api/about
router.put('/', async (req, res) => {
  try {
    const data = req.body;
    let about = await About.findOne();
    if (!about) {
      about = await About.create({ data });
    } else {
      about.data = data;
      await about.save();
    }
    res.json({ success: true, data: about.data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update about content.' });
  }
});

module.exports = router; 