import { useEffect, useState } from "react";
import { getPropiedadPorId } from "../services/propiedadService";
import { simularFinanciamiento } from "../services/evaluacionService";
import "./SimuladorFinanciamiento.css";

/**
 * Componente: SimuladorFinanciamiento
 * Props:
 *  - propiedadId (string): id de la propiedad a simular
 *  - setActiveSection (func): función entregada por el Dashboard para navegar
 */
const SimuladorFinanciamiento = ({ propiedadId, setActiveSection }) => {
    const [propiedad, setPropiedad] = useState(null);
    const [entrada, setEntrada] = useState(30); // % entrada (mínimo 30)
    const [plazo, setPlazo] = useState(15); // años (default 15)
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        /** Carga la propiedad una sola vez */
        const fetchPropiedad = async () => {
            try {
                const res = await getPropiedadPorId(propiedadId);
                setPropiedad(res.data);
            } catch (err) {
                setError("Error al cargar la propiedad");
                console.error(err);
            }
        };

        fetchPropiedad();
    }, [propiedadId]);

    const handleCalcular = async () => {
        if (entrada < 30 || entrada > 100) {
            setError("La entrada debe estar entre 30% y 100%");
            return;
        }
        if (plazo <= 0) {
            setError("Plazo inválido");
            return;
        }

        try {
            setError("");
            setLoading(true);
            const res = await simularFinanciamiento({
                propiedadId,
                porcentajeEntrada: entrada,
                plazoAnios: plazo
            });
            setResultado(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || "Error al simular");
        } finally {
            setLoading(false);
        }
    };

    if (!propiedad) return <p className="loading">Cargando simulador...</p>;

    return (
        <div className="simulador-container">
            <h2 className="titulo">Simulador de Financiamiento</h2>

            {/* Datos rápidos de la propiedad */}
            <div className="resumen-propiedad">
                <p><strong>Propiedad:</strong> {propiedad.titulo}</p>
                <p><strong>Precio:</strong> ${propiedad.precio.toLocaleString()}</p>
            </div>

            {/* Formulario de simulación */}
            <div className="formulario">
                <div className="campo">
                    <label>% de entrada (mín. 30%)</label>
                    <input
                        type="number"
                        min={30}
                        max={100}
                        step={1}
                        value={entrada}
                        onChange={e => setEntrada(Number(e.target.value))}
                    />
                </div>

                <div className="campo">
                    <label>Plazo (años)</label>
                    <select value={plazo} onChange={e => setPlazo(Number(e.target.value))}>
                        {Array.from({ length: 25 }, (_, i) => i + 1).map(anio => (
                            <option key={anio} value={anio}>{anio}</option>
                        ))}
                    </select>
                </div>

                <button className="btn-calcular" onClick={handleCalcular} disabled={loading}>
                    {loading ? "Calculando..." : "Calcular"}
                </button>

                {error && <p className="error">❌ {error}</p>}
            </div>

            {/* Resultado */}
            {resultado && (
                <div className="resultado">
                    <h3>Resultado de la simulación</h3>
                    <p><strong>Entrada:</strong> ${resultado.entrada.toLocaleString()}</p>
                    <p><strong>Monto a financiar:</strong> ${resultado.montoFinanciar.toLocaleString()}</p>
                    <p><strong>Tasa anual:</strong> {resultado.tasaEfectivaAnual}%</p>
                    <p><strong>Cuota mensual:</strong> ${resultado.cuotaMensual.toLocaleString()}</p>
                </div>
            )}
            <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#555" }}>
                *Este cálculo se basa en la información del tarifario del BIESS 2025. Consulta el documento oficial haciendo clic <a href="https://www.biess.fin.ec/files/ley-transaparencia/tarifario/2025/tarifario/TARIFARIO-JUNIO-2025.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "underline" }}>aquí</a>.
            </p>


            <button className="btn-volver" onClick={() => setActiveSection("ver-propiedad")}>
                ← Volver a la Propiedad
            </button>

        </div>
    );
};

export default SimuladorFinanciamiento;
