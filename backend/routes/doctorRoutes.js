const express = require('express');
const router = express.Router();
const { protect, allow } = require('../middleware/auth');
const { getDoctorStats } = require('../controllers/dashboardController');

// All routes are protected and for Doctors only
router.use(protect);
router.use(allow('doctor'));

router.get('/stats', getDoctorStats);

// Placeholder for future implementation
router.get('/appointments', (req, res) => {
    res.json({ message: 'My Appointments API not implemented yet' });
});

module.exports = router;
