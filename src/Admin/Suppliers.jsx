import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Mail, Phone, MapPin, Package, Edit, Trash2, Search, X, Loader2, AlertCircle } from 'lucide-react';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [currentProducts, setCurrentProducts] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '', contact_name: '', email: '', phone: '', address: ''
  });

  // ចំណុចសំខាន់៖ ពិនិត្យ URL ឱ្យច្បាស់ (ជាទូទៅ Laravel API គឺផត 8000)
  const API_URL = "http://127.0.0.1:8000/api/suppliers";

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // ១. ទាញ Token

      const res = await axios.get(`${API_URL}/read`, {
        headers: {
          'Authorization': `Bearer ${token}`, // ២. ផ្ញើទៅកាន់ Backend
          'Accept': 'application/json'
        }
      });
      
      // បងត្រូវប្រាកដថាប្រើ .data.message ឱ្យត្រូវតាម Backend
      if (res.data && res.data) {
        setSuppliers(res.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response?.status === 401) {
        // បើអស់សុពលភាព Token ឱ្យទៅ Login វិញ
        // window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // តម្រងស្វែងរក (Filter)
  const filteredData = Array.isArray(suppliers) ? suppliers.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleOpenModal = (supplier = null) => {
    if (supplier) {
      setSelectedSupplier(supplier);
      setFormData({
        name: supplier.name || '',
        contact_name: supplier.contact_name || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || ''
      });
    } else {
      setSelectedSupplier(null);
      setFormData({ name: '', contact_name: '', email: '', phone: '', address: '' });
    }
    setShowAddModal(true);
  };

  const handleViewProducts = (supplier) => {
    setSelectedSupplier(supplier);
    setCurrentProducts(supplier.products || []);
    setShowProductModal(true);
  };
const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const url = selectedSupplier ? `${API_URL}/update/${selectedSupplier.id}` : `${API_URL}/create`;
      
      // ប្រើ axios.post សម្រាប់ទាំងពីរ (បើ Update បងអាចប្រើ _method: PUT ក្នុង FormData ក៏បាន)
      const res = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if(res.status === 200 || res.status === 201) {
        fetchSuppliers();
        setShowAddModal(false);
        alert("រក្សាទុកជោគជ័យ!");
      }
    } catch (err) {
      console.error("Submit error:", err.response?.data);
      alert(err.response?.data?.message || "មានបញ្ហាក្នុងការរក្សាទុក!");
    }
  };
const handleDelete = async (id) => {
    if (window.confirm('តើអ្នកចង់លុបមែនទេ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/delete/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchSuppliers();
      } catch (err) {
        alert("លុបមិនបានសម្រេច!");
      }
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={50} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-khmer">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">អ្នកផ្គត់ផ្គង់ និងទំនិញ</h1>
          <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center hover:bg-blue-700">
            <Plus size={18} className="mr-2" /> បន្ថែមថ្មី
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text" placeholder="ស្វែងរកឈ្មោះក្រុមហ៊ុន..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid Display */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map(supplier => (
              <div key={supplier.id} className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-gray-800 uppercase">{supplier.name}</h3>
                  <p className="text-sm text-blue-600">អ្នកបន្តការងារ: {supplier.contact_name}</p>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2"><Mail size={14}/> {supplier.email}</div>
                  <div className="flex items-center gap-2"><Phone size={14}/> {supplier.phone}</div>
                  <div className="flex items-center gap-2"><MapPin size={14}/> {supplier.address}</div>
                </div>
                <div className="border-t pt-4 space-y-2">
                  <button 
                    onClick={() => handleViewProducts(supplier)}
                    className="w-full py-2 bg-yellow-50 text-yellow-700 rounded-lg font-bold flex justify-center items-center"
                  >
                    <Package size={16} className="mr-2" /> មើលទំនិញ ({supplier.products?.length || 0})
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(supplier)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex justify-center items-center">
                      <Edit size={16} className="mr-1" /> កែប្រែ
                    </button>
                    <button onClick={() => handleDelete(supplier.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex justify-center items-center">
                      <Trash2 size={16} className="mr-1" /> លុប
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <AlertCircle className="mx-auto text-gray-300 mb-2" size={48} />
            <p className="text-gray-400">មិនមានទិន្នន័យអ្នកផ្គត់ផ្គង់ទេ</p>
          </div>
        )}
      </div>

      {/* Modal View Products */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-bold">ទំនិញផ្គត់ផ្គង់ដោយ: {selectedSupplier?.name}</h2>
              <button onClick={() => setShowProductModal(false)}><X /></button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {currentProducts.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="p-3 text-sm font-bold">ឈ្មោះទំនិញ</th>
                      <th className="p-3 text-sm font-bold text-right">តម្លៃ</th>
                      <th className="p-3 text-sm font-bold text-center">ក្នុងស្តុក</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {currentProducts.map(prod => (
                      <tr key={prod.id} className="hover:bg-gray-50">
                        <td className="p-3">{prod.name}</td>
                        <td className="p-3 text-right text-blue-600 font-bold">${prod.price}</td>
                        <td className="p-3 text-center">{prod.stock_qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center py-10 text-gray-400 font-khmer italic">មិនទាន់មានទំនិញក្នុងប្រព័ន្ធនៅឡើយ</p>
              )}
            </div>
            <button onClick={() => setShowProductModal(false)} className="mt-6 w-full py-2 bg-gray-100 rounded-lg font-bold">បិទ</button>
          </div>
        </div>
      )}

      {/* Modal Add/Edit (ដូចមុន) */}
      {showAddModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold">{selectedSupplier ? 'កែប្រែ' : 'បន្ថែមថ្មី'}</h2>
                    <button type="button" onClick={() => setShowAddModal(false)}><X /></button>
                </div>
                <div className="space-y-4">
                    <input placeholder="ឈ្មោះក្រុមហ៊ុន" required className="w-full p-2 border rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input placeholder="អ្នកទំនាក់ទំនង" required className="w-full p-2 border rounded" value={formData.contact_name} onChange={e => setFormData({...formData, contact_name: e.target.value})} />
                    <input placeholder="លេខទូរស័ព្ទ" required className="w-full p-2 border rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    <input placeholder="អ៊ីមែល" type="email" required className="w-full p-2 border rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    <textarea placeholder="អាសយដ្ឋាន" className="w-full p-2 border rounded" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
                <button type="submit" className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-bold">រក្សាទុក</button>
            </form>
         </div>
      )}
    </div>
  );
};

export default Suppliers;