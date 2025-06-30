const express = require('express');
const router = express.Router();
const pool = require('../db'); // adjust path if needed

// GET all exercise videos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM exercise_videos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching exercise videos:', err.message);
    res.status(500).json({ error: 'Server error fetching exercise videos' });
  }
});

module.exports = router;
