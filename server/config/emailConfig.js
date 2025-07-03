import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config(); // ✅ Asegura que se carguen las variables en este archivo


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Verifica si las variables de entorno se cargaron
console.log(">>> GMAIL_USER:", process.env.GMAIL_USER);
console.log(">>> GMAIL_PASS:", process.env.GMAIL_PASS); // solo para pruebas locales

export const sendEmail = async (to, subject, html) => {
    await transporter.sendMail({
        from: `"Tu App" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html
    });

    console.log(`✅ Correo enviado a: ${to}`);
};
