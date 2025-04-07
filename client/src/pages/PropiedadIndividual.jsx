import { useEffect, useState } from "react";
import { getPropiedadPorId } from "../services/propiedadService";

const PropiedadIndividual = ({ propiedadId, setActiveSection }) => {
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

    if (!propiedad) return <p>Cargando propiedad...</p>;

    return (
        <div>
            <button onClick={() => setActiveSection("propiedades")}>⬅️ Regresar</button>

            <h2>{propiedad.titulo}</h2>
            <p><strong>Descripción:</strong> {propiedad.descripcion}</p>
            <p><strong>Ubicación:</strong> {propiedad.ubicacion}</p>
            <p><strong>Precio:</strong> ${propiedad.precio}</p>
            <p><strong>Tipo:</strong> {propiedad.tipo}</p>
            <p><strong>Estado:</strong> {propiedad.estado}</p>
            <p><strong>Habitaciones:</strong> {propiedad.habitaciones}</p>
            <p><strong>Baños:</strong> {propiedad.banos}</p>
            <p><strong>Parqueaderos:</strong> {propiedad.parqueaderos}</p>
            <p><strong>Metros cuadrados:</strong> {propiedad.metrosCuadrados}</p>
            <p><strong>Características:</strong> {propiedad.caracteristicas.join(", ")}</p>

            {propiedad.imagenes && propiedad.imagenes.length > 0 && (
                <div>
                    <h3>Imágenes</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {propiedad.imagenes.map((img, i) => (
                            <img key={i} src={`http://localhost:5000/${img}`} alt="propiedad" width={200} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropiedadIndividual;
