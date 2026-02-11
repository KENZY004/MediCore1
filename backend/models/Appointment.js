const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    // Hospital Reference
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'Hospital ID is required'],
        index: true
    },

    // Patient and Doctor
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient ID is required']
    },

    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'Doctor ID is required']
    },

    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },

    // Appointment Details
    appointmentDate: {
        type: Date,
        required: [true, 'Appointment date is required']
    },

    appointmentTime: {
        type: String,
        required: [true, 'Appointment time is required']
    },

    duration: {
        type: Number,
        default: 30, // in minutes
        min: [15, 'Duration must be at least 15 minutes']
    },

    // Type and Status
    appointmentType: {
        type: String,
        enum: ['Consultation', 'Follow-up', 'Emergency', 'Checkup', 'Surgery'],
        default: 'Consultation'
    },

    status: {
        type: String,
        enum: ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'],
        default: 'Scheduled'
    },

    // Reason and Notes
    reason: {
        type: String,
        required: [true, 'Reason for appointment is required'],
        maxlength: [500, 'Reason cannot exceed 500 characters']
    },

    symptoms: [{
        type: String,
        trim: true
    }],

    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },

    // Consultation Details (filled after appointment)
    diagnosis: {
        type: String,
        maxlength: [1000, 'Diagnosis cannot exceed 1000 characters']
    },

    prescription: [{
        medicine: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String
    }],

    tests: [{
        testName: String,
        status: {
            type: String,
            enum: ['Pending', 'Completed'],
            default: 'Pending'
        }
    }],

    // Follow-up
    followUpRequired: {
        type: Boolean,
        default: false
    },

    followUpDate: {
        type: Date
    },

    // Billing
    consultationFee: {
        type: Number,
        min: [0, 'Consultation fee cannot be negative']
    },

    isPaid: {
        type: Boolean,
        default: false
    },

    // Cancellation
    cancellationReason: {
        type: String
    },

    cancelledBy: {
        type: String,
        enum: ['Patient', 'Doctor', 'Hospital']
    },

    cancelledAt: {
        type: Date
    },

    // Created by (staff member who scheduled)
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
appointmentSchema.index({ hospitalId: 1, appointmentDate: 1 });
appointmentSchema.index({ hospitalId: 1, doctorId: 1, status: 1 });
appointmentSchema.index({ hospitalId: 1, patientId: 1 });
appointmentSchema.index({ hospitalId: 1, status: 1 });

// Virtual for appointment datetime
appointmentSchema.virtual('appointmentDateTime').get(function () {
    if (!this.appointmentDate || !this.appointmentTime) return null;
    const [hours, minutes] = this.appointmentTime.split(':');
    const dateTime = new Date(this.appointmentDate);
    dateTime.setHours(parseInt(hours), parseInt(minutes));
    return dateTime;
});

// Ensure virtuals are included in JSON
appointmentSchema.set('toJSON', { virtuals: true });
appointmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
