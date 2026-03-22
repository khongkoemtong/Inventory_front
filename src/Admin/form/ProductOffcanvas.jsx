import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ProductOffcanvas = ({ product, onClose, onSubmit }) => {
  const API_BASE_URL = "http://127.0.0.1:8000";
  
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...product });
  
  // Setup initial image preview
  const initialImage = product.image_url 
    ? (product.image_url.startsWith('http') ? product.image_url : `${API_BASE_URL}${product.image_url}`)
    : 'https://via.placeholder.com/150';

  const [previewImage, setPreviewImage] = useState(initialImage);
  const [categories, setCategories] = useState([]); 

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
    
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/categories/read`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const cats = res.data.data || res.data.message || [];
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const closeCanvas = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  // --- FIX: Added the missing handleChange function ---
  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file" && files[0]) {
      // Save file object for upload
      setFormData({ ...formData, [name]: files[0] });
      // Create preview URL
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();

      // Append fields
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('stock_qty', formData.stock_qty);
      data.append('category_id', formData.category_id);
      if (formData.supplier_id) data.append('supplier_id', formData.supplier_id);
      if (formData.description) data.append('description', formData.description || "");

      // Only append image if it's a new file
      if (formData.image_url instanceof File) {
        data.append('image_url', formData.image_url);
      }

      // We use POST because your api.php uses Route::post
      const response = await axios.post(
        `${API_BASE_URL}/api/product/update/${product.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        }
      );

      if (response.status === 200 || response.data.status === 'success') {
        await Swal.fire({
          icon: "success",
          title: "បានកែប្រែជោគជ័យ",
          timer: 1500,
          showConfirmButton: false
        });
        if (onSubmit) onSubmit();
        closeCanvas();
      }
    } catch (error) {
      console.error("Update Error:", error.response?.data);
      const errorMsg = error.response?.data?.message || "ការកែប្រែបរាជ័យ";
      Swal.fire({ icon: "error", title: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "តើអ្នកប្រាកដទេ?",
      text: `អ្នកនឹងលុបផលិតផល "${product.name}"!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "យល់ព្រមលុប",
      cancelButtonText: "បោះបង់",
      confirmButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/api/product/delete/${product.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        Swal.fire({ icon: "success", title: "លុបបានជោគជ័យ", timer: 1500, showConfirmButton: false });
        if (onSubmit) onSubmit();
        closeCanvas();
      } catch (error) {
        Swal.fire({ icon: "error", title: "លុបបរាជ័យ" });
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${show ? "bg-black/40" : "bg-black/0"}`}
      onClick={closeCanvas}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute right-0 top-0 h-full w-[400px] bg-white shadow-xl transform transition-transform duration-300 ${show ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold">ព័ត៌មានផលិតផល</h2>
            <button onClick={closeCanvas} className="text-gray-400 hover:text-black">✕</button>
          </div>

          <div className="space-y-4">
            {/* Image Section */}
            <div>
              <label className="block text-sm font-medium mb-1">រូបភាព</label>
              <div className="w-full h-48 overflow-hidden rounded-lg border bg-gray-50 mb-2">
                <img 
                  src={previewImage} 
                  className="w-full h-full object-contain" 
                  alt="Preview"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                />
              </div>
              <input type="file" name="image_url" onChange={handleChange} className="w-full text-sm border p-2 rounded bg-gray-50" />
            </div>

            {/* Inputs */}
            <div>
               <label className="block text-sm font-medium mb-1">ឈ្មោះផលិតផល</label>
               <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full border p-2 rounded outline-none" />
            </div>

            <div>
               <label className="block text-sm font-medium mb-1">ប្រភេទ (Category)</label>
               <select name="category_id" value={formData.category_id || ''} onChange={handleChange} className="w-full border p-2 rounded">
                 <option value="">ជ្រើសរើសប្រភេទ</option>
                 {categories.map((cat) => (
                   <option key={cat.id} value={cat.id}>{cat.name}</option>
                 ))}
               </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium mb-1">តម្លៃ ($)</label>
                 <input name="price" type="number" value={formData.price || ''} onChange={handleChange} className="w-full border p-2 rounded" />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">ក្នុងស្តុក</label>
                 <input name="stock_qty" type="number" value={formData.stock_qty || ''} onChange={handleChange} className="w-full border p-2 rounded" />
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-6">
              <button 
                onClick={handleUpdate} 
                disabled={isSubmitting}
                className={`w-full text-white font-bold py-2.5 rounded-xl transition-all ${isSubmitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isSubmitting ? "កំពុងរក្សាទុក..." : "រក្សាទុកការផ្លាស់ប្តូរ"}
              </button>
              <button onClick={handleDelete} className="w-full bg-white border border-red-200 text-red-600 font-bold py-2.5 rounded-xl hover:bg-red-50">
                លុបផលិតផលនេះ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOffcanvas;