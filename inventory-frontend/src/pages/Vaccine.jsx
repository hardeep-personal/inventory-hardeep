import axios from "axios";
import { useEffect, useState } from "react";

const API = 'http://localhost:5000/api';

function Vaccine() {
  const [vaccines, setVaccines] = useState([]);
  const [users, setUsers] = useState([]);
  const [customMessages, setCustomMessages] = useState({});

  const [newVaccine, setNewVaccine] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    age: '',
    vaccine_id: '',
    date: ''
  });

  const fetchVaccines = async () => {
    const res = await axios.get(`${API}/vaccines`);
    setVaccines(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${API}/users`);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchVaccines();
    fetchUsers();
  }, []);

  const addVaccine = async () => {
    if (!newVaccine) return;
    await axios.post(`${API}/vaccines`, { name: newVaccine });
    setNewVaccine('');
    fetchVaccines();
  };

  const registerUser = async () => {
    if (!form.name || !form.phone || !form.age || !form.vaccine_id || !form.date) return;
    await axios.post(`${API}/register`, form);
    setForm({ name: '', phone: '', age: '', vaccine_id: '', date: '' });
    fetchUsers();
  };

  const sendReminder = async (user) => {
    const customMessage = customMessages[user.id] || `Hi ${user.name}, this is a reminder for your next dose of ${user.vaccine_name}`;

    try {
      await axios.post(`${API}/send-reminder`, {
        phone: user.phone,
        message: customMessage,
      });
      alert('Reminder sent!');
    } catch (err) {
      console.error(err);
      alert('Failed to send reminder.');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">💉 Vaccination System</h1>

      {/* Add Vaccine */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h2 className="font-semibold">Add Vaccine Type</h2>
        <div className="flex space-x-2">
          <input
            className="border px-3 py-2 rounded w-full"
            placeholder="e.g. COVID-19"
            value={newVaccine}
            onChange={(e) => setNewVaccine(e.target.value)}
          />
          <button onClick={addVaccine} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
      </div>

      {/* Register User */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h2 className="font-semibold">Register User</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border px-3 py-2 rounded"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            type="number"
            className="border px-3 py-2 rounded"
            placeholder="Age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />
          <select
            className="border px-3 py-2 rounded"
            value={form.vaccine_id}
            onChange={(e) => setForm({ ...form, vaccine_id: e.target.value })}
          >
            <option value="">Select Vaccine</option>
            {vaccines.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="border px-3 py-2 rounded"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <button onClick={registerUser} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
          Register
        </button>
      </div>

      {/* User List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Registered Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-500">No users registered yet.</p>
        ) : (
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Age</th>
                <th className="p-2 border">Vaccine</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Custom Message</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="p-2 border">{u.name}</td>
                  <td className="p-2 border">{u.phone}</td>
                  <td className="p-2 border">{u.age}</td>
                  <td className="p-2 border">{u.Vaccine.name}</td>
                  <td className="p-2 border">{new Date(u.date).toLocaleDateString()}</td>
                  <td className="p-2 border">
                    <textarea
                      className="w-full border px-2 py-1 rounded text-sm"
                      placeholder={`Hi ${u.name}, this is a reminder...`}
                      value={customMessages[u.id] || ''}
                      onChange={(e) =>
                        setCustomMessages({ ...customMessages, [u.id]: e.target.value })
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <button
                      className="bg-indigo-500 text-white px-3 py-1 rounded"
                      onClick={() => sendReminder(u)}
                    >
                      📩 Send SMS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Vaccine;
