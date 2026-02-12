import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaUsers, FaSearch, FaEllipsisV } from 'react-icons/fa';

function PatientList() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredPatients = patients.filter(patient =>
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        (patient.patientId && patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="patient-list-container">
            <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3><FaUsers /> Patient List</h3>
                <div className="search-bar" style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search Patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '0.5rem 2rem 0.5rem 1rem', borderRadius: '20px', border: '1px solid #ddd' }}
                    />
                    <FaSearch style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                </div>
            </div>

            {loading ? <p>Loading patients...</p> : (
                <div className="table-responsive" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8f9fa', color: '#555' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Age/Gender</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Contact</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#777' }}>No patients found.</td>
                                </tr>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <tr key={patient._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem' }}>{patient.patientId || 'N/A'}</td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{patient.firstName} {patient.lastName}</td>
                                        <td style={{ padding: '1rem' }}>{patient.age || 'N/A'} / {patient.gender}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div>{patient.phone}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{patient.email}</div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button className="btn-sm" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}>
                                                <FaEllipsisV />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PatientList;
