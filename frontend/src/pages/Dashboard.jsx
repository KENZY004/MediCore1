import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    FaSignOutAlt, FaHospital, FaEnvelope, FaUserShield,
    FaUsers, FaUserMd, FaCalendarAlt, FaBuilding,
    FaChartLine, FaCheckCircle, FaClock
} from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
    const { user, userType, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Determine display name and role
    const displayName = user?.name || 'User';
    const displayRole = userType === 'admin' ? 'Platform Administrator' : 'Hospital';
    const displayStatus = user?.status || user?.isActive ? 'Active' : 'Inactive';

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="branding">
                    <img src="/LogoNew.png" alt="ZenoCare Logo" className="dashboard-logo" style={{ height: '70px', marginRight: '15px', objectFit: 'contain' }} />
                </div>
                <div className="header-left">
                    <h1>Welcome, {displayName}</h1>
                    <p>{userType === 'admin' ? 'Manage the ZenoCare platform' : 'Manage your hospital operations'}</p>
                </div>
                <button onClick={handleLogout} className="btn btn-logout">
                    <FaSignOutAlt />
                    Logout
                </button>
            </div>

            <div className="dashboard-content">
                {/* Profile Card */}
                <div className="user-info-card">
                    <div className="card-header">
                        {userType === 'admin' ? (
                            <FaUserShield className="card-icon admin-color" />
                        ) : (
                            <FaHospital className="card-icon" />
                        )}
                        <h2>{userType === 'admin' ? 'Admin Profile' : 'Hospital Profile'}</h2>
                    </div>
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-label">
                                {userType === 'admin' ? <FaUserShield className="info-icon" /> : <FaHospital className="info-icon" />}
                                {userType === 'admin' ? 'Name' : 'Hospital Name'}
                            </div>
                            <div className="info-value">{displayName}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">
                                <FaEnvelope className="info-icon" />
                                Email
                            </div>
                            <div className="info-value">{user?.email}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">
                                {userType === 'admin' ? <FaUserShield className="info-icon" /> : <FaBuilding className="info-icon" />}
                                {userType === 'admin' ? 'Role' : 'Type'}
                            </div>
                            <div className="info-value">
                                <span className="role-badge">{userType === 'admin' ? user?.role : user?.type}</span>
                            </div>
                        </div>
                        {userType === 'hospital' && (
                            <>
                                <div className="info-item">
                                    <div className="info-label">
                                        {user?.status === 'approved' ? <FaCheckCircle className="info-icon success" /> : <FaClock className="info-icon warning" />}
                                        Status
                                    </div>
                                    <div className="info-value">
                                        <span className={`status-badge ${user?.status}`}>{user?.status}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Quick Access Section */}
                <div className="features-section">
                    <h3 className="section-title">Quick Access</h3>
                    <div className="features-grid">
                        {userType === 'admin' ? (
                            <>
                                <FeatureCard
                                    icon={FaHospital}
                                    title="Manage Hospitals"
                                    description="Approve, reject, and manage hospital registrations"
                                    status="Coming Soon"
                                />
                                <FeatureCard
                                    icon={FaChartLine}
                                    title="System Analytics"
                                    description="View platform-wide statistics and insights"
                                    status="Coming Soon"
                                />
                                <FeatureCard
                                    icon={FaUsers}
                                    title="User Management"
                                    description="Manage admin accounts and permissions"
                                    status="Coming Soon"
                                />
                            </>
                        ) : (
                            <>
                                <FeatureCard
                                    icon={FaUsers}
                                    title="Patients"
                                    description="Manage patient records and history"
                                    status="Coming Soon"
                                />
                                <FeatureCard
                                    icon={FaUserMd}
                                    title="Doctors"
                                    description="Manage doctor profiles and schedules"
                                    status="Coming Soon"
                                />
                                <FeatureCard
                                    icon={FaCalendarAlt}
                                    title="Appointments"
                                    description="Schedule and manage appointments"
                                    status="Coming Soon"
                                />
                                <FeatureCard
                                    icon={FaBuilding}
                                    title="Departments"
                                    description="Manage hospital departments"
                                    status="Coming Soon"
                                />
                                <FeatureCard
                                    icon={FaUsers}
                                    title="Staff"
                                    description="Manage hospital staff members"
                                    status="Coming Soon"
                                />
                                <FeatureCard
                                    icon={FaChartLine}
                                    title="Analytics"
                                    description="View hospital analytics and reports"
                                    status="Coming Soon"
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Info Banner */}
                <div className="info-banner">
                    <h4>🚧 Under Development</h4>
                    <p>
                        {userType === 'admin'
                            ? 'Admin features for hospital management and analytics are being developed.'
                            : 'Hospital management features for patients, doctors, and appointments are being developed.'}
                    </p>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description, status }) {
    return (
        <div className="feature-card">
            <div className="feature-icon">
                <Icon />
            </div>
            <h4>{title}</h4>
            <p>{description}</p>
            <button className="btn btn-feature" disabled>
                {status}
            </button>
        </div>
    );
}

export default Dashboard;
