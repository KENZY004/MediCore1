import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaUserMd, FaUserNurse, FaPlus, FaSearch } from 'react-icons/fa';

function StaffManagement() {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        role: 'Doctor', // Default
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        // Doctor specific
        specialization: '',
        qualification: '',
        experience: '',
        licenseNumber: '',
        // Staff specific
        departmentId: '', // Optional for now
        employeeId: ''
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const { data } = await api.get('/hospital/staff');
            if (data.success) {
                setStaffList(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch staff", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/hospital/staff', formData);
            if (data.success) {
                alert('Staff added successfully');
                setShowModal(false);
                fetchStaff(); // Refresh list
                setFormData({ ...formData, firstName: '', lastName: '', email: '', password: '' }); // Reset partial
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding staff');
        }
    };

    return (
        <div className="staff-management">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Manage Staff</h2>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <FaPlus /> Add New Staff
                </button>
            </div>

            {loading ? <p>Loading staff...</p> : (
                <div className="table-container">
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Name</th>
                                <th style={{ padding: '1rem' }}>Role</th>
                                <th style={{ padding: '1rem' }}>Email</th>
                                <th style={{ padding: '1rem' }}>Phone</th>
                                <th style={{ padding: '1rem' }}>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.map((staff) => (
                                <tr key={staff._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className={`avatar-initials ${staff.type === 'doctor' ? 'bg-blue' : 'bg-green'}`}
                                                style={{ width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px' }}>
                                                {staff.firstName[0]}{staff.lastName[0]}
                                            </div>
                                            {staff.type === 'doctor' ? `Dr. ${staff.firstName} ${staff.lastName}` : `${staff.firstName} ${staff.lastName}`}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`status-badge ${staff.type === 'doctor' ? 'active' : 'pending'}`} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                            {staff.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{staff.email}</td>
                                    <td style={{ padding: '1rem' }}>{staff.phone}</td>
                                    <td style={{ padding: '1rem' }}>{new Date(staff.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {staffList.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No staff found. Add your first team member!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Simple Modal for Adding Staff */}
            {showModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="modal-content" style={{
                        backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', width: '500px', maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <h3>Add New Staff Member</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <div className="form-group">
                                <label>Role Type</label>
                                <select name="role" value={formData.role} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }}>
                                    <option value="Doctor">Doctor</option>
                                    <option value="Nurse">Nurse</option>
                                    <option value="Receptionist">Receptionist</option>
                                    <option value="Pharmacist">Pharmacist</option>
                                    <option value="Accountant">Accountant</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required style={{ padding: '0.5rem' }} />
                                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required style={{ padding: '0.5rem' }} />
                            </div>

                            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required style={{ padding: '0.5rem' }} />
                            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required style={{ padding: '0.5rem' }} />
                            <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required style={{ padding: '0.5rem' }} />

                            {formData.role === 'Doctor' && (
                                <>
                                    <input type="text" name="specialization" placeholder="Specialization (e.g. Cardiology)" value={formData.specialization} onChange={handleInputChange} style={{ padding: '0.5rem' }} />
                                    <input type="text" name="qualification" placeholder="Qualification (e.g. MBBS)" value={formData.qualification} onChange={handleInputChange} style={{ padding: '0.5rem' }} />
                                    <input type="number" name="experience" placeholder="Years of Experience" value={formData.experience} onChange={handleInputChange} style={{ padding: '0.5rem' }} />
                                    <input type="text" name="licenseNumber" placeholder="License Number" value={formData.licenseNumber} onChange={handleInputChange} style={{ padding: '0.5rem' }} />
                                </>
                            )}

                            {formData.role !== 'Doctor' && (
                                <input type="text" name="employeeId" placeholder="Employee ID (Optional)" value={formData.employeeId} onChange={handleInputChange} style={{ padding: '0.5rem' }} />
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Staff</button>
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.5rem', background: '#eee', border: 'none', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StaffManagement;
