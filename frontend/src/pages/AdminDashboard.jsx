import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
    FaSignOutAlt, FaChartPie, FaHospital, FaCheckCircle,
    FaTimesCircle, FaBan, FaSearch, FaEllipsisV, FaBuilding,
    FaPhoneAlt, FaEnvelope, FaUserShield, FaMapMarkerAlt, FaBars, FaTimes
} from 'react-icons/fa';

// Renamed for clarity in usage above (FaBarsIcon, FaTimesWithMargin)
const FaBarsIcon = FaBars;
const FaTimesWithMargin = FaTimes;
import './Dashboard.css';

// ... (existing code until return statement of AdminDashboard component, no changes to logic)



function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalHospitals: 0,
        pendingHospitals: 0,
        approvedHospitals: 0,
        rejectedHospitals: 0,
        activeHospitals: 0,
        recentRegistrations: 0
    });
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [hospitalStatusFilter, setHospitalStatusFilter] = useState('all'); // all, pending, approved, rejected
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleViewAdmin = (hospital) => {
        setSelectedHospital(hospital);
        setShowAdminModal(true);
    };

    const closeAdminModal = () => {
        setShowAdminModal(false);
        setSelectedHospital(null);
    };

    // Fetch Stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/analytics');
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            }
        };
        fetchStats();
    }, []);

    // Fetch Hospitals
    useEffect(() => {
        if (activeTab === 'hospitals') {
            fetchHospitals();
        }
    }, [activeTab, hospitalStatusFilter, searchTerm]);

    const fetchHospitals = async () => {
        setLoading(true);
        try {
            let query = `/admin/hospitals?page=1&limit=100`; // Simplify pagination for now
            if (hospitalStatusFilter !== 'all') {
                query += `&status=${hospitalStatusFilter}`;
            }
            if (searchTerm) {
                query += `&search=${searchTerm}`;
            }

            const { data } = await api.get(query);
            if (data.success) {
                setHospitals(data.data.hospitals);
            }
        } catch (error) {
            console.error("Failed to fetch hospitals", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.put(`/admin/hospitals/${id}/approve`);
            fetchHospitals(); // Refresh list
            // Optionally update stats locally or refetch stats
        } catch (error) {
            alert('Failed to approve hospital');
        }
    };

    const handleReject = async (id) => {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;

        try {
            await api.put(`/admin/hospitals/${id}/reject`, { reason });
            fetchHospitals();
        } catch (error) {
            alert('Failed to reject hospital');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await api.put(`/admin/hospitals/${id}/toggle-status`);
            fetchHospitals();
        } catch (error) {
            alert('Failed to toggle status');
        }
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="dashboard-layout">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && <div className="overlay" onClick={closeMobileMenu}></div>}

            {/* Sidebar */}
            <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <img src="/LogoNew.png" alt="Logo" className="brand-logo" />
                    <span className="brand-text">ZenoCare</span>
                    {/* Close button for mobile sidebar */}
                    <button className="mobile-menu-btn" onClick={closeMobileMenu} style={{ marginLeft: 'auto', fontSize: '1.2rem' }}>
                        <FaTimesWithMargin />
                    </button>
                </div>

                <nav className="nav-menu">
                    <button onClick={() => { setActiveTab('dashboard'); closeMobileMenu(); }} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
                        <FaChartPie className="nav-icon" /> Dashboard
                    </button>
                    <button onClick={() => { setActiveTab('hospitals'); closeMobileMenu(); }} className={`nav-item ${activeTab === 'hospitals' ? 'active' : ''}`}>
                        <FaHospital className="nav-icon" /> Hospitals
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-mini-profile">
                        <div className="avatar">A</div>
                        <div className="user-details">
                            <h4>{user?.name || 'Super Admin'}</h4>
                            <span className="role-badge">Admin</span>
                        </div>
                        <button onClick={handleLogout} className="btn-icon-only" title="Logout">
                            <FaSignOutAlt />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                            <FaBarsIcon />
                        </button>
                        <div className="welcome-text">
                            <h1>Admin Dashboard</h1>
                            <p>{currentDate}</p>
                        </div>
                    </div>
                    <div className="top-actions">
                        <div className="role-indicator">
                            Logged in as: <strong>SUPER ADMIN</strong>
                        </div>
                    </div>
                </header>

                <div className="dashboard-content-area" style={{ padding: '2rem' }}>

                    {activeTab === 'dashboard' && (
                        <>
                            <div className="stats-grid">
                                <StatCard
                                    title="Total Hospitals"
                                    value={stats.totalHospitals}
                                    icon={<FaBuilding />}
                                    bgClass="bg-blue"
                                    onClick={() => { setActiveTab('hospitals'); setHospitalStatusFilter('all'); }}
                                />
                                <StatCard
                                    title="Pending Approvals"
                                    value={stats.pendingHospitals}
                                    icon={<FaCheckCircle />}
                                    bgClass="bg-orange"
                                    onClick={() => { setActiveTab('hospitals'); setHospitalStatusFilter('pending'); }}
                                />
                                <StatCard
                                    title="Active Hospitals"
                                    value={stats.activeHospitals || stats.approvedHospitals}
                                    icon={<FaHospital />}
                                    bgClass="bg-green"
                                    onClick={() => { setActiveTab('hospitals'); setHospitalStatusFilter('approved'); }}
                                />
                                <StatCard
                                    title="Rejected"
                                    value={stats.rejectedHospitals}
                                    icon={<FaBan />}
                                    bgClass="bg-red"
                                    onClick={() => { setActiveTab('hospitals'); setHospitalStatusFilter('rejected'); }}
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'hospitals' && (
                        <div className="content-card">
                            <div className="card-header">
                                <h2>Hospital Management</h2>
                                <div className="card-actions">
                                    <div className="search-bar">
                                        <FaSearch className="search-icon" />
                                        <input
                                            type="text"
                                            placeholder="Search hospitals..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <select
                                        value={hospitalStatusFilter}
                                        onChange={(e) => setHospitalStatusFilter(e.target.value)}
                                        className="status-filter"
                                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Hospital Name</th>
                                            <th>Email</th>
                                            <th>Type</th>
                                            <th>Reg. Number</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading...</td></tr>
                                        ) : hospitals.length === 0 ? (
                                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No hospitals found</td></tr>
                                        ) : (
                                            hospitals.map(hospital => (
                                                <tr key={hospital._id}>
                                                    <td data-label="Hospital Name">
                                                        <div className="patient-name-cell">
                                                            <div className="avatar-sm">{hospital.name.charAt(0)}</div>
                                                            <div>
                                                                <div className="fw-bold">{hospital.name}</div>
                                                                <div className="text-muted small">
                                                                    {[hospital.address?.city, hospital.address?.state].filter(Boolean).join(', ')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td data-label="Email">{hospital.email}</td>
                                                    <td data-label="Type"><span className="badge badge-gray">{hospital.type}</span></td>
                                                    <td data-label="Reg. Number">{hospital.registrationNumber}</td>
                                                    <td data-label="Status">
                                                        <span className={`status-badge status-${hospital.status}`}>
                                                            {hospital.status}
                                                        </span>
                                                    </td>
                                                    <td data-label="Actions">
                                                        <div className="action-buttons">
                                                            <button
                                                                className="btn-icon btn-info"
                                                                title="View Admin Info"
                                                                onClick={() => handleViewAdmin(hospital)}
                                                                style={{ color: '#3b82f6' }}
                                                            >
                                                                <FaSearch />
                                                            </button>

                                                            {hospital.status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        className="btn-icon btn-approve"
                                                                        title="Approve"
                                                                        onClick={() => handleApprove(hospital._id)}
                                                                        style={{ color: '#10b981' }}
                                                                    >
                                                                        <FaCheckCircle />
                                                                    </button>
                                                                    <button
                                                                        className="btn-icon btn-reject"
                                                                        title="Reject"
                                                                        onClick={() => handleReject(hospital._id)}
                                                                        style={{ color: '#ef4444' }}
                                                                    >
                                                                        <FaTimesCircle />
                                                                    </button>
                                                                </>
                                                            )}
                                                            {hospital.status === 'approved' && (
                                                                <button
                                                                    className="btn-icon btn-suspend"
                                                                    title="Suspend"
                                                                    onClick={() => handleToggleStatus(hospital._id)}
                                                                    style={{ color: '#f59e0b' }}
                                                                >
                                                                    <FaBan />
                                                                </button>
                                                            )}
                                                            {hospital.status === 'suspended' && (
                                                                <button
                                                                    className="btn-icon btn-activate"
                                                                    title="Activate"
                                                                    onClick={() => handleToggleStatus(hospital._id)}
                                                                    style={{ color: '#10b981' }}
                                                                >
                                                                    <FaCheckCircle />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>

                {/* Admin Info Modal */}
                {showAdminModal && selectedHospital && selectedHospital.adminContact && (
                    <div className="modal-overlay" onClick={closeAdminModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px', padding: '0' }}>
                            <div className="modal-header" style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)' }}>Hospital Administrator</h2>
                                <button className="close-btn" onClick={closeAdminModal} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>&times;</button>
                            </div>

                            <div className="modal-body" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                                    <div className="admin-avatar-large" style={{
                                        width: '64px', height: '64px', borderRadius: '50%', background: '#eff6ff',
                                        color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.5rem', fontWeight: 'bold'
                                    }}>
                                        {selectedHospital.adminContact.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{selectedHospital.adminContact.name}</h3>
                                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            {selectedHospital.adminContact.designation || 'Hospital Administrator'}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.85rem', color: '#64748b' }}>
                                            <FaHospital /> {selectedHospital.name}
                                        </div>
                                    </div>
                                </div>

                                <div className="info-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div className="info-item" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                            <FaEnvelope size={14} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Email</label>
                                            <a href={`mailto:${selectedHospital.adminContact.email}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }}>
                                                {selectedHospital.adminContact.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="info-item" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                            <FaPhoneAlt size={14} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Phone</label>
                                            <a href={`tel:${selectedHospital.adminContact.phone}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }}>
                                                {selectedHospital.adminContact.phone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="info-item" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                            <FaMapMarkerAlt size={14} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Location</label>
                                            <span style={{ color: 'var(--text-primary)', lineHeight: '1.4', fontSize: '0.95rem' }}>
                                                {[selectedHospital.address?.street, selectedHospital.address?.city, selectedHospital.address?.state, selectedHospital.address?.pincode].filter(Boolean).join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer" style={{ padding: '1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', borderRadius: '0 0 12px 12px' }}>
                                <button className="btn" onClick={closeAdminModal} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.6rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', color: 'var(--text-primary)' }}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
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

export default AdminDashboard;
