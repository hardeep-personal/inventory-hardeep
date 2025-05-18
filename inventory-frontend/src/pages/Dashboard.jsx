import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react'; // Use `Pencil` for Edit
import * as XLSX from 'xlsx';

const Dashboard = () => {
    const [summary, setSummary] = useState({ totalStock: 0, totalValue: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const [products, setProducts] = useState([]);
    const [types, setTypes] = useState([]);
    const [filterType, setFilterType] = useState('All');
    const [editTypeIndex, setEditTypeIndex] = useState(null);
    const [typeInput, setTypeInput] = useState('');
    const [editTypeId, setEditTypeId] = useState(null);
    const filteredTypes = types.filter(t => t.name.toLowerCase().includes(typeInput.toLowerCase()));
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [form, setForm] = useState({
        name: '', sku: '', quantity: '', price: '', expiryDate: '', supplier: '', type: ''
    });
    const [editingId, setEditingId] = useState(null);
    const handleDownloadExcel = () => {
        const exportData = products.map(p => ({
            Name: p.name,
            SKU: p.sku,
            Quantity: p.quantity,
            Price: p.price,
            ExpiryDate: p.expiryDate ? new Date(p.expiryDate).toLocaleDateString('en-GB') : '',
            Supplier: p.supplier,
            Type: p.type,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

        XLSX.writeFile(workbook, 'products.xlsx');
    };

    useEffect(() => {
        fetchProducts();
        fetchTypes();
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.relative')) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    const fetchProducts = async () => {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);

        const totalStock = res.data.reduce((sum, p) => sum + p.quantity, 0);
        const totalValue = res.data.reduce((sum, p) => sum + (p.quantity * p.price), 0);
        setSummary({ totalStock, totalValue });
    };

    const fetchTypes = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/types');
            setTypes(res.data);
        } catch (err) {
            console.error('Error fetching types:', err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await axios.put(`http://localhost:5000/api/products/${editingId}`, form);
        } else {
            await axios.post('http://localhost:5000/api/products', form);
        }
        resetForm();
        fetchProducts();
    };

    const handleEdit = (product) => {
        const formattedDate = product.expiryDate
            ? new Date(product.expiryDate).toISOString().slice(0, 10)
            : '';
        setForm({ ...product, expiryDate: formattedDate });
        setEditingId(product.id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
    };

    const resetForm = () => {
        setForm({ name: '', sku: '', quantity: '', price: '', expiryDate: '', supplier: '', type: '' });
        setEditingId(null);
    };

    const handleAddType = async () => {
        const trimmed = typeInput.trim();
        if (!trimmed || types.some(t => t.name === trimmed)) {
            setTypeInput('');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/types', { name: trimmed });
            setTypes([...types, res.data]);
            setTypeInput('');
        } catch (err) {
            console.error('Error adding type:', err);
            alert('Failed to add type.');
        }
    };
    const handleAddOrEditType = async () => {
        const trimmed = typeInput.trim();
        if (!trimmed || types.some(t => t.name.toLowerCase() === trimmed.toLowerCase() && t.id !== editTypeId)) return;
        try {
            if (editTypeId) {
                const res = await axios.put(`http://localhost:5000/api/types/${editTypeId}`, { name: trimmed });
                setTypes(types.map(t => (t.id === editTypeId ? res.data : t)));
            } else {
                const res = await axios.post('http://localhost:5000/api/types', { name: trimmed });
                setTypes([...types, res.data]);
            }
            setEditTypeId(null);
            setTypeInput('');
        } catch (err) {
            console.error('Error saving type:', err);
        }
    };
    const handleEditTypeStart = (type) => {
        setEditTypeId(type.id);
        setTypeInput(type.name);
    };

    const handleDeleteType = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/types/${id}`);
            setTypes(types.filter(t => t.id !== id));
            if (form.type === id) setForm({ ...form, type: '' });
        } catch (err) {
            console.error('Error deleting type:', err);
        }
    };
    const handleCancelEditType = () => {
        setEditTypeId(null);
        setTypeInput('');
    };

    // const handleEditType = (index) => {
    //     setEditTypeIndex(index);
    //     setTypeInput(types[index].name);
    // };

    // const handleSaveEditedType = async () => {
    //     const newName = typeInput.trim();
    //     if (!newName || types.some(t => t.name === newName)) return;

    //     const typeToEdit = types[editTypeIndex];

    //     try {
    //         const res = await axios.put(`http://localhost:5000/api/types/${typeToEdit.id}`, { name: newName });
    //         const updatedTypes = [...types];
    //         updatedTypes[editTypeIndex] = res.data;
    //         setTypes(updatedTypes);

    //         if (form.type === typeToEdit.name) setForm({ ...form, type: newName });
    //         if (filterType === typeToEdit.name) setFilterType(newName);

    //         setEditTypeIndex(null);
    //         setTypeInput('');
    //     } catch (err) {
    //         console.error('Error updating type:', err);
    //         alert('Failed to update type.');
    //     }
    // };
    // const CustomMenuList = (props) => {
    //     return (
    //         <components.MenuList {...props}>
    //             {types.map((t, index) => (
    //                 <div
    //                     key={t.id}
    //                     className={`flex justify-between items-center px-3 py-2 hover:bg-gray-100 cursor-pointer ${editTypeIndex === index ? 'bg-yellow-100' : ''
    //                         }`}
    //                     onClick={() => setTypeInput(t.name)}
    //                 >
    //                     <span>{t.name}</span>
    //                     <div className="flex gap-2">
    //                         <button
    //                             onClick={(e) => {
    //                                 e.stopPropagation();
    //                                 handleEditType(index);
    //                             }}
    //                             className="text-yellow-600 text-xs"
    //                         >
    //                             Edit
    //                         </button>
    //                         <button
    //                             onClick={(e) => {
    //                                 e.stopPropagation();
    //                                 handleDeleteType(t);
    //                             }}
    //                             className="text-red-600 text-xs"
    //                         >
    //                             Delete
    //                         </button>
    //                     </div>
    //                 </div>
    //             ))}
    //         </components.MenuList>
    //     );
    // };
    return (
        <div className="p-0">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            {/* Summary */}
            {/* <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-lg font-semibold">Total Stock</h2>
                    <p className="text-2xl">{summary.totalStock}</p>
                </div>
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-lg font-semibold">Total Value</h2>
                    <p className="text-2xl">₹{summary.totalValue.toFixed(2)}</p>
                </div>
            </div> */}

            {/* Type Management */}
            <div className="relative bg-white p-4 rounded shadow mb-6 w-96">
                <h2 className="font-semibold text-lg mb-2">Manage Types</h2>
                <div className="flex gap-2 mb-2">
                    <input
                        className="bg-gray-200 px-2 py-2 rounded w-full"
                        placeholder="Search or Type name"
                        value={typeInput}
                        onChange={(e) => setTypeInput(e.target.value)}
                        onFocus={() => setDropdownOpen(true)}
                    />
                    <button
                        onClick={handleAddOrEditType}
                        className={`text-white px-4 py-1 rounded ${editTypeId ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-600 hover:bg-teal-700'}`}
                    >
                        {editTypeId ? 'Save' : 'Add'}
                    </button>
                    {editTypeId && (
                        <button
                            onClick={handleCancelEditType}
                            className="bg-gray-500 text-white px-4 py-1 rounded"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                {dropdownOpen && (
                    <ul className="absolute z-10 bg-white w-full border max-h-40 overflow-y-auto rounded shadow p-2">
                        {filteredTypes.length > 0 ? (
                            filteredTypes.map((t) => (
                                <li
                                    key={t.id}
                                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                                >
                                    <span>{t.name}</span>
                                    <div className="space-x-2">
                                        <button onClick={() => handleEditTypeStart(t)} className="text-yellow-600 text-sm">Edit</button>
                                        <button onClick={() => handleDeleteType(t.id)} className="text-red-600 text-sm">Delete</button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="p-2 text-gray-500 text-sm">No types found</li>
                        )}
                    </ul>
                )}
            </div>


            {/* Product Form */}
            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-8 gap-4">
                    <input name="name" value={form.name} onChange={handleChange} className="bg-gray-200 p-2 rounded" placeholder="Product Name" />
                    <input name="sku" value={form.sku} onChange={handleChange} className="bg-gray-200 p-2 rounded" placeholder="SKU" />
                    <input name="quantity" value={form.quantity} onChange={handleChange} type="number" className="bg-gray-200 p-2 rounded" placeholder="Quantity" />
                    <input name="price" value={form.price} onChange={handleChange} type="number" step="0.01" className="bg-gray-200 p-2 rounded" placeholder="Price" />
                    <input name="expiryDate" value={form.expiryDate} onChange={handleChange} type="date" className="bg-gray-200 p-2 rounded" />
                    <input name="supplier" value={form.supplier} onChange={handleChange} className="bg-gray-200 p-2 rounded" placeholder="Supplier Name" />
                    <select name="type" value={form.type} onChange={handleChange} className="bg-gray-200 p-2 rounded">
                        <option value="">Select Type</option>
                        {types.map((t) => (
                            <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                    </select>
                    <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded">
                        {editingId ? 'Update' : 'Add'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="bg-gray-500 text-white py-2 px-4 rounded">
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            {/* Filter by Category */}
            <div className="mb-4">
                <label className="mr-2 font-semibold">Filter by Category:</label>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-gray-200 p-2 rounded"
                >
                    <option value="All">All</option>
                    {types.map((t) => (
                        <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                </select>
            </div>

            {/* Product Table */}
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className="text-xl font-bold mb-4">Product List</h2>
                </div>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="🔍 Search by Name or SKU"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-200 p-2 rounded w-full"
                    />
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="bg-gray-200 p-2 rounded w-full"
                    />
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setDateFilter('');
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded w-full"
                    >
                        🔄 Reset Filters
                    </button>
                </div>

                <div>
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleDownloadExcel}
                            className="bg-white border border-teal-600 text-teal-700 px-4 py-2 rounded hover:bg-teal-600 hover:text-white transition"
                        >
                            ⬇️ Download Excel
                        </button>
                    </div>

                </div>
            </div>
            <div className="overflow-y-auto max-h-56 w-full border bg-gray-200 rounded">
                <table className="min-w-full">
                    <thead className=" bg-teal-600 text-white sticky top-0">
                        <tr>
                            <th className="p-2 ">Name</th>
                            <th className="p-2 ">SKU</th>
                            <th className="p-2 ">Qty</th>
                            <th className="p-2 ">Price</th>
                            <th className="p-2 ">Expiry</th>
                            <th className="p-2 ">Supplier</th>
                            <th className="p-2 ">Type</th>
                            <th className="p-2 ">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products
                            .filter((p) =>
                                (filterType === 'All' || p.type === filterType) &&
                                (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    p.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
                                (!dateFilter || new Date(p.expiryDate).toISOString().slice(0, 10) === dateFilter)
                            )

                            .map(p => {
                                const formattedDate = p.expiryDate
                                    ? new Date(p.expiryDate).toLocaleDateString('en-GB', {
                                        day: '2-digit', month: 'long', year: 'numeric'
                                    }) : '—';

                                return (
                                    <tr key={p.id} className={p.quantity < 5 ? 'bg-red-100' : ''}>
                                        <td className="p-2 bg-gray-200 border">{p.name}</td>
                                        <td className="p-2 bg-gray-200 border">{p.sku}</td>
                                        <td className="p-2 bg-gray-200 border">{p.quantity}</td>
                                        <td className="p-2 bg-gray-200 border">₹{p.price}</td>
                                        <td className="p-2 bg-gray-200 border">{formattedDate}</td>
                                        <td className="p-2 bg-gray-200 border">{p.supplier}</td>
                                        <td className="p-2 bg-gray-200 border">
                                            {p.type ? <span className="bg-white text-teal-600 font-semibold text-xs px-2 py-1 rounded">{p.type}</span> : '—'}
                                        </td>
                                        <td className="p-2 border flex ">
                                            <button
                                                onClick={() => handleEdit(p)}
                                                className="bg-teal-600 hover:bg-yellow-600 text-white px-2 py-1 rounded flex items-center gap-1 mr-2 transition"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded flex items-center gap-1 transition"
                                            >
                                                <Trash2 size={16} />
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
};

export default Dashboard;
