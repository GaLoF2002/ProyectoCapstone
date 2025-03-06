import express from 'express';
import { crearVendedor, obtenerVendedores,actualizarVendedor  } from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-seller', authMiddleware, adminMiddleware, crearVendedor);
router.get('/sellers', authMiddleware, adminMiddleware, obtenerVendedores);
router.put('/sellers/:id', authMiddleware, adminMiddleware, actualizarVendedor);

export default router;
