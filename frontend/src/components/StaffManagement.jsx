import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaUserMd, FaUserNurse, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

function StaffManagement() {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null); // Track if editing
    const [specializations, setSpecializations] = useState([]); // Store hospital specializations

    const initialFormState = {
        role: 'Doctor',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        specialization: '',
        qualification: '',
        experience: '',
        licenseNumber: '',
        departmentId: '',
        employeeId: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchStaff();
        fetchHospitalProfile();
    }, []);

    const fetchHospitalProfile = async () => {
        try {
            const { data } = await api.get('/hospital/profile');
            if (data.success && data.data.hospital.specializations) {
                setSpecializations(data.data.hospital.specializations);
            }
        } catch (error) {
            console.error("Failed to fetch hospital profile", error);
        }
    };

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
        const { name, value } = e.target;
        if (name === 'experience' && value < 0) return;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = (staff) => {
        setEditingId(staff._id);
        setFormData({
            role: staff.role,
            firstName: staff.firstName,
            lastName: staff.lastName,
            email: staff.email,
            phone: staff.phone,
            password: '', // Leave blank to keep unchanged
            specialization: staff.specialization || '',
            qualification: staff.qualification || '',
            experience: staff.experience || '',
            licenseNumber: staff.licenseNumber || '',
            employeeId: staff.employeeId || '',
            departmentId: staff.departmentId || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this staff member?')) return;
        try {
            const { data } = await api.delete(`/hospital/staff/${id}`);
            if (data.success) {
                alert('Staff member removed.');
                fetchStaff();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting staff');
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clean payload
        const payload = { ...formData };

        // Remove departmentId if empty string to avoid ObjectId cast error
        if (payload.departmentId === '') {
            delete payload.departmentId;
        }

        // Ensure experience is a number if present
        if (payload.experience) {
            payload.experience = Number(payload.experience);
        }

        try {
            let response;
            if (editingId) {
                // Update
                response = await api.put(`/hospital/staff/${editingId}`, payload);
            } else {
                // Create
                response = await api.post('/hospital/staff', payload);
            }

            if (response.data.success) {
                alert(editingId ? 'Staff updated successfully' : 'Staff added successfully');
                setShowModal(false);
                fetchStaff();
                setFormData(initialFormState);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving staff');
        }
    };

    // Styling Constants
    const btnPrimaryStyle = {
        background: 'var(--primary-blue)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '500',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const btnActionStyle = (color) => ({
        background: 'transparent',
        border: 'none',
        color: color,
        cursor: 'pointer',
        fontSize: '1rem',
        padding: '5px'
    });

    const avatarStyle = (isDoctor) => ({
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        background: isDoctor ? '#0056b3' : '#00796b', // Darker shades manually
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    });

    return (
        <div className="staff-management">
            <div className="section-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                flexWrap: 'wrap', // Allow wrapping
                gap: '1rem' // Add gap for wrapped items
            }}>
                <h2>Manage Staff</h2>
                <button style={btnPrimaryStyle} onClick={openAddModal}>
                    <FaPlus /> Add New Staff
                </button>
            </div>

            {loading ? <p>Loading staff...</p> : (
                <div className="staff-grid-container">
                    {/* Doctors Column */}
                    <div className="staff-column">
                        <h3 className="column-header doctor-header">
                            <FaUserMd style={{ color: '#3498db' }} /> Doctors
                        </h3>
                        <div className="table-responsive staff-table-container">
                            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa', textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                        <th style={{ padding: '1rem' }}>Name</th>
                                        <th style={{ padding: '1rem' }}>Specialization</th>
                                        <th style={{ padding: '1rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staffList.filter(s => s.role === 'Doctor').map((staff) => (
                                        <tr key={staff._id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '1rem' }} data-label="Name">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={avatarStyle(true)}>
                                                        {staff.firstName[0]}{staff.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: '#333' }}>Dr. {staff.firstName} {staff.lastName}</div>
                                                        <div style={{ fontSize: '0.85rem', color: '#666' }}>{staff.phone}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }} data-label="Specialization">{staff.specialization || 'General'}</td>
                                            <td style={{ padding: '1rem' }} data-label="Actions">
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button style={btnActionStyle('#f39c12')} title="Edit" onClick={() => handleEdit(staff)}><FaEdit /></button>
                                                    <button style={btnActionStyle('#e74c3c')} title="Delete" onClick={() => handleDelete(staff._id)}><FaTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {staffList.filter(s => s.role === 'Doctor').length === 0 && (
                                        <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No doctors found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Other Staff Column */}
                    <div className="staff-column">
                        <h3 className="column-header nurse-header">
                            <FaUserNurse style={{ color: '#27ae60' }} /> Support Staff
                        </h3>
                        <div className="table-responsive staff-table-container">
                            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa', textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                        <th style={{ padding: '1rem' }}>Name</th>
                                        <th style={{ padding: '1rem' }}>Role</th>
                                        <th style={{ padding: '1rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staffList.filter(s => s.role !== 'Doctor').map((staff) => (
                                        <tr key={staff._id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '1rem' }} data-label="Name">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={avatarStyle(false)}>
                                                        {staff.firstName[0]}{staff.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: '#333' }}>{staff.firstName} {staff.lastName}</div>
                                                        <div style={{ fontSize: '0.85rem', color: '#666' }}>{staff.phone}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }} data-label="Role">
                                                <span className="status-badge" style={{
                                                    background: '#e8f5e9', color: '#2e7d32',
                                                    padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase'
                                                }}>
                                                    {staff.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }} data-label="Actions">
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button style={btnActionStyle('#f39c12')} title="Edit" onClick={() => handleEdit(staff)}><FaEdit /></button>
                                                    <button style={btnActionStyle('#e74c3c')} title="Delete" onClick={() => handleDelete(staff._id)}><FaTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {staffList.filter(s => s.role !== 'Doctor').length === 0 && (
                                        <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No support staff found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
                    backdropFilter: 'blur(2px)'
                }}>
                    <div className="modal-content" style={{
                        backgroundColor: '#fff',
                        padding: '2rem',
                        borderRadius: '12px',
                        width: '90%', // Responsive width
                        maxWidth: '500px', // Max width constraint
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: '#333' }}>{editingId ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#999' }}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.3rem', display: 'block' }}>Role Type</label>
                                <select name="role" value={formData.role} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }} disabled={!!editingId}>
                                    <option value="Doctor">Doctor</option>
                                    <option value="Receptionist">Receptionist</option>
                                </select>
                            </div>

                            <div className="form-row-responsive" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required style={{ flex: 1, padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px', minWidth: '150px' }} />
                                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} style={{ flex: 1, padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px', minWidth: '150px' }} />
                            </div>

                            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required style={{ padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }} />

                            {!editingId && (
                                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required style={{ padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }} />
                            )}

                            <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required style={{ padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }} />

                            {formData.role === 'Doctor' && (
                                <>
                                    <select
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleInputChange}
                                        style={{ padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px', width: '100%' }}
                                        required
                                    >
                                        <option value="">Select Specialization</option>
                                        {specializations.length > 0 ? (
                                            specializations.map(spec => (
                                                <option key={spec} value={spec}>{spec}</option>
                                            ))
                                        ) : (
                                            <option value="" disabled>No specializations available for this hospital</option>
                                        )}
                                    </select>
                                    <input type="text" name="qualification" placeholder="Qualification (e.g. MBBS)" value={formData.qualification} onChange={handleInputChange} style={{ padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }} />
                                    <input type="number" name="experience" min="0" placeholder="Years of Experience" value={formData.experience} onChange={handleInputChange} style={{ padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }} />
                                    <input type="text" name="licenseNumber" placeholder="License Number" value={formData.licenseNumber} onChange={handleInputChange} style={{ padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }} />
                                </>
                            )}

                            {formData.role !== 'Doctor' && (
                                <input type="text" name="employeeId" placeholder="Employee ID (Optional)" value={formData.employeeId} onChange={handleInputChange} style={{ padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }} />
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" style={{ ...btnPrimaryStyle, flex: 1, justifyContent: 'center' }}>
                                    {editingId ? 'Update Staff' : 'Add Staff'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.6rem', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', color: '#666', fontWeight: '500' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StaffManagement;
