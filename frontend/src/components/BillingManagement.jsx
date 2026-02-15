import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaFileInvoiceDollar, FaPlus, FaTrash, FaTimes, FaCalendarCheck } from 'react-icons/fa';

function BillingManagement() {
    const [invoices, setInvoices] = useState([]);
    const [billableAppointments, setBillableAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const initialFormState = {
        patientName: '',
        patientId: '',
        appointmentId: '',
        status: 'Pending',
        items: [{ description: '', cost: '' }],
        date: new Date().toISOString().split('T')[0]
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchInvoices(), fetchBillableAppointments()]);
        } finally {
            setLoading(false);
        }
    };

    const fetchInvoices = async () => {
        try {
            const { data } = await api.get('/hospital/invoices');
            if (data.success) {
                setInvoices(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        }
    };

    const fetchBillableAppointments = async () => {
        try {
            const { data } = await api.get('/hospital/billable-appointments');
            if (data.success) {
                setBillableAppointments(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch billable appointments", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({ ...formData, items: [...formData.items, { description: '', cost: '' }] });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this invoice? The linked appointment will be marked as unbilled.')) return;
        try {
            const { data } = await api.delete(`/hospital/invoices/${id}`);
            if (data.success) {
                alert('Invoice deleted.');
                fetchData(); // Refresh both lists
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting invoice');
        }
    };

    const openAddModal = (appointment = null) => {
        if (appointment) {
            // Pre-fill from appointment
            setFormData({
                patientName: `${appointment.patientId?.firstName} ${appointment.patientId?.lastName}`,
                patientId: appointment.patientId?._id,
                appointmentId: appointment._id,
                status: 'Pending',
                items: [
                    { description: 'Consultation Fee', cost: appointment.consultationFee || '' },
                    ...(appointment.prescription ? appointment.prescription.map(p => ({
                        description: `Rx: ${p.medicine} (${p.dosage})`,
                        cost: '' // Doctor doesn't usually set price, admin fills it
                    })) : [])
                ],
                date: new Date().toISOString().split('T')[0]
            });
        } else {
            setFormData(initialFormState);
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/hospital/invoices', formData);

            if (response.data.success) {
                alert('Invoice created successfully');
                setShowModal(false);
                fetchData(); // Refresh both lists
                setFormData(initialFormState);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating invoice');
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

    const statusBadgeStyle = (status) => {
        let bg, color;
        switch (status) {
            case 'Paid':
                bg = '#dcfce7'; color = '#166534';
                break;
            case 'Pending':
                bg = '#fef9c3'; color = '#854d0e';
                break;
            case 'Cancelled':
                bg = '#fee2e2'; color = '#991b1b';
                break;
            default:
                bg = '#f3f4f6'; color = '#1f2937';
        }
        return {
            background: bg, color: color,
            padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase'
        };
    };

    return (
        <div className="billing-management">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Billing & Invoices</h2>
                <button style={btnPrimaryStyle} onClick={() => openAddModal()}>
                    <FaPlus /> New Invoice
                </button>
            </div>

            {/* Billable Appointments Section */}
            {billableAppointments.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#374151', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaCalendarCheck style={{ color: '#f59e0b' }} /> Pending Billing (Completed Appointments)
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {billableAppointments.map(appt => (
                            <div key={appt._id} style={{
                                background: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '600', color: '#111827' }}>
                                        {appt.patientId?.firstName} {appt.patientId?.lastName}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                        Dr. {appt.doctorId?.firstName} {appt.doctorId?.lastName}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                        {new Date(appt.appointmentDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <button
                                    onClick={() => openAddModal(appt)}
                                    style={{
                                        background: '#eff6ff',
                                        color: '#2563eb',
                                        border: '1px solid #bfdbfe',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        fontSize: '0.85rem',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Create Invoice
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Invoices List */}
            {loading ? <p>Loading data...</p> : (
                <div className="table-container" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '1rem' }}>Patient Name</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Total Amount</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice) => (
                                <tr key={invoice._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem', fontWeight: '500', color: '#333' }}>{invoice.patientName}</td>
                                    <td style={{ padding: '1rem', color: '#666' }}>{new Date(invoice.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem', fontWeight: '600' }}>${invoice.totalAmount}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={statusBadgeStyle(invoice.status)}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button style={btnActionStyle('#e74c3c')} title="Delete" onClick={() => handleDelete(invoice._id)}><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {invoices.length === 0 && (
                                <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>No invoices found.</td></tr>
                            )}
                        </tbody>
                    </table>
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
                        backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '600px', maxHeight: '90vh', overflowY: 'auto',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: '#333' }}>
                                {formData.appointmentId ? 'Generate Invoice from Appointment' : 'Create New Invoice'}
                            </h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#999' }}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input type="text" name="patientName" placeholder="Patient Name" value={formData.patientName} onChange={handleInputChange} required style={{ padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }} />
                                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required style={{ padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }} />
                            </div>

                            <select name="status" value={formData.status} onChange={handleInputChange} style={{ padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }}>
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                            </select>

                            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#555' }}>Items</h4>
                                {formData.items.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                            required
                                            style={{ flex: 2, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Cost"
                                            value={item.cost}
                                            onChange={(e) => handleItemChange(index, 'cost', e.target.value)}
                                            required
                                            style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                        {formData.items.length > 1 && (
                                            <button type="button" onClick={() => removeItem(index)} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addItem} style={{ fontSize: '0.85rem', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                                    + Add Item
                                </button>
                            </div>

                            <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                                Total: ${formData.items.reduce((sum, item) => sum + Number(item.cost), 0)}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" style={{ ...btnPrimaryStyle, flex: 1, justifyContent: 'center' }}>
                                    {formData.appointmentId ? 'Create & Link Invoice' : 'Generate Invoice'}
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

export default BillingManagement;
