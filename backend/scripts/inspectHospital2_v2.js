const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment'); // Assuming model exists

// Load env vars
dotenv.config({ path: '../.env' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://minhakenzyom23_db_user:I6ck9I7QiYyjK9zw@medicore1.rz2tqbv.mongodb.net/medicore?retryWrites=true&w=majority&appName=MediCore1';

const inspect = async () => {
    try {
        await mongoose.connect(uri);

        // Search by name logic from first script
        const hospital = await Hospital.findOne({ name: /hospital 2/i });

        if (!hospital) {
            console.log(JSON.stringify({ found: false, message: "Hospital with name matching 'Hospital 2' not found" }));
            process.exit(0);
        }

        const counts = {
            found: true,
            hospital: { name: hospital.name, email: hospital.email, id: hospital._id },
            doctors: await Doctor.countDocuments({ hospitalId: hospital._id }),
            staff: await Staff.countDocuments({ hospitalId: hospital._id }),
            appointments: await Appointment.countDocuments({ hospitalId: hospital._id }),
        };

        console.log("JSON_START");
        console.log(JSON.stringify(counts, null, 2));
        console.log("JSON_END");

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

inspect();
