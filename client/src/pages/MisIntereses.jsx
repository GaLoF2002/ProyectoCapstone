
import { useEffect, useState } from "react";
import { getMisIntereses } from "../services/interesService";

const MisIntereses = ({ setActiveSection, setPropiedadSeleccionada }) => {
    const [intereses, setIntereses] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getMisIntereses();
                setIntereses(res.data);
            } catch (error) {
                console.error("Error al obtener intereses:", error);
            }
        };
        fetch();
    }, []);

    const handleVerMas = (id) => {
        setPropiedadSeleccionada(id);
        setActiveSection("ver-propiedad");
    };

    return (
        <div style={{ padding: "1.5rem" }}>
            <h2>Propiedades que te interesan</h2>
            {intereses.length === 0 ? (
                <p>No tienes propiedades marcadas como interesantes aún.</p>
            ) : (
                intereses.map((interes) => (
                    <div key={interes._id} className="propiedad-card">
                        <h4>{interes.propiedad.titulo}</h4>
                        <p>{interes.propiedad.ubicacion}</p>
                        <p>${interes.propiedad.precio}</p>
                        <p>{interes.propiedad.descripcion}</p>

                        {interes.propiedad.imagenes?.length > 0 && (
                            <div className="galeria-imagenes">
                                {interes.propiedad.imagenes.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={`http://localhost:5000/${img}`}
                                        alt="Propiedad"
                                        style={{ width: "150px", marginRight: "10px" }}
                                    />
                                ))}
                            </div>
                        )}

                        <button onClick={() => handleVerMas(interes.propiedad._id)}>
                            Saber más
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default MisIntereses;
