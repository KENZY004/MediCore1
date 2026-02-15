const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');

const checkHospital = async () => {
    console.log('Mongo URI:', process.env.MONGO_URI ? 'Loaded' : 'Not Loaded');
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI is missing');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const hospitals = await Hospital.find({});

        console.log('--- Hospital Specializations Check ---');
        hospitals.forEach(h => {
            console.log(`Name: ${h.name}`);
            console.log(`Specializations: ${JSON.stringify(h.specializations)}`);
            console.log('-----------------------------------');
        });

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

checkHospital();
