const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// Load env vars
dotenv.config({ path: '../.env' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://minhakenzyom23_db_user:I6ck9I7QiYyjK9zw@medicore1.rz2tqbv.mongodb.net/medicore?retryWrites=true&w=majority&appName=MediCore1';

const debug = async () => {
    try {
        await mongoose.connect(uri);

        const patient = await Patient.findOne({ firstName: { $regex: /Brendon/i } });

        if (!patient) {
            fs.writeFileSync('debug_output.json', JSON.stringify({ error: "Patient Brendon not found" }));
            process.exit(0);
        }

        const appointments = await Appointment.find({ patientId: patient._id });

        const now = new Date();
        const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);

        const result = {
            serverTime: now.toString(),
            startOfDay: startOfDay.toString(),
            endOfDay: endOfDay.toString(),
            appointments: appointments.map(app => ({
                id: app._id,
                date: app.appointmentDate, // This will be ISO string in JSON
                dateLocal: new Date(app.appointmentDate).toString(),
                status: app.status,
                hospitalId: app.hospitalId,
                matchToday: app.appointmentDate >= startOfDay && app.appointmentDate <= endOfDay
            }))
        };

        fs.writeFileSync('debug_output.json', JSON.stringify(result, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debug();
