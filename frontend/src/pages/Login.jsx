import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import './Auth.css';

function Login() {
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
            // Unified Login Endpoint
            const response = await api.post('/auth/login', formData);

            if (response.data.success) {
                const { user, token } = response.data;
                login(user, token);

                // Redirect based on user type
                if (user.userType === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/hospital/dashboard');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Login failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <img src="/LogoNew.png" alt="ZenoCare Logo" className="auth-logo" style={{ height: '120px', marginBottom: '5px', objectFit: 'contain' }} />
                    <h1>Sign In</h1>
                    <p>Access your ZenoCare account</p>
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
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
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
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className="form-footer">
                        <Link to="/forgot-password" className="link-text">
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        <FaSignInAlt />
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="link-primary">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
