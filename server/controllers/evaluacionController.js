import EvaluacionCompra from "../models/EvaluacionCliente.js";
import Propiedad from "../models/Propiedad.js";

// Función para calcular el nivel de potencial según nueva lógica avanzada
const calcularNivelPotencial = (data) => {
    const ingresoTotal = (data.ingresos?.sueldo || 0) + (data.ingresos?.otros || 0) + (data.ingresos?.conyuge || 0);
    const egresosTotales = Object.values(data.egresos || {}).reduce((a, b) => a + (b || 0), 0);
    const ahorroCalculado = ingresoTotal - egresosTotales;
    const tieneBuenBuro = data.buro === "A" || data.buro === "B";
    const estabilidad = data.antiguedadAnios >= 2;

    let score = 0;

    if (data.tipoCompra === "contado") {
        score += 3;
        if (data.tiempoCompra === "1mes") score += 2;
        else if (data.tiempoCompra === "2meses") score += 1;

    } else if (data.tipoCompra === "credito") {
        score += 1;

        if (data.tiempoCompra === "1mes") score += 2;
        else if (data.tiempoCompra === "2meses") score += 1;

        if (data.tieneEntrada30) score += 1;
        if (tieneBuenBuro) score += 1;
        else score -= 1;

        if (estabilidad) score += 1;
        if (data.tieneInmueble) score += 1;

        if ((data.valorTotalInmuebles || 0) >= 0.3 * (data.valorPropiedad || 0)) {
            score += 1;
        }

        // ✅ Capacidad de pago mensual simulada con interés real
        const valorPropiedad = data.valorPropiedad || 0;
        const plazoAnios = data.plazoCreditoAnios || 1;
        const plazoMeses = plazoAnios * 12;
        const entrada = data.tieneEntrada30 ? 0.3 * valorPropiedad : 0;
        const montoFinanciar = valorPropiedad - entrada;

        let tasa = 0;
        if (valorPropiedad <= 90000) {
            tasa = 6.16;
        } else if (valorPropiedad <= 130000) {
            if (plazoMeses <= 120) tasa = 7.22;
            else if (plazoMeses <= 180) tasa = 8.29;
            else tasa = 9.27;
        } else if (valorPropiedad <= 200000) {
            if (plazoMeses <= 120) tasa = 8.29;
            else if (plazoMeses <= 180) tasa = 8.79;
            else tasa = 9.38;
        } else {
            if (plazoMeses <= 120) tasa = 8.50;
            else if (plazoMeses <= 180) tasa = 9.00;
            else tasa = 9.49;
        }

        const interesMensual = tasa / 12 / 100;
        const cuotaMensual = montoFinanciar * (
            interesMensual * Math.pow(1 + interesMensual, plazoMeses)
        ) / (
            Math.pow(1 + interesMensual, plazoMeses) - 1
        );

        const ingresoMensualDisponible = ahorroCalculado;

        if (ingresoMensualDisponible > cuotaMensual) {
            score += 2;
        } else if (Math.abs(ingresoMensualDisponible - cuotaMensual) < 1e-2 || ingresoMensualDisponible === cuotaMensual) {
            score += 1;
        }
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

        // 🔎 Buscar propiedad y asignar su precio
        const propiedad = await Propiedad.findById(data.propiedadInteres);
        if (!propiedad) {
            return res.status(404).json({ msg: "Propiedad no encontrada." });
        }

        data.valorPropiedad = propiedad.precio; // ✅ usar valor real

        if (data.tipoCompra === "credito") {
            const camposNumericos = [
                ...Object.values(data.ingresos || {}),
                ...Object.values(data.egresos || {}),
                data.antiguedadAnios,
                data.valorPropiedad,
                data.valorTotalInmuebles,
                data.plazoCreditoAnios
            ];

            if (camposNumericos.some(n => typeof n === 'number' && n < 0)) {
                return res.status(400).json({ msg: "No se permiten valores negativos en ingresos, egresos o activos." });
            }

            if (!["A", "B", "C", "D", "E"].includes(data.buro)) {
                return res.status(400).json({ msg: "Debes seleccionar un buró válido." });
            }

            if (typeof data.tieneEntrada30 !== 'boolean' || typeof data.tieneInmueble !== 'boolean') {
                return res.status(400).json({ msg: "Faltan los campos booleanos requeridos (tieneEntrada30, tieneInmueble)." });
            }

            if (!data.plazoCreditoAnios || data.plazoCreditoAnios <= 0) {
                return res.status(400).json({ msg: "El plazo de crédito debe ser mayor a 0." });
            }

        } else {
            // Si es contado, resetear valores innecesarios
            data.ingresos = {};
            data.egresos = {};
            data.buro = undefined;
            data.antiguedadAnios = 0;
            data.tieneEntrada30 = false;
            data.tieneInmueble = false;
            data.valorTotalInmuebles = 0;
            data.plazoCreditoAnios = 0;
        }

        // 🔢 Calcular nivel de potencial
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

                const valorInmuebleA = a.valorTotalInmuebles || 0;
                const valorInmuebleB = b.valorTotalInmuebles || 0;

                const comparacion =
                    b.nivelPotencial - a.nivelPotencial ||
                    ingresoB - ingresoA ||
                    valorInmuebleB - valorInmuebleA;

                return comparacion;
            });

        res.json({ contado, credito });
    } catch (error) {
        console.error("❌ Error al obtener evaluaciones:", error);
        res.status(500).json({ msg: "Error al obtener evaluaciones" });
    }
};

export const obtenerEvaluacionPorId = async (req, res) => {
    try {
        const { evaluacionId } = req.params;

        const evaluacion = await EvaluacionCompra.findById(evaluacionId)
            .populate("cliente", "name email phone");

        if (!evaluacion) {
            return res.status(404).json({ msg: "Evaluación no encontrada." });
        }

        const data = evaluacion.toObject();
        const detalles = [];
        const ingresoTotal = (data.ingresos?.sueldo || 0) + (data.ingresos?.otros || 0) + (data.ingresos?.conyuge || 0);
        const egresosTotales = Object.values(data.egresos || {}).reduce((a, b) => a + (b || 0), 0);
        const ahorroCalculado = ingresoTotal - egresosTotales;

        const tieneBuenBuro = data.buro === "A" || data.buro === "B";
        const estabilidad = data.antiguedadAnios >= 2;
        const valorPropiedad = data.valorPropiedad || 0;
        const plazo = data.plazoCreditoAnios || 1;

        const entrada30 = data.tieneEntrada30 ? 0.3 * valorPropiedad : 0;
        const montoRestante = valorPropiedad - entrada30;
        const plazoMeses = plazo * 12;

        // Tasa simulada
        let tasa = 0;
        if (valorPropiedad <= 90000) {
            tasa = 6.16;
        } else if (valorPropiedad <= 130000) {
            if (plazoMeses <= 120) tasa = 7.22;
            else if (plazoMeses <= 180) tasa = 8.29;
            else tasa = 9.27;
        } else if (valorPropiedad <= 200000) {
            if (plazoMeses <= 120) tasa = 8.29;
            else if (plazoMeses <= 180) tasa = 8.79;
            else tasa = 9.38;
        } else {
            if (plazoMeses <= 120) tasa = 8.50;
            else if (plazoMeses <= 180) tasa = 9.00;
            else tasa = 9.49;
        }

        const interesMensual = tasa / 12 / 100;
        const cuotaMensual = montoRestante * (
            interesMensual * Math.pow(1 + interesMensual, plazoMeses)
        ) / (
            Math.pow(1 + interesMensual, plazoMeses) - 1
        );

        let score = 0;
        let maxScore = 0;
        let explicacion = "";

        if (data.tipoCompra === "contado") {
            maxScore = 5;
            score += 3;
            detalles.push("✅ Compra al contado: +3");

            if (data.tiempoCompra === "1mes") {
                score += 2;
                detalles.push("📆 Compra en 1 mes: +2");
            } else if (data.tiempoCompra === "2meses") {
                score += 1;
                detalles.push("📆 Compra en 2 meses: +1");
            }

        } else if (data.tipoCompra === "credito") {
            maxScore = 15;
            score += 1;
            detalles.push("💳 Compra con crédito: +1");

            if (data.tiempoCompra === "1mes") {
                score += 2;
                detalles.push("📆 Compra en 1 mes: +2");
            } else if (data.tiempoCompra === "2meses") {
                score += 1;
                detalles.push("📆 Compra en 2 meses: +1");
            }

            if (data.tieneEntrada30) {
                score += 1;
                detalles.push("💰 Tiene entrada del 30%: +1");
            }

            if (tieneBuenBuro) {
                score += 1;
                detalles.push(`📈 Buen buró (${data.buro}): +1`);
            } else {
                score -= 1;
                detalles.push(`📉 Mal buró (${data.buro}): -1`);
            }

            if (estabilidad) {
                score += 1;
                detalles.push("👔 Antigüedad laboral ≥ 2 años: +1");
            }

            if (data.tieneInmueble) {
                score += 1;
                detalles.push("🏠 Tiene inmueble: +1");
            }

            if ((data.valorTotalInmuebles || 0) >= 0.3 * valorPropiedad) {
                score += 1;
                detalles.push("📊 Inmuebles ≥ 30% del valor de la propiedad: +1");
            }

            // Evaluación según cuota mensual real
            if (ahorroCalculado > cuotaMensual) {
                score += 2;
                detalles.push(
                    `💵 Ahorro mensual (${ahorroCalculado.toFixed(2)}) es MAYOR que la cuota mensual estimada (${cuotaMensual.toFixed(2)}): +2. ` +
                    `Alta capacidad de pago para asumir un crédito de ${plazo} años.`
                );
            } else if (Math.abs(ahorroCalculado - cuotaMensual) < 1e-2 || ahorroCalculado === cuotaMensual) {
                score += 1;
                detalles.push(
                    `💵 Ahorro mensual (${ahorroCalculado.toFixed(2)}) es IGUAL o casi igual a la cuota mensual estimada (${cuotaMensual.toFixed(2)}): +1. ` +
                    `Puede asumir el crédito, aunque sin mucha holgura.`
                );
            } else {
                detalles.push(
                    `⚠️ Ahorro mensual (${ahorroCalculado.toFixed(2)}) es INFERIOR a la cuota mensual estimada (${cuotaMensual.toFixed(2)}). ` +
                    `No suma puntos por riesgo de sobreendeudamiento.`
                );
            }

            // Detalles adicionales
            detalles.push(`📌 Valor propiedad: $${valorPropiedad.toFixed(2)}`);
            detalles.push(`📌 Entrada del 30%: $${entrada30.toFixed(2)}`);
            detalles.push(`📌 Monto a financiar: $${montoRestante.toFixed(2)}`);
            detalles.push(`📌 Cuota mensual estimada: $${cuotaMensual.toFixed(2)}`);
            detalles.push(`📌 Ahorro mensual disponible: $${ahorroCalculado.toFixed(2)}`);
        }

        const nivelPotencial = Math.max(1, Math.min(score, maxScore));
        const porcentaje = (nivelPotencial / maxScore) * 100;

        // Explicación final
        if (data.tipoCompra === "contado") {
            explicacion = `El cliente aplica a una compra al contado. Puntaje máximo posible: 5 puntos. Obtuvo ${nivelPotencial} puntos (${porcentaje.toFixed(1)}%). Se consideró la rapidez de la compra y el tipo de pago.`;
        } else {
            explicacion = `El cliente aplica a una compra por crédito. Puntaje máximo posible: 15 puntos. Una calificación excelente supera el 66.7% (10 puntos). Obtuvo ${nivelPotencial} puntos (${porcentaje.toFixed(1)}%). Se evaluaron ingresos, egresos, buró de crédito, antigüedad laboral, bienes inmuebles y su capacidad para cubrir la cuota mensual estimada en relación con su ahorro mensual disponible.`;
        }

        res.json({
            evaluacion,
            ingresoTotal,
            egresosTotales,
            ahorroCalculado,
            valorPropiedad,
            entrada30,
            montoRestante,
            cuotaMensual,
            nivelPotencial,
            porcentaje,
            detalles,
            explicacion
        });

    } catch (error) {
        console.error("❌ Error al obtener evaluación por ID:", error);
        res.status(500).json({ msg: "Error al obtener evaluación" });
    }
};



export const simularFinanciamiento = async (req, res) => {
    try {
        const { propiedadId, porcentajeEntrada, plazoAnios } = req.body;

        if (!porcentajeEntrada || porcentajeEntrada < 30 || porcentajeEntrada > 100) {
            return res.status(400).json({ msg: "La entrada debe ser mínimo del 30% y máximo del 100%." });
        }

        if (!plazoAnios || plazoAnios <= 0) {
            return res.status(400).json({ msg: "Debes ingresar un plazo válido." });
        }

        const propiedad = await Propiedad.findById(propiedadId);
        if (!propiedad) {
            return res.status(404).json({ msg: "Propiedad no encontrada." });
        }

        const valorPropiedad = propiedad.precio;
        const entrada = (porcentajeEntrada / 100) * valorPropiedad;
        const montoFinanciar = valorPropiedad - entrada;
        const plazoMeses = plazoAnios * 12;

        // Obtener tasa según valor propiedad y plazo
        let tasa = 0;

        if (valorPropiedad <= 90000) {
            tasa = 6.16;
        } else if (valorPropiedad <= 130000) {
            if (plazoMeses <= 120) tasa = 7.22;
            else if (plazoMeses <= 180) tasa = 8.29;
            else tasa = 9.27;
        } else if (valorPropiedad <= 200000) {
            if (plazoMeses <= 120) tasa = 8.29;
            else if (plazoMeses <= 180) tasa = 8.79;
            else tasa = 9.38;
        } else {
            if (plazoMeses <= 120) tasa = 8.50;
            else if (plazoMeses <= 180) tasa = 9.00;
            else tasa = 9.49;
        }

        const interesMensual = tasa / 12 / 100;

        const cuotaMensual = montoFinanciar * (
            interesMensual * Math.pow(1 + interesMensual, plazoMeses)
        ) / (
            Math.pow(1 + interesMensual, plazoMeses) - 1
        );

        res.json({
            valorPropiedad,
            entrada: Math.round(entrada * 100) / 100,
            montoFinanciar: Math.round(montoFinanciar * 100) / 100,
            plazoAnios,
            tasaEfectivaAnual: tasa,
            cuotaMensual: Math.round(cuotaMensual * 100) / 100
        });

    } catch (error) {
        console.error("❌ Error en simulador de financiamiento:", error);
        res.status(500).json({ msg: "Error al calcular financiamiento." });
    }
};
