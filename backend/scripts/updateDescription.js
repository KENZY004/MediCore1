const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Hospital = require('../models/Hospital');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const updateDescription = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const email = 'h1@gmail.com';
        const description = 'H1 is a healthcare facility focused on delivering quality medical services with efficient patient care and hospital management.';

        const hospital = await Hospital.findOneAndUpdate(
            { email },
            { description },
            { new: true }
        );

        if (hospital) {
            console.log(`Updated description for ${hospital.name}`);
            console.log('New Description:', hospital.description);
        } else {
            console.log(`Hospital with email ${email} not found.`);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateDescription();
