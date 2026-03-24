import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Minus, ShoppingBag, X, CheckCircle, Package, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// --- Mini Cart Component ---
const MiniCart = ({ isOpen, onClose, cartItems, onUpdateQty, onRemove }) => {
  const navigate = useNavigate();
  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.qty, 0);

  const handleCheckoutClick = () => {
    onClose();
    localStorage.setItem('checkout_cart', JSON.stringify(cartItems));
    navigate('/checkout');
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-[420px] z-[9999] bg-[#0A1A14] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-8 py-7 border-b border-white/5">
          <div>
            <h2 className="text-white text-xl font-black uppercase tracking-tighter">Your Bag</h2>
            <p className="text-emerald-500/50 text-[10px] font-black uppercase tracking-widest mt-0.5">{cartItems.length} items</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white/60 hover:text-white transition-all">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-white/10 mb-4" />
              <p className="text-white/30 text-sm font-bold uppercase tracking-widest">Bag is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white/5 rounded-3xl p-4 border border-white/5">
                <img 
                  src={item.image_url ? `http://127.0.0.1:8000${item.image_url.replace(/\\/g, '/')}` : 'https://via.placeholder.com/80'} 
                  className="w-20 h-20 rounded-2xl object-cover bg-white/10" 
                  alt={item.name} 
                />
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm truncate">{item.name}</h4>
                  <p className="text-emerald-400 font-black text-sm">${(parseFloat(item.price) * item.qty).toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center bg-white/5 rounded-xl overflow-hidden">
                      <button onClick={() => onUpdateQty(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"><Minus size={14}/></button>
                      <span className="text-white text-xs font-bold w-6 text-center">{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"><Plus size={14}/></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="px-8 py-8 border-t border-white/5 bg-[#0A1A14]">
             <div className="flex justify-between items-center mb-6">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Total Amount</span>
                <span className="text-white text-2xl font-black tracking-tighter">${total.toFixed(2)}</span>
             </div>
            <button onClick={handleCheckoutClick} className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-widest text-xs">
              Go to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// --- Main Page Component (FIXED VERSION) ---
function ProductsByCategory({ 
  cartItems, 
  setCartItems, 
  isCartOpen,      // <--- ត្រូវតែមានទទួល Prop ត្រង់នេះ
  setIsCartOpen    // <--- ត្រូវតែមានទទួល Prop ត្រង់នេះ
}) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/categories/read`, config),
          axios.get(`${API_BASE_URL}/product/read`, config)
        ]);
        setCategories(Array.isArray(catRes.data) ? catRes.data : (catRes.data.data || []));
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.data || []));
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    if (!localStorage.getItem('token')) return navigate('/login');
    setAddingId(product.id);
    setTimeout(() => setAddingId(null), 700);

    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true); // បើក Cart តាមរយៈ Prop ពី Router
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-emerald-600 font-black tracking-widest uppercase">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-20 relative">
      <MiniCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
        onUpdateQty={(id, qty) => {
          if (qty < 1) return setCartItems(prev => prev.filter(i => i.id !== id));
          setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
        }} 
        onRemove={(id) => setCartItems(prev => prev.filter(i => i.id !== id))} 
      />

      {/* Floating Cart Button */}
      {cartItems.length > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-[50] bg-emerald-500 text-emerald-950 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 hover:scale-105 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="relative">
            <ShoppingBag size={24} />
            <span className="absolute -top-2 -right-2 bg-white text-emerald-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-emerald-500">
              {cartItems.length}
            </span>
          </div>
          <span className="font-black text-xs uppercase tracking-widest">View Bag</span>
        </button>
      )}

      {/* Header Section */}
      <div className="bg-emerald-950 pt-20 pb-32 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter">Marketplace</h1>
            <p className="text-emerald-400 font-medium mt-2 uppercase text-[10px] tracking-[0.2em] font-black opacity-60">Listing {categories.length} Categories</p>
          </div>
          <div className="relative w-full max-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-200/40" size={20} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-emerald-200/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-md"
            />
          </div>
        </div>
      </div>

      {/* Categories Scroll */}
      <div className="max-w-7xl mx-auto px-8 -mt-16">
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          <CategoryBtn 
            label="All Products" 
            count={products.length} 
            active={selectedCategory === 'All'} 
            onClick={() => setSelectedCategory('All')} 
            icon={<Package size={20}/>}
          />
          {categories.map(cat => (
            <CategoryBtn 
              key={cat.id}
              label={cat.name} 
              count={products.filter(p => p.category?.name === cat.name).length} 
              active={selectedCategory === cat.name} 
              onClick={() => setSelectedCategory(cat.name)} 
              icon={<Folder size={20}/>}
            />
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-8 mt-12">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight capitalize">{selectedCategory} Items</h2>
          <span className="text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">{filteredProducts.length} Results</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart} 
                isAdding={addingId === product.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
            <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Helper Components ---
const CategoryBtn = ({ label, count, active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 p-5 rounded-[32px] min-w-[220px] transition-all border-2 ${active ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xl shadow-emerald-500/30' : 'bg-white border-transparent text-gray-600 hover:border-emerald-200 shadow-sm'}`}
  >
    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${active ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'}`}>
      {icon}
    </div>
    <div className="text-left">
      <p className="font-bold text-sm leading-tight truncate">{label}</p>
      <p className={`text-[9px] font-black uppercase mt-0.5 ${active ? 'text-white/60' : 'text-emerald-500/50'}`}>{count} items</p>
    </div>
  </button>
);

const ProductCard = ({ product, onAddToCart, isAdding }) => (
  <div className="bg-white rounded-[35px] p-5 border border-gray-50 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all group overflow-hidden">
    <div className="aspect-square rounded-[25px] overflow-hidden bg-gray-50 mb-5 relative">
      <img src={product.image_url ? `http://127.0.0.1:8000${product.image_url.replace(/\\/g, '/')}` : 'https://via.placeholder.com/200'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
      {product.stock_qty < 5 && product.stock_qty > 0 && <span className="absolute top-3 left-3 bg-orange-500 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Low Stock</span>}
      {product.stock_qty <= 0 && <span className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center text-white text-[10px] font-black uppercase tracking-[0.2em]">Out of Stock</span>}
    </div>
    <div className="px-1">
      <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">{product.category?.name || 'Category'}</p>
      <h3 className="font-bold text-gray-800 line-clamp-1 mt-1 text-sm">{product.name}</h3>
      <div className="flex items-center justify-between mt-5">
        <span className="text-xl font-black text-gray-900 tracking-tighter">${parseFloat(product.price).toFixed(2)}</span>
        <button 
          onClick={() => onAddToCart(product)} 
          disabled={product.stock_qty <= 0}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${isAdding ? 'bg-emerald-600 text-white rotate-12 scale-110' : 'bg-gray-900 text-white hover:bg-emerald-500 shadow-lg active:scale-95 disabled:bg-gray-200 disabled:cursor-not-allowed'}`}
        >
          {isAdding ? <CheckCircle size={20}/> : <Plus size={20}/>}
        </button>
      </div>
    </div>
  </div>
);

export default ProductsByCategory;