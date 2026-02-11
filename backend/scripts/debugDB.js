const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const Hospital = require('../models/Hospital');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');

        console.log('--- ADMINS ---');
        const admins = await Admin.find({});
        admins.forEach(a => console.log(`${a.email} (${a.role}) - Active: ${a.isActive}`));

        console.log('\n--- HOSPITALS ---');
        const hospitals = await Hospital.find({});
        hospitals.forEach(h => console.log(`${h.email} (${h.status}) - Active: ${h.isActive}`));

        process.exit();
    })
    .catch(err => console.error(err));
