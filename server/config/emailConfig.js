import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables de entorno desde el archivo .env

// Configurar el transporte de correo
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER, // Tu correo Gmail
        pass: process.env.GMAIL_PASS, // La contraseña de aplicación de Gmail
    },
});

export default transporter;
