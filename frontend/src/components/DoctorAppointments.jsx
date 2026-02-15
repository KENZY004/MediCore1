import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaCalendarCheck, FaUser, FaClock, FaNotesMedical, FaPrescriptionBottleAlt } from 'react-icons/fa';
import PrescriptionModal from './PrescriptionModal';
import AppointmentDetailsModal from './AppointmentDetailsModal';

function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'history'

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

    const handleStatusUpdate = async (id, status) => {
        try {
            const { data } = await api.put(`/doctor/appointments/${id}/status`, { status });
            if (data.success) {
                setAppointments(prev => prev.map(apt => apt._id === id ? data.data : apt));
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed': return <span className="status-badge active">Confirmed</span>;
            case 'Completed': return <span className="status-badge" style={{
                backgroundColor: '#2ecc71',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: '500'
            }}>Completed</span>;
            case 'Cancelled': return <span className="status-badge" style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: '500'
            }}>Cancelled</span>;
            default: return <span className="status-badge pending">Scheduled</span>;
        }
    };

    // Filter appointments based on active tab
    const filteredAppointments = appointments.filter(apt => {
        if (activeTab === 'upcoming') {
            return apt.status === 'Scheduled' || apt.status === 'Confirmed';
        } else {
            return apt.status === 'Completed' || apt.status === 'Cancelled';
        }
    });

    return (
        <div className="doctor-appointments">
            <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>My Appointments</h2>
                <div className="tabs" style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className={`btn-tab ${activeTab === 'upcoming' ? 'active-tab' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                        style={{
                            padding: '0.5rem 1rem',
                            border: 'none',
                            backgroundColor: activeTab === 'upcoming' ? '#3498db' : '#f0f0f0',
                            color: activeTab === 'upcoming' ? 'white' : '#666',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Upcoming
                    </button>
                    <button
                        className={`btn-tab ${activeTab === 'history' ? 'active-tab' : ''}`}
                        onClick={() => setActiveTab('history')}
                        style={{
                            padding: '0.5rem 1rem',
                            border: 'none',
                            backgroundColor: activeTab === 'history' ? '#3498db' : '#f0f0f0',
                            color: activeTab === 'history' ? 'white' : '#666',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        History
                    </button>
                </div>
            </div>

            {loading ? <p>Loading appointments...</p> : (
                <div className="appointments-list" style={{ display: 'grid', gap: '1rem' }}>
                    {filteredAppointments.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                            <p>No {activeTab} appointments found.</p>
                        </div>
                    ) : (
                        filteredAppointments.map((apt) => (
                            <div key={apt._id} className="appointment-card" style={{
                                padding: '1.5rem',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderLeft: `4px solid ${apt.status === 'Confirmed' ? '#3498db' : apt.status === 'Completed' ? '#2ecc71' : apt.status === 'Cancelled' ? '#e74c3c' : '#f39c12'}`
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
                                        <button className="btn-sm" onClick={() => {
                                            console.log("Selected Appointment for Details:", apt); // Debugging log
                                            setSelectedAppointment(apt);
                                            setShowDetailsModal(true);
                                        }} style={{
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

                                        {/* Actions for Upcoming appointments only */}
                                        {activeTab === 'upcoming' && (
                                            <>
                                                <button
                                                    onClick={() => handleAddPrescription(apt)}
                                                    className="btn-sm"
                                                    style={{
                                                        padding: '0.4rem 0.8rem',
                                                        border: '1px solid #f39c12',
                                                        color: '#f39c12',
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

                                                <button
                                                    onClick={() => handleStatusUpdate(apt._id, 'Completed')}
                                                    className="btn-sm"
                                                    style={{
                                                        padding: '0.4rem 0.8rem',
                                                        backgroundColor: '#2ecc71',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.8rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.3rem'
                                                    }}
                                                >
                                                    <FaCalendarCheck /> Mark Done
                                                </button>
                                            </>
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

            {showDetailsModal && selectedAppointment && (
                <AppointmentDetailsModal
                    appointment={selectedAppointment}
                    onClose={() => setShowDetailsModal(false)}
                />
            )}
        </div>
    );
}

export default DoctorAppointments;
