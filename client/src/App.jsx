import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './pages/AdminDashboard';
import SellerDashboard from './pages/VendedorDashboard';
import Home from './pages/Home';
import ClienteDashboard from "./pages/ClienteDashboard";
import Perfil from "./pages/PerfilCliente.jsx";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Propiedades from './pages/Propiedades';
import CrearPropiedad from './pages/CrearPropiedad';
import AgendamientoVendedor from "./pages/AgendamientoVendedor.jsx";
import AgendarCita from "./pages/AgendarCita.jsx";
import GestionarCitasVendedor from "./pages/GestionarCitasVendedor.jsx";
import FormularioEvaluacion from "./pages/FormularioEvaluacion";
import AdminCompradoresPage from "./pages/AdminCompradoresPage.jsx";
import IndicadoresPage from "./pages/IndicadoresPage.jsx";
import SimuladorFinanciamiento from "./pages/SimuladorFinanciamiento.jsx";
import VistaPublicaPropiedad from "./pages/VistaPublicaPropiedad";
import PropiedadIndividual from "./pages/PropiedadIndividual.jsx";
import MisCitasCliente from "./pages/MisCitasCliente.jsx";
import ResumenMensualAdmin from "./pages/ResumenMensualAdmin.jsx";
import EstadisticasCitasVendedor from "./pages/EstadisticasCitasVendedor.jsx";
import About from './components/About.jsx'; // Import the About component
import Contact from "./components/Contact.jsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/vendedor" element={<SellerDashboard />} />
                    <Route path="/cliente" element={<ClienteDashboard />} />
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/propiedades" element={<Propiedades />} />
                    <Route path="/crear-propiedad" element={<CrearPropiedad />} />
                    <Route path="/propiedades/:id" element={<PropiedadIndividual />} />
                    <Route path="/agendamiento-vendedor" element={<AgendamientoVendedor />} />
                    <Route path="/creacion-cita" element={<AgendarCita />} />
                    <Route path="/gestionar-citas" element={<GestionarCitasVendedor />} />
                    <Route path="/cliente/mis-citas" element={<MisCitasCliente />} />
                    <Route path="/cliente/evaluacion/:propiedadId" element={<FormularioEvaluacion />} />
                    <Route path="/evaluacion" element={<FormularioEvaluacion />} />
                    <Route path="/admin/compradores" element={<AdminCompradoresPage />} />
                    <Route path="/indicadores" element={<IndicadoresPage />} />
                    <Route path="/simulador-financiamiento" element={<SimuladorFinanciamiento />} />
                    <Route path="/estadistica-vendedor" element={<EstadisticasCitasVendedor />} />
                    <Route path="/resumen-mensual" element={<ResumenMensualAdmin />} />
                    <Route path="/propiedad/:id" element={<VistaPublicaPropiedad />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
