import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaUserShield, FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import './Auth.css';

function AdminLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/admin/login', formData);

            if (response.data.success) {
                login(response.data.data.admin, response.data.data.token);
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(
                err.response?.data?.message || 'Login failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <FaUserShield className="auth-icon admin-icon" />
                    <h1>Admin Login</h1>
                    <p>MediCore Platform Administration</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">
                            <FaEnvelope className="label-icon" />
                            Admin Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter admin email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <FaLock className="label-icon" />
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        <FaSignInAlt />
                        {loading ? 'Logging in...' : 'Login as Admin'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        <a href="/hospital/login" className="link-secondary">
                            Hospital Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
