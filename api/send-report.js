// api/send-report.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { userEmail, reportContent } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,    // Add your email here (e.g., example@gmail.com)
            pass: process.env.EMAIL_PASS     // Add your app password or email password here
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'tskv.0411@gmail.com',           // Your email to receive the report
        subject: 'DevPoint User Report',
        text: reportContent
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Report sent successfully', response: info.response });
    } catch (error) {
        console.error('Failed to send report:', error);
        res.status(500).json({ message: 'Failed to send report', error: error.message });
    }
}
