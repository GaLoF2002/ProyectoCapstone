import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} AlphaEco-Construcciones. Todos los derechos reservados.</p>
            <div className="footer-links">
                <a href="/about">Sobre Nosotros</a>
                <a href="/contact">Contacto</a>
            </div>
        </footer>
    );
};

export default Footer;
