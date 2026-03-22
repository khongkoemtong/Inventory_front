import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Tag, Loader2, ImageOff, Plus, X, Upload, 
  Trash2, Edit3, Package, Layers, Info, ChevronRight 
} from 'lucide-react';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null); 
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
      
      // FIXED: In your controller, you return 'return response()->json($categories);'
      // This means the array is directly in res.data
      const categoriesArray = Array.isArray(res.data) ? res.data : [];
      setCategories(categoriesArray);
      
      // Keep selected category detail updated if it exists
      if (activeCategory) {
        const updated = categoriesArray.find(c => c.id === activeCategory.id);
        if (updated) setActiveCategory(updated);
      }
    } catch (err) {
      console.error("បណ្តាញមានបញ្ហា (Network Error):", err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150?text=No+Image";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const handleOpenModal = (e, cat = null) => {
    if (e) e.stopPropagation();
    if (cat) {
      setEditId(cat.id);
      setFormData({ name: cat.name, description: cat.description || '', image: null });
    } else {
      setEditId(null);
      setFormData({ name: '', description: '', image: null });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (window.confirm("តើអ្នកប្រាកដថាចង់លុបប្រភេទនេះមែនទេ?")) {
      try {
        await axios.delete(`${BASE_URL}/api/categories/delete/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (activeCategory?.id === id) setActiveCategory(null);
        fetchData();
      } catch (err) {
        alert("មិនអាចលុបបានទេ!");
      }
    }
  };
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  const token = localStorage.getItem('token');
  
  // Use FormData to handle the text and the image file
  const data = new FormData();
  data.append('name', formData.name);
  data.append('description', formData.description || "");
  
  // Only append image if a new file was selected
  if (formData.image) {
    data.append('image', formData.image);
  }

  try {
    // Both Create and Update will use axios.post because your api.php uses Route::post
    const url = editId 
      ? `${BASE_URL}/api/categories/update/${editId}` 
      : `${BASE_URL}/api/categories/create`;

    await axios.post(url, data, {
      headers: { 
        'Content-Type': 'multipart/form-data', 
        'Authorization': `Bearer ${token}` 
      },
    });

    await fetchData(); // Refresh the table
    setIsModalOpen(false); // Close the modal
    setFormData({ name: '', description: '', image: null }); // Reset form
  } catch (err) {
    console.error("Error details:", err.response?.data);
    alert(err.response?.data?.message || "ប្រតិបត្តិការបរាជ័យ!");
  } finally {
    setIsSubmitting(false);
  }
};

  // --- Rendering UI (Keep your current JSX, it is great) ---
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-6 font-sans gap-6">
      
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Layers className="text-blue-600" /> ការគ្រប់គ្រងប្រភេទទំនិញ
          </h1>
          <p className="text-gray-500 text-sm">គ្រប់គ្រងប្រភេទ និងមើលផលិតផលតាមក្រុមនីមួយៗ</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} /> បង្កើតប្រភេទថ្មី
        </button>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Side: Table */}
        <div className="w-1/2 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-gray-50/50">
            <h3 className="font-bold text-gray-700 flex items-center gap-2 uppercase text-xs tracking-wider">
              បញ្ជីប្រភេទ ({categories.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-400 border-b">ប្រភេទ</th>
                  <th className="p-4 text-xs font-bold text-gray-400 border-b">ចំនួនផលិតផល</th>
                  <th className="p-4 text-xs font-bold text-gray-400 border-b text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr 
                    key={cat.id} 
                    onClick={() => setActiveCategory(cat)}
                    className={`cursor-pointer transition-colors ${activeCategory?.id === cat.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={getImageUrl(cat.image)} 
                          className="w-12 h-12 rounded-lg object-cover border bg-white" 
                          alt="" 
                          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/50"; }}
                        />
                        <div>
                          <div className="font-bold text-gray-800">{cat.name}</div>
                          <div className="text-xs text-gray-400 line-clamp-1">{cat.description || 'គ្មានការពិពណ៌នា'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-bold">
                        {cat.products?.length || 0} items
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={(e) => handleOpenModal(e, cat)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"><Edit3 size={16} /></button>
                        <button onClick={(e) => handleDelete(e, cat.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="w-1/2 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          {activeCategory ? (
            <>
              <div className="p-5 border-b flex items-center justify-between bg-blue-600 text-white">
                <div className="flex items-center gap-3">
                  <Package size={24} />
                  <div>
                    <h3 className="font-bold">ផលិតផលក្នុងក្រុម: {activeCategory.name}</h3>
                    <p className="text-xs text-blue-100">{activeCategory.products?.length || 0} មុខទំនិញត្រូវបានរកឃើញ</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 sticky top-0 border-b">
                    <tr>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase">ទំនិញ</th>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase">តម្លៃ</th>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">ស្តុក</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activeCategory.products?.length > 0 ? activeCategory.products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={getImageUrl(prod.image_url)} 
                              className="w-10 h-10 rounded shadow-sm object-cover border" 
                              alt="" 
                              onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/40"; }}
                            />
                            <span className="font-medium text-gray-700">{prod.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-blue-600 font-bold">${Number(prod.price).toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${prod.stock_qty < 10 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                            {prod.stock_qty} pcs
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="3" className="p-20 text-center">
                          <div className="flex flex-col items-center gap-2 text-gray-400">
                            <Info size={40} className="opacity-20" />
                            <p>មិនទាន់មានផលិតផលក្នុងប្រភេទនេះនៅឡើយទេ</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="m-auto flex flex-col items-center gap-4 text-gray-300">
              <div className="p-6 bg-gray-100 rounded-full">
                <ChevronRight size={60} />
              </div>
              <p className="text-lg font-medium">សូមជ្រើសរើសប្រភេទដើម្បីមើលផលិតផល</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-xl text-gray-800">{editId ? 'កែប្រែព័ត៌មាន' : 'បន្ថែមប្រភេទថ្មី'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">ឈ្មោះប្រភេទ *</label>
                <input
                  type="text" placeholder="ឧទាហរណ៍៖ ភេសជ្ជៈ" required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">ការពិពណ៌នា</label>
                <textarea
                  placeholder="រៀបរាប់បន្តិចបន្តួច..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 transition-all"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">រូបភាពតំណាង</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                  <Upload className="text-gray-400 mb-2" size={24} />
                  <span className="text-xs text-gray-500 font-medium">{formData.image ? formData.image.name : "ចុចដើម្បីផ្ទុកឡើងរូបភាព"}</span>
                  <input type="file" className="hidden" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
                </label>
              </div>
              <button
                type="submit" disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-300 transition-all transform active:scale-[0.98]"
              >
                {isSubmitting ? "កំពុងរក្សាទុក..." : (editId ? "ធ្វើបច្ចុប្បន្នភាព" : "បង្កើតប្រភេទឥឡូវនេះ")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;