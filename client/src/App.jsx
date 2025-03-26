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
import React from "react";

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
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
