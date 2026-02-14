import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaUser, FaPhone, FaVenusMars, FaHistory, FaTimes, FaCalendarAlt, FaStethoscope } from 'react-icons/fa';

function DoctorPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientHistory, setPatientHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const { data } = await api.get('/doctor/patients');
            if (data.success) {
                setPatients(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch patients", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewHistory = async (patient) => {
        setSelectedPatient(patient);
        setLoadingHistory(true);
        try {
            const { data } = await api.get(`/doctor/patients/${patient._id}/history`);
            if (data.success) {
                setPatientHistory(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch patient history", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const closeHistory = () => {
        setSelectedPatient(null);
        setPatientHistory([]);
    };

    return (
        <div className="doctor-patients">
            <div className="section-header" style={{ marginBottom: '2rem' }}>
                <h2>My Patients</h2>
            </div>

            {loading ? <p>Loading patients...</p> : (
                <>
                    <div className="patients-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {patients.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                <p>No patients found. Patients will appear here after you have an appointment with them.</p>
                            </div>
                        ) : (
                            patients.map(patient => (
                                <div key={patient._id} className="patient-card" style={{
                                    backgroundColor: 'white',
                                    borderRadius: '10px',
                                    padding: '1.5rem',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '50px', height: '50px', borderRadius: '50%',
                                            backgroundColor: '#e3f2fd', color: '#1976d2',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.2rem', fontWeight: 'bold'
                                        }}>
                                            {patient.firstName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem' }}>{patient.firstName} {patient.lastName}</h3>
                                            <span style={{ fontSize: '0.9rem', color: '#666' }}>ID: {patient.patientId || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="patient-details" style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#555' }}>
                                            <FaVenusMars /> <span>{patient.gender}</span>
                                            <span style={{ margin: '0 0.5rem' }}>|</span>
                                            <span>{patient.age ? `${patient.age} years` : 'Age N/A'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#555' }}>
                                            <FaPhone /> <span>{patient.phone}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleViewHistory(patient)}
                                        className="btn-outline"
                                        style={{
                                            marginTop: 'auto',
                                            padding: '0.6rem',
                                            border: '1px solid #1976d2',
                                            color: '#1976d2',
                                            backgroundColor: 'transparent',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <FaHistory /> View History
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Patient History Modal */}
                    {selectedPatient && (
                        <div className="modal-overlay" style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                        }}>
                            <div className="modal-content" style={{
                                backgroundColor: 'white',
                                width: '90%', maxWidth: '800px',
                                maxHeight: '85vh',
                                borderRadius: '12px',
                                display: 'flex', flexDirection: 'column',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                            }}>
                                <div className="modal-header" style={{
                                    padding: '1.5rem', borderBottom: '1px solid #eee',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <div>
                                        <h2 style={{ margin: 0 }}>Medical History</h2>
                                        <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                                            {selectedPatient.firstName} {selectedPatient.lastName}
                                        </p>
                                    </div>
                                    <button onClick={closeHistory} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#666' }}>
                                        <FaTimes />
                                    </button>
                                </div>

                                <div className="modal-body" style={{ padding: '1.5rem', overflowY: 'auto' }}>
                                    {loadingHistory ? (
                                        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading history...</div>
                                    ) : (
                                        <div className="history-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            {patientHistory.length === 0 ? (
                                                <p style={{ textAlign: 'center', color: '#666' }}>No history records found.</p>
                                            ) : (
                                                patientHistory.map(record => (
                                                    <div key={record._id} className="history-card" style={{
                                                        border: '1px solid #eee', borderRadius: '8px', padding: '1rem',
                                                        backgroundColor: '#fafafa'
                                                    }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                                            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                                                                <FaCalendarAlt style={{ color: '#1976d2' }} />
                                                                <strong>{new Date(record.appointmentDate).toLocaleDateString()}</strong>
                                                                <span style={{ color: '#666', fontSize: '0.9rem' }}>{record.appointmentTime}</span>
                                                            </div>
                                                            <div className={`status-badge ${record.status.toLowerCase()}`} style={{
                                                                padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem',
                                                                backgroundColor: record.status === 'Completed' ? '#e8f5e9' : '#fff3e0',
                                                                color: record.status === 'Completed' ? '#2e7d32' : '#ef6c00'
                                                            }}>
                                                                {record.status}
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                            <div>
                                                                <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.85rem', color: '#666', fontWeight: 'bold' }}>Reason</p>
                                                                <p style={{ margin: 0 }}>{record.reason}</p>
                                                            </div>
                                                            <div>
                                                                <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.85rem', color: '#666', fontWeight: 'bold' }}>Doctor</p>
                                                                <p style={{ margin: 0 }}>Dr. {record.doctorId?.firstName} {record.doctorId?.lastName}</p>
                                                            </div>
                                                        </div>

                                                        {(record.diagnosis || record.prescription?.length > 0) && (
                                                            <div style={{ marginTop: '1rem', borderTop: '1px dashed #ddd', paddingTop: '1rem' }}>
                                                                {record.diagnosis && (
                                                                    <div style={{ marginBottom: '0.8rem' }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                                                                            <FaStethoscope style={{ color: '#e91e63' }} />
                                                                            <strong style={{ color: '#333' }}>Diagnosis</strong>
                                                                        </div>
                                                                        <p style={{ margin: 0, color: '#444' }}>{record.diagnosis}</p>
                                                                    </div>
                                                                )}

                                                                {record.prescription?.length > 0 && (
                                                                    <div>
                                                                        <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Prescription</strong>
                                                                        <div className="rx-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                                            {record.prescription.map((med, idx) => (
                                                                                <span key={idx} style={{
                                                                                    backgroundColor: '#e0f2f1', color: '#00695c',
                                                                                    padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.9rem'
                                                                                }}>
                                                                                    {med.medicine} ({med.dosage})
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default DoctorPatients;
