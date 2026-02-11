const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Hospital = require('../models/Hospital');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please login.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user info to request based on type
            if (decoded.type === 'admin') {
                req.admin = { id: decoded.id };
                req.userType = 'admin';
            } else if (decoded.type === 'hospital') {
                req.hospital = { id: decoded.id };
                req.userType = 'hospital';
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token type'
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in authentication'
        });
    }
};

// Admin only access
exports.adminOnly = async (req, res, next) => {
    try {
        if (req.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        // Verify admin exists and is active
        const admin = await Admin.findById(req.admin.id);

        if (!admin || !admin.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Admin account not found or inactive'
            });
        }

        next();
    } catch (error) {
        console.error('Admin authorization error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in authorization'
        });
    }
};

// Hospital only access
exports.hospitalOnly = async (req, res, next) => {
    try {
        if (req.userType !== 'hospital') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Hospital only.'
            });
        }

        // Verify hospital exists, is approved and active
        const hospital = await Hospital.findById(req.hospital.id);

        if (!hospital) {
            return res.status(403).json({
                success: false,
                message: 'Hospital not found'
            });
        }

        if (hospital.status !== 'approved') {
            return res.status(403).json({
                success: false,
                message: 'Hospital not approved'
            });
        }

        if (!hospital.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Hospital account is inactive'
            });
        }

        next();
    } catch (error) {
        console.error('Hospital authorization error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in authorization'
        });
    }
};
