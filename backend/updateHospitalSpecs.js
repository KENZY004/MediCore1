const mongoose = require('mongoose');
const Hospital = require('./models/Hospital');
require('dotenv').config();

const updateSpecs = async () => {
    try {
        if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing');

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const hospitalId = '698decd9201a20530893ba2f'; // h1@gmail.com
        const specs = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Surgery', 'Dermatology'];

        const result = await Hospital.findByIdAndUpdate(
            hospitalId,
            { specializations: specs },
            { new: true }
        );

        if (result) {
            console.log(`Updated hospital: ${result.name}`);
            console.log(`New Specializations: ${JSON.stringify(result.specializations)}`);
        } else {
            console.log('Hospital not found');
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

updateSpecs();
