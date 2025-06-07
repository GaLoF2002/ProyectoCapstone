import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvaluacionPorId } from "../services/evaluacionService";

const EvaluacionDetalleCliente = ({ evaluacionId }) => {
    const navigate = useNavigate();
    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                console.log("Evaluación ID:", evaluacionId);
                const res = await getEvaluacionPorId(evaluacionId);
                setDatos(res.data);
            } catch (error) {
                console.error("Error al obtener evaluación:", error);
            } finally {
                setLoading(false);
            }
        };

        if (evaluacionId) {
            fetchDatos();
        }
    }, [evaluacionId]);

    if (loading) return <p>Cargando...</p>;
    if (!datos) return <p>No se encontró información de evaluación.</p>;

    const { evaluacion, porcentaje, detalles } = datos;

    return (
        <div style={{ padding: "1rem" }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
                ← Regresar
            </button>

            <h2>Detalle de Evaluación</h2>
            <p><strong>Cliente:</strong> {evaluacion.cliente.name}</p>
            <p><strong>Correo:</strong> {evaluacion.cliente.email}</p>
            <p><strong>Teléfono:</strong> {evaluacion.cliente.phone}</p>
            <p><strong>Tipo de compra:</strong> {evaluacion.tipoCompra}</p>
            <p><strong>Porcentaje total:</strong> {porcentaje?.toFixed(2)}%</p>

            <h3>Detalle de la Puntuación</h3>
            <ul>
                {detalles.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>

            {evaluacion.tipoCompra === "credito" && (
                <>
                    <h4>Información Financiera</h4>
                    <p><strong>Ingresos:</strong> ${Object.values(evaluacion.ingresos || {}).reduce((a, b) => a + (b || 0), 0)}</p>
                    <p><strong>Egresos:</strong> ${Object.values(evaluacion.egresos || {}).reduce((a, b) => a + (b || 0), 0)}</p>
                    <p><strong>Ahorro calculado:</strong> ${((Object.values(evaluacion.ingresos || {}).reduce((a, b) => a + (b || 0), 0)) - (Object.values(evaluacion.egresos || {}).reduce((a, b) => a + (b || 0), 0)))}</p>
                    <p><strong>Buró:</strong> {evaluacion.buro}</p>
                    <p><strong>Antigüedad laboral:</strong> {evaluacion.antiguedadAnios} años</p>
                    <p><strong>Tiene inmueble:</strong> {evaluacion.tieneInmueble ? "Sí" : "No"}</p>
                    <p><strong>Valor de inmuebles:</strong> ${evaluacion.valorTotalInmuebles}</p>
                    <p><strong>Plazo de crédito:</strong> {evaluacion.plazoCreditoAnios} años</p>
                </>
            )}

            <h4>Documentos Adjuntos</h4>
            <ul>
                {(evaluacion.documentos || []).map((doc, i) => (
                    <li key={i}>
                        <a href={`http://localhost:5000/${doc}`} target="_blank" rel="noopener noreferrer">
                            Documento {i + 1}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EvaluacionDetalleCliente;
