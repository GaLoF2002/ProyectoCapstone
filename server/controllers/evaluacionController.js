import EvaluacionCompra from "../models/EvaluacionCliente.js";

// Función para calcular el puntaje (simplificada)
const calcularNivelPotencial = (data) => {
    const ingresoTotal = (data.ingresos?.sueldo || 0) + (data.ingresos?.otros || 0) + (data.ingresos?.conyuge || 0);
    const egresosTotales = Object.values(data.egresos || {}).reduce((a, b) => a + (b || 0), 0);
    const ahorro = ingresoTotal - egresosTotales;

    const relacionDeuda = egresosTotales > 0 ? (data.egresos?.deudas || 0) / ingresoTotal : 0;
    const tieneBuenBuro = data.buro === "A" || data.buro === "B";
    const estabilidad = data.antiguedadAnios >= 2;
    const patrimonio = (data.numeroInmuebles || 0) + (data.numeroVehiculos || 0);

    let score = 1;
    if (ahorro > 300 && relacionDeuda < 0.3) score++;
    if (tieneBuenBuro) score++;
    if (estabilidad) score++;
    if (patrimonio >= 2) score++;

    return Math.min(score, 5);
};

export const crearEvaluacionCompra = async (req, res) => {
    try {
        const data = JSON.parse(req.body.datos); // El frontend debe enviar los datos como string JSON
        const archivos = req.files?.map(file => file.path) || [];

        // Calcular nivel automáticamente
        const nivelPotencial = calcularNivelPotencial(data);

        const evaluacion = new EvaluacionCompra({
            ...data,
            cliente: req.user._id,
            documentos: archivos,
            nivelPotencial
        });

        await evaluacion.save();
        res.status(201).json({ msg: "Evaluación guardada correctamente", evaluacion });
    } catch (error) {
        console.error("❌ Error al guardar evaluación:", error);
        res.status(500).json({ msg: "Error al guardar evaluación" });
    }
};
