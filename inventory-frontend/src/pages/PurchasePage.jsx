import { useEffect, useState } from 'react';
import axios from 'axios';

function PurchasePage() {
  const [summary, setSummary] = useState({ totalStock: 0, totalValue: 0 });
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
      name: '', sku: '', quantity: '', price: '', expiryDate: '', supplier: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
      fetchProducts();
  }, []);

  const fetchProducts = async () => {
      const res = await axios.get('http://localhost:5000/api/purchases');
      setProducts(res.data);
      const totalStock = res.data.reduce((sum, p) => sum + p.quantity, 0);
      const totalValue = res.data.reduce((sum, p) => sum + (p.quantity * p.price), 0);
      setSummary({ totalStock, totalValue });
  };

  const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (editingId) {
          await axios.put(`http://localhost:5000/api/purchases/${editingId}`, form);
      } else {
          await axios.post('http://localhost:5000/api/purchases', form);
      }
      resetForm();
      fetchProducts();
  };

  const handleEdit = (product) => {
      const formattedDate = product.expiryDate
          ? new Date(product.expiryDate).toISOString().slice(0, 10)
          : '';

      setForm({
          ...product,
          expiryDate: formattedDate
      });
      setEditingId(product.id);
  };

  const handleDelete = async (id) => {
      await axios.delete(`http://localhost:5000/api/purchases/${id}`);
      fetchProducts();
  };

  const resetForm = () => {
      setForm({ name: '', sku: '', quantity: '', price: '', expiryDate: '', supplier: '' });
      setEditingId(null);
  };
  return (
    <div>
         <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-xl font-bold mb-4">
                    {editingId ? 'Edit Product' : 'Add New Purchase'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-8 gap-4">
                    <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded" placeholder="Product Name" />
                    <input name="sku" value={form.sku} onChange={handleChange} className="border p-2 rounded" placeholder="SKU" />
                    <input name="quantity" value={form.quantity} onChange={handleChange} type="number" className="border p-2 rounded" placeholder="Quantity" />
                    <input name="price" value={form.price} onChange={handleChange} type="number" step="0.01" className="border p-2 rounded" placeholder="Price" />
                    <input name="expiryDate" value={form.expiryDate} onChange={handleChange} type="date" className="border p-2 rounded" />
                    <input name="supplier" value={form.supplier} onChange={handleChange} className="border p-2 rounded" placeholder="Buyer Name" />

                    <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                        {editingId ? 'Update' : 'Add '}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="bg-gray-500 text-white py-2 px-4 rounded">
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            <h2 className="text-xl font-bold mb-4">Product List</h2>
            <div className="overflow-y-auto max-h-56 w-full border border-gray-200 rounded">
                <table className="min-w-full">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Description</th>
                            <th className="p-2 border">Qty</th>
                            <th className="p-2 border">Price</th>
                            <th className="p-2 border">Date</th>
                            <th className="p-2 border">Supplier</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => {
                            const formattedDate = p.expiryDate
                                ? new Date(p.expiryDate).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })
                                : '—';

                            return (
                                <tr key={p.id} className={p.quantity < 5 ? 'bg-red-100' : ''}>
                                    <td className="p-2 border">{p.name}</td>
                                    <td className="p-2 border">{p.sku}</td>
                                    <td className="p-2 border">{p.quantity}</td>
                                    <td className="p-2 border">₹{p.price}</td>
                                    <td className="p-2 border">{formattedDate}</td> {/* NEW */}
                                    <td className="p-2 border">{p.supplier}</td>
                                    <td className="p-2 border">
                                        <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white px-2 py-1 rounded">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <p className="mt-2 text-sm text-red-600">* Low stock items are highlighted</p>
            </div>
    </div>
  );
}

export default PurchasePage;
