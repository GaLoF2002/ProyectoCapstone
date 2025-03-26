import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {sendEmail} from '../config/emailConfig.js';


export const register = async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const assignedRole = role || "cliente";
        const user = new User({ name, email, password: hashedPassword, phone, role: assignedRole });
        await user.save();

        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error en el registro" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Expira en 7 día
        );

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: "Error en el inicio de sesión" });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ msg: "Si el email existe, se ha enviado un correo." });
        }

        const token = crypto.randomBytes(20).toString("hex");

        // ✅ SOLO actualiza campos existentes (sin crear usuario)
        user.resetToken = token;
        user.resetTokenExpires = Date.now() + 3600000; // 1 hora
        await user.save({ validateBeforeSave: false }); // 👈 evita validar campos como phone o role

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        const html = `
            <p>Has solicitado restablecer tu contraseña</p>
            <p>Haz clic en el siguiente enlace:</p>
            <a href="${resetUrl}">Restablecer contraseña</a>
        `;

        await sendEmail(user.email, "Recuperar contraseña", html);
        res.status(200).json({ msg: "Si el email existe, se ha enviado un correo." });

    } catch (error) {
        console.error("Error en forgotPassword:", error);
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
};



export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: "Token inválido o expirado" });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = null;
        user.resetTokenExpires = null;

        await user.save();
        res.json({ msg: "Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la contraseña" });
    }
};


