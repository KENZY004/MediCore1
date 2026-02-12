const express = require('express');
const router = express.Router();
const { protect, allow } = require('../middleware/auth');
const {
    registerPatient,
    bookAppointment,
    searchPatients,
    getDoctors,
    getAllPatients
} = require('../controllers/receptionController');
const { getReceptionStats } = require('../controllers/dashboardController');

// Shared routes (Read-only for Hospital Admin)
router.get('/stats', protect, allow('Receptionist', 'receptionist', 'hospital_admin'), getReceptionStats);
router.get('/patients', protect, allow('Receptionist', 'receptionist', 'hospital_admin'), getAllPatients);
router.get('/patients/search', protect, allow('Receptionist', 'receptionist', 'hospital_admin'), searchPatients);
router.get('/doctors', protect, allow('Receptionist', 'receptionist', 'hospital_admin'), getDoctors);

// Receptionist Only (Write access)
router.post('/patients', protect, allow('Receptionist', 'receptionist'), registerPatient);
router.post('/appointments', protect, allow('Receptionist', 'receptionist'), bookAppointment);

module.exports = router;
