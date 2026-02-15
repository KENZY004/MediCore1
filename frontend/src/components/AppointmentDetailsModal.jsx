import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaPhone, FaCalendarAlt, FaNotesMedical, FaHistory } from 'react-icons/fa';
import api from '../utils/api';

function AppointmentDetailsModal({ appointment, onClose }) {
    console.log("Modal received appointment:", appointment); // Debugging log
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
            <div className="modal-content" style={{
                maxWidth: '650px',
                width: '95%',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                padding: '0'
            }}>
                <div className="modal-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    background: '#ffffff',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px'
                }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#111827', fontSize: '1.25rem', fontWeight: '600' }}>
                        <div style={{ background: '#eff6ff', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
                            <FaUser style={{ color: '#0066cc', fontSize: '1.1rem' }} />
                        </div>
                        Patient Details
                    </h3>
                    <button onClick={onClose} style={{
                        background: '#f3f4f6',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#4b5563',
                        transition: 'all 0.2s'
                    }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#e5e7eb'; e.currentTarget.style.color = '#1f2937'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#4b5563'; }}
                    >
                        <FaTimes style={{ fontSize: '1rem' }} />
                    </button>
                </div>

                <div className="modal-tabs" style={{ display: 'flex', padding: '0 1.5rem', borderBottom: '1px solid #e5e7eb', marginTop: '0' }}>
                    <button
                        onClick={() => setActiveTab('details')}
                        style={{
                            padding: '1rem 0',
                            marginRight: '1.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'details' ? '2px solid #0066cc' : '2px solid transparent',
                            color: activeTab === 'details' ? '#0066cc' : '#6b7280',
                            fontWeight: activeTab === 'details' ? '600' : '500',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        Current Visit
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        style={{
                            padding: '1rem 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'history' ? '2px solid #0066cc' : '2px solid transparent',
                            color: activeTab === 'history' ? '#0066cc' : '#6b7280',
                            fontWeight: activeTab === 'history' ? '600' : '500',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <FaHistory /> Medical History
                    </button>
                </div>

                <div className="modal-body" style={{ overflowY: 'auto', flex: 1, padding: '1.5rem' }}>
                    {activeTab === 'details' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
                            {/* Patient Info */}
                            <div className="info-section">
                                <h4 style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Personal Info</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Full Name</span>
                                        <span style={{ color: '#111827', fontWeight: '600', fontSize: '1rem' }}>{patient.firstName} {patient.lastName}</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Age/Gender</span>
                                            <span style={{ color: '#111827', fontWeight: '500' }}>{patient.age} / {patient.gender}</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Blood Group</span>
                                            <span style={{ color: '#111827', fontWeight: '500' }}>{patient.bloodGroup || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Phone</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#111827', fontWeight: '500' }}>
                                            <FaPhone style={{ color: '#9ca3af', fontSize: '0.9rem' }} />
                                            {patient.phone}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Appointment Info */}
                            <div className="info-section">
                                <h4 style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Visit Details</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <span style={{ display: 'block', color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Date & Time</span>
                                        <span style={{ display: 'block', color: '#111827', fontWeight: '600', fontSize: '1rem' }}>
                                            {new Date(appointment.appointmentDate).toLocaleDateString()}
                                            <span style={{ color: '#6b7280', fontWeight: '400', marginLeft: '0.5rem' }}>at {appointment.appointmentTime}</span>
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Reason</span>
                                        <div style={{ background: '#f3f4f6', padding: '0.75rem', borderRadius: '8px', fontSize: '0.95rem', color: '#374151' }}>
                                            {appointment.reason}
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Status</span>
                                        <span className={`status-badge ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Full Width Notes/Prescription if they exist */}
                            {(appointment.notes || (appointment.prescription && appointment.prescription.length > 0)) && (
                                <div style={{ gridColumn: '1 / -1', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px dashed #e5e7eb' }}>
                                    <h4 style={{ color: '#0066cc', marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FaNotesMedical /> Medical Notes
                                    </h4>

                                    {appointment.diagnosis && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <strong style={{ display: 'block', color: '#374151', marginBottom: '0.25rem' }}>Diagnosis</strong>
                                            <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.6' }}>{appointment.diagnosis}</p>
                                        </div>
                                    )}

                                    {appointment.prescription && appointment.prescription.length > 0 && (
                                        <div>
                                            <strong style={{ display: 'block', color: '#374151', marginBottom: '0.5rem' }}>Prescription</strong>
                                            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '8px' }}>
                                                {appointment.prescription.map((rx, idx) => (
                                                    <div key={idx} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: idx < appointment.prescription.length - 1 ? '1px solid #dcfce7' : 'none' }}>
                                                        <div style={{ fontWeight: '600', color: '#166534', fontSize: '1.05rem', marginBottom: '0.25rem' }}>{rx.medicine}</div>
                                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#15803d' }}>
                                                            <span>{rx.dosage}</span>
                                                            <span>•</span>
                                                            <span>{rx.frequency}</span>
                                                            <span>•</span>
                                                            <span>{rx.duration}</span>
                                                        </div>
                                                        {rx.instructions && <div style={{ fontSize: '0.85rem', color: '#14532d', fontStyle: 'italic', marginTop: '0.25rem' }}>Note: {rx.instructions}</div>}
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
                                <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>Loading history...</p>
                            ) : history.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem 2rem', background: '#f9fafb', borderRadius: '8px' }}>
                                    <p style={{ color: '#6b7280', margin: 0 }}>No previous medical history found.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {history.filter(h => h._id !== appointment._id).map(record => (
                                        <div key={record._id} style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            padding: '1.25rem',
                                            background: '#ffffff',
                                            transition: 'box-shadow 0.2s'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <FaCalendarAlt style={{ color: '#6b7280' }} />
                                                    <strong style={{ color: '#111827' }}>{new Date(record.appointmentDate).toLocaleDateString()}</strong>
                                                </div>
                                                <span style={{ fontSize: '0.9rem', color: '#6b7280', background: '#f3f4f6', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                                                    Dr. {record.doctorId?.lastName}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#374151' }}>
                                                <span style={{ color: '#6b7280' }}>Reason:</span> {record.reason}
                                            </div>
                                            {record.diagnosis && (
                                                <div style={{ fontSize: '0.95rem', color: '#0369a1', background: '#e0f2fe', padding: '0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>
                                                    <strong>Diagnosis:</strong> {record.diagnosis}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {history.filter(h => h._id !== appointment._id).length === 0 && (
                                        <p style={{ textAlign: 'center', color: '#6b7280' }}>No other history records.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="modal-footer" style={{
                    padding: '1.25rem 1.5rem',
                    borderTop: '1px solid #e5e7eb',
                    background: '#f9fafb',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    borderBottomLeftRadius: '16px',
                    borderBottomRightRadius: '16px'
                }}>
                    <button onClick={onClose} style={{
                        backgroundColor: '#ffffff',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        padding: '0.625rem 1.25rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        transition: 'all 0.2s',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                    }}
                        onMouseOver={(e) => { e.target.style.backgroundColor = '#f3f4f6'; e.target.style.borderColor = '#9ca3af'; }}
                        onMouseOut={(e) => { e.target.style.backgroundColor = '#ffffff'; e.target.style.borderColor = '#d1d5db'; }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AppointmentDetailsModal;
