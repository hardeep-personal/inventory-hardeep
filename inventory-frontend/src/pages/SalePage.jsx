import { useEffect, useState } from 'react';
import axios from 'axios';

function SalePage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productId: '',
    quantity: '',
    saleDate: '',
    customerName: ''
  });
  const [availableStock, setAvailableStock] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/purchases'); // Assumes products are in `purchases`
    setProducts(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'productId') {
      const selected = products.find(p => p.id === parseInt(value));
      setAvailableStock(selected?.quantity || 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/sales', {
        ...form,
        quantity: parseInt(form.quantity),
        saleDate: form.saleDate || new Date().toISOString()
      });

      setMessage('Sale recorded and inventory updated.');
      setForm({ productId: '', quantity: '', saleDate: '', customerName: '' });
      setAvailableStock(0);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage('Error: ' + (err.response?.data?.message || 'Sale failed'));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Sell Products</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block mb-1">Select Product:</label>
          <select
            name="productId"
            value={form.productId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Choose Product --</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>
          {availableStock > 0 && (
            <p className="text-sm text-gray-600">Available: {availableStock}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            min="1"
            max={availableStock}
          />
        </div>

        <div>
          <label className="block mb-1">Customer Name:</label>
          <input
            type="text"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter customer name"
          />
        </div>

        <div>
          <label className="block mb-1">Sale Date:</label>
          <input
            type="date"
            name="saleDate"
            value={form.saleDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={!form.productId || !form.quantity}
        >
          Record Sale
        </button>

        {message && <p className="mt-2 text-blue-600">{message}</p>}
      </form>
    </div>
  );
}

export default SalePage;
