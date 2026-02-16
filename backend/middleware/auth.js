const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');

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

            // Determine which collection to query based on role/type in token
            let user;

            if (decoded.role === 'super_admin') {
                // Handle hardcoded super admin or DB admin
                if (decoded.id === 'super_admin_hardcoded') {
                    user = {
                        _id: 'super_admin_hardcoded',
                        id: 'super_admin_hardcoded',
                        name: 'Super Admin',
                        email: 'kenznajeeb@gmail.com',
                        role: 'super_admin',
                        userType: 'admin'
                    };
                } else {
                    user = await Admin.findById(decoded.id);
                }
            } else if (decoded.role === 'hospital_admin' || decoded.type === 'hospital') {
                user = await Hospital.findById(decoded.id);
                if (user) user.role = 'hospital_admin';
            } else if (decoded.role === 'doctor') {
                user = await Doctor.findById(decoded.id);
                if (user) user.role = 'doctor';
            } else {
                // Check Staff for other roles
                user = await Staff.findById(decoded.id);
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found or invalid token.'
                });
            }

            // Attach user to request
            req.user = user;
            req.userType = decoded.type; // Attach userType for legacy compatibility

            // Ensure hospitalId is available
            if (user.hospitalId) {
                req.user.hospitalId = user.hospitalId;
            } else if (decoded.role === 'hospital_admin' || decoded.type === 'hospital') {
                req.user.hospitalId = user._id;
            }

            next();
        } catch (error) {
            console.error('Token verification failed:', error);
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

// Grant access to specific roles
exports.allow = (...roles) => {
    return (req, res, next) => {
        // Normalize role check
        // req.user.role should be available
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user?.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

// Legacy support wrappers
exports.adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'super_admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin only.'
        });
    }
    next();
};

exports.hospitalOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'hospital_admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Hospital only.'
        });
    }
    next();
};
