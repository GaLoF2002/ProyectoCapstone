import VisitaCliente from "../models/VisitaCliente.js";
import Propiedad from "../models/Propiedad.js";
import mongoose from "mongoose";

// Indicadores mensuales
export const obtenerIndicadores = async (req, res) => {
    try {
        const ahora = new Date();
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

        // Agrupar visitas por propiedad
        const propiedadesMasVistas = await VisitaCliente.aggregate([
            { $match: { timestamp: { $gte: inicioMes } } },
            { $group: { _id: "$propiedad", total: { $sum: 1 } } },
            { $sort: { total: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "propiedads",
                    localField: "_id",
                    foreignField: "_id",
                    as: "propiedad"
                }
            },
            { $unwind: "$propiedad" }
        ]);

        // Agrupar por tipo
        const tiposMasVistos = await VisitaCliente.aggregate([
            { $match: { timestamp: { $gte: inicioMes } } },
            { $group: { _id: "$tipo", total: { $sum: 1 } } },
            { $sort: { total: -1 } }
        ]);

        // Agrupar por filtros
        const filtrosUsados = await VisitaCliente.aggregate([
            { $match: { timestamp: { $gte: inicioMes } } },
            {
                $group: {
                    _id: {
                        habitaciones: "$habitaciones",
                        parqueaderos: "$parqueaderos"
                    },
                    total: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);

        res.json({ propiedadesMasVistas, tiposMasVistos, filtrosUsados });
    } catch (error) {
        console.error("❌ Error obteniendo indicadores:", error);
        res.status(500).json({ msg: "Error obteniendo indicadores" });
    }
};
