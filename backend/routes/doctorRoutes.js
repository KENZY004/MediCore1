const express = require('express');
const router = express.Router();
const { protect, allow } = require('../middleware/auth');
const {
    getDoctorAppointments,
    getDoctorStats,
    addPrescription
} = require('../controllers/doctorController');

// All routes are protected and for Doctors only
router.use(protect);
router.use(allow('doctor'));

router.get('/stats', getDoctorStats);
router.get('/appointments', getDoctorAppointments);
router.post('/appointments/:id/prescription', addPrescription);
router.get('/patients', require('../controllers/doctorController').getDoctorPatients);
router.get('/patients/:id/history', require('../controllers/doctorController').getPatientHistory);

module.exports = router;
