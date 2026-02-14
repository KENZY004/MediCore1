const Invoice = require('../models/Invoice');
const User = require('../models/User');

// Create new invoice
exports.createInvoice = async (req, res) => {
    try {
        const { patientName, patientId, items, status, date } = req.body;
        const hospitalId = req.user.id;

        const totalAmount = items.reduce((sum, item) => sum + Number(item.cost), 0);

        const newInvoice = new Invoice({
            hospitalId,
            patientName,
            patientId: patientId || undefined,
            items,
            totalAmount,
            status: status || 'Pending',
            date: date || Date.now()
        });

        await newInvoice.save();

        res.status(201).json({
            success: true,
            message: 'Invoice created successfully',
            data: newInvoice
        });
    } catch (error) {
        console.error("Error creating invoice:", error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Get all invoices for a hospital
exports.getInvoices = async (req, res) => {
    try {
        const hospitalId = req.user.id;
        const invoices = await Invoice.find({ hospitalId }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            data: invoices
        });
    } catch (error) {
        console.error("Error fetching invoices:", error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Update an invoice
exports.updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const invoice = await Invoice.findOneAndUpdate(
            { _id: id, hospitalId: req.user.id },
            updates,
            { new: true }
        );

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Invoice updated',
            data: invoice
        });
    } catch (error) {
        console.error("Error updating invoice:", error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Delete an invoice
exports.deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findOneAndDelete({ _id: id, hospitalId: req.user.id });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Invoice deleted'
        });
    } catch (error) {
        console.error("Error deleting invoice:", error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
