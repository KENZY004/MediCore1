const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Define schemas inline to avoid require issues if models have other dependencies
const DoctorSchema = new mongoose.Schema({}, { strict: false });
const AppointmentSchema = new mongoose.Schema({}, { strict: false });

const Doctor = mongoose.model('Doctor', DoctorSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);

const checkAppointments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find the doctor "John Doe"
        // Note: checking nested personalInfo
        const doctor = await Doctor.findOne({ 'personalInfo.firstName': 'John', 'personalInfo.lastName': 'Doe' });

        if (!doctor) {
            console.log('Doctor "John Doe" not found in DB');
            // List all doctors to help debugging
            const allDocs = await Doctor.find({});
            console.log('Available doctors:', allDocs.map(d => d.personalInfo ? `${d.personalInfo.firstName} ${d.personalInfo.lastName}` : d._id));
            return;
        }

        console.log(`Doctor Found: ${doctor.personalInfo.firstName} ${doctor.personalInfo.lastName} (ID: ${doctor._id})`);

        // Get all appointments for this doctor
        const appointments = await Appointment.find({ doctorId: doctor._id });

        console.log(`\nTotal Appointments found: ${appointments.length}`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        console.log(`\nServer "Today" range: ${today.toISOString()} to ${tomorrow.toISOString()}`);

        appointments.forEach(apt => {
            console.log(`\n- ID: ${apt._id}`);
            console.log(`  Date: ${apt.appointmentDate}`);
            console.log(`  Time: ${apt.appointmentTime}`);
            console.log(`  Status: ${apt.status}`);

            const aptDate = new Date(apt.appointmentDate);
            const isToday = aptDate >= today && aptDate < tomorrow;
            console.log(`  Is Today? ${isToday}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

checkAppointments();
