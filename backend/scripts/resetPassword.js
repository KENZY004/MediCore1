const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Hospital = require('../models/Hospital');

const resetPassword = async () => {
    try {
        const uri = 'mongodb+srv://minhakenzyom23_db_user:I6ck9I7QiYyjK9zw@medicore1.rz2tqbv.mongodb.net/medicore?retryWrites=true&w=majority&appName=MediCore1';
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        const email = 'h1@gmail.com';
        const newPassword = 'password123';

        const hospital = await Hospital.findOne({ email });
        if (!hospital) {
            console.log('User not found');
            process.exit(1);
        }

        // Hash and save
        // Note: The pre-save hook might auto-hash if we just set it. 
        // But to be sure, let's let the pre-save hook do it by marking it modified.
        hospital.password = newPassword;
        await hospital.save();

        console.log(`Password for ${email} reset to: ${newPassword}`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

resetPassword();
