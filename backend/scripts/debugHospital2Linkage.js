const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');

// Load env vars
dotenv.config({ path: '../.env' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://minhakenzyom23_db_user:I6ck9I7QiYyjK9zw@medicore1.rz2tqbv.mongodb.net/medicore?retryWrites=true&w=majority&appName=MediCore1';

const debug = async () => {
    try {
        await mongoose.connect(uri);

        // 1. Find Hospital 2
        const hospital = await Hospital.findOne({ name: /hospital 2/i });

        if (!hospital) {
            console.log(JSON.stringify({ found: false, message: "Hospital 2 not found" }));
            process.exit(0);
        }

        // 2. Find Doctors linked to this ID
        const doctors = await Doctor.find({ hospitalId: hospital._id });

        // 3. Find Staff linked to this ID
        const staff = await Staff.find({ hospitalId: hospital._id });

        const result = {
            found: true,
            hospital: { name: hospital.name, id: hospital._id },
            doctors: doctors.map(d => ({
                name: `Dr. ${d.firstName} ${d.lastName}`,
                id: d._id,
                hospitalId: d.hospitalId,
                role: d.role || "Doctor (implicit)"
            })),
            staff: staff.map(s => ({
                name: `${s.firstName} ${s.lastName}`,
                role: s.role,
                id: s._id,
                hospitalId: s.hospitalId
            }))
        };

        console.log("JSON_START");
        console.log(JSON.stringify(result, null, 2));
        console.log("JSON_END");

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debug();
