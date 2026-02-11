const express = require('express');
const router = express.Router();
const { protect, hospitalOnly } = require('../middleware/auth');
const {
    registerHospital,
    loginHospital,
    getHospitalProfile,
    updateHospitalProfile,
    changePassword
} = require('../controllers/hospitalController');

// Public routes
router.post('/register', registerHospital);
router.post('/login', loginHospital);

// Protected routes (Hospital only)
router.get('/profile', protect, hospitalOnly, getHospitalProfile);
router.put('/profile', protect, hospitalOnly, updateHospitalProfile);
router.put('/change-password', protect, hospitalOnly, changePassword);

module.exports = router;
