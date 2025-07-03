import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaFacebookSquare } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import './Contact.css';

const Contact = () => {
    const navigate = useNavigate();

    return (
        <div className="contact-page-container">
            <Header />

            <div className="contact-content">
                <h1>Contacto</h1>

                <div className="contact-info">
                    <p>
                        <FaMapMarkerAlt className="contact-icon" />
                        <span><strong>Dirección:</strong> Cumbayá, Urb. Jardines del Este, Quito, Ecuador, 170901</span>
                    </p>
                    <p>
                        <FaPhoneAlt className="contact-icon" />
                        <span><strong>Móvil:</strong> 099 862 8563</span>
                    </p>
                    <p>
                        <FaFacebookSquare className="contact-icon" />
                        <span>
                            <strong>Facebook:</strong>{' '}
                            <a
                                href="https://www.facebook.com/alphaecoConstrucciones?locale=es_LA"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                facebook.com/alphaecoConstrucciones
                            </a>
                        </span>
                    </p>
                </div>

                <button className="back-to-home-btn" onClick={() => navigate('/')}>
                    Regresar al Inicio
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
