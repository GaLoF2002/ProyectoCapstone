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


import React from "react";
import PropiedadIndividual from "./pages/PropiedadIndividual.jsx";
import MisCitasCliente from "./pages/MisCitasCliente.jsx";

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
                    <Route path="/cliente" element={<ClienteDashboard/>} />
                    <Route path="/perfil" element={<Perfil/>} />
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

                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;