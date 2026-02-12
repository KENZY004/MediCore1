const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');

const uri = 'mongodb+srv://minhakenzyom23_db_user:I6ck9I7QiYyjK9zw@medicore1.rz2tqbv.mongodb.net/medicore?retryWrites=true&w=majority&appName=MediCore1';

const checkUsers = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const hospital = await Hospital.findOne({ email: 'h1@gmail.com' });
        console.log('Hospital found:', !!hospital, hospital ? hospital.email : '');

        const doctor = await Doctor.findOne({ email: 'doctor@gmail.com' });
        console.log('Doctor found:', !!doctor, doctor ? doctor.email : '');

        const receptionist = await Staff.findOne({ email: 'recep@gmail.com' });
        console.log('Receptionist found:', !!receptionist, receptionist ? receptionist.email : '');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUsers();
