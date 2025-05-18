import { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReceiptPDF from '../components/ReceiptPDF';
import ReportPDF from '../components/ReportPDF';
import useWebSocket from '../hooks/useWebSocket';

function Reception() {
    const [prescriptions, setPrescriptions] = useState([]);

    const [form, setForm] = useState({
        owner_name: '', phone: '', animal_name: '', species: '', breed: '', age: '', gender: '',
        color: '', weight: '', visit_date: '', symptoms: '', text: ''
    });

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ amount: '', payment_mode: '' });

    const fetchRegistration = async () => {
        const res = await fetch('http://localhost:5000/api/registration');
        const data = await res.json();
        setPrescriptions(data.reverse());
    };
    useWebSocket((message) => {
        if (message.type === 'REGISTRATION_UPDATED') {
          fetchRegistration(); // Sync instantly
        }
      });
    useEffect(() => { fetchRegistration(); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const requiredFields = ['owner_name', 'phone', 'animal_name', 'species', 'visit_date', 'text'];
        for (let field of requiredFields) {
            if (!form[field]) {
                alert(`❌ ${field.replace('_', ' ')} is required`);
                return false;
            }
        }
        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;
        try {
            const res = await fetch('http://localhost:5000/api/registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Failed to save');
            alert('✅ Registered & Prescription Saved');
            setForm({
                owner_name: '', phone: '', animal_name: '', species: '', breed: '', age: '', gender: '',
                color: '', weight: '', visit_date: '', symptoms: '', text: ''
            });
            fetchRegistration();
        } catch (err) {
            alert('❌ Registration Failed');
            console.error(err);
        }
    };

    const handleFinalize = async (id) => {
        if (!editForm.amount || !editForm.payment_mode) {
            alert('❌ Please enter amount and payment mode');
            return;
        }
        try {
            const res = await fetch(`http://localhost:5000/api/registration/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });
            if (!res.ok) throw new Error('Failed to update');
            setEditingId(null);
            setEditForm({ amount: '', payment_mode: '' });
            fetchRegistration();
        } catch (err) {
            alert('❌ Update failed');
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-10">
            <h1 className="text-2xl font-bold text-gray-800">🏥 Reception Dashboard</h1>

            <div className="bg-white p-6 rounded shadow space-y-4 border">
                <h2 className="text-lg font-semibold mb-2">🐾 Animal Registration & Prescription</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" name="owner_name" value={form.owner_name} onChange={handleChange} className="border p-2 rounded" placeholder="Owner Name" />
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="border p-2 rounded" placeholder="Phone" pattern="[0-9]{10}" />
                    <input type="text" name="animal_name" value={form.animal_name} onChange={handleChange} className="border p-2 rounded" placeholder="Animal Name" />
                    <input type="text" name="species" value={form.species} onChange={handleChange} className="border p-2 rounded" placeholder="Species" />
                    <input type="text" name="breed" value={form.breed} onChange={handleChange} className="border p-2 rounded" placeholder="Breed" />
                    <input type="number" name="age" value={form.age} onChange={handleChange} className="border p-2 rounded" placeholder="Age" min="0" />
                    <select name="gender" value={form.gender} onChange={handleChange} className="border p-2 rounded">
                        <option value="">Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                    <input type="text" name="color" value={form.color} onChange={handleChange} className="border p-2 rounded" placeholder="Color" />
                    <input type="number" name="weight" value={form.weight} onChange={handleChange} className="border p-2 rounded" placeholder="Weight (kg)" min="0" step="0.1" />
                    <input type="date" name="visit_date" value={form.visit_date} onChange={handleChange} className="border p-2 rounded" />
                    <input type="text" name="symptoms" value={form.symptoms} onChange={handleChange} className="border p-2 rounded col-span-2" placeholder="Symptoms" />
                </div>
                <textarea name="text" value={form.text} onChange={handleChange} rows={4} className="w-full border rounded p-2" placeholder="Prescription"></textarea>

                <button onClick={handleRegister} className="bg-green-600 text-white px-6 py-2 rounded">➕ Register & Save</button>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">📋 Registered Prescriptions</h2>
                {prescriptions.length === 0 ? (
                    <p className="text-gray-500">No data yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border border-gray-300 rounded shadow-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-2 py-2 border">Owner</th>
                                    <th className="px-2 py-2 border">Animal</th>
                                    <th className="px-2 py-2 border">Species</th>
                                    <th className="px-2 py-2 border">Breed</th>
                                    <th className="px-2 py-2 border">Age</th>
                                    <th className="px-2 py-2 border">Prescription</th>
                                    <th className="px-2 py-2 border">Billing</th>
                                    <th className="px-2 py-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescriptions.map((p) => (
                                    <tr key={p.id} className="border-t">
                                        <td className="px-2 py-2 border">{p.owner_name}</td>
                                        <td className="px-2 py-2 border">{p.animal_name}</td>
                                        <td className="px-2 py-2 border">{p.species}</td>
                                        <td className="px-2 py-2 border">{p.breed}</td>
                                        <td className="px-2 py-2 border">{p.age}</td>
                                        <td className="px-2 py-2 border text-sm whitespace-pre-line">{p.text}</td>
                                        <td className="px-2 py-2 border">
                                            {editingId === p.id ? (
                                                <div className="space-y-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Amount"
                                                        value={editForm.amount}
                                                        onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                                                        className="border p-1 rounded w-full"
                                                    />
                                                    <select
                                                        value={editForm.payment_mode}
                                                        onChange={(e) => setEditForm({ ...editForm, payment_mode: e.target.value })}
                                                        className="border p-1 rounded w-full"
                                                    >
                                                        <option value="">Select Mode</option>
                                                        <option>Cash</option>
                                                        <option>UPI</option>
                                                        <option>Card</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleFinalize(p.id)}
                                                        className="bg-green-600 text-white px-2 py-1 rounded w-full text-xs mt-1"
                                                    >✅ Save</button>
                                                </div>
                                            ) : (
                                                <>
                                                    {p.amount ? (
                                                        <p className="text-green-700">₹{p.amount} / {p.payment_mode}</p>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(p.id);
                                                                setEditForm({ amount: '', payment_mode: '' });
                                                            }}
                                                            className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                                                        >✏️ Finalize</button>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                        <td className="px-2 py-2 border space-y-2 text-center">
                                            <PDFDownloadLink
                                                document={<ReceiptPDF patientData={p} amount={p.amount || 'N/A'} />}
                                                fileName={`receipt_${p.id}.pdf`}
                                            >
                                                <button className="bg-orange-600 text-white px-2 py-1 rounded text-xs">🧾 Receipt</button>
                                            </PDFDownloadLink>
                                            <br />
                                            <PDFDownloadLink
                                                document={<ReportPDF patient={p.owner_name} text={p.text} />}
                                                fileName={`report_${p.id}.pdf`}
                                            >
                                                <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs">📄 Report</button>
                                            </PDFDownloadLink>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reception;
