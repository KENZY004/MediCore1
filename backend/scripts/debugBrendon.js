const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// Load env vars
dotenv.config({ path: '../.env' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://minhakenzyom23_db_user:I6ck9I7QiYyjK9zw@medicore1.rz2tqbv.mongodb.net/medicore?retryWrites=true&w=majority&appName=MediCore1';

const debug = async () => {
    try {
        await mongoose.connect(uri);

        // Find Patient Brendon
        const patient = await Patient.findOne({ firstName: { $regex: /Brendon/i } });
        if (!patient) {
            console.log(JSON.stringify({ found: false, message: "Patient Brendon not found" }));
            process.exit(0);
        }

        // Find Appointments for Brendon
        const appointments = await Appointment.find({ patientId: patient._id });

        const now = new Date();
        const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);

        // Simple console logs instead of large JSON
        console.log(`Patient: ${patient.firstName} ${patient.lastName}`);
        console.log(`Server Time: ${now.toISOString()}`);
        console.log(`Start of Today: ${startOfDay.toISOString()}`);
        console.log(`End of Today: ${endOfDay.toISOString()}`);
        console.log(`Total Appointments: ${appointments.length}`);

        appointments.forEach((app, index) => {
            console.log(`App ${index + 1}:`);
            console.log(`  Date: ${app.appointmentDate.toISOString()}`);
            console.log(`  Status: ${app.status}`);
            console.log(`  Is Today? ${app.appointmentDate >= startOfDay && app.appointmentDate <= endOfDay}`);
            console.log(`  HospitalId: ${app.hospitalId}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debug();
