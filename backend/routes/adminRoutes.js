const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
    loginAdmin,
    getAdminProfile,
    getAllHospitals,
    getHospitalById,
    approveHospital,
    rejectHospital,
    toggleHospitalStatus,
    getSystemAnalytics
} = require('../controllers/adminController');

// Public routes
router.post('/login', loginAdmin);

// Protected routes (Admin only)
router.use(protect, adminOnly); // All routes below require admin authentication

router.get('/me', getAdminProfile);
router.get('/hospitals', getAllHospitals);
router.get('/hospitals/:id', getHospitalById);
router.put('/hospitals/:id/approve', approveHospital);
router.put('/hospitals/:id/reject', rejectHospital);
router.put('/hospitals/:id/toggle-status', toggleHospitalStatus);
router.get('/analytics', getSystemAnalytics);

module.exports = router;
