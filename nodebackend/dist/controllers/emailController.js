"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAutoReply = exports.sendTestEmail = exports.sendPublicMessage = exports.sendContactMessage = void 0;
const email_1 = require("../config/email");
// Send contact message from user
const sendContactMessage = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { message, subject } = req.body;
        if (!message || message.trim().length === 0) {
            res.status(400).json({ success: false, message: 'Message cannot be empty' });
            return;
        }
        // Get user info
        const [users] = await req.app.get('pool').query('SELECT full_name, email FROM users WHERE id = ?', [userId]);
        const user = users[0];
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2C3E68;">New Contact Message from BiblioTech User</h2>
                <hr style="border-color: #5F7DB0;">
                
                <div style="margin: 20px 0;">
                    <p><strong>From:</strong> ${user.full_name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>User ID:</strong> ${userId}</p>
                    ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
                </div>
                
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
                
                <hr style="border-color: #5F7DB0;">
                <p style="color: #666; font-size: 12px;">
                    Sent from BiblioTech Library System
                </p>
            </div>
        `;
        const result = await (0, email_1.sendEmail)('bibliotech453@gmail.com', subject || `Contact from ${user.full_name}`, html);
        if (result.success) {
            res.json({
                success: true,
                message: 'Your message has been sent successfully. We will respond within 24-48 hours.'
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Failed to send message. Please try again later.'
            });
        }
    }
    catch (error) {
        console.error('Send contact message error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.sendContactMessage = sendContactMessage;
// Send email from non-logged in users (public contact)
const sendPublicMessage = async (req, res) => {
    try {
        const { name, email, message, subject } = req.body;
        if (!name || !email || !message) {
            res.status(400).json({ success: false, message: 'Name, email, and message are required' });
            return;
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ success: false, message: 'Invalid email format' });
            return;
        }
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2C3E68;">New Contact Message from BiblioTech Website</h2>
                <hr style="border-color: #5F7DB0;">
                
                <div style="margin: 20px 0;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
                </div>
                
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
                
                <hr style="border-color: #5F7DB0;">
                <p style="color: #666; font-size: 12px;">
                    Sent from BiblioTech Library Website Contact Form
                </p>
            </div>
        `;
        const result = await (0, email_1.sendEmail)('bibliotech453@gmail.com', subject || `Website Contact from ${name}`, html);
        if (result.success) {
            res.json({
                success: true,
                message: 'Your message has been sent successfully. We will respond within 24-48 hours.'
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Failed to send message. Please try again later.'
            });
        }
    }
    catch (error) {
        console.error('Send public message error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.sendPublicMessage = sendPublicMessage;
// Send test email (for admin testing)
const sendTestEmail = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const [users] = await req.app.get('pool').query('SELECT email FROM users WHERE id = ?', [userId]);
        const html = `
            <div style="font-family: Arial, sans-serif; text-align: center;">
                <h2 style="color: #2C3E68;">✅ Email Configuration Working!</h2>
                <p>This is a test email from BiblioTech Library System.</p>
                <p>Your email system is properly configured.</p>
                <hr>
                <p style="color: #666;">Sent at: ${new Date().toLocaleString()}</p>
            </div>
        `;
        const result = await (0, email_1.sendEmail)(users[0].email, 'BiblioTech - Test Email', html);
        if (result.success) {
            res.json({
                success: true,
                message: 'Test email sent successfully'
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Failed to send test email'
            });
        }
    }
    catch (error) {
        console.error('Send test email error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.sendTestEmail = sendTestEmail;
// Auto-reply to user when they send a message
const sendAutoReply = async (userEmail, userName) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #2C3E68;">Thank you for contacting BiblioTech!</h2>
            <p>Dear ${userName},</p>
            <p>We have received your message and our team will get back to you within 24-48 hours.</p>
            <br>
            <p>Best regards,</p>
            <p><strong>BiblioTech Library Team</strong></p>
            <hr>
            <p style="color: #666; font-size: 12px;">This is an automated response, please do not reply directly.</p>
        </div>
    `;
    return await (0, email_1.sendEmail)(userEmail, 'Thank you for contacting BiblioTech', html);
};
exports.sendAutoReply = sendAutoReply;
