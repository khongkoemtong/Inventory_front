import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// ១. បង្កើតតម្លៃដើម (Initial State) ទុកសម្រាប់ Reset
const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock_qty: '',
  category_id: '',
  supplier_id: '',
  image_url: '',
  status: 'in stock'
};

const ProductForm = ({ onSubmit, initialData = null }) => {
  const navigate = useNavigate();
  
  // បើមាន initialData (ពេល Edit) ឱ្យវាបង្ហាញទិន្នន័យចាស់ បើអត់ទេឱ្យវាទទេ (ពេល Create)
  const [formData, setFormData] = useState(initialData || EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ទាញទិន្នន័យ Categories & Suppliers មកដាក់ក្នុង Select Box
 useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        
        const [catRes, supRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/categories/read", config),
          axios.get("http://127.0.0.1:8000/api/suppliers/read", config)
        ]);
        
        // ឆែកមើល response structure ឱ្យច្បាស់
        // បើ Backend បោះមក { "message": [...] } នោះត្រូវប្រើ .data.message
        const catData = catRes.data.message || catRes.data.Data || catRes.data;
        const supData = supRes.data.message || supRes.data.Data || supRes.data;

        console.log("Categories:", catData); // តេស្តមើលក្នុង Console ថាវាចេញ Array ឬអត់
        
        setCategories(Array.isArray(catData) ? catData : []);
        setSuppliers(Array.isArray(supData) ? supData : []);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData(prev => ({ ...prev, image_url: URL.createObjectURL(file) }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'ឈ្មោះផលិតផលត្រូវតែបំពេញ';
    if (!formData.price || formData.price <= 0) newErrors.price = 'តម្លៃមិនត្រឹមត្រូវ';
    if (!formData.category_id) newErrors.category_id = 'សូមជ្រើសរើសប្រភេទ';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    const data = new FormData();

    // បោះទិន្នន័យចូល FormData
    Object.keys(formData).forEach(key => {
      // បើជាករណី Edit ហើយ image_url ជា String (URL ចាស់) មិនបាច់ Append ចូលទេ
      if (key !== 'image_url') {
        data.append(key, formData[key] === null ? '' : formData[key]);
      }
    });

    // បើមានជ្រើសរើស File រូបភាពថ្មី
    if (imageFile) {
      data.append('image_url', imageFile);
    }

    // ប្រសិនបើជាករណី Update ក្នុង Laravel បងត្រូវប្រើវិធីនេះទើបវាស្គាល់ File
    if (initialData) {
      data.append('_method', 'PUT'); 
    }

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const url = initialData 
        ? `http://127.0.0.1:8000/api/product/update/${initialData.id}`
        : `http://127.0.0.1:8000/api/product/create`;

      await axios.post(url, data, config);

      Swal.fire('ជោគជ័យ', initialData ? 'កែប្រែបានសម្រេច' : 'រក្សាទុកបានសម្រេច', 'success');
      
      if (!initialData) {
        setFormData(EMPTY_FORM);
        setImageFile(null);
        e.target.reset();
      }
      if (onSubmit) onSubmit();
      
    } catch (error) {
      console.error("Submit Error:", error.response?.data);
      Swal.fire('កំហុស', error.response?.data?.message || 'មិនអាចរក្សាទុកបានទេ', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6">
        {initialData ? '📝 កែប្រែផលិតផល' : '➕ បន្ថែមផលិតផលថ្មី'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input ឈ្មោះ */}
        <div>
          <label className="block text-sm font-medium mb-1">ឈ្មោះផលិតផល *</label>
          <input 
            type="text" name="name" 
            value={formData.name} 
            onChange={handleChange} 
            className={`w-full p-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`} 
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* តម្លៃ */}
          <div>
            <label className="block text-sm font-medium mb-1">តម្លៃ ($) *</label>
            <input 
              type="number" name="price" 
              value={formData.price} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-lg border-gray-300" 
            />
          </div>
          {/* ចំនួនស្តុក */}
          <div>
            <label className="block text-sm font-medium mb-1">ចំនួនស្តុក *</label>
            <input 
              type="number" name="stock_qty" 
              value={formData.stock_qty} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-lg border-gray-300" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* ប្រភេទ */}
          <div>
            <label className="block text-sm font-medium mb-1">ប្រភេទ *</label>
            <select 
              name="category_id" 
              value={formData.category_id} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-lg border-gray-300"
            >
              <option value="">ជ្រើសរើសប្រភេទ</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          {/* អ្នកផ្គត់ផ្គង់ */}
          <div>
            <label className="block text-sm font-medium mb-1">អ្នកផ្គត់ផ្គង់ *</label>
            <select 
              name="supplier_id" 
              value={formData.supplier_id} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-lg border-gray-300"
            >
              <option value="">ជ្រើសរើសអ្នកផ្គត់ផ្គង់</option>
              {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
            </select>
          </div>
        </div>

        {/* រូបភាព */}
        <div>
          <label className="block text-sm font-medium mb-1">រូបភាពផលិតផល</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="w-full p-2 border rounded-lg border-gray-300" 
          />
          {formData.image_url && (
            <img 
              src={formData.image_url} 
              alt="Preview" 
              className="mt-3 w-32 h-32 object-cover rounded-lg border" 
            />
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button 
            type="button" 
            onClick={() => navigate('/dashboard/products')} 
            className="px-5 py-2 border rounded-lg hover:bg-gray-100"
          >
            បោះបង់
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${isSubmitting ? 'opacity-50' : ''}`}
          >
            {isSubmitting ? 'កំពុងរក្សាទុក...' : (initialData ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុកទិន្នន័យ')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;