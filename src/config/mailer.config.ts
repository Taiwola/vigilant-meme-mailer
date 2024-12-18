import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';
const { createTransport } = nodemailer;

export const transporter = createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});



export const verifyTransporter = async () => await transporter.verify();

export const sendMail = async (mailOptions: any) => await transporter.sendMail(mailOptions);

