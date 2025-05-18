import { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PrescriptionPDF from '../components/PrescriptionPDF';
import ReceiptPDF from '../components/ReceiptPDF';
import ReportPDF from '../components/ReportPDF';
import useWebSocket from '../hooks/useWebSocket';


function Prescription() {
  const [text, setText] = useState('');
  const [savedText, setSavedText] = useState('');
  const [saving, setSaving] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [editingPrescriptionId, setEditingPrescriptionId] = useState(null);

  const fetchPrescriptions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/registration');
      const data = await res.json();
      setPrescriptions(data.reverse());
    } catch (err) {
      console.error('Failed to fetch prescriptions', err);
    }
  };
  useWebSocket((message) => {
    if (message.type === 'REGISTRATION_UPDATED') {
      fetchPrescriptions();
    }
  });
  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const endpoint = editingPrescriptionId
      ? `http://localhost:5000/api/registration/${editingPrescriptionId}`
      : `http://localhost:5000/api/registration`;
    const method = editingPrescriptionId ? 'PUT' : 'POST';

    // Grab the current prescription to retain full structure for PUT
    const current = prescriptions.find((p) => p.id === editingPrescriptionId);

    const payload = editingPrescriptionId
      ? {
          ...current,
          text, // updated prescription text
        }
      : { text };

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save');

      await response.json();
      alert(editingPrescriptionId ? '✅ Prescription updated!' : '💾 Prescription saved!');
      setEditingPrescriptionId(null);
      setSavedText(text);
      setText('');
      fetchPrescriptions();
    } catch (err) {
      console.error(err);
      alert('❌ Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setText(savedText);
    setEditingPrescriptionId(null);
  };

  const handleEditPrescription = (id, text) => {
    setEditingPrescriptionId(id);
    setText(text);
    setSavedText(text);
    alert('✏️ Loaded for editing');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">📝 Prescription Editor</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        className="w-full border rounded p-3 font-mono text-sm whitespace-pre-line"
        placeholder="Write your prescription..."
      />

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={saving}
        >
          {saving ? 'Saving...' : editingPrescriptionId ? '💾 Update' : '💾 Save'}
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          ❌ Cancel
        </button>
        <PDFDownloadLink
          document={<PrescriptionPDF text={savedText} />}
          fileName="prescription.pdf"
        >
          {({ loading }) =>
            loading ? (
              <button className="bg-gray-500 text-white px-4 py-2 rounded">Generating PDF...</button>
            ) : (
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                📄 Download PDF
              </button>
            )
          }
        </PDFDownloadLink>
      </div>

      <div className="mt-6 border p-4 bg-gray-50 rounded whitespace-pre-line font-mono text-sm">
        <h2 className="text-lg font-semibold mb-2">📄 Preview</h2>
        {savedText}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">🗂 Previous Prescriptions</h2>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-2">Owner</th>
                <th className="border px-2 py-2">Animal</th>
                <th className="border px-2 py-2">Species</th>
                <th className="border px-2 py-2">Breed</th>
                <th className="border px-2 py-2">Age</th>
                <th className="border px-2 py-2">Prescription</th>
                <th className="border px-2 py-2">Actions</th>
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
                  <td className="px-2 py-2 border space-y-2 text-center">
                    <PDFDownloadLink
                      document={<ReceiptPDF patientData={p} amount={p.amount} />}
                      fileName={`receipt_${p.id}.pdf`}
                    >
                      <button className="bg-orange-600 text-white px-2 py-1 rounded text-xs mb-1">🧾 Receipt</button>
                    </PDFDownloadLink>
                    <br />
                    <PDFDownloadLink
                      document={<ReportPDF patient={p.owner_name} text={p.text} />}
                      fileName={`report_${p.id}.pdf`}
                    >
                      <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs mb-1">📄 Report</button>
                    </PDFDownloadLink>
                    <br />
                    <button
                      onClick={() => handleEditPrescription(p.id, p.text)}
                      className="bg-purple-600 text-white px-2 py-1 rounded text-xs mt-2"
                    >
                      ✏️ Edit Text
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Prescription;
