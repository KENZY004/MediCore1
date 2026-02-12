const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get doctor's appointments
// @route   GET /api/doctor/appointments
// @access  Private (Doctor)
exports.getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.doctor.id;

        // Find appointments for this doctor, populated with patient details
        const appointments = await Appointment.find({ doctorId })
            .populate('patientId', 'firstName lastName age gender phone')
            .sort({ date: 1, time: 1 }); // Sort by date and time

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        console.error('Get doctor appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments'
        });
    }
};

// @desc    Get doctor statistics
// @route   GET /api/doctor/stats
// @access  Private (Doctor)
exports.getDoctorStats = async (req, res) => {
    try {
        const doctorId = req.doctor.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Count today's appointments
        const todayAppointments = await Appointment.countDocuments({
            doctorId,
            date: {
                $gte: today,
                $lt: tomorrow
            },
            status: { $ne: 'Cancelled' }
        });

        // Count pending reports (placeholder logic, usually based on status 'Completed' but no report uploaded)
        // For now, let's say 'Scheduled' appointments are "pending" attention
        const pendingReports = await Appointment.countDocuments({
            doctorId,
            status: 'Scheduled'
        });

        res.status(200).json({
            success: true,
            data: {
                todayAppointments,
                pendingReports
            }
        });
    } catch (error) {
        console.error('Get doctor stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching doctor stats'
        });
    }
};
