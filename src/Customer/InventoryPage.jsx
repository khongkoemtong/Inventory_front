import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function InventoryPage() {
  const { userId } = useParams(); // ចាប់យក ID ពី URL
  const [data, setData] = useState(null);
  const IP = "192.168.110.13"; 

  useEffect(() => {
  const IP = "192.168.110.13";
  
  fetch(`http://${IP}:8000/api/user-inventory/${userId}`)
    .then(res => {
      console.log("Response Status:", res.status); // បើឃើញ 200 គឺជោគជ័យ
      return res.json();
    })
    .then(result => {
      console.log("Result received:", result);
      // ត្រូវប្រាកដថា result មាន property ឈ្មោះ products
      if(result.success) {
        setData(result);
      }
    })
    .catch(err => {
      console.error("Fetch Error:", err);
      alert("Connect ទៅ API មិនបានទេ! សូមឆែក IP និង Firewall");
    });
}, [userId]);

  if (!data) return <div className="p-10 text-center text-blue-500">កំពុងស្វែងរកផលិតផល...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 p-5 text-white shadow-md">
        <h1 className="text-xl font-bold">ផលិតផលក្នុងស្តុក (#{userId})</h1>
      </div>
      
      <div className="p-4 space-y-4">
        {data.products.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center border border-gray-100">
            <img 
                src={product.image_url} 
                className="w-20 h-20 object-cover rounded-xl mr-4" 
                alt={product.name} 
                onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{product.name}</h3>
              <p className="text-blue-600 font-bold text-lg">${product.price}</p>
              <p className="text-xs text-gray-400">Qty: {product.stock_qty}</p>
            </div>
            <span className="bg-green-100 text-green-600 text-[10px] px-2 py-1 rounded-full font-bold">
              {product.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InventoryPage;