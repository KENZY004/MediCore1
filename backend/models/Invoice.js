const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: false // Optional if invoice is for a walk-in or non-registered component
    },
    patientName: {
        type: String,
        required: true
    },
    items: [{
        description: {
            type: String,
            required: true
        },
        cost: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Cancelled'],
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
