const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');
const Admin = require('../models/Admin');


const checkUser = async () => {
    try {
        const uri = 'mongodb+srv://minhakenzyom23_db_user:I6ck9I7QiYyjK9zw@medicore1.rz2tqbv.mongodb.net/medicore?retryWrites=true&w=majority&appName=MediCore1';
        console.log('Connecting to URI...');
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        const email = 'h1@gmail.com';
        console.log(`Checking for ${email}...`);

        const hospital = await Hospital.findOne({ email }).select('+password');
        if (hospital) {
            console.log('Found in Hospital:', hospital.email);
            console.log('Role:', hospital.role);

            const isMatch = await bcrypt.compare('password', hospital.password);
            console.log('Password "password" match:', isMatch);

            const isMatch123 = await bcrypt.compare('password123', hospital.password);
            console.log('Password "password123" match:', isMatch123);
        } else {
            console.log('Not found in Hospital collection');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUser();
