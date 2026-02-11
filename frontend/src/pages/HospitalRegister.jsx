import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
    FaHospital, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt,
    FaIdCard, FaCertificate, FaUser, FaBuilding
} from 'react-icons/fa';
import './Auth.css';

function HospitalRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        // Basic Information
        name: '',
        registrationNumber: '',
        licenseNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',

        // Address
        street: '',
        city: '',
        state: '',
        pincode: '',

        // Admin Contact
        adminName: '',
        adminEmail: '',
        adminPhone: '',

        // Hospital Details
        type: 'Private',
        totalBeds: '',
        specializations: [],
        website: '',
        description: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const specializationOptions = [
        'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
        'Gynecology', 'Dermatology', 'ENT', 'Ophthalmology',
        'General Medicine', 'Surgery', 'Emergency', 'ICU'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSpecializationChange = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;

        if (checked) {
            setFormData({
                ...formData,
                specializations: [...formData.specializations, value]
            });
        } else {
            setFormData({
                ...formData,
                specializations: formData.specializations.filter(s => s !== value)
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, street, city, state, pincode, adminName, adminEmail, adminPhone, ...rest } = formData;

            const registerData = {
                ...rest,
                address: {
                    street,
                    city,
                    state,
                    pincode
                },
                adminContact: {
                    name: adminName,
                    email: adminEmail,
                    phone: adminPhone,
                    designation: 'Hospital Administrator'
                },
                totalBeds: parseInt(formData.totalBeds) || 0
            };

            const response = await api.post('/hospitals/register', registerData);

            if (response.data.success) {
                setSuccess('Hospital registration submitted successfully! Awaiting admin approval.');
                setTimeout(() => {
                    navigate('/hospital/login');
                }, 3000);
            }
        } catch (err) {
            setError(
                err.response?.data?.message || 'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card auth-card-wide">
                <div className="auth-header">
                    <FaHospital className="auth-icon" />
                    <h1>Hospital Registration</h1>
                    <p>Register your hospital on MediCore Platform</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Basic Information */}
                    <h3 className="form-section-title">Basic Information</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">
                                <FaHospital className="label-icon" />
                                Hospital Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter hospital name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="type">
                                <FaBuilding className="label-icon" />
                                Hospital Type *
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="Private">Private</option>
                                <option value="Government">Government</option>
                                <option value="Semi-Government">Semi-Government</option>
                                <option value="Trust">Trust</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="registrationNumber">
                                <FaIdCard className="label-icon" />
                                Registration Number *
                            </label>
                            <input
                                type="text"
                                id="registrationNumber"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                placeholder="Hospital registration number"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="licenseNumber">
                                <FaCertificate className="label-icon" />
                                License Number *
                            </label>
                            <input
                                type="text"
                                id="licenseNumber"
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={handleChange}
                                placeholder="Hospital license number"
                                required
                            />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <h3 className="form-section-title">Contact Information</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">
                                <FaEnvelope className="label-icon" />
                                Hospital Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="hospital@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">
                                <FaPhone className="label-icon" />
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="10-digit phone number"
                                pattern="[0-9]{10}"
                                required
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <h3 className="form-section-title">Address</h3>

                    <div className="form-group">
                        <label htmlFor="street">
                            <FaMapMarkerAlt className="label-icon" />
                            Street Address *
                        </label>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            placeholder="Street address"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="city">City *</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="state">State *</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="State"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="pincode">Pincode *</label>
                            <input
                                type="text"
                                id="pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="6-digit pincode"
                                pattern="[0-9]{6}"
                                required
                            />
                        </div>
                    </div>

                    {/* Admin Contact */}
                    <h3 className="form-section-title">Admin Contact Person</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="adminName">
                                <FaUser className="label-icon" />
                                Name *
                            </label>
                            <input
                                type="text"
                                id="adminName"
                                name="adminName"
                                value={formData.adminName}
                                onChange={handleChange}
                                placeholder="Admin name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="adminEmail">
                                <FaEnvelope className="label-icon" />
                                Email *
                            </label>
                            <input
                                type="email"
                                id="adminEmail"
                                name="adminEmail"
                                value={formData.adminEmail}
                                onChange={handleChange}
                                placeholder="admin@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="adminPhone">
                                <FaPhone className="label-icon" />
                                Phone *
                            </label>
                            <input
                                type="tel"
                                id="adminPhone"
                                name="adminPhone"
                                value={formData.adminPhone}
                                onChange={handleChange}
                                placeholder="10-digit phone"
                                pattern="[0-9]{10}"
                                required
                            />
                        </div>
                    </div>

                    {/* Hospital Details */}
                    <h3 className="form-section-title">Hospital Details</h3>

                    <div className="form-group">
                        <label htmlFor="totalBeds">Total Beds</label>
                        <input
                            type="number"
                            id="totalBeds"
                            name="totalBeds"
                            value={formData.totalBeds}
                            onChange={handleChange}
                            placeholder="Number of beds"
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label>Specializations</label>
                        <div className="checkbox-grid">
                            {specializationOptions.map(spec => (
                                <label key={spec} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        value={spec}
                                        checked={formData.specializations.includes(spec)}
                                        onChange={handleSpecializationChange}
                                    />
                                    {spec}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Security */}
                    <h3 className="form-section-title">Security</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password">
                                <FaLock className="label-icon" />
                                Password *
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="At least 6 characters"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                <FaLock className="label-icon" />
                                Confirm Password *
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter password"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Submitting...' : 'Register Hospital'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already registered?{' '}
                        <Link to="/hospital/login" className="link-primary">
                            Login Here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HospitalRegister;
