import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag, Package, ChevronRight, Loader2, ImageOff, Plus, X, Upload, Trash2, Edit3 } from 'lucide-react';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null); // Null for create, ID for update
  const [formData, setFormData] = useState({ name: '', description: '', image: null });

  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchData();
  }, []);
const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/categories/read`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // ឆែកមើល response structure (អាចជា res.data.message ឬ res.data.Data)
      const data = res.data.message || res.data.Data || res.data;
      setCategories(Array.isArray(data) ? data : []);
      
      // កំណត់ Active Category ដំបូងគេ
      if (Array.isArray(data) && data.length > 0 && !activeCategory) {
        setActiveCategory(data[0]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditId(cat.id);
      setFormData({ name: cat.name, description: cat.description || '', image: null });
    } else {
      setEditId(null);
      setFormData({ name: '', description: '', image: null });
    }
    setIsModalOpen(true);
  };

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150"; // Fallback if no image
    if (path.startsWith('http')) return path; // Already a full URL

    // Combine BASE_URL with the path, ensuring no double slashes
    // Assuming BASE_URL = "http://127.0.0.1:8000"
    return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (formData.image) data.append('image', formData.image);
    if (editId) data.append('_method', 'PUT');

    try {
      const url = editId
        ? `${BASE_URL}/api/categories/update/${editId}`
        : `${BASE_URL}/api/categories/create`;

      await axios.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      await fetchData(); 
      setIsModalOpen(false);
      setFormData({ name: '', description: '', image: null });
    } catch (err) {
      alert(err.response?.data?.message || "ប្រតិបត្តិការបរាជ័យ!");
    } finally {
      setIsSubmitting(false);
    }
  };

 const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm("តើអ្នកប្រាកដថាចង់លុបប្រភេទនេះមែនទេ?")) {
      try {
        await axios.delete(`${BASE_URL}/api/categories/delete/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
        if (activeCategory?.id === id) setActiveCategory(null);
      } catch (err) {
        alert("មិនអាចលុបបានទេ!");
      }
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6 p-6 bg-gray-50 font-sans">

      {/* --- Sidebar --- */}
      <div className="w-1/3 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <Tag size={18} className="text-blue-500" /> ប្រភេទទំនិញ ({categories.length})
          </h3>
          <button onClick={() => handleOpenModal()} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {categories.map((cat) => (
            <div key={cat.id} className="group relative">
              <button
                onClick={() => setActiveCategory(cat)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeCategory?.id === cat.id ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-100 text-gray-600'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      cat.image?.startsWith('http')
                        ? cat.image
                        : `${BASE_URL}${cat.image?.startsWith('/') ? '' : '/'}${cat.image}`
                    }
                    className="w-10 h-10 rounded-lg object-cover border bg-white"
                    alt={cat.name}
                    onError={(e) => {
                      e.target.onerror = null; // Prevents infinite loop if placeholder fails
                      e.target.src = "https://via.placeholder.com/40";
                    }}
                  />
                  <span className="font-semibold text-sm">{cat.name}</span>
                </div>
                <ChevronRight size={14} className={activeCategory?.id === cat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
              </button>

              {/* Quick Actions for Sidebar */}
              <div className="absolute right-8 top-3 hidden group-hover:flex gap-1">
                <button onClick={() => handleOpenModal(cat)} className="p-1 bg-white/90 text-blue-600 rounded border shadow-sm hover:bg-white"><Edit3 size={12} /></button>
                <button onClick={() => handleDelete(cat.id)} className="p-1 bg-white/90 text-red-600 rounded border shadow-sm hover:bg-white"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        {activeCategory ? (
          <>
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Change this */}
                <img src={getImageUrl(activeCategory.image)} className="w-16 h-16 rounded-xl object-cover border" alt="" />                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{activeCategory.name}</h2>
                  <p className="text-gray-500 text-sm">{activeCategory.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(activeCategory)} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
                  <Edit3 size={16} /> កែប្រែ
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 sticky top-0 border-b">
                  <tr>
                    <th className="p-4 text-xs font-bold uppercase text-gray-400">ឈ្មោះទំនិញ</th>
                    <th className="p-4 text-xs font-bold uppercase text-gray-400">តម្លៃ</th>
                    <th className="p-4 text-xs font-bold uppercase text-gray-400 text-right">ស្តុក</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeCategory.products?.length > 0 ? activeCategory.products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-blue-50/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={prod.image_url} className="w-10 h-10 rounded shadow-sm object-cover" alt="" />
                          <span className="font-medium text-gray-700">{prod.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-blue-600 font-bold">${prod.price}</td>
                      <td className="p-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${prod.stock_qty < 10 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                          {prod.stock_qty} pcs
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="p-20 text-center text-gray-400">គ្មានទំនិញក្នុងប្រភេទនេះទេ</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : <div className="m-auto text-gray-400 flex flex-col items-center gap-2"><ImageOff size={48} className="opacity-20" /><p>សូមជ្រើសរើសប្រភេទ</p></div>}
      </div>

      {/* --- Create/Edit Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{editId ? 'កែប្រែប្រភេទ' : 'បន្ថែមប្រភេទថ្មី'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input
                type="text" placeholder="ឈ្មោះប្រភេទ" required
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <textarea
                placeholder="ការពិពណ៌នា"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 transition-all"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                <Upload className="text-gray-400 mb-2" size={20} />
                <span className="text-xs text-gray-500">{formData.image ? formData.image.name : "ជ្រើសរើសរូបភាពប្រភេទ"}</span>
                <input type="file" className="hidden" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
              </label>
              <button
                type="submit" disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-300"
              >
                {isSubmitting ? "កំពុងរក្សាទុក..." : (editId ? "ធ្វើបច្ចុប្បន្នភាព" : "បង្កើតថ្មី")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;