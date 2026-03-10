import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import ProductOffcanvas from './form/ProductOffcanvas';

const Product = () => {
  const [productData, setProductData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
const fetchData = async () => {
    setLoading(true);
    try {
      // ១. ទាញយក Token ពី LocalStorage
      const token = localStorage.getItem('token');

      // ២. បង្កើត config សម្រាប់ដាក់ Token ក្នុង Header
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      // ៣. ហៅ API ផលិតផល និង ប្រភេទ (Category) ព្រមគ្នាដោយប្រើ config
      const [productRes, categoryRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/product/read', config),
        axios.get('http://127.0.0.1:8000/api/categories/read', config)
      ]);

      // ៤. ចាប់យកទិន្នន័យពី Response (ឆែកមើល Key "message" ដូចក្នុងរូបភាព Network របស់បង)
      const products = productRes.data.data || [];
      const cats = categoryRes.data.message || [];

      // ៥. បញ្ចូលទៅក្នុង State
      setProductData(Array.isArray(products) ? products : []);
      setCategories(Array.isArray(cats) ? cats : []);

      console.log("Fetch Success:", products);

    } catch (e) {
      console.error("Fetch Error Detail:", e.response?.data || e.message);
      
      // ប្រសិនបើ Token ខុស ឬ អស់សុពលភាព (Error 401)
      if (e.response?.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'សូមធ្វើការ Login ម្តងទៀត!',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          // បើចង់ឱ្យវាលោតទៅទំព័រ Login វិញ
          // window.location.href = '/login';
        });
      } else {
        Swal.fire('Error', 'មិនអាចទាញទិន្នន័យបានទេ៖ ' + (e.response?.data?.message || 'Server Error'), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">បញ្ជីផលិតផល</h1>
          <button onClick={fetchData} disabled={loading} className="p-2 bg-gray-100 rounded-lg">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        <Link to='/dashboard/products/create' className="px-4 py-2 bg-blue-600 text-white rounded-lg">+ បន្ថែមថ្មី</Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              {/* បន្ថែម Column ID នៅទីនេះ */}
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">ឈ្មោះផលិតផល</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">ប្រភេទ</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">ស្តុក</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">តម្លៃ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productData.length > 0 ? productData.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedProduct(product)}>
                {/* បង្ហាញលេខសម្គាល់ ID */}
                <td className="px-6 py-4 font-bold text-red-500 ">#{product.id}</td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-bold">
                    {product.category ? product.category.name : 'មិនស្គាល់ប្រភេទ'}
                  </span>
                </td>
                <td className="px-6 py-4">{product.stock_qty}</td>
                <td className="px-6 py-4">${Number(product.price).toLocaleString()}</td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="text-center py-10 text-gray-400">គ្មានទិន្នន័យ</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <ProductOffcanvas
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSubmit={fetchData}
        />
      )}
    </div>
  );
};

export default Product;