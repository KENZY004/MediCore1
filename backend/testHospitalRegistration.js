const mongoose = require('mongoose');
const Hospital = require('./models/Hospital');
require('dotenv').config();

const testRegistration = async () => {
    try {
        if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing');

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Data from screenshot/user request context
        const testData = {
            name: 'Hospital 2',
            registrationNumber: '12456320',
            licenseNumber: 'LIC-TEST-002', // Assuming this might be the conflict or just a placeholder
            email: 'hospital2@example.com', // Need to guess or use a temp one to test duplications
            password: 'password123',
            phone: '1234567890',
            address: {
                street: '123 Test St',
                city: 'Test City',
                state: 'Test State',
                pincode: '123456'
            },
            adminContact: {
                name: 'Admin Test',
                email: 'admin@hospital2.com',
                phone: '0987654321',
                designation: 'Admin'
            },
            type: 'Government',
            totalBeds: 100,
            specializations: ['Cardiology'],
            website: 'www.hospital2.com',
            description: 'Test Hospital'
        };

        // 1. Check for existing conflicts manually first
        const existingEmail = await Hospital.findOne({ email: testData.email });
        if (existingEmail) console.log(`Conflict: Email ${testData.email} already exists.`);

        const existingReg = await Hospital.findOne({ registrationNumber: testData.registrationNumber });
        if (existingReg) console.log(`Conflict: Registration Number ${testData.registrationNumber} already exists.`);

        // 2. Attempt Registration (Simulate Controller Logic)
        const existingHospital = await Hospital.findOne({
            $or: [
                { email: testData.email },
                { registrationNumber: testData.registrationNumber },
                { licenseNumber: testData.licenseNumber }
            ]
        });

        if (existingHospital) {
            console.log('Controller would return 400: Hospital with this email, registration number, or license number already exists');
            console.log('Existing Hospital Details:', existingHospital.name, existingHospital.email, existingHospital.registrationNumber);
        } else {
            console.log('No conflict found with these details. Logic should proceed.');
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

testRegistration();
