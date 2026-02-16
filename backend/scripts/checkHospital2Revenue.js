const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');

// Load env vars
dotenv.config({ path: '../.env' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://minhakenzyom23_db_user:I6ck9I7QiYyjK9zw@medicore1.rz2tqbv.mongodb.net/medicore?retryWrites=true&w=majority&appName=MediCore1';

const check = async () => {
    try {
        await mongoose.connect(uri);

        const hospital = await Hospital.findOne({ name: /hospital 2/i });
        if (!hospital) {
            console.log("Hospital 2 not found");
            process.exit(0);
        }

        const completedApps = await Appointment.find({
            hospitalId: hospital._id,
            status: 'Completed'
        });

        console.log(`Hospital 2 (${hospital.name})`);
        console.log(`Completed Appointments: ${completedApps.length}`);

        let totalFee = 0;
        completedApps.forEach(app => {
            console.log(` - Appt ID: ${app._id}, Fee: ${app.consultationFee}`);
            totalFee += (app.consultationFee || 0);
        });

        console.log(`Calculated Total Revenue: ${totalFee}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

check();
