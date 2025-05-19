import express from "express";
import { registrarVisita } from "../controllers/visitaController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/registrar/:propiedadId", authMiddleware, registrarVisita);

export default router;
