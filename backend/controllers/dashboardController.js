const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');

// @desc    Get Hospital Dashboard Stats
// @route   GET /api/hospital/stats
// @access  Private (Hospital Admin)
exports.getHospitalStats = async (req, res) => {
    try {
        const hospitalId = req.user.hospitalId;

        // Run queries in parallel for performance
        const [
            doctorCount,
            staffCount,
            patientCount,
            appointmentCount,
            revenueData
        ] = await Promise.all([
            Doctor.countDocuments({ hospitalId }),
            Staff.countDocuments({ hospitalId }),
            Patient.countDocuments({ hospitalId }), // Assuming Patient has hospitalId
            Appointment.countDocuments({ hospitalId }), // Assuming Appointment has hospitalId
            // Revenue calculation from Paid Invoices
            Invoice.aggregate([
                { $match: { hospitalId: req.user.hospitalId, status: 'Paid' } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ])
        ]);

        const totalStaff = doctorCount + staffCount;
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        res.status(200).json({
            success: true,
            data: {
                totalStaff,
                totalPatients: patientCount,
                totalRevenue,
                totalAppointments: appointmentCount,
                doctorCount,
                nurseCount: staffCount // For now treating all non-doctor staff as general staff
            }
        });

    } catch (error) {
        console.error('Error fetching hospital stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error fetching dashboard stats'
        });
    }
};

// @desc    Get Doctor Dashboard Stats
// @route   GET /api/doctor/stats
// @access  Private (Doctor)
exports.getDoctorStats = async (req, res) => {
    try {
        const doctorId = req.user.id; // User ID from auth middleware (linked to Doctor model)

        // Find the actual Doctor document if req.user.id is the User account ID
        // Note: In our unified auth, req.user might be the Doctor document itself. 
        // Let's assume req.user._id is the correct reference.

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const [todayAppointments, pendingReports] = await Promise.all([
            Appointment.countDocuments({
                doctorId: req.user.id,
                appointmentDate: { $gte: startOfDay, $lte: endOfDay },
                status: { $ne: 'Cancelled' }
            }),
            // Placeholder: "Pending Reports" could be appointments with status 'Completed' but no report generated
            // For now, let's just count 'Scheduled' as pending work
            Appointment.countDocuments({
                doctorId: req.user.id,
                status: 'Scheduled'
            })
        ]);

        res.json({
            success: true,
            data: {
                todayAppointments,
                pendingReports
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Receptionist Dashboard Stats
// @route   GET /api/reception/stats
// @access  Private (Receptionist)
exports.getReceptionStats = async (req, res) => {
    try {
        const hospitalId = req.user.hospitalId;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const [newPatients, pendingAppointments, completedAppointments] = await Promise.all([
            Patient.countDocuments({
                hospitalId,
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            }),
            Appointment.countDocuments({
                hospitalId,
                appointmentDate: { $gte: startOfDay, $lte: endOfDay },
                status: 'Scheduled'
            }),
            Appointment.countDocuments({
                hospitalId,
                appointmentDate: { $gte: startOfDay, $lte: endOfDay },
                status: 'Completed'
            })
        ]);

        res.json({
            success: true,
            data: {
                newPatients,
                pendingAppointments,
                completedAppointments,
                todayAppointments: pendingAppointments + completedAppointments // Keep total for backward compat if needed
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
