const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get doctor's appointments
// @route   GET /api/doctor/appointments
// @access  Private (Doctor)
exports.getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.user.id;

        // Find appointments for this doctor, populated with patient details
        // Added bloodGroup to populated fields
        const appointments = await Appointment.find({ doctorId })
            .populate('patientId', 'firstName lastName age gender phone bloodGroup')
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
        // Create date range for today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Count today's appointments
        const todayAppointments = await Appointment.countDocuments({
            doctorId,
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: { $ne: 'Cancelled' }
        });

        // Count pending reports (Scheduled or Confirmed but not Completed)
        const pendingReports = await Appointment.countDocuments({
            doctorId,
            status: { $in: ['Scheduled', 'Confirmed'] }
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

        // Filter out null patientIds first
        const validAppointments = appointments.filter(apt => apt.patientId);

        const uniquePatientIds = [...new Set(validAppointments.map(apt => apt.patientId.toString()))];

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

// @desc    Update appointment status
// @route   PUT /api/doctor/appointments/:id/status
// @access  Private (Doctor)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const doctorId = req.user.id;

        const appointment = await Appointment.findOne({ _id: id, doctorId });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        const validStatuses = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        // Prevent completing future appointments
        if (status === 'Completed') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const appointmentDate = new Date(appointment.appointmentDate);
            appointmentDate.setHours(0, 0, 0, 0);

            if (appointmentDate > today) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot mark future appointments as completed'
                });
            }
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json({
            success: true,
            message: `Appointment marked as ${status}`,
            data: appointment
        });
    } catch (error) {
        console.error('Update appointment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating appointment status'
        });
    }
};

// @desc    Get next scheduled appointment
// @route   GET /api/doctor/next-appointment
// @access  Private (Doctor)
exports.getNextAppointment = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const appointment = await Appointment.findOne({
            doctorId,
            appointmentDate: { $gte: startOfDay },
            status: { $in: ['Scheduled', 'Confirmed'] }
        })
            .populate('patientId', 'firstName lastName age gender')
            .sort({ appointmentDate: 1, appointmentTime: 1 });

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.error('Get next appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching next appointment'
        });
    }
};

// @desc    Get recent patients
// @route   GET /api/doctor/recent-patients
// @access  Private (Doctor)
exports.getRecentPatients = async (req, res) => {
    try {
        const doctorId = req.user.id;

        // Get recent completed appointments
        const appointments = await Appointment.find({
            doctorId,
            status: 'Completed'
        })
            .sort({ appointmentDate: -1, appointmentTime: -1 })
            .populate('patientId', 'firstName lastName age gender lastVisit');

        // Deduplicate patients
        const uniquePatients = [];
        const seenIds = new Set();

        for (const apt of appointments) {
            // Check for valid patientId (it might be null if patient deleted)
            if (apt.patientId && !seenIds.has(apt.patientId._id.toString())) {

                // Safely convert to object if needed, though lean() or just using it works if populated
                // If it's a mongoose doc, .toObject() makes it a plain JS object
                const patientData = apt.patientId.toObject ? apt.patientId.toObject() : apt.patientId;

                uniquePatients.push({
                    ...patientData,
                    lastAppointmentDate: apt.appointmentDate
                });
                seenIds.add(apt.patientId._id.toString());
            }
            if (uniquePatients.length >= 5) break;
        }

        res.status(200).json({
            success: true,
            data: uniquePatients
        });
    } catch (error) {
        console.error('Get recent patients error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recent patients'
        });
    }
};
