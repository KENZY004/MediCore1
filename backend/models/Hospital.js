const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const hospitalSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, 'Hospital name is required'],
        trim: true,
        maxlength: [100, 'Hospital name cannot exceed 100 characters']
    },

    registrationNumber: {
        type: String,
        required: [true, 'Registration number is required'],
        unique: true,
        trim: true
    },

    licenseNumber: {
        type: String,
        required: [true, 'License number is required'],
        unique: true,
        trim: true
    },

    // Contact Information
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },

    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },

    // Address
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        state: {
            type: String,
            required: [true, 'State is required']
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
            match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
        }
    },

    // Admin Contact Person
    adminContact: {
        name: {
            type: String,
            required: [true, 'Admin contact name is required']
        },
        email: {
            type: String,
            required: [true, 'Admin contact email is required'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
        },
        phone: {
            type: String,
            required: [true, 'Admin contact phone is required'],
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
        },
        designation: {
            type: String,
            default: 'Hospital Administrator'
        }
    },

    // Hospital Details
    type: {
        type: String,
        enum: ['Government', 'Private', 'Semi-Government', 'Trust'],
        default: 'Private'
    },

    totalBeds: {
        type: Number,
        min: [1, 'Hospital must have at least 1 bed']
    },

    specializations: [{
        type: String,
        enum: [
            'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
            'Gynecology', 'Dermatology', 'ENT', 'Ophthalmology',
            'General Medicine', 'Surgery', 'Emergency', 'ICU'
        ]
    }],

    // Status and Approval
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending'
    },

    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },

    approvedAt: {
        type: Date
    },

    rejectionReason: {
        type: String
    },

    // Subscription/Account Status
    isActive: {
        type: Boolean,
        default: true
    },

    // Additional Information
    website: {
        type: String,
        trim: true
    },

    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    }
}, {
    timestamps: true
});

// Hash password before saving
hospitalSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
hospitalSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
hospitalSchema.methods.getPublicProfile = function () {
    const hospital = this.toObject();
    delete hospital.password;
    return hospital;
};

module.exports = mongoose.model('Hospital', hospitalSchema);
