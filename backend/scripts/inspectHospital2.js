const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');
const Patient = require('../models/Patient');
// const Appointment = require('../models/Appointment'); // If model exists

// Load env vars
dotenv.config({ path: '../.env' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://minhakenzyom23_db_user:I6ck9I7QiYyjK9zw@medicore1.rz2tqbv.mongodb.net/medicore?retryWrites=true&w=majority&appName=MediCore1';

const inspect = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        // Regex search for "Hospital 2" or close to it
        const hospitals = await Hospital.find({ name: /hospital 2/i });

        if (hospitals.length === 0) {
            console.log('No hospital found with name matching "Hospital 2"');
            console.log('All hospitals:', await Hospital.find({}, 'name email'));
        } else {
            for (const h of hospitals) {
                console.log(`\nFound Hospital: ${h.name} (${h._id})`);
                console.log(`Email: ${h.email}`);

                const doctorCount = await Doctor.countDocuments({ hospitalId: h._id });
                console.log(`Doctors: ${doctorCount}`);

                const staffCount = await Staff.countDocuments({ hospitalId: h._id });
                console.log(`Staff: ${staffCount}`);

                // Patients might not be linked to hospital directly if they are global? 
                // Need to check schema. Usually patients are registered globally but maybe linked via appointments.
                // Or maybe they are linked if created by hospital.
                // Let's check Patient schema... it usually doesn't have hospitalId unless strictly private.
                // But let's check if there is a field.
                const patientCount = await Patient.countDocuments({});
                console.log(`Total Patients in System: ${patientCount}`);

                // Check if appointments exist
                try {
                    const Appointment = require('../models/Appointment');
                    const appointmentCount = await Appointment.countDocuments({ hospitalId: h._id });
                    console.log(`Appointments: ${appointmentCount}`);
                } catch (e) {
                    console.log('Address model check skipped or failed');
                }
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

inspect();
