const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const testAPI = async () => {
    try {
        if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing');

        // 1. Connect to DB to get Doctor
        await mongoose.connect(process.env.MONGODB_URI);
        const doctor = await Doctor.findOne({ firstName: 'Rebecca', lastName: 'Gryffindor' });

        if (!doctor) {
            console.log('Doctor not found');
            return;
        }

        // 2. Generate Token (replicating authController.js)
        const token = jwt.sign({
            id: doctor._id,
            role: 'doctor',
            hospitalId: doctor.hospitalId
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        console.log('Generated Token for Doctor:', doctor.firstName);

        await mongoose.disconnect();

        // 3. Make API Request
        const response = await fetch('http://localhost:5000/api/doctor/patients', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('API Response Status:', response.status);
        console.log('API Response Body:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Test failed:', error);
    }
};

testAPI();
