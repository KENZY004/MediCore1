
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaTimes, FaSave } from 'react-icons/fa';

function EditPatientModal({ patient, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        gender: '',
        age: '', // Or DOB
        // address fields
    });

    useEffect(() => {
        if (patient) {
            setFormData({
                firstName: patient.firstName || '',
                lastName: patient.lastName || '',
                phone: patient.phone || '',
                email: patient.email || '',
                gender: patient.gender || 'Male',
                age: patient.age || ''
            });
        }
    }, [patient]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put(`/reception/patients/${patient._id}`, formData);
            if (data.success) {
                onUpdate(data.data);
                onClose();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating patient');
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="modal-content" style={{
                background: 'white', padding: '2rem', borderRadius: '8px', width: '500px', maxWidth: '90%', position: 'relative'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer'
                }}>
                    <FaTimes />
                </button>
                <h3 style={{ marginBottom: '1.5rem' }}>Edit Patient Details</h3>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: '#666' }}>First Name</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: '#666' }}>Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.85rem', color: '#666' }}>Phone</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                    </div>

                    <div>
                        <label style={{ fontSize: '0.85rem', color: '#666' }}>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: '#666' }}>Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: '#666' }}>Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '10px' }}>
                        <FaSave /> Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditPatientModal;
