import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaUser, FaClock, FaArrowRight, FaHistory } from 'react-icons/fa';

export function NextAppointmentWidget({ onViewAll }) {
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNext = async () => {
            try {
                const { data } = await api.get('/doctor/next-appointment');
                if (data.success) {
                    setAppointment(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch next appointment", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNext();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="dashboard-section" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="section-header" style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaClock style={{ color: '#0066cc' }} /> Up Next
                </h2>
                <button onClick={onViewAll} className="btn-link" style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: '0.9rem' }}>View All</button>
            </div>

            {appointment ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '50px', height: '50px', borderRadius: '50%',
                            background: '#eff6ff', color: '#0066cc',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.2rem', fontWeight: 'bold'
                        }}>
                            {appointment.patientId?.firstName?.charAt(0) || 'P'}
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{appointment.patientId?.firstName} {appointment.patientId?.lastName}</h3>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{appointment.reason}</p>
                        </div>
                    </div>

                    <div style={{
                        background: '#f8fafc', padding: '1rem', borderRadius: '8px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>Time</span>
                            <span style={{ fontWeight: '600', color: '#0066cc' }}>{appointment.appointmentTime}</span>
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>Date</span>
                            <span style={{ fontWeight: '600' }}>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <button className="btn-primary" style={{
                        marginTop: 'auto', width: '100%', padding: '0.75rem',
                        background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px',
                        cursor: 'pointer', fontWeight: '500'
                    }} onClick={onViewAll}>
                        Start Consultation
                    </button>
                </div>
            ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    <p>No upcoming appointments.</p>
                </div>
            )}
        </div>
    );
}

export function RecentPatientsWidget({ onViewAll }) {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const { data } = await api.get('/doctor/recent-patients');
                if (data.success) {
                    setPatients(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch recent patients", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecent();
    }, []);

    return (
        <div className="dashboard-section">
            <div className="section-header" style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaHistory style={{ color: '#28a745' }} /> Recent Patients
                </h2>
                <button onClick={onViewAll} className="btn-link" style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: '0.9rem' }}>View All</button>
            </div>

            {loading ? <p>Loading...</p> : patients.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {patients.map(patient => (
                        <div key={patient._id} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '0.75rem', borderBottom: '1px solid #f1f5f9'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: '#f0fdf4', color: '#22c55e',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.9rem'
                                }}>
                                    <FaUser />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>{patient.firstName} {patient.lastName}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Last: {new Date(patient.lastAppointmentDate).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <FaArrowRight style={{ color: '#cbd5e1', fontSize: '0.9rem' }} />
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    <p>No recent patients found.</p>
                </div>
            )}
        </div>
    );
}
