// routes/interesRoutes.js
import express from "express";
import { marcarInteres, obtenerInteresesPorCliente } from "../controllers/interesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/marcar-interes", authMiddleware, marcarInteres);
router.get("/mis-intereses", authMiddleware, obtenerInteresesPorCliente);

export default router;
