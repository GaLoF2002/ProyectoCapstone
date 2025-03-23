import { sendEmail } from "./emailService.js";

const email = "destinatario@gmail.com"; // Cambia esto por tu email para probar
const subject = "Prueba de envío de correo";
const text = "Hola, esto es una prueba de recuperación de contraseña desde mi servidor Node.js.";

sendEmail(email, subject, text)
    .then((success) => {
        if (success) console.log("✅ Correo enviado correctamente");
        else console.log("❌ Fallo en el envío");
    });
