import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Search, X, Check } from 'lucide-react';

const CreateOrder = ({ onSuccess, onCancel }) => {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userId, setUserId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // ១. ទាញយកបញ្ជីទំនិញ
 // ១. កែសម្រួលការទាញយកទិន្នន័យ (ដាក់ Token និង Check Key)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/api/product/read', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const json = await response.json();
        
        // ឆែកមើល Key ឱ្យត្រូវតាម Backend (Data ឬ message)
        const productList = json.Data || json.message || json;
        setProducts(Array.isArray(productList) ? productList : []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // ២. កែសម្រួលការ Submit (ថែម Token និង Content-Type)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) return alert("សូមជ្រើសរើសទំនិញយ៉ាងតិចមួយ!");

    const token = localStorage.getItem('token');
    const payload = {
      user_id: userId,
      total_amount: totalAmount,
      items: selectedItems.map(({product_id, quantity, price}) => ({
        product_id, 
        quantity: parseInt(quantity), 
        price: parseFloat(price)
      }))
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        alert("បង្កើតការបញ្ជាទិញជោគជ័យ!");
        onSuccess(); // ត្រឡប់ទៅ List វិញ
      } else {
        alert("បរាជ័យ: " + (result.message || "មានបញ្ហាជាមួយទិន្នន័យ"));
      }
    } catch (err) {
      console.error(err);
      alert("មិនអាចទាក់ទងទៅកាន់ Server បានទេ!");
    }
  };

  // ២. មុខងារបន្ថែមទំនិញដែលបានជ្រើសរើសពី Table ចូលក្នុង Order
  const handleSelectProduct = (product) => {
    // ពិនិត្យថាទំនិញនេះមានក្នុងបញ្ជីរួចហើយឬនៅ
    const exists = selectedItems.find(item => item.product_id === product.id);
    if (exists) {
      alert("ទំនិញនេះត្រូវបានជ្រើសរើសរួចហើយ!");
      return;
    }

    setSelectedItems([...selectedItems, { 
      product_id: product.id, 
      name: product.name, 
      quantity: 1, 
      price: product.price 
    }]);
    setIsModalOpen(false); // បិទ Modal បន្ទាប់ពីជ្រើសរើស
  };

  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, value) => {
    const newItems = [...selectedItems];
    newItems[index].quantity = parseInt(value) || 1;
    setSelectedItems(newItems);
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  

  // ចម្រាញ់ទំនិញតាមរយៈការ Search ក្នុង Modal
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toString().includes(searchTerm)
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg font-khmer relative">
      <button onClick={onCancel} className="flex items-center text-gray-500 mb-4 hover:text-blue-600 transition-colors">
        <ArrowLeft size={20} className="mr-1" /> ត្រឡប់ក្រោយ
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">បង្កើតការបញ្ជាទិញថ្មី</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">លេខសម្គាល់អ្នកប្រើប្រាស់ (User ID)</label>
            <input type="number" required className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none transition-all" 
              placeholder="បញ្ចូល ID អ្នកទិញ..." value={userId} onChange={(e) => setUserId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">សរុបទឹកប្រាក់</label>
            <div className="w-full border-2 border-gray-100 p-3 rounded-xl bg-gray-50 font-bold text-xl text-blue-600">
              ${totalAmount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">{selectedItems.length}</span>
              បញ្ជីទំនិញដែលបានជ្រើសរើស
            </h3>
            <button type="button" onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
              <Plus size={18} /> ជ្រើសរើសទំនិញពីតារាង
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm border-b">
                  <th className="pb-3 font-bold">ឈ្មោះទំនិញ</th>
                  <th className="pb-3 font-bold w-32">ចំនួន</th>
                  <th className="pb-3 font-bold">តម្លៃ</th>
                  <th className="pb-3 font-bold">សរុប</th>
                  <th className="pb-3 font-bold text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedItems.map((item, index) => (
                  <tr key={index} className="group">
                    <td className="py-4 font-medium">{item.name}</td>
                    <td className="py-4">
                      <input type="number" min="1" className="w-20 border rounded-lg p-1.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                        value={item.quantity} onChange={(e) => updateQuantity(index, e.target.value)} />
                    </td>
                    <td className="py-4 text-gray-600">${item.price}</td>
                    <td className="py-4 font-bold text-blue-600">${(item.price * item.quantity).toLocaleString()}</td>
                    <td className="py-4 text-right">
                      <button type="button" onClick={() => removeItem(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {selectedItems.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-400">មិនទាន់មានទំនិញត្រូវបានជ្រើសរើសនៅឡើយ</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95">
          <Save size={20} /> រក្សាទុកការបញ្ជាទិញ
        </button>
      </form>

      {/* --- Modal បង្ហាញតារាងទំនិញ --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">ជ្រើសរើសទំនិញ</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 bg-gray-50 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="ស្វែងរកតាមឈ្មោះ ឬ ID ទំនិញ..." 
                  className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white shadow-sm">
                  <tr className="text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-3 font-bold border-b">ID</th>
                    <th className="p-3 font-bold border-b">ឈ្មោះទំនិញ</th>
                    <th className="p-3 font-bold border-b">តម្លៃ</th>
                    <th className="p-3 font-bold border-b">ស្តុក</th>
                    <th className="p-3 font-bold border-b text-right">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-blue-50 transition-colors">
                      <td className="p-3 text-sm text-gray-500">#{p.id}</td>
                      <td className="p-3 font-bold">{p.name}</td>
                      <td className="p-3 text-blue-600 font-medium">${p.price}</td>
                      <td className={`p-3 text-sm ${p.stock_qty <= 5 ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                        {p.stock_qty} ក្នុងស្តុក
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleSelectProduct(p)} 
                          className="bg-gray-100 hover:bg-blue-600 hover:text-white p-2 rounded-lg transition-all group">
                          <Check size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrder;