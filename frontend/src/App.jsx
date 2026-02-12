import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Unified Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Super Admin Dashboard */}
                    <Route
                        path="/super-admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Unified Hospital Staff Dashboard */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['hospital_admin', 'doctor', 'receptionist', 'nurse', 'billing', 'lab_technician', 'pharmacist']}>
                                <HospitalDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
