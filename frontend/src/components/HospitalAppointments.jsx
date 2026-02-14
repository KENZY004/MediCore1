
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaCalendarCheck, FaUser, FaClock, FaUserMd } from 'react-icons/fa';

function HospitalAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get('/hospital/appointments');
            if (data.success) {
                setAppointments(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed': return <span className="status-badge active" style={{ background: '#e3f2fd', color: '#1976d2', padding: '4px 8px', borderRadius: '4px' }}>Confirmed</span>;
            case 'Completed': return <span className="status-badge bg-green" style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '4px' }}>Completed</span>;
            case 'Cancelled': return <span className="status-badge bg-red" style={{ background: '#ffebee', color: '#c62828', padding: '4px 8px', borderRadius: '4px' }}>Cancelled</span>;
            default: return <span className="status-badge pending" style={{ background: '#fff3e0', color: '#ef6c00', padding: '4px 8px', borderRadius: '4px' }}>Scheduled</span>;
        }
    };

    return (
        <div className="hospital-appointments">
            <div className="section-header" style={{ marginBottom: '2rem' }}>
                <h2>All Hospital Appointments</h2>
            </div>

            {loading ? <p>Loading appointments...</p> : (
                <div className="appointments-list">
                    {appointments.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                            <p>No appointments found.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <thead style={{ background: '#f8f9fa' }}>
                                    <tr>
                                        <th style={{ padding: '15px', textAlign: 'left' }}>Date & Time</th>
                                        <th style={{ padding: '15px', textAlign: 'left' }}>Patient</th>
                                        <th style={{ padding: '15px', textAlign: 'left' }}>Doctor</th>
                                        <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                                        <th style={{ padding: '15px', textAlign: 'left' }}>Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((apt) => (
                                        <tr key={apt._id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '15px' }}>
                                                <div style={{ fontWeight: '500' }}>{new Date(apt.appointmentDate).toLocaleDateString()}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#666' }}>{apt.appointmentTime}</div>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <div style={{ fontWeight: '500' }}>{apt.patientId?.firstName} {apt.patientId?.lastName}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#666' }}>{apt.patientId?.phone}</div>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <FaUserMd style={{ color: '#666' }} />
                                                    <span>Dr. {apt.doctorId?.firstName} {apt.doctorId?.lastName}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                {getStatusBadge(apt.status)}
                                            </td>
                                            <td style={{ padding: '15px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {apt.reason}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default HospitalAppointments;
