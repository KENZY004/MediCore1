const express = require('express');
const router = express.Router();
const { protect, allow } = require('../middleware/auth');
const { getReceptionStats } = require('../controllers/dashboardController');

// All routes are protected and for Receptionists only
router.use(protect);
router.use(allow('receptionist'));

router.get('/stats', getReceptionStats);

module.exports = router;
