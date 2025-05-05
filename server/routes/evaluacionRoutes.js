import express from "express";
import { crearEvaluacionCompra } from "../controllers/evaluacionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadEvaluacion } from "../config/multer.js";

const router = express.Router();

router.post("/", authMiddleware, uploadEvaluacion, crearEvaluacionCompra);


export default router;
