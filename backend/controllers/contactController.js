const nodemailer = require('nodemailer');

// @desc    Send contact email
// @route   POST /api/contact
// @access  Public
exports.sendContactEmail = async (req, res) => {
    const { firstName, lastName, email, hospitalName, message } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    try {
        // Create transporter
        // Note: In production, use environment variables for credentials
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Email to Admin
        const mailOptions = {
            from: `"${firstName} ${lastName}" <${email}>`, // Sender address
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Receiver (Admin)
            subject: `New Contact Form Submission from ${firstName} ${lastName}`,
            html: `
                <h3>New Contact Request</h3>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Hospital/Org:</strong> ${hospitalName || 'N/A'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).json({ success: false, message: 'Email could not be sent', error: error.message });
    }
};
