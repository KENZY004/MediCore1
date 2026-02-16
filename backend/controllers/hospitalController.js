const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id, type: 'hospital' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Register a new hospital
// @route   POST /api/hospitals/register
// @access  Public
exports.registerHospital = async (req, res) => {
    try {
        const {
            name,
            registrationNumber,
            licenseNumber,
            email,
            password,
            phone,
            address,
            adminContact,
            type,
            totalBeds,
            specializations,
            website,
            description
        } = req.body;

        // Check if hospital already exists
        const existingHospital = await Hospital.findOne({
            $or: [{ email }, { registrationNumber }, { licenseNumber }]
        });

        if (existingHospital) {
            return res.status(400).json({
                success: false,
                message: 'Hospital with this email, registration number, or license number already exists'
            });
        }

        // Create hospital
        const hospital = await Hospital.create({
            name,
            registrationNumber,
            licenseNumber,
            email,
            password,
            phone,
            address,
            adminContact,
            type,
            totalBeds,
            specializations,
            website,
            description,
            status: 'pending' // Requires admin approval
        });

        res.status(201).json({
            success: true,
            message: 'Hospital registration submitted successfully. Awaiting admin approval.',
            data: {
                hospital: hospital.getPublicProfile()
            }
        });
    } catch (error) {
        console.error('Hospital registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error registering hospital'
        });
    }
};

// @desc    Login hospital
// @route   POST /api/hospitals/login
// @access  Public
exports.loginHospital = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find hospital and include password
        const hospital = await Hospital.findOne({ email }).select('+password');

        if (!hospital) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if hospital is approved
        if (hospital.status !== 'approved') {
            return res.status(403).json({
                success: false,
                message: `Your hospital registration is ${hospital.status}. Please contact admin.`
            });
        }

        // Check if hospital is active
        if (!hospital.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your hospital account has been deactivated. Please contact admin.'
            });
        }

        // Check password
        const isPasswordMatch = await hospital.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(hospital._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                hospital: hospital.getPublicProfile()
            }
        });
    } catch (error) {
        console.error('Hospital login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in'
        });
    }
};

// @desc    Get hospital profile
// @route   GET /api/hospitals/profile
// @access  Private (Hospital)
exports.getHospitalProfile = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.user.id);

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: 'Hospital not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                hospital: hospital.getPublicProfile()
            }
        });
    } catch (error) {
        console.error('Get hospital profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching hospital profile'
        });
    }
};

// @desc    Update hospital profile
// @route   PUT /api/hospitals/profile
// @access  Private (Hospital)
exports.updateHospitalProfile = async (req, res) => {
    try {
        const allowedUpdates = [
            'name', 'phone', 'address', 'adminContact', 'type',
            'totalBeds', 'specializations', 'website', 'description'
        ];

        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const hospital = await Hospital.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: 'Hospital not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Hospital profile updated successfully',
            data: {
                hospital: hospital.getPublicProfile()
            }
        });
    } catch (error) {
        console.error('Update hospital profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating hospital profile'
        });
    }
};

// @desc    Change hospital password
// @route   PUT /api/hospitals/change-password
// @access  Private (Hospital)
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        const hospital = await Hospital.findById(req.user.id).select('+password');

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: 'Hospital not found'
            });
        }

        // Verify current password
        const isMatch = await hospital.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        hospital.password = newPassword;
        await hospital.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password'
        });
    }
};

// @desc    Get all doctors and staff
// @route   GET /api/hospital/staff
// @access  Private (Hospital)
exports.getAllStaff = async (req, res) => {
    try {
        const hospitalId = req.user.id;

        const doctors = await Doctor.find({ hospitalId }).select('-password');
        const staff = await Staff.find({ hospitalId }).select('-password');

        // Add 'type' field to distinguish in frontend
        const doctorsWithType = doctors.map(d => ({ ...d.toObject(), type: 'doctor', role: 'Doctor' }));
        const staffWithType = staff.map(s => ({ ...s.toObject(), type: 'staff' }));

        res.status(200).json({
            success: true,
            count: doctors.length + staff.length,
            data: [...doctorsWithType, ...staffWithType]
        });
    } catch (error) {
        console.error('Get all staff error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching staff list'
        });
    }
};

// @desc    Add new doctor or staff
// @route   POST /api/hospital/staff
// @access  Private (Hospital)
exports.addStaff = async (req, res) => {
    try {
        const { role, password, ...data } = req.body;
        const hospitalId = req.user.id;

        // Basic validation
        if (!data.email || !password || !data.firstName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        let newStaff;

        if (role === 'Doctor') {
            // Check if doctor exists
            const existingDoctor = await Doctor.findOne({ email: data.email });
            if (existingDoctor) {
                return res.status(400).json({
                    success: false,
                    message: 'Doctor with this email already exists'
                });
            }

            // Create Doctor
            newStaff = await Doctor.create({
                ...data,
                password,
                hospitalId,
                specialization: data.specialization || 'General Physician', // Default if missing
                qualification: data.qualification || 'MBBS',
                experience: data.experience || 0,
                licenseNumber: data.licenseNumber || `LIC-${Date.now()}` // Temporary fallback
            });
        } else {
            // Check if staff exists
            const existingStaff = await Staff.findOne({ email: data.email });
            if (existingStaff) {
                return res.status(400).json({
                    success: false,
                    message: 'Staff member with this email already exists'
                });
            }

            // Create Staff
            newStaff = await Staff.create({
                ...data,
                password,
                role,
                hospitalId,
                employeeId: data.employeeId || `EMP-${Date.now()}` // Temporary fallback
            });
        }

        res.status(201).json({
            success: true,
            message: `${role} added successfully`,
            data: newStaff.getPublicProfile()
        });

    } catch (error) {
        console.error('Add staff error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error adding staff member'
        });
    }
};

// @desc    Update staff member
// @route   PUT /api/hospital/staff/:id
// @access  Private (Hospital)
exports.updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const hospitalId = req.user.id;

        // Try to find in Doctor collection first
        let staff = await Doctor.findOne({ _id: id, hospitalId });
        let type = 'Doctor';

        if (!staff) {
            // Try Staff collection
            staff = await Staff.findOne({ _id: id, hospitalId });
            type = 'Staff';
        }

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }

        // Prevent changing email to an existing one
        if (updates.email && updates.email !== staff.email) {
            const existingDoctor = await Doctor.findOne({ email: updates.email });
            const existingStaff = await Staff.findOne({ email: updates.email });
            if (existingDoctor || existingStaff) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
        }

        // Update fields
        Object.keys(updates).forEach(key => {
            // Avoid updating immutable fields or password directly here if strictly validated
            if (key !== '_id' && key !== 'hospitalId' && key !== 'password') {
                staff[key] = updates[key];
            }
        });

        await staff.save();

        res.status(200).json({
            success: true,
            message: 'Staff updated successfully',
            data: staff
        });

    } catch (error) {
        console.error('Update staff error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating staff'
        });
    }
};

// @desc    Delete staff member
// @route   DELETE /api/hospital/staff/:id
// @access  Private (Hospital)
exports.deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const hospitalId = req.user.id;

        // Try Doctor
        let result = await Doctor.findOneAndDelete({ _id: id, hospitalId });

        if (!result) {
            // Try Staff
            result = await Staff.findOneAndDelete({ _id: id, hospitalId });
        }

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Staff member removed successfully'
        });

    } catch (error) {
        console.error('Delete staff error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing staff'
        });
    }
};

// @desc    Get all appointments for hospital
// @route   GET /api/hospitals/appointments
// @access  Private (Hospital)
exports.getAllAppointments = async (req, res) => {
    try {
        const hospitalId = req.user.id;

        const appointments = await require('../models/Appointment').find({ hospitalId })
            .populate('patientId', 'firstName lastName phone')
            .populate('doctorId', 'firstName lastName departmentId')
            .sort({ appointmentDate: -1, appointmentTime: 1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        console.error('Get all appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments'
        });
    }
};
