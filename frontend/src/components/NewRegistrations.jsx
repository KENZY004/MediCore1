
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaArrowLeft, FaUser } from 'react-icons/fa';

function NewRegistrations({ onBack }) {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                // Fetch all patients and filter for today (or create a new endpoint)
                // For simplicity/reusability, reusing getAllPatients and filtering in frontend 
                // Alternatively, searchPatients with a date param would be better for scaling
                const { data } = await api.get('/reception/patients');
                if (data.success) {
                    const today = new Date().toDateString();
                    const todaysPatients = data.data.filter(p =>
                        new Date(p.createdAt || p.registrationDate).toDateString() === today
                    );
                    setPatients(todaysPatients);
                }
            } catch (error) {
                console.error("Failed to fetch new registrations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    return (
        <div className="new-registrations">
            <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={onBack} className="btn-icon-only" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#666' }}>
                    <FaArrowLeft />
                </button>
                <h2>New Registrations (Today)</h2>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : patients.length === 0 ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', borderRadius: '8px' }}>
                    <p style={{ color: '#666' }}>No new registrations found for today.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>Patient Name</th>
                                <th style={{ padding: '12px' }}>Phone</th>
                                <th style={{ padding: '12px' }}>Gender</th>
                                <th style={{ padding: '12px' }}>Registered At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map(patient => (
                                <tr key={patient._id || patient.patientId} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1976d2' }}>
                                            <FaUser size={14} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '500' }}>{patient.firstName} {patient.lastName}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{patient.patientId}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>{patient.phone}</td>
                                    <td style={{ padding: '12px' }}>{patient.gender}</td>
                                    <td style={{ padding: '12px' }}>{new Date(patient.createdAt || patient.registrationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default NewRegistrations;
