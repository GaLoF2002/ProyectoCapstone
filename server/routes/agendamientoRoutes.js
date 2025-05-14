import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
    crearCita,
    obtenerMisCitas,
    cambiarEstadoCita,
    eliminarCita,
    reagendarCita
} from '../controllers/citaController.js';

import {
    crearDisponibilidad,
    obtenerDisponibilidadPorVendedor
} from '../controllers/disponibilidadController.js';

const router = express.Router();

// ========== DISPONIBILIDAD ========== //

// Crear disponibilidad del vendedor (solo usuarios autenticados)
router.post('/disponibilidad', authMiddleware, crearDisponibilidad);

// Obtener disponibilidad de un vendedor por ID
router.get('/disponibilidad/:vendedorId', authMiddleware, obtenerDisponibilidadPorVendedor);


// ========== CITAS ========== //

// Crear una cita (cliente)
router.post('/citas', authMiddleware, crearCita);

// Obtener todas las citas del usuario autenticado (cliente o vendedor)
router.get('/citas', authMiddleware, obtenerMisCitas);

// Cambiar el estado de una cita (aceptada / cancelada)
router.put('/citas/:id/estado', authMiddleware, cambiarEstadoCita);

router.put('/citas/:id/reagendar', authMiddleware, reagendarCita);

// Eliminar una cita (si decides permitirlo)
router.delete('/citas/:id', authMiddleware, eliminarCita);

export default router;
