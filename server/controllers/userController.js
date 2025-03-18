import User from "../models/User.js";
import bcrypt from "bcryptjs";


export const obtenerPerfil = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        res.status(500).json({ error: "Error al obtener el perfil" });
    }
};

// Actualizar perfil del usuario
export const actualizarPerfil = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Actualizar los campos si se envían
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ message: "Perfil actualizado correctamente" });

    } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        res.status(500).json({ error: "Error al actualizar el perfil" });
    }
};
