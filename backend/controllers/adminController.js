const Admin = require('../models/Admin');
const Hospital = require('../models/Hospital');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id, type: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Get current admin profile
// @route   GET /api/admin/me
// @access  Private (Admin)
exports.getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { admin: admin.getPublicProfile() }
        });
    } catch (error) {
        console.error('Get admin profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching admin profile'
        });
    }
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for hardcoded super admin
        if (email === 'kenznajeeb@gmail.com' && password === 'admin123') {
            const token = jwt.sign({ id: 'super_admin_hardcoded', type: 'admin' }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE || '7d'
            });

            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    admin: {
                        id: 'super_admin_hardcoded',
                        name: 'Super Admin',
                        email: 'kenznajeeb@gmail.com',
                        role: 'super_admin',
                        userType: 'admin'
                    }
                }
            });
        }

        // Find admin and include password
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated'
            });
        }

        // Check password
        const isPasswordMatch = await admin.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate token
        const token = generateToken(admin._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                admin: admin.getPublicProfile()
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in'
        });
    }
};

// @desc    Get all hospitals
// @route   GET /api/admin/hospitals
// @access  Private (Admin)
exports.getAllHospitals = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, search } = req.query;

        const query = {};

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { registrationNumber: { $regex: search, $options: 'i' } }
            ];
        }

        const hospitals = await Hospital.find(query)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Hospital.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                hospitals,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                total: count
            }
        });
    } catch (error) {
        console.error('Get all hospitals error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching hospitals'
        });
    }
};

// @desc    Get hospital by ID
// @route   GET /api/admin/hospitals/:id
// @access  Private (Admin)
exports.getHospitalById = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id).select('-password');

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: 'Hospital not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { hospital }
        });
    } catch (error) {
        console.error('Get hospital by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching hospital'
        });
    }
};

// @desc    Approve hospital
// @route   PUT /api/admin/hospitals/:id/approve
// @access  Private (Admin)
exports.approveHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: 'Hospital not found'
            });
        }

        if (hospital.status === 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Hospital is already approved'
            });
        }

        hospital.status = 'approved';
        hospital.approvedBy = req.user.id;
        hospital.approvedAt = new Date();
        hospital.isActive = true;

        await hospital.save();

        // TODO: Send approval email to hospital

        res.status(200).json({
            success: true,
            message: 'Hospital approved successfully',
            data: { hospital: hospital.getPublicProfile() }
        });
    } catch (error) {
        console.error('Approve hospital error:', error);
        res.status(500).json({
            success: false,
            message: 'Error approving hospital'
        });
    }
};

// @desc    Reject hospital
// @route   PUT /api/admin/hospitals/:id/reject
// @access  Private (Admin)
exports.rejectHospital = async (req, res) => {
    try {
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a rejection reason'
            });
        }

        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: 'Hospital not found'
            });
        }

        hospital.status = 'rejected';
        hospital.rejectionReason = reason;
        hospital.isActive = false;

        await hospital.save();

        // TODO: Send rejection email to hospital

        res.status(200).json({
            success: true,
            message: 'Hospital rejected',
            data: { hospital: hospital.getPublicProfile() }
        });
    } catch (error) {
        console.error('Reject hospital error:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting hospital'
        });
    }
};

// @desc    Suspend/Activate hospital
// @route   PUT /api/admin/hospitals/:id/toggle-status
// @access  Private (Admin)
exports.toggleHospitalStatus = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: 'Hospital not found'
            });
        }

        hospital.isActive = !hospital.isActive;
        hospital.status = hospital.isActive ? 'approved' : 'suspended';

        await hospital.save();

        res.status(200).json({
            success: true,
            message: `Hospital ${hospital.isActive ? 'activated' : 'suspended'} successfully`,
            data: { hospital: hospital.getPublicProfile() }
        });
    } catch (error) {
        console.error('Toggle hospital status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating hospital status'
        });
    }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getSystemAnalytics = async (req, res) => {
    try {
        const totalHospitals = await Hospital.countDocuments();
        const pendingHospitals = await Hospital.countDocuments({ status: 'pending' });
        const approvedHospitals = await Hospital.countDocuments({ status: 'approved' });
        const rejectedHospitals = await Hospital.countDocuments({ status: 'rejected' });
        const activeHospitals = await Hospital.countDocuments({ isActive: true });

        // Recent registrations (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentRegistrations = await Hospital.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.status(200).json({
            success: true,
            data: {
                totalHospitals,
                pendingHospitals,
                approvedHospitals,
                rejectedHospitals,
                activeHospitals,
                recentRegistrations
            }
        });
    } catch (error) {
        console.error('Get system analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics'
        });
    }
};
