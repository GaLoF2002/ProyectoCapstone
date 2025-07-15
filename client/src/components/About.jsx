import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './About.css';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page-container">
            <Header />

            <div className="about-content">
                <h1>Sobre Nosotros</h1>
                <p>
                    <strong>Alpha Eco-Construcciones S.A.S.</strong> es una empresa ecuatoriana con más de 13 años de experiencia en el sector de la
                    construcción, especializada en la edificación de proyectos residenciales en las
                    prestigiosas zonas de Cumbayá y Tumbaco. A lo largo de su trayectoria, ha
                    consolidado su reputación como un referente en el sector inmobiliario,
                    ofreciendo soluciones integrales y personalizadas que responden a las
                    expectativas de los clientes. Con un equipo de profesionales altamente
                    capacitados, Alpha Eco-Construcciones transforma las metas de sus clientes en
                    proyectos tangibles y de alta calidad.
                </p>
                <p>
                    Desde sus inicios, la empresa se ha centrado en la
                    <strong> innovación y la sostenibilidad</strong>, ajustando cada proyecto a las demandas
                    específicas del cliente y a las exigencias del entorno. Su misión de brindar
                    viviendas de excelente calidad al mejor precio del mercado refleja su
                    compromiso con la accesibilidad y la responsabilidad ambiental. Este enfoque no
                    solo asegura la satisfacción del cliente, sino también su contribución al
                    desarrollo urbano ordenado y armónico en las comunidades donde opera.
                </p>
                <p>
                    Alpha Eco-Construcciones busca posicionarse como
                    líder en el mercado, marcando tendencias en el ámbito de la construcción
                    gracias a su enfoque orientado a la calidad y la excelencia. Su visión
                    empresarial está respaldada por valores fundamentales como la <strong>seriedad, el
                    compromiso con el cliente, la honestidad y el profesionalismo</strong>.
                    Estos principios guían cada decisión y acción,
                    garantizando proyectos que no solo cumplen con los estándares técnicos, sino
                    que también fortalecen la confianza entre la empresa y sus clientes.
                </p>
                <p>
                    Además de su enfoque en la construcción de edificios
                    residenciales, la empresa también desarrolla actividades secundarias en la
                    construcción de edificios no residenciales, gestión inmobiliaria y servicios
                    relacionados. Esta diversificación de servicios le permite adaptarse a un
                    mercado cambiante y atender una amplia gama de necesidades, posicionándose como
                    una solución integral para aquellos que buscan proyectos habitacionales o
                    comerciales de alto impacto y durabilidad.
                </p>

                <button className="about-back-to-home-btn" onClick={() => navigate('/')}>
                    Regresar al Inicio
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default About;
