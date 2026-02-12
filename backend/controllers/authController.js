const User = require('../models/User');
const Admin = require('../models/Admin');
const Hospital = require('../models/Hospital');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { name, email, password, role, phone, dateOfBirth, gender } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User already exists with this email',
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'patient',
            phone,
            dateOfBirth,
            gender,
        });

        // Generate token
        const token = user.generateAuthToken();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during registration',
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// @desc    Login user (Unified for all roles)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;

        // 1. Check for Super Admin (Hardcoded or DB)
        if (email === 'kenznajeeb@gmail.com' && password === 'admin123') {
            const token = jwt.sign({
                id: 'super_admin_hardcoded',
                type: 'admin',
                role: 'super_admin'
            }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE || '7d'
            });

            return res.status(200).json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: 'super_admin_hardcoded',
                    name: 'Super Admin',
                    email: 'kenznajeeb@gmail.com',
                    role: 'super_admin',
                    userType: 'admin'
                }
            });
        }

        // 2. Check Admin Collection (DB Super Admins)
        let user = await Admin.findOne({ email }).select('+password');
        let role = 'super_admin';
        let userType = 'admin';
        let hospitalId = null;

        // 3. Check Hospital Collection (Hospital Admin)
        if (!user) {
            user = await Hospital.findOne({ email }).select('+password');
            if (user) {
                role = 'hospital_admin';
                userType = 'hospital';
                hospitalId = user._id;
            }
        }

        // 4. Check Doctor Collection
        if (!user) {
            // Need to require Doctor model at top of file
            const Doctor = require('../models/Doctor');
            user = await Doctor.findOne({ email }).select('+password');
            if (user) {
                role = 'doctor';
                userType = 'hospital_staff';
                hospitalId = user.hospitalId;
            }
        }

        // 5. Check Staff Collection
        if (!user) {
            // Need to require Staff model at top of file
            const Staff = require('../models/Staff');
            user = await Staff.findOne({ email }).select('+password');
            if (user) {
                role = user.role.toLowerCase(); // receptionist, billing, etc.
                userType = 'hospital_staff';
                hospitalId = user.hospitalId;
            }
        }

        // 6. If no user found
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }

        // 7. Check if active
        if (user.isActive === false) {
            return res.status(401).json({
                success: false,
                error: 'Your account has been deactivated. Please contact administrator.',
            });
        }

        // 8. If hospital, check status
        if (userType === 'hospital' && user.status !== 'approved') {
            return res.status(401).json({
                success: false,
                error: 'Your hospital account is awaiting approval.',
            });
        }

        // 9. Verify Password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }

        // 10. Generate Token
        const token = jwt.sign({
            id: user._id,
            type: userType,
            role: role,
            hospitalId: hospitalId
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || '7d',
        });

        // 11. Return Response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name || user.firstName + ' ' + user.lastName,
                email: user.email,
                role: role,
                userType: userType,
                hospitalId: hospitalId,
                // Include specific details if needed
                specialization: user.specialization || undefined,
                department: user.departmentId || undefined
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during login',
        });
    }
};

// Helper for token generation
const jwt = require('jsonwebtoken');

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
            bloodGroup: req.body.bloodGroup,
            emergencyContact: req.body.emergencyContact,
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(
            (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user,
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during profile update',
        });
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Please provide current and new password',
            });
        }

        const user = await User.findById(req.user.id).select('+password');

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Current password is incorrect',
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        const token = user.generateAuthToken();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
            token,
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during password change',
        });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No user found with this email',
            });
        }

        // Generate reset token
        const resetToken = user.generateResetToken();
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // TODO: Send email with reset URL
        // For now, just return the token (remove this in production)
        res.status(200).json({
            success: true,
            message: 'Password reset email sent',
            resetToken, // Remove this in production
            resetUrl, // Remove this in production
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            error: 'Email could not be sent',
        });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired reset token',
            });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        const token = user.generateAuthToken();

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
            token,
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during password reset',
        });
    }
};
