import Propiedad from '../models/Propiedad.js';

// Crear una propiedad
export const crearPropiedad = async (req, res) => {
    try {
        // Verificar roles permitidos
        if (req.user.role !== 'admin' && req.user.role !== 'vendedor') {
            return res.status(403).json({ msg: 'No tienes permisos para crear propiedades' });
        }

        // Extraer las rutas de las imágenes subidas
        const imagenes = req.files ? req.files.map(file => file.path) : [];

        const nuevaPropiedad = new Propiedad({
            ...req.body,
            imagenes,
            creadoPor: req.user._id
        });

        await nuevaPropiedad.save();
        res.status(201).json({ msg: 'Propiedad creada correctamente', propiedad: nuevaPropiedad });
    } catch (error) {
        console.error("Error al crear propiedad:", error);
        res.status(500).json({ error: 'Error al crear propiedad' });
    }
};

// Obtener todas las propiedades
export const obtenerPropiedades = async (req, res) => {
    try {
        const propiedades = await Propiedad.find().populate("creadoPor", "name email");
        res.json(propiedades);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener propiedades' });
    }
};

// Obtener una sola propiedad por ID
export const obtenerPropiedadPorId = async (req, res) => {
    try {
        const propiedad = await Propiedad.findById(req.params.id).populate("creadoPor", "name email");
        if (!propiedad) return res.status(404).json({ msg: 'Propiedad no encontrada' });
        res.json(propiedad);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar la propiedad' });
    }
};

// Actualizar una propiedad
export const actualizarPropiedad = async (req, res) => {
    try {
        const propiedad = await Propiedad.findById(req.params.id);
        if (!propiedad) return res.status(404).json({ msg: 'Propiedad no encontrada' });

        if (req.user.role !== 'admin' && !propiedad.creadoPor.equals(req.user._id)) {
            return res.status(403).json({ msg: 'No autorizado para actualizar esta propiedad' });
        }

        Object.assign(propiedad, req.body);
        await propiedad.save();
        res.json({ msg: 'Propiedad actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la propiedad' });
    }
};

// Eliminar una propiedad
export const eliminarPropiedad = async (req, res) => {
    try {
        const propiedad = await Propiedad.findById(req.params.id);
        if (!propiedad) return res.status(404).json({ msg: 'Propiedad no encontrada' });

        if (req.user.role !== 'admin' && !propiedad.creadoPor.equals(req.user._id)) {
            return res.status(403).json({ msg: 'No autorizado para eliminar esta propiedad' });
        }

        await propiedad.deleteOne();
        res.json({ msg: 'Propiedad eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar propiedad' });
    }
};

