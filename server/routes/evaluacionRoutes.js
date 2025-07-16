import express from "express";
import {
    crearEvaluacionCompra,
    obtenerEvaluacionesPorPropiedad,
    simularFinanciamiento,
    obtenerEvaluacionPorId
} from "../controllers/evaluacionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadEvaluacion } from "../config/multer.js";

const router = express.Router();

// ✅ Ruta clara para crear evaluación de compra con documentos PDF
router.post("/evaluacion-compra", authMiddleware, uploadEvaluacion, crearEvaluacionCompra);

// ✅ Ruta clara para obtener evaluaciones por ID de propiedad
router.get("/evaluacion-compra/por-propiedad/:propiedadId", authMiddleware, obtenerEvaluacionesPorPropiedad);

// ✅ Ruta clara para simular financiamiento
router.post("/simular-financiamiento", authMiddleware, simularFinanciamiento);


router.get("/evaluacion-detalle/:evaluacionId", authMiddleware, obtenerEvaluacionPorId);


export default router;
