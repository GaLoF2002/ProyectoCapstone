import React, { useContext, useState } from "react";
import { crearEvaluacion } from "../services/evaluacionService";
import { AuthContext } from "../context/AuthContext";
import "./FormularioEvaluacion.css";

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
    const [enviado, setEnviado] = useState(false);

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
            <div className="mensaje-exito">
                ✅ Perfecto, pronto nos comunicaremos con usted.
            </div>
        );
    }

    return (
        <div className="formulario-evaluacion-container">
            <h2>📋 Evaluación de Potencial de Compra</h2>

            {error && <div className="mensaje error">{error}</div>}

            <form onSubmit={handleSubmit} className="formulario-evaluacion">
                <div>
                    <label htmlFor="nombres">Nombres:</label>
                    <input type="text" id="nombres" name="nombres" value={datos.nombres || ""} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="cedula">Cédula:</label>
                    <input type="text" id="cedula" name="cedula" value={datos.cedula || ""} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="edad">Edad:</label>
                    <input type="number" id="edad" name="edad" value={datos.edad || ""} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="estadoCivil">Estado civil:</label>
                    <select id="estadoCivil" name="estadoCivil" value={datos.estadoCivil || ""} onChange={handleChange} required>
                        <option value="">Seleccione</option>
                        <option value="Soltero">Soltero</option>
                        <option value="Casado">Casado</option>
                        <option value="Divorciado">Divorciado</option>
                        <option value="Viudo">Viudo</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="hijos">Hijos o dependientes:</label>
                    <input type="number" id="hijos" name="hijos" value={datos.hijos || ""} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="nivelEducativo">Nivel educativo:</label>
                    <select id="nivelEducativo" name="nivelEducativo" value={datos.nivelEducativo || ""} onChange={handleChange} required>
                        <option value="">Seleccione</option>
                        <option value="Primaria">Primaria</option>
                        <option value="Secundaria">Secundaria</option>
                        <option value="Bachillerato">Bachillerato</option>
                        <option value="Tercer nivel">Tercer nivel</option>
                        <option value="Cuarto nivel">Cuarto nivel</option>
                        <option value="Postgrado">Postgrado</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="celular">Celular:</label>
                    <input type="text" id="celular" name="celular" value={datos.celular || ""} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="tipoEmpleado">Tipo de empleado:</label>
                    <select id="tipoEmpleado" name="tipoEmpleado" value={datos.tipoEmpleado} onChange={handleChange}>
                        <option value="Dependiente">Dependiente</option>
                        <option value="Independiente">Independiente</option>
                    </select>
                </div>

                {datos.tipoEmpleado === "Dependiente" && (
                    <>
                        <div>
                            <label htmlFor="empleador">Nombre del empleador:</label>
                            <input type="text" id="empleador" name="empleador" value={datos.empleador || ""} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="cargo">Cargo:</label>
                            <input type="text" id="cargo" name="cargo" value={datos.cargo || ""} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="antiguedadAnios">Antigüedad (años):</label>
                            <input type="number" id="antiguedadAnios" name="antiguedadAnios" value={datos.antiguedadAnios || ""} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="ingresoMensual">Ingreso mensual:</label>
                            <input type="number" id="ingresoMensual" name="ingresoMensual" value={datos.ingresoMensual || ""} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="bonificaciones">Bonificaciones:</label>
                            <input type="number" id="bonificaciones" name="bonificaciones" value={datos.bonificaciones || ""} onChange={handleChange} />
                        </div>
                    </>
                )}

                {datos.tipoEmpleado === "Independiente" && (
                    <>
                        <div>
                            <label htmlFor="actividadEconomica">Actividad económica:</label>
                            <input type="text" id="actividadEconomica" name="actividadEconomica" value={datos.actividadEconomica || ""} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="negocioNombre">Nombre del negocio:</label>
                            <input type="text" id="negocioNombre" name="negocioNombre" value={datos.negocioNombre || ""} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="localPropio">¿Local propio?</label>
                            <input type="checkbox" id="localPropio" name="localPropio" checked={datos.localPropio} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="ventasMensuales">Ventas mensuales:</label>
                            <input type="number" id="ventasMensuales" name="ventasMensuales" value={datos.ventasMensuales || ""} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="comprasMensuales">Compras mensuales:</label>
                            <input type="number" id="comprasMensuales" name="comprasMensuales" value={datos.comprasMensuales || ""} onChange={handleChange} />
                        </div>
                    </>
                )}

                <div>
                    <label htmlFor="ingresoConyuge">Ingreso del cónyuge (opcional):</label>
                    <input type="number" id="ingresoConyuge" name="ingresoConyuge" value={datos.ingresoConyuge || ""} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="valorPropiedad">Valor estimado de la propiedad:</label>
                    <input type="number" id="valorPropiedad" name="valorPropiedad" value={datos.valorPropiedad || ""} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="entradaInicial">Entrada inicial estimada:</label>
                    <input type="number" id="entradaInicial" name="entradaInicial" value={datos.entradaInicial || ""} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="plazoCredito">Plazo estimado del crédito (años):</label>
                    <input type="number" id="plazoCredito" name="plazoCredito" value={datos.plazoCredito || ""} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="buro">Buró de crédito:</label>
                    <select id="buro" name="buro" value={datos.buro || ""} onChange={handleChange}>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="input-archivos-evaluacion">Adjuntar hasta 2 documentos (PDF):</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        multiple
                        onChange={handleArchivo}
                        id="input-archivos-evaluacion"
                    />
                </div>

                <button type="submit">Enviar Evaluación</button>
            </form>
        </div>
    );
};

export default FormularioEvaluacion;
