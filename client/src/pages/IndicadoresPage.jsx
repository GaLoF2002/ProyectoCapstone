import React, { useEffect, useState } from "react";
import { getIndicadores } from "../services/indicadoresService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const IndicadoresPage = () => {
    const [datos, setDatos] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getIndicadores();
                setDatos(res.data);
            } catch (err) {
                console.error("Error al cargar indicadores: ", err);
            }
        };
        fetch();
    }, []);

    if (!datos) return <p>Cargando indicadores...</p>;

    return (
        <div className="indicadores-container" style={{ padding: "2rem" }}>
            <h2>📊 Indicadores de Gestión - Mes Actual</h2>

            {/* Gráfico: Tipos de propiedades más vistas */}
            <h3>Tipos de Propiedades Más Vistas</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={datos.tiposMasVistos} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={100}>
                        {datos.tiposMasVistos.map((entry, index) => (
                            <Cell key={`cell-${index}`} />
                        ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            {/* Gráfico: Propiedades más vistas */}
            <h3>Ranking de Propiedades Más Vistas</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datos.propiedadesMasVistas.map(p => ({
                    titulo: p.propiedad?.titulo || "Propiedad",
                    total: p.total
                }))}>
                    <XAxis dataKey="titulo" hide />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>

            {/* Lista detallada de propiedades más vistas */}
            <h4>📌 Lista de Propiedades Más Vistas</h4>
            <ul>
                {datos.propiedadesMasVistas.map((p, i) => (
                    <li key={i} style={{ marginBottom: "1rem" }}>
                        <strong>{p.propiedad?.titulo || "Propiedad"}</strong><br />
                        Tipo: {p.propiedad?.tipo}, Ubicación: {p.propiedad?.ubicacion}, Habitaciones: {p.propiedad?.habitaciones}, Parqueaderos: {p.propiedad?.parqueaderos}<br />
                        Visitas: {p.total}
                    </li>
                ))}
            </ul>

            {/* Propiedades más consultadas por filtros */}
            <h3>🔍 Consultas por Filtros Más Comunes</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th style={{ borderBottom: "1px solid #ccc" }}>Habitaciones</th>
                    <th style={{ borderBottom: "1px solid #ccc" }}>Parqueaderos</th>
                    <th style={{ borderBottom: "1px solid #ccc" }}>Consultas</th>
                </tr>
                </thead>
                <tbody>
                {datos.filtrosUsados.map((f, i) => (
                    <tr key={i}>
                        <td>{f._id.habitaciones}</td>
                        <td>{f._id.parqueaderos}</td>
                        <td>{f.total}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default IndicadoresPage;
