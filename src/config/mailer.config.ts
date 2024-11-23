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
    debug: true,
    logger: true,
});

console.log("MAIL_USERNAME:", process.env.MAIL_USERNAME);
console.log("MAIL_PASSWORD:", process.env.MAIL_PASSWORD ? "Loaded" : "Not Loaded");



export const verifyTransporter = async () => await transporter.verify();

export const sendMail = async (mailOptions: any) => await transporter.sendMail(mailOptions);

