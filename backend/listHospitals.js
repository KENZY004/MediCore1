const mongoose = require('mongoose');
const Hospital = require('./models/Hospital');
require('dotenv').config();

const listHospitals = async () => {
    try {
        if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing');

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const fs = require('fs');
        let output = '';
        const log = (msg) => { output += msg + '\n'; console.log(msg); };

        const hospitals = await Hospital.find({}, 'name email registrationNumber licenseNumber');

        log(`Found ${hospitals.length} hospitals:`);
        hospitals.forEach(h => {
            log(`- ${h.name} | Email: ${h.email} | Reg: ${h.registrationNumber} | Lic: ${h.licenseNumber}`);
        });

        fs.writeFileSync('list_hospitals_output.txt', output);

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

listHospitals();
