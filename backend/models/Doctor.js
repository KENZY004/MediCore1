const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    // Hospital Reference - CRITICAL: Doctors belong to hospitals
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'Hospital ID is required'],
        index: true
    },

    // Personal Information
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },

    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },

    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },

    dateOfBirth: {
        type: Date
    },

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },

    // Professional Information
    specialization: {
        type: String,
        required: [true, 'Specialization is required'],
        enum: [
            'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
            'Gynecology', 'Dermatology', 'ENT', 'Ophthalmology',
            'General Medicine', 'Surgery', 'Emergency', 'Anesthesiology',
            'Radiology', 'Pathology', 'Psychiatry', 'Dentistry'
        ]
    },

    qualification: {
        type: String,
        required: [true, 'Qualification is required']
    },

    experience: {
        type: Number,
        min: [0, 'Experience cannot be negative'],
        required: [true, 'Years of experience is required']
    },

    licenseNumber: {
        type: String,
        required: [true, 'Medical license number is required'],
        unique: true
    },

    // Department
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },

    // Schedule
    schedule: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        startTime: String, // Format: "09:00"
        endTime: String,   // Format: "17:00"
        isAvailable: {
            type: Boolean,
            default: true
        }
    }],

    // Consultation
    consultationFee: {
        type: Number,
        min: [0, 'Consultation fee cannot be negative']
    },

    consultationDuration: {
        type: Number,
        default: 30, // in minutes
        min: [15, 'Consultation duration must be at least 15 minutes']
    },

    // Status
    isActive: {
        type: Boolean,
        default: true
    },

    joiningDate: {
        type: Date,
        default: Date.now
    },

    // Additional Information
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },

    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },

    awards: [{
        type: String
    }],

    languages: [{
        type: String
    }]
}, {
    timestamps: true
});

// Index for efficient querying
doctorSchema.index({ hospitalId: 1, specialization: 1 });
doctorSchema.index({ hospitalId: 1, isActive: 1 });

// Virtual for full name
doctorSchema.virtual('fullName').get(function () {
    return `Dr. ${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
doctorSchema.set('toJSON', { virtuals: true });
doctorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Doctor', doctorSchema);
