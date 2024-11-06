// api/send-report.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { userEmail, reportContent } = req.body;

    // Check if required fields are present
    if (!userEmail || !reportContent) {
        return res.status(400).json({ error: 'Missing userEmail or reportContent' });
    }

    try {
        // Set up Nodemailer transport with environment variables
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,  // Make sure EMAIL_USER is set in Vercel environment variables
                pass: process.env.EMAIL_PASS   // Make sure EMAIL_PASS is set in Vercel environment variables
            }
        });

        const mailOptions = {
            from: userEmail,
            to: 'tskv.0411@gmail.com',       // Replace with your receiving email
            subject: 'User Report',
            text: reportContent
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
}
