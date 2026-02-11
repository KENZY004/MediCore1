const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    // Hospital Reference
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

    // Employment Information
    employeeId: {
        type: String,
        required: [true, 'Employee ID is required'],
        unique: true
    },

    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: [
            'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician',
            'Radiologist', 'Physiotherapist', 'Accountant', 'IT Staff',
            'Security', 'Housekeeping', 'Administrative Staff', 'Other'
        ]
    },

    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },

    qualification: {
        type: String
    },

    experience: {
        type: Number,
        min: [0, 'Experience cannot be negative']
    },

    // Employment Details
    joiningDate: {
        type: Date,
        required: [true, 'Joining date is required'],
        default: Date.now
    },

    employmentType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Temporary'],
        default: 'Full-time'
    },

    salary: {
        type: Number,
        min: [0, 'Salary cannot be negative']
    },

    // Schedule
    shift: {
        type: String,
        enum: ['Morning', 'Evening', 'Night', 'Rotating']
    },

    workingDays: [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],

    // Status
    isActive: {
        type: Boolean,
        default: true
    },

    // Contact Information
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

    // Additional Information
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },

    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    }
}, {
    timestamps: true
});

// Index for efficient querying
staffSchema.index({ hospitalId: 1, role: 1 });
staffSchema.index({ hospitalId: 1, isActive: 1 });
staffSchema.index({ hospitalId: 1, departmentId: 1 });

// Virtual for full name
staffSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
staffSchema.set('toJSON', { virtuals: true });
staffSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Staff', staffSchema);
