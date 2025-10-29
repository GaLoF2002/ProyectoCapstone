import { useEffect, useState } from "react";
import { getPropiedadPorId } from "../services/propiedadService";
import "./VistaPublicaPropiedad.css";
const API_URL = import.meta.env.VITE_API_URL;

const VistaPublicaPropiedad = ({ propiedadId, volverA, setActiveSection }) => {
    const [propiedad, setPropiedad] = useState(null);


    useEffect(() => {
        if (!propiedadId) return;
        const fetch = async () => {
            try {
                const res = await getPropiedadPorId(propiedadId);
                setPropiedad(res.data);
            } catch (err) {
                console.error("Error al obtener propiedad pública", err);
            }
        };

        fetch();
    }, [propiedadId]);

    if (!propiedad) return <p className="loading">Cargando propiedad...</p>;

    return (
        <div className="detalle-prop-container">
            <h2 className="titulo-propiedad">{propiedad.titulo}</h2>

            {propiedad.imagenes?.length > 0 && (
                <div className="galeria-imagenes">
                    {propiedad.imagenes.map((img, i) => {
                        const src = img?.startsWith('http') ? img : `${API_URL}/${img}`;
                        return <img key={i} src={src} alt={`Propiedad ${i+1}`} />;
                    })}
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

            {/* Botón de volver solo si se pasa setActiveSection (solo desde Dashboard) */}
            {setActiveSection && (
                <button className="btn-volver" onClick={() => setActiveSection(volverA || "propiedades")}>
                    🔙 Volver
                </button>

            )}
        </div>
    );
};

export default VistaPublicaPropiedad;
