const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get doctor's appointments
// @route   GET /api/doctor/appointments
// @access  Private (Doctor)
exports.getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.user.id;

        // Find appointments for this doctor, populated with patient details
        const appointments = await Appointment.find({ doctorId })
            .populate('patientId', 'firstName lastName age gender phone')
            .sort({ appointmentDate: 1, appointmentTime: 1 }); // Sort by date and time

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
        const doctorId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Count today's appointments
        const todayAppointments = await Appointment.countDocuments({
            doctorId,
            appointmentDate: {
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

// @desc    Add prescription to appointment
// @route   POST /api/doctor/appointments/:id/prescription
// @access  Private (Doctor)
exports.addPrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { prescription, diagnosis, notes } = req.body;
        const doctorId = req.user.id;

        const appointment = await Appointment.findOne({ _id: id, doctorId });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Update appointment
        if (prescription) appointment.prescription = prescription;
        if (diagnosis) appointment.diagnosis = diagnosis;
        if (notes) appointment.notes = notes;

        // Auto-complete appointment if prescription is added? 
        // Let's keep it manual or optional, but typically adding Rx means consultation is done.
        // appointment.status = 'Completed'; 

        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Prescription added successfully',
            data: appointment
        });
    } catch (error) {
        console.error('Add prescription error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding prescription'
        });
    }
};

// @desc    Get patients treated by doctor
// @route   GET /api/doctor/patients
// @access  Private (Doctor)
exports.getDoctorPatients = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const hospitalId = req.user.hospitalId;

        // Find all unique patient IDs from appointments
        const appointments = await Appointment.find({ doctorId, hospitalId }).select('patientId');
        const uniquePatientIds = [...new Set(appointments.map(apt => apt.patientId.toString()))];

        // Fetch patient details
        const patients = await require('../models/Patient').find({
            _id: { $in: uniquePatientIds }
        }).select('firstName lastName age gender phone email lastVisit');

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        console.error('Get doctor patients error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching patients'
        });
    }
};

// @desc    Get patient history
// @route   GET /api/doctor/patients/:id/history
// @access  Private (Doctor)
exports.getPatientHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const hospitalId = req.user.hospitalId;

        // Fetch all appointments for this patient in this hospital
        // Doctors can see full history within the hospital for better diagnosis
        const history = await Appointment.find({
            patientId: id,
            hospitalId
        })
            .populate('doctorId', 'firstName lastName specialization')
            .sort({ appointmentDate: -1, appointmentTime: -1 });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        console.error('Get patient history error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching patient history'
        });
    }
};
