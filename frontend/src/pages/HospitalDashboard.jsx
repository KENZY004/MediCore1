import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
    FaSignOutAlt, FaHospital, FaUserMd,
    FaCalendarCheck, FaChartPie, FaPlus,
    FaSearch, FaBell, FaUsers, FaUserPlus,
    FaFileInvoiceDollar, FaNotesMedical
} from 'react-icons/fa';
import './Dashboard.css';

import StaffManagement from '../components/StaffManagement';

function HospitalDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Helper to check roles
    const hasRole = (roles) => {
        if (!user || !user.role) return false;
        return roles.includes(user.role);
    };

    const [stats, setStats] = useState({
        totalStaff: 0,
        totalPatients: 0,
        totalRevenue: 0,
        totalAppointments: 0,
        doctorCount: 0,
        nurseCount: 0,
        todayAppointments: 0,
        pendingReports: 0,
        newPatients: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                let endpoint = '';
                // Check role and decide endpoint
                // Note: user.role is from context, might be 'hospital_admin', 'doctor', 'receptionist'
                if (hasRole(['hospital_admin'])) endpoint = '/hospital/stats';
                else if (hasRole(['doctor'])) endpoint = '/doctor/stats';
                else if (hasRole(['receptionist'])) endpoint = '/reception/stats';

                if (endpoint) {
                    const { data } = await api.get(endpoint);
                    if (data.success) {
                        setStats(prev => ({ ...prev, ...data.data }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoadingStats(false);
            }
        };

        if (user) fetchStats();
    }, [user]);

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src="/LogoNew.png" alt="Logo" className="brand-logo" />
                    <span className="brand-text">ZenoCare</span>
                </div>

                <nav className="nav-menu">
                    {/* Common for all */}
                    <button onClick={() => setActiveTab('dashboard')} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>
                        <FaChartPie className="nav-icon" /> Dashboard
                    </button>

                    {/* Hospital Admin Links */}
                    {hasRole(['hospital_admin']) && (
                        <>
                            <button onClick={() => setActiveTab('profile')} className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>
                                <FaHospital className="nav-icon" /> Hospital Profile
                            </button>
                            <button onClick={() => setActiveTab('staff')} className={`nav-item ${activeTab === 'staff' ? 'active' : ''}`} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>
                                <FaUserMd className="nav-icon" /> Manage Staff
                            </button>
                        </>
                    )}

                    {/* Doctor Links */}
                    {hasRole(['doctor']) && (
                        <>
                            <a href="#" className="nav-item">
                                <FaCalendarCheck className="nav-icon" /> My Appointments
                            </a>
                            <a href="#" className="nav-item">
                                <FaNotesMedical className="nav-icon" /> My Patients
                            </a>
                        </>
                    )}

                    {/* Receptionist Links */}
                    {hasRole(['receptionist']) && (
                        <>
                            <a href="#" className="nav-item">
                                <FaUserPlus className="nav-icon" /> Register Patient
                            </a>
                            <a href="#" className="nav-item">
                                <FaCalendarCheck className="nav-icon" /> Book Appointment
                            </a>
                        </>
                    )}

                    {/* Billing Links */}
                    {hasRole(['billing', 'hospital_admin']) && (
                        <a href="#" className="nav-item">
                            <FaFileInvoiceDollar className="nav-icon" /> Billing & Invoices
                        </a>
                    )}

                </nav>

                <div className="sidebar-footer">
                    <div className="user-mini-profile">
                        <div className="avatar">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="user-details">
                            <h4>{user?.name}</h4>
                            <span className="role-badge">{user?.role?.replace('_', ' ')}</span>
                        </div>
                        <button onClick={handleLogout} className="btn-icon-only" title="Logout">
                            <FaSignOutAlt />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Top Bar */}
                <header className="top-bar">
                    <div className="welcome-text">
                        <h1>Welcome back, {user?.name}</h1>
                        <p>{currentDate}</p>
                    </div>

                    <div className="top-actions">
                        <div className="role-indicator">
                            Logged in as: <strong>{user?.role?.replace('_', ' ').toUpperCase()}</strong>
                        </div>
                    </div>
                </header>

                {/* Dashboard Stats - Role Specific */}
                <div className="dashboard-content-area" style={{ padding: '2rem' }}>

                    {activeTab === 'dashboard' && (
                        <>
                            {/* Hospital Admin View */}
                            {hasRole(['hospital_admin']) && (
                                <div className="stats-grid">
                                    <StatCard title="Total Staff" value={stats.totalStaff || 0} icon={<FaUserMd />} bgClass="bg-blue" />
                                    <StatCard title="Total Patients" value={stats.totalPatients || 0} icon={<FaUsers />} bgClass="bg-green" />
                                    <StatCard title="Total Revenue" value={`$${stats.totalRevenue || 0}`} icon={<FaFileInvoiceDollar />} bgClass="bg-purple" />
                                    <StatCard title="Total Appointments" value={stats.totalAppointments || 0} icon={<FaCalendarCheck />} bgClass="bg-orange" />
                                </div>
                            )}

                            {/* Doctor View */}
                            {hasRole(['doctor']) && (
                                <div className="stats-grid">
                                    <StatCard title="Today's Appointments" value={stats.todayAppointments || 0} icon={<FaCalendarCheck />} bgClass="bg-blue" />
                                    <StatCard title="Pending Reports" value={stats.pendingReports || 0} icon={<FaNotesMedical />} bgClass="bg-orange" />
                                </div>
                            )}

                            {/* Receptionist View */}
                            {hasRole(['receptionist']) && (
                                <div className="stats-grid">
                                    <StatCard title="New Registrations" value={stats.newPatients || 0} icon={<FaUserPlus />} bgClass="bg-green" />
                                    <StatCard title="Today's Appointments" value={stats.todayAppointments || 0} icon={<FaCalendarCheck />} bgClass="bg-blue" />
                                </div>
                            )}

                            {/* Placeholder for actions */}
                            <div className="dashboard-section" style={{ marginTop: '2rem' }}>
                                <div className="section-header">
                                    <h2>Quick Actions</h2>
                                </div>

                                <div className="quick-actions">
                                    {/* Hospital Admin Actions */}
                                    {hasRole(['hospital_admin']) && (
                                        <>
                                            <ActionBtn icon={<FaUserMd />} label="Add Staff" onClick={() => setActiveTab('staff')} />
                                            <ActionBtn icon={<FaUserPlus />} label="Add Doctor" onClick={() => setActiveTab('staff')} />
                                            <ActionBtn icon={<FaHospital />} label="Update Profile" onClick={() => setActiveTab('profile')} />
                                        </>
                                    )}

                                    {/* Receptionist Actions */}
                                    {hasRole(['receptionist']) && (
                                        <>
                                            <ActionBtn icon={<FaUserPlus />} label="New Patient" />
                                            <ActionBtn icon={<FaCalendarCheck />} label="Schedule" />
                                        </>
                                    )}

                                    {/* Doctor Actions */}
                                    {hasRole(['doctor']) && (
                                        <ActionBtn icon={<FaCalendarCheck />} label="Schedule" />
                                    )}

                                    {/* Billing Actions */}
                                    {hasRole(['billing', 'hospital_admin']) && (
                                        <ActionBtn icon={<FaFileInvoiceDollar />} label="New Invoice" />
                                    )}

                                    {!hasRole(['receptionist', 'billing', 'doctor', 'hospital_admin']) && (
                                        <p>No specific actions available for your role.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'staff' && <StaffManagement />}

                    {activeTab === 'profile' && <div><h2>Hospital Profile - Coming Soon</h2></div>}

                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, bgClass }) {
    return (
        <div className="stat-card">
            <div className="stat-info">
                <h3>{title}</h3>
                <div className="stat-value">{value}</div>
            </div>
            <div className={`stat-icon-bg ${bgClass}`}>
                {icon}
            </div>
        </div>
    );
}

function ActionBtn({ icon, label, onClick }) {
    return (
        <button className="action-btn" onClick={onClick}>
            <span className="action-icon">{icon}</span>
            <span>{label}</span>
        </button>
    );
}

export default HospitalDashboard;
