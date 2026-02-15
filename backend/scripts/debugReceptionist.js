const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Define schemas inline
const PatientSchema = new mongoose.Schema({}, { strict: false });
const StaffSchema = new mongoose.Schema({}, { strict: false });
const HospitalSchema = new mongoose.Schema({}, { strict: false });

const Patient = mongoose.model('Patient', PatientSchema);
const Staff = mongoose.model('Staff', StaffSchema);
const Hospital = mongoose.model('Hospital', HospitalSchema);

const checkReceptionistView = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Find the Receptionist "Alice Smith"
        const receptionist = await Staff.findOne({ 'personalInfo.firstName': 'Alice', 'personalInfo.lastName': 'Smith' });

        if (!receptionist) {
            console.log('Receptionist "Alice Smith" not found');
            return;
        }

        console.log(`\nReceptionist: ${receptionist.personalInfo.firstName} ${receptionist.personalInfo.lastName}`);
        console.log(`Role: ${receptionist.role}`);
        console.log(`Hospital ID (from DB): ${receptionist.hospitalId}`);

        // 2. Simulate what happens in Auth Middleware (decoding token - partial simulation)
        // We assume the token was created with this user's ID and HospitalID.
        // Let's check if the hospital ID in the user document matches what we expect for patients.

        // 3. Find Patients for this Hospital
        const patients = await Patient.find({ hospitalId: receptionist.hospitalId });
        console.log(`\nTotal Patients found for Hospital ID ${receptionist.hospitalId}: ${patients.length}`);

        patients.forEach(p => {
            console.log(`- ${p.firstName} ${p.lastName} (Phone: ${p.phone})`);
        });

        // 4. Test Search Logic
        const searchQuery = "Ali"; // Example search
        console.log(`\nTesting search for "${searchQuery}"...`);

        const searchResults = await Patient.find({
            hospitalId: receptionist.hospitalId,
            $or: [
                { firstName: { $regex: searchQuery, $options: 'i' } },
                { lastName: { $regex: searchQuery, $options: 'i' } },
                { phone: { $regex: searchQuery, $options: 'i' } }
            ]
        });

        console.log(`Search Results: ${searchResults.length}`);
        searchResults.forEach(p => console.log(`- Found: ${p.firstName} ${p.lastName}`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

checkReceptionistView();
