const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
require('dotenv').config();

const checkDoctorPatients = async () => {
    try {
        if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing');

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const fs = require('fs');
        let output = '';
        const log = (msg) => { output += msg + '\n'; console.log(msg); };

        // 1. Find the doctor
        const doctor = await Doctor.findOne({ firstName: 'Rebecca', lastName: 'Gryffindor' });
        if (!doctor) {
            log('Doctor Rebecca Gryffindor not found');
            fs.writeFileSync('debug_patients_output.txt', output);
            return;
        }
        log(`Doctor found: ${doctor.firstName} ${doctor.lastName} (${doctor._id})`);
        log(`Doctor Hospital ID: ${doctor.hospitalId}`);

        // 2. Find appointments for this doctor
        const appointments = await Appointment.find({ doctorId: doctor._id });
        log(`Found ${appointments.length} appointments for this doctor.`);

        appointments.forEach(apt => {
            log('--- Appointment ---');
            log(`ID: ${apt._id}`);
            log(`Patient ID: ${apt.patientId}`);
            log(`Hospital ID: ${apt.hospitalId}`);
            log(`Status: ${apt.status}`);
            log(`Date: ${apt.appointmentDate}`);
        });

        // 2b. Test exact query
        const exactMatches = await Appointment.find({
            doctorId: doctor._id,
            hospitalId: doctor.hospitalId
        });
        log(`\nExact Query Result (doctorId + hospitalId): Found ${exactMatches.length} appointments.`);

        // 3. Check if any patients match
        if (appointments.length > 0) {
            const patientIds = [...new Set(appointments.map(a => a.patientId ? a.patientId.toString() : null).filter(Boolean))];
            log(`Unique Patient IDs linked: ${patientIds}`);

            const patients = await Patient.find({ _id: { $in: patientIds } });
            log(`Found ${patients.length} patient records from these IDs.`);
            patients.forEach(p => log(`Patient: ${p.firstName} ${p.lastName} (${p._id})`));
        }

        fs.writeFileSync('debug_patients_output.txt', output);

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

checkDoctorPatients();
