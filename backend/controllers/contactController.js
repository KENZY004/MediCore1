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
        // Log configuration (without password)
        console.log('📧 Email Configuration:', {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            user: process.env.EMAIL_USER,
            from: process.env.EMAIL_FROM,
            to: process.env.ADMIN_EMAIL
        });

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

        // Verify transporter configuration
        await transporter.verify();
        console.log('✅ SMTP connection verified');

        // Email to Admin - Beautiful HTML Template
        const mailOptions = {
            from: process.env.EMAIL_FROM, // System email (what users see)
            replyTo: email, // User's email for easy reply
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Receiver (Admin)
            subject: `🏥 New Contact Form Submission from ${firstName} ${lastName}`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); padding: 40px 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: 1px; }
        .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px; }
        .content { padding: 40px 30px; }
        .info-card { background: #f8fafc; border-left: 4px solid #1976d2; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .info-row { margin: 15px 0; }
        .label { color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
        .value { color: #1e293b; font-size: 16px; font-weight: 500; }
        .message-box { background: #fff; border: 2px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .message-box p { color: #475569; line-height: 1.6; margin: 0; }
        .footer { background: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { color: #64748b; font-size: 13px; margin: 5px 0; }
        .badge { display: inline-block; background: #0066cc; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ZenoCare</h1>
            <p>New Contact Form Submission</p>
        </div>
        <div class="content">
            <p style="color: #1e293b; font-size: 16px; margin-bottom: 25px;">You have received a new inquiry from a potential client:</p>
            
            <div class="info-card">
                <div class="info-row">
                    <div class="label">Full Name</div>
                    <div class="value">${firstName} ${lastName}</div>
                </div>
                <div class="info-row">
                    <div class="label">Email Address</div>
                    <div class="value">${email}</div>
                </div>
                <div class="info-row">
                    <div class="label">Hospital / Organization</div>
                    <div class="value">${hospitalName || 'Not specified'}</div>
                </div>
            </div>

            <div class="label" style="margin-top: 30px;">Message</div>
            <div class="message-box">
                <p>${message}</p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${email}?subject=Re: Your inquiry to ZenoCare" style="display: inline-block; background: #1976d2; color: white; padding: 12px 24px; border-radius: 25px; font-size: 14px; font-weight: 600; text-decoration: none; box-shadow: 0 2px 8px rgba(25,118,210,0.3);">📧 Reply to ${firstName}</a>
            </div>
        </div>
        <div class="footer">
            <p><strong>ZenoCare Hospital Management System</strong></p>
            <p>This is an automated notification from your contact form.</p>
            <p style="margin-top: 15px; color: #94a3b8; font-size: 12px;">© ${new Date().getFullYear()} ZenoCare. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully');

        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('❌ Email send error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            command: error.command
        });
        res.status(500).json({ success: false, message: 'Email could not be sent', error: error.message });
    }
};
