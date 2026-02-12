const express = require('express');
const router = express.Router();
const { protect, allow } = require('../middleware/auth');
const {
    getDoctorAppointments,
    getDoctorStats
} = require('../controllers/doctorController');

// All routes are protected and for Doctors only
router.use(protect);
router.use(allow('doctor'));

router.get('/stats', getDoctorStats);
router.get('/appointments', getDoctorAppointments);

module.exports = router;
