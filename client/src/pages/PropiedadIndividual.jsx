import { useContext, useEffect,useRef, useState } from "react";
import { getPropiedadPorId } from "../services/propiedadService";
import { AuthContext } from "../context/AuthContext";
import FormularioEvaluacion from "./FormularioEvaluacion";
import { registrarVisita } from "../services/visitaService";
import "./PropiedadIndividual.css";

const PropiedadIndividual = ({ propiedadId, setActiveSection }) => {
    const { user } = useContext(AuthContext);
    const [propiedad, setPropiedad] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mensajeFinal, setMensajeFinal] = useState(false);
    const visitaRegistrada = useRef(false);

    useEffect(() => {
        if (!user || user.role !== "cliente") return;

        if (visitaRegistrada.current) return; // ✅ corta si ya registró

        visitaRegistrada.current = true; // ❗ marca antes para evitar simultáneas

        const fetch = async () => {
            try {
                const res = await getPropiedadPorId(propiedadId);
                setPropiedad(res.data);
                await registrarVisita(propiedadId);
            } catch (err) {
                console.error("Error al cargar propiedad o registrar visita", err);
            }
        };

        fetch();
    }, [propiedadId]);

    const handleFormularioCompletado = () => {
        setMensajeFinal(true);
        setTimeout(() => {
            setMostrarFormulario(false);
            setMensajeFinal(false);
        }, 3000);
    };

    if (!propiedad) return <p className="loading">Cargando propiedad...</p>;

    return (
        <div className="detalle-prop-container">
            {!mostrarFormulario ? (
                <>
                    <h2 className="titulo-propiedad">{propiedad.titulo}</h2>

                    {propiedad.imagenes && propiedad.imagenes.length > 0 && (
                        <div className="galeria-imagenes">
                            {propiedad.imagenes.map((img, i) => (
                                <img key={i} src={`http://localhost:5000/${img}`} alt="Propiedad" />
                            ))}
                        </div>
                    )}

                    <div className="info-propiedad">
                        <div className="columna">
                            <p><strong>Descripción:</strong> {propiedad.descripcion}</p>
                            <p><strong>Ubicación:</strong> {propiedad.ubicacion}</p>
                            <p><strong>Precio:</strong> ${propiedad.precio}</p>
                            <p><strong>Tipo:</strong> {propiedad.tipo}</p>
                            <p><strong>Estado:</strong> {propiedad.estado}</p>
                        </div>
                        <div className="columna">
                            <p><strong>Habitaciones:</strong> {propiedad.habitaciones}</p>
                            <p><strong>Baños:</strong> {propiedad.banos}</p>
                            <p><strong>Parqueaderos:</strong> {propiedad.parqueaderos}</p>
                            <p><strong>Metros cuadrados:</strong> {propiedad.metrosCuadrados} m²</p>
                            <p><strong>Características:</strong> {propiedad.caracteristicas.join(", ")}</p>
                        </div>
                    </div>

                    {user.role === "cliente" && (
                        <>
                            <button
                                className="btn-agendar-cita"
                                onClick={() => setActiveSection("agendar-cita")}
                            >
                                📅 Agendar Cita para Conocer la Propiedad
                            </button>

                            <button
                                className="btn-interesado"
                                onClick={() => setMostrarFormulario(true)}
                            >
                                📝 Deseo comprar esta propiedad
                            </button>
                        </>
                    )}
                </>
            ) : mensajeFinal ? (
                <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.2rem", marginTop: "2rem" }}>
                    ✅ Gracias por tu interés. ¡Nos pondremos en contacto contigo muy pronto!
                </p>
            ) : (
                <FormularioEvaluacion
                    propiedadId={propiedad._id}
                    onFinalizar={handleFormularioCompletado}
                />
            )}
        </div>
    );
};

export default PropiedadIndividual;
