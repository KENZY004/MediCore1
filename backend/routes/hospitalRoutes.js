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
    addStaff,
    updateStaff,
    deleteStaff
} = require('../controllers/hospitalController');
const { getHospitalStats } = require('../controllers/dashboardController');
const {
    createInvoice,
    getInvoices,
    updateInvoice,
    deleteInvoice,
    getBillableAppointments
} = require('../controllers/billingController');

const {
    getAllAppointments
} = require('../controllers/hospitalController');

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
router.put('/staff/:id', protect, hospitalOnly, updateStaff);
router.delete('/staff/:id', protect, hospitalOnly, deleteStaff);
router.get('/appointments', protect, hospitalOnly, getAllAppointments);

// Billing Routes
router.post('/invoices', protect, hospitalOnly, createInvoice);
router.get('/invoices', protect, hospitalOnly, getInvoices);
router.put('/invoices/:id', protect, hospitalOnly, updateInvoice);
router.delete('/invoices/:id', protect, hospitalOnly, deleteInvoice);
router.get('/billable-appointments', protect, hospitalOnly, getBillableAppointments);

module.exports = router;
