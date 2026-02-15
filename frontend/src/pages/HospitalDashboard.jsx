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
import DoctorAppointments from '../components/DoctorAppointments';
import PatientRegistration from '../components/PatientRegistration';
import BookAppointment from '../components/BookAppointment';
import PatientList from '../components/PatientList';
import HospitalProfile from '../components/HospitalProfile';
import BillingManagement from '../components/BillingManagement';
import TodaysAppointments from '../components/TodaysAppointments';
import NewRegistrations from '../components/NewRegistrations';
import HospitalAppointments from '../components/HospitalAppointments';
import DoctorPatients from '../components/DoctorPatients';
import { NextAppointmentWidget, RecentPatientsWidget } from '../components/DoctorDashboardWidgets';

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
                            <button onClick={() => setActiveTab('appointments')} className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>
                                <FaCalendarCheck className="nav-icon" /> My Appointments
                            </button>
                            <button onClick={() => setActiveTab('patients')} className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>
                                <FaNotesMedical className="nav-icon" /> My Patients
                            </button>
                        </>
                    )}

                    {/* Receptionist Links */}
                    {hasRole(['receptionist']) && (
                        <>
                            <button onClick={() => setActiveTab('register-patient')} className={`nav-item ${activeTab === 'register-patient' ? 'active' : ''}`} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>
                                <FaUserPlus className="nav-icon" /> Register Patient
                            </button>
                            <button onClick={() => setActiveTab('book-appointment')} className={`nav-item ${activeTab === 'book-appointment' ? 'active' : ''}`} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>
                                <FaCalendarCheck className="nav-icon" /> Book Appointment
                            </button>
                            <button onClick={() => setActiveTab('patient-list')} className={`nav-item ${activeTab === 'patient-list' ? 'active' : ''}`} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>
                                <FaUsers className="nav-icon" /> All Patients
                            </button>
                        </>
                    )}

                    {/* Billing Links */}
                    {hasRole(['billing', 'hospital_admin']) && (
                        <button onClick={() => setActiveTab('billing')} className={`nav-item ${activeTab === 'billing' ? 'active' : ''}`} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>
                            <FaFileInvoiceDollar className="nav-icon" /> Billing & Invoices
                        </button>
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
                                    <div onClick={() => setActiveTab('staff')} style={{ cursor: 'pointer' }}>
                                        <StatCard title="Total Staff" value={stats.totalStaff || 0} icon={<FaUserMd />} bgClass="bg-blue" />
                                    </div>
                                    <div onClick={() => setActiveTab('patient-list')} style={{ cursor: 'pointer' }}>
                                        <StatCard title="Total Patients" value={stats.totalPatients || 0} icon={<FaUsers />} bgClass="bg-green" />
                                    </div>
                                    <div onClick={() => setActiveTab('billing')} style={{ cursor: 'pointer' }}>
                                        <StatCard title="Total Revenue" value={`$${stats.totalRevenue || 0}`} icon={<FaFileInvoiceDollar />} bgClass="bg-purple" />
                                    </div>
                                    <div onClick={() => setActiveTab('appointments')} style={{ cursor: 'pointer' }}>
                                        <StatCard title="Total Appointments" value={stats.totalAppointments || 0} icon={<FaCalendarCheck />} bgClass="bg-orange" />
                                    </div>
                                </div>
                            )}

                            {/* Doctor View */}
                            {hasRole(['doctor']) && (
                                <>
                                    <div className="stats-grid">
                                        {/* Unclickable Today's Appointments */}
                                        <StatCard
                                            title="Today's Appointments"
                                            value={stats.todayAppointments || 0}
                                            icon={<FaCalendarCheck />}
                                            bgClass="bg-blue"
                                        />
                                        <div onClick={() => setActiveTab('appointments')} style={{ cursor: 'pointer' }}>
                                            <StatCard
                                                title="Pending Reports"
                                                value={stats.pendingReports || 0}
                                                icon={<FaNotesMedical />}
                                                bgClass="bg-orange"
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                                        {/* Next Appointment Widget */}
                                        <NextAppointmentWidget onViewAll={() => setActiveTab('appointments')} />

                                        {/* Recent Patients Widget */}
                                        <RecentPatientsWidget onViewAll={() => setActiveTab('patients')} />
                                    </div>
                                </>
                            )}

                            {/* Receptionist View */}
                            {hasRole(['receptionist']) && (
                                <div className="stats-grid">
                                    <StatCard
                                        title="New Registrations"
                                        value={stats.newPatients || 0}
                                        icon={<FaUserPlus />}
                                        bgClass="bg-green"
                                        onClick={() => setActiveTab('stats-new-registrations')}
                                    />
                                    <StatCard
                                        title="Today's Appointments"
                                        value={stats.todayAppointments || 0}
                                        icon={<FaCalendarCheck />}
                                        bgClass="bg-blue"
                                        onClick={() => setActiveTab('stats-today-appointments')}
                                    />
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
                                            <ActionBtn icon={<FaUserPlus />} label="New Patient" onClick={() => setActiveTab('register-patient')} />
                                            <ActionBtn icon={<FaCalendarCheck />} label="Schedule" onClick={() => setActiveTab('book-appointment')} />
                                        </>
                                    )}

                                    {/* Doctor Actions */}
                                    {hasRole(['doctor']) && (
                                        <ActionBtn icon={<FaCalendarCheck />} label="View Schedule" onClick={() => setActiveTab('appointments')} />
                                    )}

                                    {/* Billing Actions */}
                                    {hasRole(['billing', 'hospital_admin']) && (
                                        <ActionBtn icon={<FaFileInvoiceDollar />} label="New Invoice" onClick={() => setActiveTab('billing')} />
                                    )}

                                    {!hasRole(['receptionist', 'billing', 'doctor', 'hospital_admin']) && (
                                        <p>No specific actions available for your role.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'staff' && <StaffManagement />}
                    {activeTab === 'appointments' && (
                        hasRole(['hospital_admin']) ? <HospitalAppointments /> : <DoctorAppointments />
                    )}
                    {activeTab === 'patients' && (
                        hasRole(['hospital_admin']) ? <PatientList readOnly={true} /> : <DoctorPatients />
                    )}

                    {activeTab === 'profile' && <HospitalProfile />}

                    {activeTab === 'register-patient' && <PatientRegistration onSuccess={(data) => {
                        // Optional: Auto-switch to book appointment with this patient
                        // For now, just stay on page or show success
                    }} />}
                    {activeTab === 'book-appointment' && <BookAppointment />}
                    {activeTab === 'patient-list' && <PatientList readOnly={hasRole(['hospital_admin'])} />}
                    {activeTab === 'billing' && <BillingManagement />}

                    {activeTab === 'stats-today-appointments' && <TodaysAppointments onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'stats-new-registrations' && <NewRegistrations onBack={() => setActiveTab('dashboard')} />}

                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, bgClass, onClick }) {
    return (
        <div className="stat-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
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
