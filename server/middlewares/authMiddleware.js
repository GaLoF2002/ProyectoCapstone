import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Verificar que el encabezado de autorización exista y sea correcto
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "No autorizado, token no encontrado o malformado" });
        }

        // Extraer el token del encabezado
        const token = authHeader.split(" ")[1];

        // Verificar que la clave secreta esté definida
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ msg: "Error interno: JWT_SECRET no definido en el entorno" });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar el usuario en la base de datos
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ msg: "No autorizado, usuario no encontrado" });
        }

        // Asignar el usuario a la solicitud
        req.user = user;
        next();
    } catch (error) {
        console.error("Error en authMiddleware:", error);

        // Manejo específico para token expirado
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "Token expirado, inicia sesión nuevamente" });
        }

        // Para cualquier otro error relacionado con el token
        res.status(401).json({ msg: "No autorizado, token inválido" });
    }
};

// Middleware para verificar si el usuario es administrador
export const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ msg: "Acceso denegado, se requieren permisos de administrador" });
    }
};
