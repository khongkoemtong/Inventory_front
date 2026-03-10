import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2, PackageSearch } from 'lucide-react';

const LowStockAlerts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // កំណត់ចំនួនអប្បបរមា (Minimum) ដោយខ្លួនឯង ព្រោះ API មិនទាន់មាន field នេះ
  const MIN_STOCK_THRESHOLD = 20; 
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // ១. ទាញយក Token ពី LocalStorage
      const token = localStorage.getItem('token'); 

      const response = await fetch('http://127.0.0.1:8000/api/product/read', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // ២. បញ្ជូន Token ទៅកាន់ Server
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.status === 401) {
        throw new Error('សូមចូលប្រើប្រាស់គណនីជាមុនសិន (Unauthorized)');
      }

      const jsonResponse = await response.json();
      
      // កំណត់ទិន្នន័យ (ដូចការណែនាំមុន)
      const allProducts = Array.isArray(jsonResponse) 
        ? jsonResponse 
        : (jsonResponse.data || jsonResponse.message || []);

      const lowStockData = allProducts.filter(item => {
        return Number(item.stock_qty) < MIN_STOCK_THRESHOLD;
      });
      
      setProducts(lowStockData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getStockPercentage = (current) => {
    return Math.min((current / MIN_STOCK_THRESHOLD) * 100, 100);
  };
  
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
      <p className="text-gray-600 font-khmer">កំពុងត្រួតពិនិត្យស្តុក...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-khmer">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">របាយការណ៍ស្តុកទាប</h1>
            <p className="text-gray-500">ទំនិញដែលមានចំនួនតិចជាង {MIN_STOCK_THRESHOLD}</p>
          </div>
          <button onClick={fetchProducts} className="bg-white border px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
            ធ្វើបច្ចុប្បន្នភាព
          </button>
        </div>

        {products.length > 0 ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center">
            <AlertCircle className="text-red-500 mr-3" />
            <span className="text-red-700 font-medium">មានទំនិញចំនួន {products.length} មុខត្រូវការការបញ្ជាទិញចូលបន្ថែម!</span>
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-center">
            <PackageSearch className="text-green-500 mr-3" />
            <span className="text-green-700 font-medium">ស្តុកទំនិញទាំងអស់ស្ថិតក្នុងស្ថានភាពល្អ។</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-40 object-cover bg-gray-100"
              />
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-1">{product.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">ស្តុកនៅសល់</p>
                    <p className={`text-2xl font-black ${product.stock_qty <= 5 ? 'text-red-600' : 'text-orange-500'}`}>
                      {product.stock_qty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase">តម្លៃ</p>
                    <p className="text-lg font-semibold text-gray-700">${product.price}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${product.stock_qty <= 5 ? 'bg-red-600' : 'bg-orange-500'}`}
                    style={{ width: `${getStockPercentage(product.stock_qty)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LowStockAlerts;