import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaUsers, FaSearch, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import EditPatientModal from './EditPatientModal';

function PatientList({ readOnly = false }) {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingPatient, setEditingPatient] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const { data } = await api.get('/reception/patients');
            if (data.success) {
                setPatients(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch patients", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient? This will also remove their appointments.')) {
            try {
                const { data } = await api.delete(`/reception/patients/${id}`);
                if (data.success) {
                    setPatients(patients.filter(p => p._id !== id));
                }
            } catch (error) {
                alert(error.response?.data?.message || 'Error deleting patient');
            }
        }
    };

    const handleUpdate = (updatedPatient) => {
        setPatients(patients.map(p => p._id === updatedPatient._id ? updatedPatient : p));
    };

    const filteredPatients = patients.filter(patient =>
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        (patient.patientId && patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="patient-list-container">
            <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h3><FaUsers /> Patient List</h3>
                <div className="search-bar" style={{ position: 'relative', width: 'auto', flexGrow: 1, maxWidth: '300px' }}>
                    <input
                        type="text"
                        placeholder="Search Patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '0.5rem 2rem 0.5rem 1rem', borderRadius: '20px', border: '1px solid #ddd', width: '100%' }}
                    />
                    <FaSearch style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                </div>
            </div>

            {loading ? <p>Loading patients...</p> : (
                <div className="table-responsive staff-table-container">
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8f9fa', color: '#555' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Age/Gender</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Contact</th>
                                {!readOnly && <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={readOnly ? 4 : 5} style={{ padding: '2rem', textAlign: 'center', color: '#777' }}>No patients found.</td>
                                </tr>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <tr key={patient._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem' }} data-label="ID">{patient.patientId || 'N/A'}</td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }} data-label="Name">{patient.firstName} {patient.lastName}</td>
                                        <td style={{ padding: '1rem' }} data-label="Age/Gender">{patient.age || 'N/A'} / {patient.gender}</td>
                                        <td style={{ padding: '1rem' }} data-label="Contact">
                                            <div>{patient.phone}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{patient.email}</div>
                                        </td>
                                        {!readOnly && (
                                            <td style={{ padding: '1rem', textAlign: 'center' }} data-label="Actions">
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                                    <button
                                                        onClick={() => setEditingPatient(patient)}
                                                        className="btn-icon"
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2' }}
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(patient._id)}
                                                        className="btn-icon"
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d32f2f' }}
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {editingPatient && (
                <EditPatientModal
                    patient={editingPatient}
                    onClose={() => setEditingPatient(null)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
}

export default PatientList;
