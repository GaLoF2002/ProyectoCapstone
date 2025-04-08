import React, { useEffect, useState } from "react";
import { getPropiedades } from "../services/propiedadService";
import { useNavigate } from "react-router-dom";
import "./Propiedades.css";

const Propiedades = ({ setActiveSection, setPropiedadSeleccionada }) => {
    const [propiedades, setPropiedades] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const propiedadesPorPagina = 3;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPropiedades = async () => {
            try {
                const res = await getPropiedades();
                setPropiedades(res.data);
            } catch (err) {
                console.error("Error al obtener propiedades:", err);
            }
        };
        fetchPropiedades();
    }, []);

    const indiceInicio = (paginaActual - 1) * propiedadesPorPagina;
    const indiceFin = indiceInicio + propiedadesPorPagina;
    const propiedadesPaginadas = propiedades.slice(indiceInicio, indiceFin);

    const paginaAnterior = () => {
        if (paginaActual > 1) setPaginaActual(paginaActual - 1);
    };

    const paginaSiguiente = () => {
        if (indiceFin < propiedades.length) setPaginaActual(paginaActual + 1);
    };

    return (
        <div className="propiedades-container">
            <div className="header-container">
                <h2>Listado de Propiedades</h2>
                <button onClick={() => setActiveSection("crear-propiedad")}>
                    ➕ Añadir Nueva Propiedad
                </button>
            </div>

            <div className="prop-list">
                {propiedadesPaginadas.map((p) => (
                    <div key={p._id} className="prop-card">
                        <div className="prop-card-content">
                            {p.imagenes && p.imagenes.length > 0 && (
                                <img
                                    src={`http://localhost:5000/${p.imagenes[0]}`}
                                    alt="Imagen de la propiedad"
                                    className="propiedad-img-lateral"
                                    onClick={() => navigate(`/imagen/${p._id}`)}
                                    style={{ cursor: "pointer" }}
                                />
                            )}
                            <div className="prop-info">
                                <h3>{p.titulo}</h3>
                                <p>{p.ubicacion}</p>
                                <p>Precio: ${p.precio}</p>
                                <p>Estado: {p.estado}</p>
                                <button onClick={() => {
                                    setPropiedadSeleccionada(p._id);
                                    setActiveSection("ver-propiedad");
                                }}>
                                    Ver más
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {propiedades.length > propiedadesPorPagina && (
                <div className="paginacion">
                    <button onClick={paginaAnterior} disabled={paginaActual === 1}>
                        ◀ Anterior
                    </button>
                    <span>Página {paginaActual}</span>
                    <button onClick={paginaSiguiente} disabled={indiceFin >= propiedades.length}>
                        Siguiente ▶
                    </button>
                </div>
            )}
        </div>
    );
};

export default Propiedades;
