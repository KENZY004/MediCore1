import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaCalendarCheck, FaUser, FaClock, FaNotesMedical, FaPrescriptionBottleAlt } from 'react-icons/fa';
import PrescriptionModal from './PrescriptionModal';

function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get('/doctor/appointments');
            if (data.success) {
                setAppointments(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPrescription = (appointment) => {
        setSelectedAppointment(appointment);
        setShowPrescriptionModal(true);
    };

    const handlePrescriptionSuccess = (updatedAppointment) => {
        setAppointments(prev => prev.map(apt => apt._id === updatedAppointment._id ? updatedAppointment : apt));
        // Optionally show a success toast here
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed': return <span className="status-badge active">Confirmed</span>;
            case 'Completed': return <span className="status-badge bg-green" style={{ color: 'white' }}>Completed</span>;
            case 'Cancelled': return <span className="status-badge bg-red" style={{ color: 'white' }}>Cancelled</span>;
            default: return <span className="status-badge pending">Scheduled</span>;
        }
    };

    return (
        <div className="doctor-appointments">
            <div className="section-header" style={{ marginBottom: '2rem' }}>
                <h2>My Appointments</h2>
            </div>

            {loading ? <p>Loading appointments...</p> : (
                <div className="appointments-list" style={{ display: 'grid', gap: '1rem' }}>
                    {appointments.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                            <p>No appointments scheduled yet.</p>
                        </div>
                    ) : (
                        appointments.map((apt) => (
                            <div key={apt._id} className="appointment-card" style={{
                                padding: '1.5rem',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderLeft: `4px solid ${apt.status === 'Confirmed' ? '#3498db' : '#e74c3c'}`
                            }}>
                                <div className="apt-info">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <FaClock style={{ color: '#666' }} />
                                        <strong>{new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}</strong>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#555' }}>
                                        <FaUser />
                                        <span>{apt.patientId?.firstName} {apt.patientId?.lastName}</span>
                                    </div>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#777' }}>
                                        Reason: {apt.reason}
                                    </div>
                                    {apt.prescription && apt.prescription.length > 0 && (
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#27ae60', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <FaPrescriptionBottleAlt /> Prescription Added
                                        </div>
                                    )}
                                </div>
                                <div className="apt-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                    {getStatusBadge(apt.status)}

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn-sm" style={{
                                            padding: '0.4rem 0.8rem',
                                            border: '1px solid #3498db',
                                            color: '#3498db',
                                            borderRadius: '4px',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }}>
                                            View Details
                                        </button>

                                        {(apt.status === 'Scheduled' || apt.status === 'Confirmed' || apt.status === 'Completed') && (
                                            <button
                                                onClick={() => handleAddPrescription(apt)}
                                                className="btn-sm"
                                                style={{
                                                    padding: '0.4rem 0.8rem',
                                                    border: '1px solid #2ecc71',
                                                    color: '#2ecc71',
                                                    borderRadius: '4px',
                                                    background: 'transparent',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.3rem'
                                                }}
                                            >
                                                <FaNotesMedical /> {apt.prescription && apt.prescription.length > 0 ? 'Edit Rx' : 'Add Rx'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showPrescriptionModal && selectedAppointment && (
                <PrescriptionModal
                    appointment={selectedAppointment}
                    onClose={() => setShowPrescriptionModal(false)}
                    onSuccess={handlePrescriptionSuccess}
                />
            )}
        </div>
    );
}

export default DoctorAppointments;
