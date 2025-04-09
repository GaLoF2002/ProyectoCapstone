import React, { useEffect, useState } from "react";
import { getPropiedades } from "../services/propiedadService";
import { eliminarPropiedad} from "../services/propiedadService";

import { useNavigate } from "react-router-dom";
import "./Propiedades.css";

const Propiedades = ({ setActiveSection, setPropiedadSeleccionada, setModoEdicion }) => {
    const [propiedades, setPropiedades] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const propiedadesPorPagina = 3;
    const navigate = useNavigate();

    const [filtros, setFiltros] = useState({
        metrosMin: "",
        metrosMax: "",
        habitaciones: "",
        parqueaderos: "",
        tipo: ""
    });

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros({ ...filtros, [name]: value });
    };

    const aplicarFiltros = async () => {
        try {
            const res = await getPropiedades(filtros);
            setPropiedades(res.data);
            setPaginaActual(1);
        } catch (err) {
            console.error("Error al aplicar filtros", err);
        }
    };

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
    const handleEliminarPropiedad = async (id) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta propiedad?");
        if (!confirmar) return;

        try {
            await eliminarPropiedad(id);
            alert("Propiedad eliminada correctamente");
            // Refresca la lista
            const res = await getPropiedades();
            setPropiedades(res.data);
        } catch (err) {
            console.error("Error al eliminar propiedad:", err);
            alert("No puedes eliminar esta propiedad, fue creada por otro usuario o no tienes permisos.");
        }
    };


    return (
        <div className="propiedades-container">
            <div className="header-container">
                <h2>Listado de Propiedades</h2>
                <button onClick={() =>
                    setModoEdicion(false) ||
                    setActiveSection("crear-propiedad")}>
                    ➕ Añadir Nueva Propiedad
                </button>
            </div>

            {/* 🔍 Filtros */}
            <div className="filtros">
                <input type="number" name="metrosMin" placeholder="Min m²" value={filtros.metrosMin} onChange={handleFiltroChange} />
                <input type="number" name="metrosMax" placeholder="Max m²" value={filtros.metrosMax} onChange={handleFiltroChange} />
                <input type="number" name="habitaciones" placeholder="Habitaciones" value={filtros.habitaciones} onChange={handleFiltroChange} />
                <input type="number" name="parqueaderos" placeholder="Parqueaderos" value={filtros.parqueaderos} onChange={handleFiltroChange} />
                <select name="tipo" value={filtros.tipo} onChange={handleFiltroChange}>
                    <option value="">Todos los tipos</option>
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                    <option value="terreno">Terreno</option>
                </select>
                <button onClick={aplicarFiltros}>Aplicar Filtros</button>
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
                                <button
                                    className="delete-button"
                                    onClick={() => handleEliminarPropiedad(p._id)}
                                >
                                    🗑 Eliminar
                                </button>
                                <button
                                    onClick={() => {
                                        setPropiedadSeleccionada(p); // ✅ pasa todo el objeto
                                        setModoEdicion(true); // ✅ activa modo edición
                                        setActiveSection("crear-propiedad");
                                    }}
                                >
                                    ✏️ Editar
                                </button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {propiedades.length > propiedadesPorPagina && (
                <div className="paginacion">
                <button onClick={paginaAnterior} disabled={paginaActual === 1}>◀ Anterior</button>
                    <span>Página {paginaActual}</span>
                    <button onClick={paginaSiguiente} disabled={indiceFin >= propiedades.length}>Siguiente ▶</button>
                </div>
            )}
        </div>
    );
};

export default Propiedades;
