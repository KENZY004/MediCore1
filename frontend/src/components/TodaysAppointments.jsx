
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaArrowLeft, FaCalendarCheck, FaUserMd } from 'react-icons/fa';

function TodaysAppointments({ onBack }) {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Fetch all appointments for today logic
                // Since there is no specific endpoint, we should probably add one or filter
                // However, let's try to filter locally for now if there is an endpoint
                // Wait, reception routes doesn't seem to expose getAllAppointments easily without filter
                // Let's assume we can fetch all or create a new endpoint?
                // The implementation plan suggested creating components but backend support might be needed.
                // Let's try to use a new endpoint or existing one.
                // Looking at reception routes... no 'getAppointments'.
                // I should add a route or reuse something.
                // Actually, let's create a temporary solution: 
                // Since we can't easily get appointments without a dedicated route for reception
                // I will add a `getAppointments` route to `receptionController` first? No, plan didn't say that.
                // Wait, `receptionController` has `searchPatients` and `registerPatient`.
                // It does NOT have `getAppointments`.
                // To do this properly, I need to add `getAppointments` to `receptionController`.
                // I will Add it parallel to this file creation in next step.

                const { data } = await api.get('/reception/appointments?date=today');
                if (data.success) {
                    setAppointments(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch appointments", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled': return '#2196f3';
            case 'Completed': return '#4caf50';
            case 'Cancelled': return '#f44336';
            default: return '#999';
        }
    };

    return (
        <div className="todays-appointments">
            <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={onBack} className="btn-icon-only" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#666' }}>
                    <FaArrowLeft />
                </button>
                <h2>Today's Appointments</h2>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : appointments.length === 0 ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', borderRadius: '8px' }}>
                    <p style={{ color: '#666' }}>No appointments scheduled for today.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>Time</th>
                                <th style={{ padding: '12px' }}>Patient</th>
                                <th style={{ padding: '12px' }}>Doctor</th>
                                <th style={{ padding: '12px' }}>Reason</th>
                                <th style={{ padding: '12px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(apt => (
                                <tr key={apt._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px', fontWeight: '500' }}>{apt.appointmentTime}</td>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ fontWeight: '500' }}>{apt.patientId?.firstName} {apt.patientId?.lastName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{apt.patientId?.phone}</div>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaUserMd style={{ color: '#666' }} />
                                            <span>Dr. {apt.doctorId?.firstName} {apt.doctorId?.lastName}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>{apt.reason}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem',
                                            background: `${getStatusColor(apt.status)}20`, color: getStatusColor(apt.status)
                                        }}>
                                            {apt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default TodaysAppointments;
