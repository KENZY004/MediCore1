import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaHospital, FaSave, FaEdit, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

function HospitalProfile() {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        description: '',
        adminContact: '',
        specializations: [],
        totalBeds: 0,
        registrationNumber: '',
        type: ''
    });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/hospital/profile');
            if (data.success) {
                setProfile(data.data.hospital);
                setFormData(data.data.hospital);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put('/hospital/profile', formData);
            if (data.success) {
                alert('Profile updated successfully');
                setProfile(data.data.hospital);
                setEditing(false);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating profile');
        }
    };

    // Helper to safely get nested values or handle legacy string data
    const getVal = (obj, field, defaultVal = '') => {
        if (typeof obj === 'string') return defaultVal; // If schema changed but DB has string
        return obj?.[field] || defaultVal;
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;

    return (
        <div className="hospital-profile">
            <div className="section-header section-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Hospital Profile</h2>
                {!editing && (
                    <button className="btn-primary" onClick={() => setEditing(true)} style={{
                        background: 'var(--primary-blue)', color: 'white', border: 'none', padding: '10px 20px',
                        borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                        fontWeight: '500', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <FaEdit /> Edit Profile
                    </button>
                )}
            </div>

            {editing ? (
                <div className="card" style={{ padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <form onSubmit={handleSubmit} className="profile-edit-grid" style={{ gap: '1.5rem' }}>
                        {/* Basic Info */}
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Hospital Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} />
                        </div>

                        <div className="form-group">
                            <label>Main Phone Number</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} />
                        </div>

                        <div className="form-group">
                            <label>Website</label>
                            <input type="text" name="website" value={formData.website} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} />
                        </div>

                        {/* Admin Contact Group */}
                        <div style={{ gridColumn: 'span 2', background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                            <h4 style={{ marginBottom: '1rem', color: '#555' }}>Admin Contact Person</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" name="adminContact.name" value={getVal(formData.adminContact, 'name')} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" name="adminContact.email" value={getVal(formData.adminContact, 'email')} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="text" name="adminContact.phone" value={getVal(formData.adminContact, 'phone')} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} />
                                </div>
                            </div>
                        </div>

                        {/* Address Group */}
                        <div style={{ gridColumn: 'span 2', background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                            <h4 style={{ marginBottom: '1rem', color: '#555' }}>Address</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label>Street</label>
                                    <input type="text" name="address.street" value={getVal(formData.address, 'street')} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} />
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" name="address.city" value={getVal(formData.address, 'city')} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input type="text" name="address.state" value={getVal(formData.address, 'state')} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} />
                                </div>
                                <div className="form-group">
                                    <label>Pincode</label>
                                    <input type="text" name="address.pincode" value={getVal(formData.address, 'pincode')} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Total Beds</label>
                            <input type="number" name="totalBeds" value={formData.totalBeds} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} />
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', minHeight: '100px' }} />
                        </div>

                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary" style={{
                                background: 'var(--primary-blue)', color: 'white', border: 'none', padding: '12px 24px',
                                borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                fontWeight: '500', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                <FaSave /> Save Changes
                            </button>
                            <button type="button" className="btn-secondary" onClick={() => { setEditing(false); setFormData(profile); }} style={{
                                padding: '12px 24px', border: '1px solid #ccc', borderRadius: '6px', background: 'transparent',
                                cursor: 'pointer', color: '#666', fontWeight: '500'
                            }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="profile-view-grid" style={{ gap: '2rem' }}>
                    {/* Left Column: Key Info */}
                    <div className="card" style={{ padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                        <div className="hospital-avatar" style={{
                            width: '120px', height: '120px', background: '#e3f2fd', color: '#1976d2',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '3rem', margin: '0 auto 1.5rem'
                        }}>
                            <FaHospital />
                        </div>
                        <h3 style={{ marginBottom: '0.5rem' }}>{profile.name}</h3>
                        <span className="badge" style={{
                            background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: '16px', fontSize: '0.875rem'
                        }}>
                            {profile.type?.toUpperCase()} HOSPITAL
                        </span>

                        <div style={{ marginTop: '2rem', textAlign: 'left' }}>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                <FaEnvelope style={{ color: '#666' }} /> {profile.email}
                            </p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                <FaPhone style={{ color: '#666' }} /> {profile.phone}
                            </p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                <FaGlobe style={{ color: '#666' }} /> {profile.website || 'No website'}
                            </p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                <FaMapMarkerAlt style={{ color: '#666' }} />
                                {typeof profile.address === 'object'
                                    ? `${profile.address.street}, ${profile.address.city}, ${profile.address.state} - ${profile.address.pincode}`
                                    : profile.address
                                }
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="card" style={{ padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>About Hospital</h4>
                        <p style={{ lineHeight: '1.6', color: '#444', marginBottom: '2rem' }}>
                            {profile.description || 'No description provided.'}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <h5 style={{ color: '#666', marginBottom: '0.5rem' }}>Registration Number</h5>
                                <p style={{ fontWeight: '500' }}>{profile.registrationNumber}</p>
                            </div>
                            <div>
                                <h5 style={{ color: '#666', marginBottom: '0.5rem' }}>Total Beds</h5>
                                <p style={{ fontWeight: '500' }}>{profile.totalBeds}</p>
                            </div>
                            <div>
                                <h5 style={{ color: '#666', marginBottom: '0.5rem' }}>Admin Contact</h5>
                                <p style={{ fontWeight: '500' }}>
                                    {typeof profile.adminContact === 'object'
                                        ? `${profile.adminContact.name} (${profile.adminContact.phone})`
                                        : profile.adminContact
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HospitalProfile;
