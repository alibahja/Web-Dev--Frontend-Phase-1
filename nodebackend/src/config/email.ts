import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"BiblioTech Library" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        return { success: true, info };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error };
    }
};

export default transporter;