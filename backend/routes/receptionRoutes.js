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

// All routes are protected and for Receptionists only
router.use(protect);
router.use(allow('Receptionist'));

router.get('/stats', getReceptionStats);
router.get('/patients', getAllPatients);
router.post('/patients', registerPatient);
router.get('/patients/search', searchPatients);
router.get('/doctors', getDoctors);
router.post('/appointments', bookAppointment);

module.exports = router;
