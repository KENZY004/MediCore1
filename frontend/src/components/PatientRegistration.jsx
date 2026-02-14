import { useState } from 'react';
import api from '../utils/api';
import { FaUserPlus, FaSave } from 'react-icons/fa';

function PatientRegistration({ onSuccess }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'Male',
        phone: '',
        email: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        },
        bloodGroup: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/reception/patients', formData);
            if (data.success) {
                alert(`Patient Registered Successfully! ID: ${data.data.patientId}`);
                setFormData({
                    firstName: '', lastName: '', dateOfBirth: '', gender: 'Male',
                    phone: '', email: '', address: { street: '', city: '', state: '', pincode: '' }, bloodGroup: ''
                });
                if (onSuccess) onSuccess(data.data); // Pass patient data to parent (e.g., for auto-filling appointment)
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error registering patient');
        }
    };

    return (
        <div className="patient-registration">
            <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                <h3><FaUserPlus /> Register New Patient</h3>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required autoComplete="off" style={{ padding: '0.8rem' }} />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required autoComplete="off" style={{ padding: '0.8rem' }} />

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '0.8rem', color: '#666' }}>Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required style={{ padding: '0.8rem' }} />
                </div>

                <select name="gender" value={formData.gender} onChange={handleChange} style={{ padding: '0.8rem' }}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required style={{ padding: '0.8rem' }} />
                <input type="email" name="email" placeholder="Email (Optional)" value={formData.email} onChange={handleChange} style={{ padding: '0.8rem' }} />

                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} style={{ padding: '0.8rem' }}>
                    <option value="">Select Blood Group (Optional)</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                </select>

                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                    <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Address</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input type="text" name="address.street" placeholder="Street" value={formData.address.street} onChange={handleChange} style={{ padding: '0.8rem' }} />
                        <input type="text" name="address.city" placeholder="City" value={formData.address.city} onChange={handleChange} style={{ padding: '0.8rem' }} />
                        <input type="text" name="address.state" placeholder="State" value={formData.address.state} onChange={handleChange} style={{ padding: '0.8rem' }} />
                        <input type="text" name="address.pincode" placeholder="Pincode" value={formData.address.pincode} onChange={handleChange} style={{ padding: '0.8rem' }} />
                    </div>
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '12px 24px', fontSize: '1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                        <FaSave /> Register Patient
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PatientRegistration;
