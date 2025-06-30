const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authenticateToken = require('../middleware/authMiddleware'); // 🔐 import the middleware

router.post('/signup', patientController.registeruser);
router.post('/login', patientController.loginUser);
router.post('/setup/:userId', authenticateToken, patientController.completeSetup); // 🛡 protected
router.get('/profile/:userId', authenticateToken, patientController.getProfile);   // 🛡 protected

module.exports = router;
