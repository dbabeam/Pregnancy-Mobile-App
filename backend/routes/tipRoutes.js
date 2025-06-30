const express = require('express');
const router = express.Router();
const { getTipsByTrimester } = require('../controllers/tipController');

// GET /api/tips
router.get('/', getTipsByTrimester);

module.exports = router;
