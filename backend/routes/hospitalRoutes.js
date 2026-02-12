const express = require('express');
const router = express.Router();
const { protect, hospitalOnly } = require('../middleware/auth');
const {
    registerHospital,
    loginHospital,
    getHospitalProfile,
    updateHospitalProfile,
    changePassword,
    getAllStaff,
    addStaff
} = require('../controllers/hospitalController');
const { getHospitalStats } = require('../controllers/dashboardController');

// Public routes
router.post('/register', registerHospital);
router.post('/login', loginHospital);

// Protected routes (Hospital only)
router.get('/profile', protect, hospitalOnly, getHospitalProfile);
router.put('/profile', protect, hospitalOnly, updateHospitalProfile);
router.put('/change-password', protect, hospitalOnly, changePassword);
router.get('/stats', protect, hospitalOnly, getHospitalStats);
router.get('/staff', protect, hospitalOnly, getAllStaff);
router.post('/staff', protect, hospitalOnly, addStaff);

module.exports = router;
