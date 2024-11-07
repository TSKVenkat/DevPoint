import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();  // Loads .env file contents into process.env

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;  // Use PORT from .env or default to 3000

const allowedOrigins = ['https://devpointsnuc.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(express.json());

// Route to handle sending the report email
app.post('/send-report', async (req, res) => {
    console.log(req.body);
    const { userEmail, reportContent } = req.body; // Extract userEmail and reportContent from the request body
    console.log(userEmail);

    // Set up the Nodemailer transporter with Gmail configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,  // Replace with your email
            pass: process.env.EMAIL_PASS    // Replace with your email password or app password
        }
    });

    // Define the email options
    const mailOptions = {
        from: process.env.EMAIL_USER,                       // Use the user's email as the sender
        to: 'tskv.0411@gmail.com',              // Your email as the receiver
        subject: 'DevPoint User Report',                 // Subject of the report email
        text: reportContent                   // Content of the report
    };

    // Send the email and handle success or error
    try {
        const info = await transporter.sendMail(mailOptions);
        res.status(200).send('Report sent: ' + info.response); // Success response
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to send report');         // Error response
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});