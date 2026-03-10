import React, { useEffect, useState } from 'react';
import { Package, AlertCircle, TrendingUp, ShoppingCart } from 'lucide-react';
import axios from 'axios';

const Overview = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // កំណត់អាសយដ្ឋាន Backend URL
  const BACKEND_URL = "http://127.0.0.1:8000";
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // ១. ទាញយក Token មកប្រើ
        const token = localStorage.getItem('token');

        const response = await axios.get(`${BACKEND_URL}/api/product/read`, {
          headers: {
            'Authorization': `Bearer ${token}`, // <--- សំខាន់បំផុត
            'Accept': 'application/json'
          }
        });

        // រកមើលកន្លែងនេះក្នុង useEffect របស់បង
        if (response.data && response.data.data) { // ប្តូរពី .message មកជា .data
          setActivities(response.data.data);
        }
      } catch (e) {
        console.error("បញ្ហាពេលទាញទិន្នន័យ:", e.response?.status);
        // បើ Error 401 ឱ្យវាទៅ Login វិញ
        if (e.response?.status === 401) window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  // --- ការគណនាតួលេខសរុប (Dynamic Stats) ---
  const totalProducts = activities.length;
  // ផលិតផលដែលអស់ពីស្តុក (stock_qty == 0)
  const outOfStock = activities.filter(item => parseInt(item.stock_qty) === 0).length;
  // គណនាតម្លៃសរុប (Price * Stock)
  const totalValue = activities.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.stock_qty)), 0);

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold text-gray-800">សេចក្តីសង្ខេបនៃសារពើភ័ណ្ឌ</h1>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">ផលិតផលសរុប</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalProducts}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg"><Package className="text-blue-600" size={24} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">អស់ពីស្តុក</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{outOfStock}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg"><AlertCircle className="text-red-600" size={24} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">តម្លៃសរុបក្នុងស្តុក</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">${totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg"><TrendingUp className="text-green-600" size={24} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">អ្នកលក់សរុប</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {[...new Set(activities.map(item => item.seller_id))].length}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg"><ShoppingCart className="text-purple-600" size={24} /></div>
          </div>
        </div>
      </div>

      {/* Product List Table-like UI */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">បញ្ជីផលិតផលថ្មីៗ</h2>
        </div>

        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-10 text-center text-gray-500 animate-pulse">កំពុងផ្ទុក...</div>
          ) : activities.length > 0 ? (
            activities.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  {/* បច្ចេកទេសដោះស្រាយ URL រូបភាព */}
                  <img
                    src={
                      item.image_url.startsWith('http')
                        ? item.image_url
                        : `http://127.0.0.1:8000${item.image_url}`
                    }
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover bg-gray-100 border border-gray-100"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 capitalize">{item.name}</h4>
                    <p className="text-xs text-gray-400">ID: {item.id} • {new Date(item.created_at).toLocaleDateString('km-KH')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-semibold">តម្លៃ</p>
                    <p className="font-bold text-blue-600">${parseFloat(item.price).toFixed(2)}</p>
                  </div>
                  <div className="w-24 text-right">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${item.stock_qty > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                      {item.stock_qty > 0 ? `ស្តុក: ${item.stock_qty}` : 'អស់ស្តុក'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-400">មិនមានទិន្នន័យឡើយ</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;