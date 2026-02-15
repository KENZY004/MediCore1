import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaTimes, FaSave } from 'react-icons/fa';
import api from '../utils/api';

const PrescriptionModal = ({ appointment, onClose, onSuccess }) => {
    const [diagnosis, setDiagnosis] = useState(appointment?.diagnosis || '');
    const [notes, setNotes] = useState(appointment?.notes || '');
    const [prescription, setPrescription] = useState(appointment?.prescription || []);
    const [medicines, setMedicines] = useState([
        { medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (appointment?.prescription && appointment.prescription.length > 0) {
            setMedicines(appointment.prescription);
        }
    }, [appointment]);

    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = [...medicines];
        updatedMedicines[index][field] = value;
        setMedicines(updatedMedicines);
    };

    const addMedicineRow = () => {
        setMedicines([...medicines, { medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    };

    const removeMedicineRow = (index) => {
        if (medicines.length > 1) {
            const updatedMedicines = medicines.filter((_, i) => i !== index);
            setMedicines(updatedMedicines);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Filter out empty rows
        const validMedicines = medicines.filter(m => m.medicine.trim() !== '');

        if (validMedicines.length === 0 && !diagnosis.trim()) {
            setError('Please add at least one medicine or a diagnosis.');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post(`/doctor/appointments/${appointment._id}/prescription`, {
                diagnosis,
                notes,
                prescription: validMedicines
            });

            if (response.data.success) {
                if (onSuccess) onSuccess(response.data.data);
                onClose();
            }
        } catch (err) {
            console.error("Error saving prescription:", err);
            setError(err.response?.data?.message || 'Failed to save prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="modal-content" style={{
                backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto'
            }}>
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Write Prescription</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                        <FaTimes />
                    </button>
                </div>

                {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Diagnosis</label>
                        <textarea
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            placeholder="Enter diagnosis..."
                            className="form-control"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', minHeight: '80px' }}
                        />
                    </div>

                    <div className="medicines-section" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Medicines</h3>
                            <button type="button" onClick={addMedicineRow} style={{
                                backgroundColor: '#3498db', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}>
                                <FaPlus size={12} /> Add Medicine
                            </button>
                        </div>

                        <div className="medicines-list">
                            <div className="medicines-header" style={{
                                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr auto', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#555'
                            }}>
                                <div>Medicine Name</div>
                                <div>Dosage</div>
                                <div>Freq</div>
                                <div>Duration</div>
                                <div>Instructions</div>
                                <div></div> {/* Empty for delete button */}
                            </div>
                            {medicines.map((med, index) => (
                                <div key={index} className="medicine-row" style={{
                                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center'
                                }}>
                                    <input
                                        type="text"
                                        placeholder="Medicine Name"
                                        value={med.medicine}
                                        onChange={(e) => handleMedicineChange(index, 'medicine', e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', width: '100%', minWidth: 0 }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Dosage"
                                        value={med.dosage}
                                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', width: '100%', minWidth: 0 }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Freq"
                                        value={med.frequency}
                                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', width: '100%', minWidth: 0 }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Duration"
                                        value={med.duration}
                                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', width: '100%', minWidth: 0 }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Instructions"
                                        value={med.instructions}
                                        onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', width: '100%', minWidth: 0 }}
                                    />
                                    <button type="button" onClick={() => removeMedicineRow(index)} style={{
                                        color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem'
                                    }}>
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Additional notes..."
                            className="form-control"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', minHeight: '80px' }}
                        />
                    </div>

                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '0.8rem 1.5rem', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer'
                        }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} style={{
                            padding: '0.8rem 1.5rem', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                            {loading ? 'Saving...' : <><FaSave /> Save Prescription</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrescriptionModal;
