import EvaluacionCompra from "../models/EvaluacionCliente.js";
import Propiedad from "../models/Propiedad.js";

// Función para calcular el nivel de potencial según nueva lógica avanzada
const calcularNivelPotencial = (data) => {
    const ingresoTotal = (data.ingresos?.sueldo || 0) + (data.ingresos?.otros || 0) + (data.ingresos?.conyuge || 0);
    const egresosTotales = Object.values(data.egresos || {}).reduce((a, b) => a + (b || 0), 0);
    const ahorroCalculado = ingresoTotal - egresosTotales;
    const ahorroCliente = data.ahorroMensual || 0;
    const relacionDeuda = ingresoTotal > 0 ? (data.egresos?.deudas || 0) / ingresoTotal : 1;
    const tieneBuenBuro = data.buro === "A" || data.buro === "B";
    const estabilidad = data.antiguedadAnios >= 2;
    const patrimonio = (data.numeroInmuebles || 0) + (data.numeroVehiculos || 0);

    let score = 0;

    if (data.tipoCompra === "contado") {
        score += 3;
        if (data.tiempoCompra === "1mes") score += 2;
        else if (data.tiempoCompra === "2meses") score += 1;
    } else if (data.tipoCompra === "credito") {
        score += 1;
        if (data.tiempoCompra === "1mes") score += 2;
        else if (data.tiempoCompra === "2meses") score += 1;
        if (ahorroCliente >= 0.3 * (data.valorPropiedad || 0)) score += 1;
        if (relacionDeuda < 0.3) score += 1;
        if (tieneBuenBuro) score += 1;
        else score -= 1;
        if (estabilidad) score += 1;

        if (patrimonio === 1) score += 1;
        else if (patrimonio > 1) score += 2;
    }

    const rawScore = score;
    const maxScore = data.tipoCompra === "contado" ? 5 : 15;
    const normalizedScore = Math.max(1, Math.min(rawScore, maxScore));
    const porcentaje = (normalizedScore / maxScore) * 100;

    return { nivelPotencial: normalizedScore, porcentaje };
};

export const crearEvaluacionCompra = async (req, res) => {
    try {
        const data = JSON.parse(req.body.datos);
        const archivos = req.files?.map(file => file.path) || [];

        if (data.tipoCompra === "credito") {
            const camposNumericos = [
                ...Object.values(data.ingresos || {}),
                ...Object.values(data.egresos || {}),
                data.ahorroMensual,
                data.antiguedadAnios,
                data.numeroInmuebles,
                data.numeroVehiculos,
                data.valorPropiedad
            ];
            if (camposNumericos.some(n => typeof n === 'number' && n < 0)) {
                return res.status(400).json({ msg: "No se permiten valores negativos en ingresos, egresos o activos." });
            }

            if (!["A", "B", "C", "D", "E"].includes(data.buro)) {
                return res.status(400).json({ msg: "Debes seleccionar un buró válido." });
            }
        } else {
            data.ingresos = {};
            data.egresos = {};
            data.ahorroMensual = 0;
            data.buro = undefined;
            data.antiguedadAnios = 0;
            data.numeroInmuebles = 0;
            data.numeroVehiculos = 0;
        }

        const { nivelPotencial, porcentaje } = calcularNivelPotencial(data);

        const evaluacion = new EvaluacionCompra({
            ...data,
            cliente: req.user._id,
            documentos: archivos,
            nivelPotencial,
            porcentaje
        });

        await evaluacion.save();
        res.status(201).json({ msg: "Evaluación guardada correctamente", evaluacion });
    } catch (error) {
        console.error("❌ Error al guardar evaluación: ", error);
        res.status(500).json({ msg: "Error al guardar evaluación" });
    }
};

export const obtenerEvaluacionesPorPropiedad = async (req, res) => {
    try {
        const { propiedadId } = req.params;

        const evaluaciones = await EvaluacionCompra.find({ propiedadInteres: propiedadId })
            .populate("cliente", "name email phone");

        const contado = evaluaciones
            .filter(e => e.tipoCompra === "contado")
            .sort((a, b) => b.nivelPotencial - a.nivelPotencial);

        const credito = evaluaciones
            .filter(e => e.tipoCompra === "credito")
            .sort((a, b) => {
                const ingresoA = (a.ingresos?.sueldo || 0) + (a.ingresos?.otros || 0) + (a.ingresos?.conyuge || 0);
                const ingresoB = (b.ingresos?.sueldo || 0) + (b.ingresos?.otros || 0) + (b.ingresos?.conyuge || 0);

                const ahorroA = a.ahorroMensual || 0;
                const ahorroB = b.ahorroMensual || 0;

                const patrimonioA = (a.numeroInmuebles || 0) + (a.numeroVehiculos || 0);
                const patrimonioB = (b.numeroInmuebles || 0) + (b.numeroVehiculos || 0);

                const comparacion =
                    b.nivelPotencial - a.nivelPotencial ||
                    ingresoB - ingresoA ||
                    ahorroB - ahorroA ||
                    patrimonioB - patrimonioA;

                return comparacion;
            });

        res.json({ contado, credito });
    } catch (error) {
        console.error("❌ Error al obtener evaluaciones:", error);
        res.status(500).json({ msg: "Error al obtener evaluaciones" });
    }
};
