const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedHospital = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const testHospital = {
            hospitalName: 'City General Hospital',
            name: 'City General Hospital', // Hospital schema uses 'name', not 'hospitalName'
            email: 'test@hospital.com',
            registrationNumber: 'REG123456',
            licenseNumber: 'LIC987654',
            password: 'password123',
            passwordConfirm: 'password123',
            phone: '1234567890',
            address: {
                street: '123 Medical drive',
                city: 'Metropolis',
                state: 'NY',
                pincode: '123456'
            },
            adminContact: {
                name: 'John Doe',
                phone: '0987654321',
                email: 'john@test.com'
            },
            type: 'Private',
            totalBeds: 500,
            specializations: ['Cardiology', 'Neurology'],
            status: 'approved' // IMPORTANT: Must be approved to login
        };

        // Check if exists
        const existing = await Hospital.findOne({ email: testHospital.email });
        if (existing) {
            console.log('Test hospital already exists. Updating to ensure it is approved...');
            existing.status = 'approved';
            existing.password = 'password123'; // Reset password to be sure (will be hashed by pre-save if modified, but might need manual handling if using findOneAndUpdate. better to use save)
            // Actually, if I update via save, the pre-save hook might re-hash.
            // Let's just delete and recreate to be 100% sure of the password.
            await Hospital.deleteOne({ _id: existing._id });
            console.log('Existing deleted.');
        }

        const newHospital = new Hospital(testHospital);
        await newHospital.save();

        console.log('Test Hospital Created Successfully!');
        console.log('Email: test@hospital.com');
        console.log('Password: password123');

        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding hospital:', error);
        process.exit(1);
    }
};

seedHospital();
