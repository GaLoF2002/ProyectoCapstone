// routes/indicadoresRoutes.js
import express from "express";
import { obtenerIndicadores } from "../controllers/indicadoresController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, obtenerIndicadores);

export default router;
