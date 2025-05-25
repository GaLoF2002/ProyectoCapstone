// routes/indicadoresRoutes.js
import express from "express";
import { obtenerIndicadores, obtenerEstadisticasPorPropiedad } from "../controllers/indicadoresController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, obtenerIndicadores);

// Obtener estadísticas por propiedad
router.get("/propiedadIndicador/:propiedadId", authMiddleware, obtenerEstadisticasPorPropiedad);

export default router;
