const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    // Hospital Reference
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'Hospital ID is required'],
        index: true
    },

    // Department Information
    name: {
        type: String,
        required: [true, 'Department name is required'],
        trim: true,
        maxlength: [100, 'Department name cannot exceed 100 characters']
    },

    code: {
        type: String,
        required: [true, 'Department code is required'],
        uppercase: true,
        trim: true
    },

    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Head of Department
    headOfDepartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },

    // Contact Information
    phone: {
        type: String,
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },

    email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },

    // Location
    floor: {
        type: String
    },

    building: {
        type: String
    },

    // Resources
    totalBeds: {
        type: Number,
        min: [0, 'Total beds cannot be negative'],
        default: 0
    },

    availableBeds: {
        type: Number,
        min: [0, 'Available beds cannot be negative'],
        default: 0
    },

    // Status
    isActive: {
        type: Boolean,
        default: true
    },

    establishedDate: {
        type: Date,
        default: Date.now
    },

    // Services offered
    services: [{
        type: String,
        trim: true
    }],

    // Equipment
    equipment: [{
        name: String,
        quantity: Number,
        condition: {
            type: String,
            enum: ['Excellent', 'Good', 'Fair', 'Needs Repair']
        }
    }]
}, {
    timestamps: true
});

// Index for efficient querying
departmentSchema.index({ hospitalId: 1, code: 1 }, { unique: true });
departmentSchema.index({ hospitalId: 1, isActive: 1 });

// Virtual for bed occupancy rate
departmentSchema.virtual('occupancyRate').get(function () {
    if (this.totalBeds === 0) return 0;
    const occupiedBeds = this.totalBeds - this.availableBeds;
    return ((occupiedBeds / this.totalBeds) * 100).toFixed(2);
});

// Ensure virtuals are included in JSON
departmentSchema.set('toJSON', { virtuals: true });
departmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Department', departmentSchema);
