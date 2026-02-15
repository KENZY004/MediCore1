import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaPhone, FaCalendarAlt, FaNotesMedical, FaHistory } from 'react-icons/fa';
import api from '../utils/api';

function AppointmentDetailsModal({ appointment, onClose }) {
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [activeTab, setActiveTab] = useState('details'); // 'details' or 'history'

    useEffect(() => {
        if (activeTab === 'history' && appointment.patientId) {
            fetchHistory();
        }
    }, [activeTab, appointment]);

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const { data } = await api.get(`/doctor/patients/${appointment.patientId._id}/history`);
            if (data.success) {
                setHistory(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    if (!appointment) return null;

    const patient = appointment.patientId || {};

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '700px', width: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaUser style={{ color: '#0066cc' }} /> Patient Details
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#666' }}>
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
                    <button
                        onClick={() => setActiveTab('details')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'details' ? '3px solid #0066cc' : '3px solid transparent',
                            color: activeTab === 'details' ? '#0066cc' : '#666',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Current Visit
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'history' ? '3px solid #0066cc' : '3px solid transparent',
                            color: activeTab === 'history' ? '#0066cc' : '#666',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        <FaHistory /> Medical History
                    </button>
                </div>

                <div className="modal-body" style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
                    {activeTab === 'details' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            {/* Patient Info */}
                            <div className="info-section">
                                <h4 style={{ color: '#0066cc', borderBottom: '1px solid #b3d7ff', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Personal Info</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <div><strong>Name:</strong> {patient.firstName} {patient.lastName}</div>
                                    <div><strong>Age/Gender:</strong> {patient.age} / {patient.gender}</div>
                                    <div><strong>Blood Group:</strong> {patient.bloodGroup || 'N/A'}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FaPhone style={{ color: '#666', fontSize: '0.9rem' }} />
                                        {patient.phone}
                                    </div>
                                </div>
                            </div>

                            {/* Appointment Info */}
                            <div className="info-section">
                                <h4 style={{ color: '#0066cc', borderBottom: '1px solid #b3d7ff', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Visit Details</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <div>
                                        <strong>Date & Time:</strong><br />
                                        <span style={{ color: '#333' }}>
                                            {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Reason for Visit:</strong><br />
                                        <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                                            {appointment.reason}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Status:</strong> <span className={`status-badge ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Full Width Notes/Prescription if they exist */}
                            {(appointment.notes || (appointment.prescription && appointment.prescription.length > 0)) && (
                                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                                    <h4 style={{ color: '#0066cc', borderBottom: '1px solid #b3d7ff', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Medical Notes</h4>

                                    {appointment.diagnosis && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <strong>Diagnosis:</strong>
                                            <p style={{ margin: '0.25rem 0' }}>{appointment.diagnosis}</p>
                                        </div>
                                    )}

                                    {appointment.prescription && appointment.prescription.length > 0 && (
                                        <div>
                                            <strong>Prescription:</strong>
                                            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '6px', marginTop: '0.5rem' }}>
                                                {appointment.prescription.map((rx, idx) => (
                                                    <div key={idx} style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: idx < appointment.prescription.length - 1 ? '1px solid #dcfce7' : 'none' }}>
                                                        <div style={{ fontWeight: '600', color: '#166534' }}>{rx.medicine}</div>
                                                        <div style={{ fontSize: '0.9rem', color: '#15803d' }}>{rx.dosage} - {rx.frequency} ({rx.duration})</div>
                                                        {rx.instructions && <div style={{ fontSize: '0.85rem', color: '#14532d', fontStyle: 'italic' }}>Note: {rx.instructions}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        // History Tab
                        <div className="history-list">
                            {loadingHistory ? (
                                <p>Loading history...</p>
                            ) : history.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>No previous medical history found for this hospital.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {history.filter(h => h._id !== appointment._id).map(record => (
                                        <div key={record._id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', background: '#fafafa' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <strong style={{ color: '#333' }}>{new Date(record.appointmentDate).toLocaleDateString()}</strong>
                                                <span style={{ fontSize: '0.9rem', color: '#666' }}>Dr. {record.doctorId?.lastName}</span>
                                            </div>
                                            <div style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                                                <span style={{ color: '#666' }}>Reason:</span> {record.reason}
                                            </div>
                                            {record.diagnosis && (
                                                <div style={{ fontSize: '0.95rem', color: '#0066cc' }}>
                                                    <strong>Diagnosis:</strong> {record.diagnosis}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {history.filter(h => h._id !== appointment._id).length === 0 && (
                                        <p style={{ textAlign: 'center', color: '#666' }}>No other history records.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="modal-footer" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} className="btn-secondary">Close</button>
                </div>
            </div>
        </div>
    );
}

export default AppointmentDetailsModal;
