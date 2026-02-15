const mongoose = require('mongoose');
const Hospital = require('./models/Hospital');
require('dotenv').config();
const fs = require('fs');

const checkHospital = async () => {
    try {
        if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing');

        await mongoose.connect(process.env.MONGODB_URI);

        const hospitals = await Hospital.find({});

        let output = '--- All Hospitals Check ---\n';
        hospitals.forEach(h => {
            output += `ID: ${h._id}\n`;
            output += `Name: ${h.name}\n`;
            output += `Email: ${h.email}\n`;
            output += `Spec Count: ${h.specializations ? h.specializations.length : 0}\n`;
            output += `Specializations: ${JSON.stringify(h.specializations)}\n`;
            output += '-----------------------------------\n';
        });

        fs.writeFileSync('specs_output.txt', output);
        console.log('Output written to specs_output.txt');

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

checkHospital();
