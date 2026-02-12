const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedUsers = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.log('MONGO_URI not found in env, using fallback...');
        }
        const uri = 'mongodb+srv://minhakenzyom23_db_user:I6ck9I7QiYyjK9zw@medicore1.rz2tqbv.mongodb.net/medicore?retryWrites=true&w=majority&appName=MediCore1';
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        // 1. Create Hospital Admin
        const hospitalEmail = 'h1@gmail.com';
        const hospitalPassword = 'h112345'; // Updated to meet min length of 6

        let hospital = await Hospital.findOne({ email: hospitalEmail });
        if (hospital) {
            console.log('Hospital already exists, updating password...');
            hospital.password = hospitalPassword; // Will be hashed by pre-save hook
            hospital.status = 'approved';
            await hospital.save();
        } else {
            console.log('Creating Hospital...');
            hospital = await Hospital.create({
                name: 'City General Hospital',
                email: hospitalEmail,
                password: hospitalPassword,
                phone: '1234567890',
                address: {
                    street: '123 Health St',
                    city: 'Metropolis',
                    state: 'NY',
                    pincode: '100001' // Changed from zipCode to pincode (6 digits) and key name
                },
                adminContact: {
                    name: 'Admin One',
                    phone: '1234567890',
                    email: hospitalEmail,
                    designation: 'Administrator'
                },
                type: 'Private', // Changed from General to Private
                totalBeds: 100,
                status: 'approved',
                registrationNumber: 'REG_H1_VERIFY_' + new Date().getTime(), // Ensure unique
                licenseNumber: 'LIC_H1_VERIFY_' + new Date().getTime() // Ensure unique
            });
        }
        console.log(`Hospital '${hospital.name}' ready. Email: ${hospitalEmail}`);

        // 2. Create Doctor
        const doctorEmail = 'doctor@gmail.com';
        const doctorPassword = 'doctor123';

        let doctor = await Doctor.findOne({ email: doctorEmail });
        if (doctor) {
            console.log('Doctor already exists, updating password...');
            doctor.password = doctorPassword;
            doctor.hospitalId = hospital._id;
            await doctor.save();
        } else {
            console.log('Creating Doctor...');
            doctor = await Doctor.create({
                hospitalId: hospital._id,
                firstName: 'John',
                lastName: 'Doe',
                email: doctorEmail,
                phone: '9876543210',
                password: doctorPassword,
                specialization: 'Cardiology',
                qualification: 'MD',
                experience: 10,
                consultationFee: 100,
                licenseNumber: 'DOC_LIC_' + new Date().getTime(), // Added required field
                availability: [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }], // Schema might differ, checking defaults
                departmentId: new mongoose.Types.ObjectId() // Placeholder if required, or remove if not
            });
        }
        console.log(`Doctor '${doctor.firstName}' ready. Email: ${doctorEmail}`);

        // 3. Create Receptionist (Staff)
        const recepEmail = 'recep@gmail.com';
        const recepPassword = 'recep123';

        let receptionist = await Staff.findOne({ email: recepEmail });
        if (receptionist) {
            console.log('Receptionist already exists, updating password...');
            receptionist.password = recepPassword;
            receptionist.hospitalId = hospital._id;
            receptionist.role = 'Receptionist';
            await receptionist.save();
        } else {
            console.log('Creating Receptionist...');
            receptionist = await Staff.create({
                hospitalId: hospital._id,
                firstName: 'Alice',
                lastName: 'Smith',
                email: recepEmail,
                phone: '1122334455',
                password: recepPassword,
                role: 'Receptionist',
                employeeId: 'REC001',
                joiningDate: new Date(),
                salary: 30000
            });
        }
        console.log(`Receptionist '${receptionist.firstName}' ready. Email: ${recepEmail}`);

        console.log('--- SEEDING COMPLETE ---');
        console.log('You can now log in with the verified credentials.');
        process.exit();

    } catch (error) {
        console.error('Seeding Error:', error.message);
        if (error.code === 11000) {
            console.error('Duplicate Key Error:', error.keyValue);
            console.log('User likely already exists with these details.');
        }
        process.exit(1);
    }
};

seedUsers();
