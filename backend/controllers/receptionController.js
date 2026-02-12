const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Register a new patient
// @route   POST /api/reception/patients
// @access  Private (Receptionist)
exports.registerPatient = async (req, res) => {
    try {
        const { firstName, lastName, dateOfBirth, gender, phone, email, address, bloodGroup } = req.body;
        const hospitalId = req.user.hospitalId;

        // Basic validation
        if (!firstName || !lastName || !dateOfBirth || !gender || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if patient exists (by phone)
        const existingPatient = await Patient.findOne({ phone, hospitalId });
        if (existingPatient) {
            return res.status(400).json({
                success: false,
                message: 'Patient with this phone number already registered'
            });
        }

        // Generate Patient ID ( Simple logic: HOSP-Timestamp-Random)
        const patientId = `PID-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const patient = await Patient.create({
            patientId,
            firstName,
            lastName,
            dateOfBirth,
            gender,
            phone,
            email,
            address,
            bloodGroup,
            hospitalId,
            registeredBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Patient registered successfully',
            data: patient
        });

    } catch (error) {
        console.error('Register patient error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error registering patient'
        });
    }
};

// @desc    Book an appointment
// @route   POST /api/reception/appointments
// @access  Private (Receptionist)
exports.bookAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, time, reason } = req.body;
        const hospitalId = req.user.hospitalId;

        // Validate
        if (!patientId || !doctorId || !date || !time || !reason) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all appointment details'
            });
        }

        // Check doctor availability (Basic check)
        // In a real app, we'd check against schedule and existing appointments
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Check if slot is taken
        const existingAppointment = await Appointment.findOne({
            doctorId,
            date,
            time,
            status: { $ne: 'Cancelled' }
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked'
            });
        }

        const appointment = await Appointment.create({
            hospitalId,
            patientId,
            doctorId,
            appointmentDate: date,
            appointmentTime: time,
            reason,
            createdBy: req.user.id,
            status: 'Scheduled'
        });

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            data: appointment
        });

    } catch (error) {
        console.error('Book appointment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error booking appointment'
        });
    }
};

// @desc    Search patients
// @route   GET /api/reception/patients/search
// @access  Private (Receptionist)
exports.searchPatients = async (req, res) => {
    try {
        const { query } = req.query;
        const hospitalId = req.user.hospitalId;

        if (!query) {
            return res.status(400).json({ success: false, message: 'Please provide a search query' });
        }

        // Search by name or phone
        const patients = await Patient.find({
            hospitalId,
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });

    } catch (error) {
        console.error('Search patients error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching patients'
        });
    }
};

// @desc    Get all doctors for appointment booking
// @route   GET /api/reception/doctors
// @access  Private (Receptionist)
exports.getDoctors = async (req, res) => {
    try {
        const hospitalId = req.user.hospitalId;
        // Only fetch active doctors
        const doctors = await Doctor.find({ hospitalId, isActive: true })
            .select('firstName lastName specialization departmentId')
            .sort({ firstName: 1 });

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        console.error('Get doctors error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching doctors'
        });
    }
};

// @desc    Get all patients
// @route   GET /api/reception/patients
// @access  Private (Receptionist)
exports.getAllPatients = async (req, res) => {
    try {
        const hospitalId = req.user.hospitalId;
        const patients = await Patient.find({ hospitalId })
            .select('firstName lastName age gender phone email patientId lastVisit')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        console.error('Get all patients error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching patients'
        });
    }
};
