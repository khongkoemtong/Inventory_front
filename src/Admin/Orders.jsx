import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Search, RefreshCw, Loader2 } from 'lucide-react';
import CreateOrder from './form/CreateOrder';
import OrderDetail from './detail/OrderDetail';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ទាំងអស់');
  const [showform, setShowform] = useState(false);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');  
      
      const response = await axios.get('http://127.0.0.1:8000/api/orders/read-all', { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      // បើសិនជា Backend បោះទិន្នន័យមកក្នុង response.data.data
      if (response.data && response.data.data) {
        setOrders(response.data.data);
      } else if (Array.isArray(response.data)) {
        setOrders(response.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`តើអ្នកប្រាកដជាចង់លុបការបញ្ជាទិញ ID: ${orderId} មែនទេ?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://127.0.0.1:8000/api/orders/delete/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setOrders(prev => prev.filter(order => order.id !== orderId));
        alert("លុបបានជោគជ័យ!");
      } catch (err) {
        alert("មិនអាចលុបបានឡើយ!");
      }
    }
  };

  // --- ផ្នែក Filter (ចំណុចដែលធ្វើឱ្យបងអត់ឃើញ Data ពីមុន) ---
  const filteredOrders = orders.filter(order => {
    const customerName = order.user?.full_name || order.customer_name || '';
    const orderId = order.id?.toString() || '';
    
    const matchesSearch = 
      orderId.includes(searchTerm) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // កែឱ្យស្គាល់ទាំងអក្សរតូច និងធំ
    const currentStatus = order.status?.toLowerCase() || '';
    const targetFilter = statusFilter.toLowerCase();

    const matchesStatus = statusFilter === 'ទាំងអស់' || currentStatus === targetFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return 'bg-green-100 text-green-700 border-green-200';
    if (s === 'shipping') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s === 'pending') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (s === 'cancelled') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (showform) return <CreateOrder onSuccess={() => { setShowform(false); fetchOrders(); }} onCancel={() => setShowform(false)} />;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center font-khmer">
      <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
      <p>កំពុងផ្ទុកបញ្ជីបញ្ជាទិញ...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-khmer">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">ការបញ្ជាទិញ</h1>
          <div className="flex gap-2">
            <button onClick={fetchOrders} className="p-2 bg-white border rounded-lg hover:bg-gray-100"><RefreshCw size={20} /></button>
            <button onClick={() => setShowform(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-all">
              <Plus size={20} className="mr-2" /> បង្កើតការបញ្ជាទិញ
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm border p-4 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ស្វែងរកតាម ID ឬ ឈ្មោះ..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="border rounded-lg px-4 py-2 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ទាំងអស់">ស្ថានភាពទាំងអស់</option>
            <option value="pending">រង់ចាំ (Pending)</option>
            <option value="shipping">កំពុងដឹក (Shipping)</option>
            <option value="delivered">បានដឹកដល់ (Delivered)</option>
            <option value="cancelled">បានបោះបង់ (Cancelled)</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">កាលបរិច្ឆេទ</th>
                  <th className="px-6 py-4">អ្នកបញ្ជាទិញ</th>
                  <th className="px-6 py-4">សរុប</th>
                  <th className="px-6 py-4">ស្ថានភាព</th>
                  <th className="px-6 py-4 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-blue-600">#{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('km-KH') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-medium">{order.user?.full_name || 'មិនស្គាល់'}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">${Number(order.total_amount || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(order.status)}`}>
                        {order.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleViewDetail(order)} className="text-blue-600 p-2 hover:bg-blue-50 rounded-lg"><Eye size={18} /></button>
                        <button className="text-gray-400 p-2"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteOrder(order.id)} className="text-red-600 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400">មិនមានទិន្នន័យបញ្ជាទិញឡើយ</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="សរុបការបញ្ជាទិញ" value={orders.length} color="blue" />
          <StatCard title="ទឹកប្រាក់សរុប" value={`$${orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0).toLocaleString()}`} color="green" />
          <StatCard title="កំពុងរង់ចាំ" value={orders.filter(o => o.status?.toLowerCase() === 'pending').length} color="yellow" />
        </div>
      </div>

      {showDetail && <OrderDetail order={selectedOrder} onClose={() => setShowDetail(false)} />}
    </div>
  );
};

// បង្កើត Component តូចមួយសម្រាប់ Stats ដើម្បីឱ្យ Code ខ្លីស្អាត
const StatCard = ({ title, value, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-${color}-500 border`}>
    <p className="text-sm text-gray-500 font-bold uppercase">{title}</p>
    <p className="text-3xl font-black mt-1">{value}</p>
  </div>
);

export default Orders;