import { useContext, useEffect, useState } from "react";
import { getPropiedadPorId } from "../services/propiedadService";
import { AuthContext } from "../context/AuthContext";
import "./PropiedadIndividual.css";

const PropiedadIndividual = ({ propiedadId, setActiveSection }) => {
    const { user } = useContext(AuthContext);
    const [propiedad, setPropiedad] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getPropiedadPorId(propiedadId);
                setPropiedad(res.data);
            } catch (err) {
                console.error("Error al cargar la propiedad", err);
            }
        };
        fetch();
    }, [propiedadId]);

    if (!propiedad) return <p className="loading">Cargando propiedad...</p>;

    return (
        <div className="detalle-prop-container">

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

            {/* Botón para Agendar Cita */}
            {user.role === "cliente" && (
                <button
                    className="btn-agendar-cita"
                    onClick={() => setActiveSection("agendar-cita")}
                >
                    📅 Agendar Cita para Conocer la Propiedad
                </button>
            )}

        </div>
    );
};

export default PropiedadIndividual;
