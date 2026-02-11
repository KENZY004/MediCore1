import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import { FaHospital, FaUsers, FaCalendarAlt, FaChartLine, FaUserShield } from 'react-icons/fa';
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

                    {/* Admin Dashboard */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Hospital Dashboard */}
                    <Route
                        path="/hospital/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['hospital']}>
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

function Home() {
    return (
        <div className="app">
            <header className="app-header">
                <div className="header-content">
                    <div className="logo-section">
                        <img src="/LogoNew.png" alt="ZenoCare Logo" className="header-logo" style={{ height: '100px', width: 'auto', objectFit: 'contain' }} />
                        <div>
                            <h1>ZenoCare Hospital Management System</h1>
                            <p>B2B Hospital Management Platform</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="app-main">
                <div className="home">
                    <div className="welcome-section">
                        <h2>Streamline Your Hospital Operations</h2>
                        <p className="subtitle">
                            Comprehensive B2B platform for hospitals to manage patients, doctors, appointments, and staff
                        </p>

                        <div className="cta-buttons">
                            <a href="/login" className="btn btn-primary">Login</a>
                            <a href="/register" className="btn btn-secondary">Register Hospital</a>
                        </div>
                    </div>

                    <div className="features-section">
                        <h3 className="section-title">Platform Features</h3>
                        <div className="features-grid">
                            <FeatureCard
                                icon="FaHospital"
                                title="Hospital Registration"
                                description="Register your hospital and get admin approval to access the platform"
                            />
                            <FeatureCard
                                icon="FaUsers"
                                title="Patient Management"
                                description="Manage patient records, medical history, and appointments"
                            />
                            <FeatureCard
                                icon="FaCalendarAlt"
                                title="Internal Scheduling"
                                description="Schedule appointments and manage doctor availability"
                            />
                            <FeatureCard
                                icon="FaChartLine"
                                title="Analytics Dashboard"
                                description="Hospital-specific and system-wide analytics"
                            />
                            <FeatureCard
                                icon="FaUserShield"
                                title="Admin Oversight"
                                description="Platform administrators manage hospital approvals and monitor usage"
                            />
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>For Hospitals</h3>
                        <p>Register your hospital, get approved by admin, and start managing your operations efficiently.</p>

                        <h3>For Administrators</h3>
                        <p>Oversee the platform, approve hospital registrations, and monitor system-wide analytics.</p>
                    </div>
                </div>
            </main>

            <footer className="app-footer">
                <p>© 2026 ZenoCare HMS. Developed by Kenzn - LPU BTech CSE</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    const icons = {
        FaHospital,
        FaUsers,
        FaCalendarAlt,
        FaChartLine,
        FaUserShield,
    };

    const Icon = icons[icon];

    return (
        <div className="feature-card">
            <div className="feature-icon">
                <Icon />
            </div>
            <h4>{title}</h4>
            <p>{description}</p>
        </div>
    );
}

export default App;
