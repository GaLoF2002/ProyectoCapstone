import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "No autorizado, token no encontrado" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ msg: "No autorizado, usuario no encontrado" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error en authMiddleware:", error);
        res.status(401).json({ msg: "No autorizado, token inválido" });
    }
};

export const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ msg: "Acceso denegado, se requieren permisos de administrador" });
    }
};
