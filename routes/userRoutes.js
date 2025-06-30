import express from "express";
import { obtenerPerfil, actualizarPerfil } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Ruta para obtener el perfil
router.get("/profile", authMiddleware, obtenerPerfil);

// Ruta para actualizar el perfil
router.post("/profile", authMiddleware, actualizarPerfil);

export default router;
