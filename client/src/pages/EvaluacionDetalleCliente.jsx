import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvaluacionPorId } from "../services/evaluacionService";
import "./EvaluacionDetalleCliente.css";

const EvaluacionDetalleCliente = ({ evaluacionId }) => {
    const navigate = useNavigate();
    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
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
        <div className="evaluacion-container">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Regresar
            </button>

            <h2>Detalle de Evaluación</h2>

            <div className="seccion-doble">
                <div className="tabla-contenedor">
                    <h3>🧑 Datos del Cliente</h3>
                    <table className="tabla-simple">
                        <tbody>
                        <tr>
                            <td><strong>Nombre:</strong></td>
                            <td>{evaluacion.cliente.name}</td>
                        </tr>
                        <tr>
                            <td><strong>Correo:</strong></td>
                            <td>{evaluacion.cliente.email}</td>
                        </tr>
                        <tr>
                            <td><strong>Teléfono:</strong></td>
                            <td>{evaluacion.cliente.phone}</td>
                        </tr>
                        <tr>
                            <td><strong>Tipo de compra:</strong></td>
                            <td>{evaluacion.tipoCompra}</td>
                        </tr>
                        <tr>
                            <td><strong>Porcentaje total:</strong></td>
                            <td>{porcentaje?.toFixed(2)}%</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="tabla-contenedor">
                    <h3>📊 Detalle de la Puntuación</h3>
                    <table className="tabla-simple">
                        <tbody>
                        {detalles.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {evaluacion.tipoCompra === "credito" && (
                <div className="financiera seccion-doble">
                    <div className="tabla-contenedor">
                        <h4>💰 Información Financiera</h4>
                        <table className="tabla-simple">
                            <tbody>
                            <tr>
                                <td><strong>Ingresos:</strong></td>
                                <td>${Object.values(evaluacion.ingresos || {}).reduce((a, b) => a + (b || 0), 0)}</td>
                            </tr>
                            <tr>
                                <td><strong>Egresos:</strong></td>
                                <td>${Object.values(evaluacion.egresos || {}).reduce((a, b) => a + (b || 0), 0)}</td>
                            </tr>
                            <tr>
                                <td><strong>Ahorro:</strong></td>
                                <td>${(Object.values(evaluacion.ingresos || {}).reduce((a, b) => a + (b || 0), 0) -
                                    Object.values(evaluacion.egresos || {}).reduce((a, b) => a + (b || 0), 0))}</td>
                            </tr>
                            <tr>
                                <td><strong>Buró:</strong></td>
                                <td>{evaluacion.buro}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="tabla-contenedor">
                        <h4>🏠 Información Adicional</h4>
                        <table className="tabla-simple">
                            <tbody>
                            <tr>
                                <td><strong>Antigüedad laboral:</strong></td>
                                <td>{evaluacion.antiguedadAnios} años</td>
                            </tr>
                            <tr>
                                <td><strong>Tiene inmueble:</strong></td>
                                <td>{evaluacion.tieneInmueble ? "Sí" : "No"}</td>
                            </tr>
                            <tr>
                                <td><strong>Valor inmuebles:</strong></td>
                                <td>${evaluacion.valorTotalInmuebles}</td>
                            </tr>
                            <tr>
                                <td><strong>Plazo crédito:</strong></td>
                                <td>{evaluacion.plazoCreditoAnios} años</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <h4>📎 Documentos Adjuntos</h4>
            <ul>
                {(evaluacion.documentos || []).map((doc, i) => (
                    <li key={i}>
                        <a href={`http://localhost:5000/${doc}`} target="_blank" rel="noopener noreferrer">
                            Documento {i + 1}
                        </a>
                    </li>
                ))}
            </ul>

            <div className="evaluacion-equifax">
                <h4>🔍 ¿Quieres una evaluación más detallada?</h4>
                <p>
                    Puedes obtener el score financiero completo y evaluación detallada con Equifax dando clic
                    <a
                        href="https://www.equifax.com.ec/miscreditos/checkout?codPaquete=48&campana=0"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        &nbsp;aquí
                    </a>.
                </p>
            </div>

        </div>
    );
};

export default EvaluacionDetalleCliente;
