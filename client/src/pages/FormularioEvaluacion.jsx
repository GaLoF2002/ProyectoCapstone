import React, { useContext, useState } from "react";
import { crearEvaluacion } from "../services/evaluacionService";
import { AuthContext } from "../context/AuthContext";

const FormularioEvaluacion = ({ propiedadId }) => {
    const { user } = useContext(AuthContext);

    const [datos, setDatos] = useState({
        nombres: "",
        cedula: "",
        edad: "",
        estadoCivil: "",
        hijos: "",
        nivelEducativo: "",
        celular: "",
        tipoEmpleado: "Dependiente",
        empleador: "",
        cargo: "",
        antiguedadAnios: "",
        ingresoMensual: "",
        bonificaciones: "",
        actividadEconomica: "",
        negocioNombre: "",
        localPropio: false,
        empleados: "",
        ventasMensuales: "",
        comprasMensuales: "",
        utilidadMensual: "",
        ventasAnioAnterior: "",
        ventasProyectadas: "",
        ingresoConyuge: "",
        valorPropiedad: "",
        entradaInicial: "",
        plazoCredito: "",
        buro: "A"
    });

    const [archivos, setArchivos] = useState([]);
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);
    const [enviado, setEnviado] = useState(false); // ✅ NUEVO estado

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDatos(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleArchivo = (e) => {
        setArchivos([...e.target.files].slice(0, 2));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(null);
        setError(null);

        if (!propiedadId) {
            setError("❌ No se ha definido la propiedad de interés.");
            return;
        }

        const payload = {
            ...datos,
            propiedadInteres: propiedadId
        };

        const formData = new FormData();
        formData.append("datos", JSON.stringify(payload));
        archivos.forEach(file => formData.append("documentos", file));

        try {
            await crearEvaluacion(formData);
            setEnviado(true);
            setMensaje("✅ Perfecto, pronto nos comunicaremos con usted.");
            setDatos({});
            setArchivos([]);
            document.getElementById("input-archivos-evaluacion").value = "";

            setTimeout(() => {
                setMensaje(null);
            }, 2000);
        } catch (err) {
            console.error("❌ Error al enviar evaluación:", err);
            setError(err.response?.data?.msg || "Error inesperado.");
        }
    };

    if (enviado) {
        return (
            <div
                className="mensaje-exito"
                style={{
                    backgroundColor: "#d1fae5",
                    color: "#065f46",
                    padding: "1.2rem",
                    textAlign: "center",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    marginTop: "1rem"
                }}
            >
                ✅ Perfecto, pronto nos comunicaremos con usted.
            </div>
        );
    }

    return (
        <div className="formulario-evaluacion-container">
            <h2>📋 Evaluación de Potencial de Compra</h2>

            {error && <div className="mensaje error">{error}</div>}

            <form onSubmit={handleSubmit} className="formulario-evaluacion">
                <label>Nombres:</label>
                <input type="text" name="nombres" value={datos.nombres || ""} onChange={handleChange} required />

                <label>Cédula:</label>
                <input type="text" name="cedula" value={datos.cedula || ""} onChange={handleChange} required />

                <label>Edad:</label>
                <input type="number" name="edad" value={datos.edad || ""} onChange={handleChange} required />

                <label>Estado civil:</label>
                <select name="estadoCivil" value={datos.estadoCivil || ""} onChange={handleChange} required>
                    <option value="">Seleccione</option>
                    <option value="Soltero">Soltero</option>
                    <option value="Casado">Casado</option>
                    <option value="Divorciado">Divorciado</option>
                    <option value="Viudo">Viudo</option>
                </select>

                <label>Hijos o dependientes:</label>
                <input type="number" name="hijos" value={datos.hijos || ""} onChange={handleChange} required />

                <label>Nivel educativo:</label>
                <select name="nivelEducativo" value={datos.nivelEducativo || ""} onChange={handleChange} required>
                    <option value="">Seleccione</option>
                    <option value="Primaria">Primaria</option>
                    <option value="Secundaria">Secundaria</option>
                    <option value="Bachillerato">Bachillerato</option>
                    <option value="Tercer nivel">Tercer nivel</option>
                    <option value="Cuarto nivel">Cuarto nivel</option>
                    <option value="Postgrado">Postgrado</option>
                </select>

                <label>Celular:</label>
                <input type="text" name="celular" value={datos.celular || ""} onChange={handleChange} required />

                <label>Tipo de empleado:</label>
                <select name="tipoEmpleado" value={datos.tipoEmpleado} onChange={handleChange}>
                    <option value="Dependiente">Dependiente</option>
                    <option value="Independiente">Independiente</option>
                </select>

                {datos.tipoEmpleado === "Dependiente" && (
                    <>
                        <label>Nombre del empleador:</label>
                        <input type="text" name="empleador" value={datos.empleador || ""} onChange={handleChange} />
                        <label>Cargo:</label>
                        <input type="text" name="cargo" value={datos.cargo || ""} onChange={handleChange} />
                        <label>Antigüedad (años):</label>
                        <input type="number" name="antiguedadAnios" value={datos.antiguedadAnios || ""} onChange={handleChange} />
                        <label>Ingreso mensual:</label>
                        <input type="number" name="ingresoMensual" value={datos.ingresoMensual || ""} onChange={handleChange} />
                        <label>Bonificaciones:</label>
                        <input type="number" name="bonificaciones" value={datos.bonificaciones || ""} onChange={handleChange} />
                    </>
                )}

                {datos.tipoEmpleado === "Independiente" && (
                    <>
                        <label>Actividad económica:</label>
                        <input type="text" name="actividadEconomica" value={datos.actividadEconomica || ""} onChange={handleChange} />
                        <label>Nombre del negocio:</label>
                        <input type="text" name="negocioNombre" value={datos.negocioNombre || ""} onChange={handleChange} />
                        <label>¿Local propio?</label>
                        <input type="checkbox" name="localPropio" checked={datos.localPropio} onChange={handleChange} />
                        <label>Ventas mensuales:</label>
                        <input type="number" name="ventasMensuales" value={datos.ventasMensuales || ""} onChange={handleChange} />
                        <label>Compras mensuales:</label>
                        <input type="number" name="comprasMensuales" value={datos.comprasMensuales || ""} onChange={handleChange} />
                    </>
                )}

                <label>Ingreso del cónyuge (opcional):</label>
                <input type="number" name="ingresoConyuge" value={datos.ingresoConyuge || ""} onChange={handleChange} />

                <label>Valor estimado de la propiedad:</label>
                <input type="number" name="valorPropiedad" value={datos.valorPropiedad || ""} onChange={handleChange} />

                <label>Entrada inicial estimada:</label>
                <input type="number" name="entradaInicial" value={datos.entradaInicial || ""} onChange={handleChange} />

                <label>Plazo estimado del crédito (años):</label>
                <input type="number" name="plazoCredito" value={datos.plazoCredito || ""} onChange={handleChange} />

                <label>Buró de crédito:</label>
                <select name="buro" value={datos.buro || ""} onChange={handleChange}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                </select>

                <label>Adjuntar hasta 2 documentos (PDF):</label>
                <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={handleArchivo}
                    id="input-archivos-evaluacion"
                />

                <button type="submit">Enviar Evaluación</button>
            </form>
        </div>
    );
};

export default FormularioEvaluacion;
