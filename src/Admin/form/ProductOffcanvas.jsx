import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ProductOffcanvas = ({ product, onClose, onSubmit }) => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({ ...product });
  const [previewImage, setPreviewImage] = useState(product.image_url);
  const [categories, setCategories] = useState([]); 

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
    
    // ទាញបញ្ជី Category មកដាក់ក្នុង Dropdown
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/categories/read");
        const cats = res.data || res.data || [];
        setCategories(cats);
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

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file" && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // មុខងារកែប្រែ (Update)
 const handleUpdate = async () => {
  try {
    const token = localStorage.getItem('token');
    const data = new FormData();

    // បោះទិន្នន័យចូល FormData
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        // ឆែកមើលបើជា Object (ដូចជា category relation) គឺមិនបាច់យកមកទេ 
        // យកតែ values ធម្មតា និង File (រូបភាព)
        if (!(typeof formData[key] === 'object' && !(formData[key] instanceof File))) {
          data.append(key, formData[key]);
        }
      }
    }

    // បញ្ជាក់៖ បើ Backend ប្រើ Route::post បងមិនបាច់ថែម _method: PUT ទេ។ 
    // ប៉ុន្តែបងត្រូវប្រាកដថាផ្ញើ Token ទៅជាមួយ។

    const response = await axios.post(
      `http://127.0.0.1:8000/api/product/update/${product.id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      }
    );

    if (response.status === 200 || response.status === 201) {
      await Swal.fire({
        icon: "success",
        title: "បានកែប្រែជោគជ័យ",
        timer: 1500,
        showConfirmButton: false
      });
      if (typeof onSubmit === 'function') onSubmit();
      closeCanvas();
    }
  } catch (error) {
    console.error("Update Error:", error.response?.data);
    // បង្ហាញ Error message ពី Backend មកលើ Screen តែម្តងដើម្បីស្រួលដឹង
    const errorMsg = error.response?.data?.message || "ការកែប្រែបរាជ័យ";
    Swal.fire({ icon: "error", title: errorMsg });
  }
};

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "តើអ្នកប្រាកដទេ?",
      text: `អ្នកនឹងលុបផលិតផល "${product.name}" ចេញពីប្រព័ន្ធ!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "យល់ព្រមលុប",
      cancelButtonText: "បោះបង់",
    });

    if (result.isConfirmed) {
      try {
        // ១. ទាញ Token ពី LocalStorage (ដូចការ Update ដែរ)
        const token = localStorage.getItem('token');

        // ២. បញ្ជូន Request ទៅកាន់ API ជាមួយ Header Authorization
        const response = await axios.delete(
          `http://127.0.0.1:8000/api/product/delete/${product.id}`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }
        );

        // ឆែកមើលបើលុបជោគជ័យ (Status 200 ឬ 204)
        if (response.status === 200 || response.status === 204) {
          await Swal.fire({
            icon: "success",
            title: "លុបបានជោគជ័យ",
            timer: 1500,
            showConfirmButton: false
          });

          // ហៅ function onSubmit ដើម្បី refresh បញ្ជីទំនិញនៅខាងក្រៅ
          if (typeof onSubmit === 'function') onSubmit(); 
          closeCanvas();
        }
      } catch (error) {
        console.error("Delete Error:", error.response?.data);
        
        // បង្ហាញ Error Message ឱ្យចំបញ្ហា
        let errorTitle = "ការលុបបរាជ័យ";
        let errorText = error.response?.data?.message || "មានបញ្ហាបច្ចេកទេស!";

        if (error.response?.status === 401) {
          errorText = "អ្នកមិនមានសិទ្ធិលុបទេ ឬ Token ហួសកំណត់!";
        } else if (error.response?.status === 404) {
          errorText = "រកមិនឃើញទិន្នន័យផលិតផលនេះក្នុងប្រព័ន្ធ!";
        }

        Swal.fire({
          icon: "error",
          title: errorTitle,
          text: errorText,
        });
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
            <button onClick={closeCanvas} className="text-gray-400 hover:text-black transition-colors">✕</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">រូបភាព</label>
              <img src={previewImage || 'https://via.placeholder.com/150'} className="w-full  object-cover rounded-lg border mb-2 shadow-sm" />
              <input type="file" name="image_url" onChange={handleChange} className="w-full text-sm border p-2 rounded bg-gray-50" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ឈ្មោះផលិតផល</label>
              <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ប្រភេទ (Category)</label>
              <select
                name="category_id"
                value={formData.category_id || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">ជ្រើសរើសប្រភេទ</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">តម្លៃ ($)</label>
                <input name="price" type="number" value={formData.price || ''} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ក្នុងស្តុក</label>
                <input name="stock_qty" type="number" value={formData.stock_qty || ''} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-6">
              <button onClick={handleUpdate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition shadow-lg shadow-blue-200">
                រក្សាទុកការផ្លាស់ប្តូរ
              </button>
              <button onClick={handleDelete} className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2.5 rounded-xl transition">
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