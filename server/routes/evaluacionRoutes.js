import express from "express";
import {
    crearEvaluacionCompra,
    obtenerEvaluacionesPorPropiedad
} from "../controllers/evaluacionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadEvaluacion } from "../config/multer.js";

const router = express.Router();

// Ruta para crear evaluación de compra
router.post("/compra", authMiddleware, uploadEvaluacion, crearEvaluacionCompra);

// Ruta para obtener evaluaciones por propiedad
router.get("/compra/:propiedadId", authMiddleware, obtenerEvaluacionesPorPropiedad);

export default router;
