import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import './Dashboard.css';

function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="branding">
                    <img src="/LogoNew.png" alt="ZenoCare Logo" className="dashboard-logo" style={{ height: '70px', marginRight: '15px', objectFit: 'contain' }} />
                </div>
                <div className="header-left">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome, {user?.name || 'Admin'}</p>
                </div>
                <button onClick={handleLogout} className="btn btn-logout">
                    <FaSignOutAlt />
                    Logout
                </button>
            </div>

            <div className="dashboard-content">
                <div className="admin-placeholder-card">
                    <FaUserShield className="admin-placeholder-icon" />
                    <h2>Admin Panel Under Construction</h2>
                    <p>Detailed analytics and hospital management features will be available in the next update.</p>
                    <p className="admin-status">Logged in as: <strong>{user?.email}</strong></p>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
