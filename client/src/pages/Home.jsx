import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Bienvenido a CalendarREACT 🏡</h1>
            <Link to="/login"><button>Iniciar Sesión</button></Link>
            <Link to="/register"><button>Registrarse</button></Link>
        </div>
    );
};

export default Home;
