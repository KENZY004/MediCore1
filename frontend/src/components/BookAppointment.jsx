import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaCalendarPlus, FaSearch } from 'react-icons/fa';

function BookAppointment({ preSelectedPatient }) {
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(preSelectedPatient || null);

    const [formData, setFormData] = useState({
        patientId: preSelectedPatient?._id || '',
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        consultationFee: 500
    });

    useEffect(() => {
        // Fetch active doctors
        const fetchDoctors = async () => {
            try {
                const { data } = await api.get('/reception/doctors');
                if (data.success) {
                    setDoctors(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch doctors", error);
            }
        };
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (preSelectedPatient) {
            setSelectedPatient(preSelectedPatient);
            setFormData(prev => ({ ...prev, patientId: preSelectedPatient._id }));
        }
    }, [preSelectedPatient]);

    // Live search with debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length >= 1) { // Changed to >= 1 for faster search
                try {
                    const { data } = await api.get(`/reception/patients/search?query=${searchQuery}`);
                    if (data.success) {
                        setSearchResults(data.data);
                    }
                } catch (error) {
                    console.error("Search failed", error);
                }
            } else {
                setSearchResults([]);
            }
        }, 300); // Reduced delay slightly for snappier feel

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault(); // Prevent default form submission if user hits enter
    };

    const selectPatient = (patient) => {
        setSelectedPatient(patient);
        setFormData(prev => ({ ...prev, patientId: patient._id }));
        setSearchResults([]); // Clear search
        setSearchQuery('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedPatient) {
            alert('Please select a patient first');
            return;
        }

        if (!formData.doctorId) {
            alert('Please select a doctor');
            return;
        }

        // Validate Date and Time
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayString = `${year}-${month}-${day}`;

        if (formData.date < todayString) {
            alert("Cannot book appointment in the past.");
            return;
        }

        if (formData.date === todayString) {
            const currentHours = String(now.getHours()).padStart(2, '0');
            const currentMinutes = String(now.getMinutes()).padStart(2, '0');
            const currentTimeString = `${currentHours}:${currentMinutes}`;

            if (formData.time < currentTimeString) {
                alert("Cannot book appointment for a past time.");
                return;
            }
        }

        try {
            const { data } = await api.post('/reception/appointments', formData);
            if (data.success) {
                alert('Appointment Booked Successfully!');
                // Reset ONLY appointment details, keep patient selected for ease of use
                setFormData(prev => ({ ...prev, date: '', time: '', reason: '' }));
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error booking appointment');
        }
    };

    return (
        <div className="book-appointment">
            <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                <h3><FaCalendarPlus /> Book Appointment</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>

                {/* Left Column: Patient Selection */}
                <div className="patient-selection-column">
                    <h4 style={{ marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>1. Select Patient</h4>

                    {!selectedPatient ? (
                        <div className="search-box">
                            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Search by Name or Phone"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                                <button type="submit" className="btn-secondary" style={{ padding: '0.8rem', borderRadius: '4px', cursor: 'pointer' }}>
                                    <FaSearch />
                                </button>
                            </form>

                            {searchResults.length > 0 && (
                                <ul style={{ listStyle: 'none', padding: 0, border: '1px solid #eee', borderRadius: '4px', maxHeight: '300px', overflowY: 'auto' }}>
                                    {searchResults.map(p => (
                                        <li key={p._id} onClick={() => selectPatient(p)}
                                            style={{ padding: '1rem', borderBottom: '1px solid #eee', cursor: 'pointer', transition: 'background 0.2s' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                        >
                                            <div style={{ fontWeight: 'bold' }}>{p.firstName} {p.lastName}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Phone: {p.phone}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>ID: {p.patientId}</div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {searchResults.length === 0 && searchQuery && (
                                <p style={{ color: '#666', textAlign: 'center', marginTop: '1rem' }}>No patients found.</p>
                            )}
                        </div>
                    ) : (
                        <div className="selected-patient-card" style={{ padding: '1.5rem', background: '#e3f2fd', borderRadius: '8px', border: '1px solid #90caf9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <h4 style={{ margin: 0, color: '#1565c0' }}>Selected Patient</h4>
                                <button onClick={() => setSelectedPatient(null)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>
                                    Change
                                </button>
                            </div>
                            <p style={{ margin: '0.5rem 0' }}><strong>Name:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</p>
                            <p style={{ margin: '0.5rem 0' }}><strong>ID:</strong> {selectedPatient.patientId}</p>
                            <p style={{ margin: '0.5rem 0' }}><strong>Phone:</strong> {selectedPatient.phone}</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Appointment Details */}
                <div className="appointment-details-column">
                    <h4 style={{ marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>2. Appointment Details</h4>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Doctor</label>
                            <select name="doctorId" value={formData.doctorId} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                                <option value="">-- Choose Doctor --</option>
                                {doctors.map(doc => (
                                    <option key={doc._id} value={doc._id}>
                                        Dr. {doc.firstName} {doc.lastName} ({doc.specialization})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Time</label>
                                <input type="time" name="time" value={formData.time} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Reason for Visit</label>
                            <textarea name="reason" value={formData.reason} onChange={handleChange} required rows="3" style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }} placeholder="e.g. Fever, Checkup, Consultation"></textarea>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Consultation Fee ($)</label>
                            <input type="number" name="consultationFee" min="0" value={formData.consultationFee} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }} />
                        </div>

                        <button type="submit" className="btn-primary" disabled={!selectedPatient || !formData.doctorId} style={{ padding: '1rem', fontSize: '1rem', fontWeight: 'bold', cursor: (!selectedPatient || !formData.doctorId) ? 'not-allowed' : 'pointer', opacity: (!selectedPatient || !formData.doctorId) ? 0.7 : 1 }}>
                            Confirm Appointment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BookAppointment;
