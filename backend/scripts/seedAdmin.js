const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

const seedAdmin = async () => {
    try {
        const adminEmail = 'kenznajeeb@gmail.com';
        const adminPassword = 'admin123'; // Initial password

        // Check if admin exists
        const adminExists = await Admin.findOne({ email: adminEmail });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        // Create admin
        await Admin.create({
            name: 'Kenz Najeeb',
            email: adminEmail,
            password: adminPassword,
            role: 'super_admin',
            phone: '0000000000',
            isActive: true
        });

        console.log('Admin user created successfully');
        console.log(`Email: ${adminEmail}`);
        console.log('Password: (hidden)');

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
