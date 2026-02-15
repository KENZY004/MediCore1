const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    // Hospital Reference - CRITICAL: Patients belong to hospitals
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
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },

    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: [true, 'Gender is required']
    },

    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },

    // Contact Information
    email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },

    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },

    alternatePhone: {
        type: String,
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },

    // Address
    address: {
        street: String,
        city: String,
        state: String,
        pincode: {
            type: String,
            match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
        }
    },

    // Emergency Contact
    emergencyContact: {
        name: String,
        relationship: String,
        phone: {
            type: String,
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
        }
    },

    // Medical Information
    medicalHistory: [{
        condition: String,
        diagnosedDate: Date,
        notes: String
    }],

    allergies: [{
        type: String,
        trim: true
    }],

    currentMedications: [{
        name: String,
        dosage: String,
        frequency: String,
        startDate: Date
    }],

    // Patient ID (Hospital-specific)
    patientId: {
        type: String,
        required: true,
        unique: true
    },

    // Registration
    registrationDate: {
        type: Date,
        default: Date.now
    },

    isActive: {
        type: Boolean,
        default: true
    },

    // Additional Information
    occupation: String,

    maritalStatus: {
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'Widowed']
    },

    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    }
}, {
    timestamps: true
});

// Index for efficient querying
patientSchema.index({ hospitalId: 1, patientId: 1 });
patientSchema.index({ hospitalId: 1, phone: 1 });

// Virtual for full name
patientSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
patientSchema.virtual('age').get(function () {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Ensure virtuals are included in JSON
patientSchema.set('toJSON', { virtuals: true });
patientSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Patient', patientSchema);
