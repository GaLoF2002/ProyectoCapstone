// controllers/disponibilidadController.js
import Disponibilidad from '../models/DisponibilidadVendedor.js';
import Cita from '../models/Cita.js';

// Crear disponibilidad del vendedor
export const crearDisponibilidad = async (req, res) => {
    try {
        const { diaSemana, horaInicio, horaFin } = req.body;
        const vendedor = req.user._id; // Asumiendo que el vendedor ya está autenticado

        // Verificar si ya existe una disponibilidad para ese día y vendedor
        const existe = await Disponibilidad.findOne({ vendedor, diaSemana });
        if (existe) {
            return res.status(400).json({ msg: 'Ya tienes registrada disponibilidad para ese día' });
        }

        const nueva = new Disponibilidad({ vendedor, diaSemana, horaInicio, horaFin });
        await nueva.save();
        res.status(201).json({ msg: 'Disponibilidad creada correctamente', disponibilidad: nueva });
    } catch (error) {
        console.error("Error al crear disponibilidad:", error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// Obtener disponibilidad por vendedor
export const obtenerDisponibilidadPorVendedor = async (req, res) => {
    try {
        const vendedor = req.params.vendedorId;
        const disponibilidad = await Disponibilidad.find({ vendedor });
        res.json(disponibilidad);
    } catch (error) {
        console.error("Error al obtener disponibilidad:", error);
        res.status(500).json({ error: 'Error al obtener disponibilidad' });
    }
};

// Funcionalidad que podría usarse en citaController: validar cruce de citas
export const validarDisponibilidad = async (vendedorId, fecha, hora) => {
    // Buscar citas existentes para ese vendedor en esa fecha y hora
    const citaExistente = await Cita.findOne({ vendedor: vendedorId, fecha, hora, estado: { $ne: "cancelada" } });
    return !citaExistente; // true si está disponible
};
