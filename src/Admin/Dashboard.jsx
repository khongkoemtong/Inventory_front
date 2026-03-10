import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, BarChart3, TrendingUp, AlertCircle, ShoppingCart, 
  FileText, Users, LayoutDashboard, ChevronDown, ChevronRight ,User
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const Dashboard = () => {
  // States
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
   const fetchAndCountLowStock = async () => {
  try {
    const token = localStorage.getItem('token'); 
    const res = await axios.get("http://127.0.0.1:8000/api/product/read", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    // FIX: Look in res.data, res.data.data, or res.data.message
    const rawData = res.data;
    const products = Array.isArray(rawData) 
      ? rawData 
      : (rawData.data || rawData.message || []);
    
    if (Array.isArray(products)) {
      // Use the same threshold as your LowStockAlerts (20)
      const lowStockItems = products.filter(item => Number(item.stock_qty) < 20);
      setLowStockCount(lowStockItems.length);
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      console.error("Token expired or invalid");
    }
    console.error("Error fetching for low stock count:", err);
  }
};

    fetchAndCountLowStock();
    
    const interval = setInterval(fetchAndCountLowStock, 30000);
    return () => clearInterval(interval);
  }, []);

  const mainItems = [
    { id: 'overview', name: 'Overview', icon: BarChart3, path: '/dashboard' },
  ];
  

 const inventorySubItems = [
  { id: 'products', name: 'All Products', icon: Package, path: '/dashboard/products' }, // Added /dashboard/
  { id: 'category', name: 'Categories', icon: LayoutDashboard, path: '/dashboard/category' },
  { id: 'suppliers', name: 'Suppliers', icon: Users, path: '/dashboard/suppliers' },
  { id: 'orders', name: 'Orders', icon: ShoppingCart, path: '/dashboard/orders' },
  { id: 'reports', name: 'Reports', icon: FileText, path: '/dashboard/reports' },
  { id: 'customer', name: 'Customer', icon: User , path: '/dashboard/customer' },
];

  return (
    <div className="flex h-screen bg-gray-50 font-khmer">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl">
        {/* Header/Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white ">Medusa</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Inventory v1.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-hide">
          <ul className="space-y-1.5">
            {/* Overview */}
            {mainItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span className="text-sm font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}

            {/* Inventory Management Dropdown */}
            <li>
              <button
                onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-gray-400 hover:bg-gray-800 hover:text-white`}
              >
                <div className="flex items-center space-x-3">
                  <LayoutDashboard size={20} />
                  <span className="text-sm font-medium">Inventory</span>
                </div>
                {isInventoryOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              <div className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${isInventoryOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                {inventorySubItems.map((subItem) => (
                  <NavLink
                    key={subItem.id}
                    to={subItem.path}
                    className={({ isActive }) => 
                      `flex items-center space-x-3 pl-12 pr-4 py-2.5 rounded-lg text-[13px] transition-all ${
                        isActive ? 'text-blue-400 font-bold bg-blue-400/10' : 'text-gray-500 hover:text-white hover:bg-gray-800'
                      }`
                    }
                  >
                    <span>{subItem.name}</span>
                  </NavLink>
                ))}
              </div>
            </li>

            {/* Low Stock Alert with Badge */}
            <li>
              <NavLink
                to="/dashboard/low-stock"
                className={({ isActive }) => 
                  `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle size={20} />
                  <span className="text-sm font-medium">Low Stock</span>
                </div>
                
                {lowStockCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center animate-pulse">
                    {lowStockCount}
                  </span>
                )}
              </NavLink>
            </li>
            
            {/* Analytics */}
            <li>
              <NavLink
                to="analytics"
                className={({ isActive }) => 
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <TrendingUp size={20} />
                <span className="text-sm font-medium">Analytics</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/30">
          <div className="flex items-center space-x-3 px-2 py-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg border border-blue-400/30">
              <span className="text-sm font-bold text-white uppercase">A</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-white">Admin User</p>
              <p className="text-[11px] text-gray-500 truncate">admin@stockflow.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-gray-50 scroll-smooth">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;