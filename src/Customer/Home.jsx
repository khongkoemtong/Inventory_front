import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  ShoppingBag, ArrowRight, X, LogOut, Star, RotateCcw,
  ShieldCheck, Truck, Sparkles, ChevronRight, Plus, Minus, Trash2, CheckCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const CartOffcanvas = ({ isOpen, onClose, cartItems, onUpdateQty, onRemove, onCheckout, checkoutLoading, checkoutSuccess }) => {
  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[420px] z-[70] bg-[#0A1A14] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-7 border-b border-white/5">
          <div>
            <h2 className="text-white text-xl font-black uppercase tracking-tighter">Your Bag</h2>
            <p className="text-emerald-500/50 text-[10px] font-black uppercase tracking-widest mt-0.5">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white/60 hover:text-white transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-emerald-500/40" />
              </div>
              <p className="text-white/30 text-sm font-bold uppercase tracking-widest">Your bag is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white/5 rounded-3xl p-4 group">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0">
                  <img
                    src={item.image_url ? `http://127.0.0.1:8000${item.image_url.replace(/\\/g, '/')}` : 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">{item.category?.name}</p>
                  <h4 className="text-white font-bold text-sm truncate">{item.name}</h4>
                  <p className="text-emerald-400 font-black text-sm mt-1">${(parseFloat(item.price) * item.qty).toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center bg-white/5 rounded-xl overflow-hidden">
                      <button onClick={() => onUpdateQty(item.id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                        <Minus size={12} />
                      </button>
                      <span className="text-white text-xs font-black w-6 text-center">{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                        <Plus size={12} />
                      </button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="w-7 h-7 flex items-center justify-center text-red-500/40 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-8 py-8 border-t border-white/5 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Subtotal</span>
              <span className="text-white text-2xl font-black tracking-tighter">${total.toFixed(2)}</span>
            </div>

            {checkoutSuccess ? (
              <div className="flex items-center justify-center gap-3 py-5 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-emerald-400">
                <CheckCircle size={20} />
                <span className="text-sm font-black uppercase tracking-widest">Order Placed!</span>
              </div>
            ) : (
              <button
                onClick={onCheckout}
                disabled={checkoutLoading}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-[11px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-emerald-500/20"
              >
                {checkoutLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    Placing Order…
                  </span>
                ) : (
                  <>Checkout <ArrowRight size={16} /></>
                )}
              </button>
            )}
            <p className="text-center text-white/20 text-[9px] font-black uppercase tracking-widest">Secure checkout · Free shipping</p>
          </div>
        )}
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   MAIN HOME COMPONENT
───────────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();
  const statsRef = useRef(null);

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [scrolled, setScrolled] = useState(false);
  const [statsOffset, setStatsOffset] = useState(0);

  // Auth
  const getStoredUserId = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try { return JSON.parse(userData).id; } catch (e) { return null; }
    }
    return null;
  };
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userId] = useState(getStoredUserId());

  // Data States
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cart States
  const [cartItems, setCartItems] = useState([]);
  const [addingId, setAddingId] = useState(null);       // which product is being added
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (statsRef.current) {
        setStatsOffset(statsRef.current.getBoundingClientRect().top * 0.15);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } };
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/categories/read`, config),
          axios.get(`${API_BASE_URL}/product/read`, config)
        ]);
        setCategories(catRes.data.data || []);
        setProducts(prodRes.data.data || []);
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
    window.location.reload();
  };

  /* ── CART LOGIC ── */
  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setAddingId(product.id);
    setTimeout(() => setAddingId(null), 700); // visual feedback delay

    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
    setCheckoutSuccess(false);
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty < 1) {
      handleRemove(id);
      return;
    }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty: newQty } : i));
  };

  const handleRemove = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  /* ── CHECKOUT → POST /api/orders/create ── */
  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const token = localStorage.getItem('token');

      // Build order payload — adjust fields to match your OrderController@create
      const payload = {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.qty,
          price: item.price,
        })),
        total_price: cartItems.reduce((sum, i) => sum + parseFloat(i.price) * i.qty, 0).toFixed(2),
      };

      await axios.post(`${API_BASE_URL}/orders/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setCheckoutSuccess(true);
      setCartItems([]);
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category?.name === activeCategory);

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">

      {/* CART OFFCANVAS */}
      <CartOffcanvas
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
        checkoutLoading={checkoutLoading}
        checkoutSuccess={checkoutSuccess}
      />

     

      {/* HERO */}
      <section className="relative bg-emerald-950 pt-56 pb-32 overflow-hidden min-h-screen flex items-center text-white">
        <div className="container mx-auto px-8 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h1 className="text-7xl md:text-9xl font-black mb-8 leading-[0.85] tracking-tighter">BEYOND <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 italic">TRENDS.</span></h1>
            <a href="#shop" className="bg-emerald-500 text-emerald-950 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest inline-flex items-center gap-3">
              Explore Shop <ArrowRight size={18} />
            </a>
          </div>
          <div className="relative aspect-[4/5] bg-emerald-900 rounded-[4rem] overflow-hidden rotate-2 shadow-2xl">
            <img src="/image.png" alt="Hero" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* PARALLAX STATS */}
      <section id="stats" ref={statsRef} className="relative py-40 overflow-hidden bg-black border-y border-white/5">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070"
            alt="Background"
            className="absolute inset-0 w-full h-[130%] object-cover opacity-40"
            style={{ transform: `translateY(${statsOffset}px)`, top: '-15%', willChange: 'transform' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-black to-black" />
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-12 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { icon: <ShieldCheck size={32} />, val: '100%', sub: 'Secure' },
            { icon: <Truck size={32} />, val: '24h', sub: 'Shipping' },
            { icon: <RotateCcw size={32} />, val: '30D', sub: 'Returns' },
            { icon: <Star size={32} />, val: '4.9/5', sub: 'Rating' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-emerald-500/10 backdrop-blur-xl text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                {stat.icon}
              </div>
              <h4 className="text-4xl font-black text-white tracking-tighter mb-1">{stat.val}</h4>
              <p className="text-[10px] font-black uppercase text-emerald-500/50 tracking-widest">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP SECTION */}
      <section id="shop" className="py-32 overflow-hidden">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
            <div className="max-w-xl">
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-6 leading-none">Curated <br />Collections</h2>
              <div className="h-1 w-20 bg-emerald-500" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all ${activeCategory === 'All' ? 'bg-emerald-900 text-white shadow-xl' : 'bg-white text-gray-400 border border-gray-100'}`}
              >All Pieces</button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all ${activeCategory === cat.name ? 'bg-emerald-900 text-white shadow-xl' : 'bg-white text-gray-400 border border-gray-100'}`}
                >{cat.name}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex gap-10 overflow-hidden">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="min-w-[300px] animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-[2.5rem] mb-6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar pb-12 -mx-8 px-8 snap-x snap-mandatory">
              <div className="flex flex-nowrap gap-8">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group min-w-[280px] md:min-w-[320px] snap-start">
                    <div className="relative aspect-square mb-8 overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2">
                      <img
                        src={product.image_url ? `http://127.0.0.1:8000${product.image_url.replace(/\\/g, '/')}` : 'https://via.placeholder.com/600'}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        alt={product.name}
                      />
                      {/* Add to Bag button */}
                      <div className="absolute bottom-6 inset-x-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={addingId === product.id}
                          className={`w-full py-4 font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                            addingId === product.id
                              ? 'bg-emerald-400 text-emerald-950 scale-95'
                              : 'bg-emerald-900 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {addingId === product.id ? (
                            <><CheckCircle size={14} /> Added!</>
                          ) : (
                            <><ShoppingBag size={14} /> Add to Bag</>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">{product.category?.name}</p>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-xl font-black text-gray-900">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORY SHOWCASE */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">The Directory</h2>
              <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest">Find your specific aesthetic</p>
            </div>
            <div className="hidden md:block h-px flex-grow mx-10 bg-gray-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px] md:h-[600px]">
            <div
              className="md:col-span-7 relative group overflow-hidden rounded-[3rem] bg-emerald-100 cursor-pointer"
              onClick={() => { setActiveCategory(categories[0]?.name || 'All'); window.scrollTo({ top: document.getElementById('shop').offsetTop, behavior: 'smooth' }); }}
            >
              <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070" alt="Featured" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-10 left-10 text-white">
                <span className="bg-emerald-500 text-[9px] font-black px-3 py-1 rounded-full uppercase mb-4 inline-block">Trending Now</span>
                <h3 className="text-4xl font-black uppercase tracking-tighter italic">Essential <br /> Minimalism</h3>
                <div className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  View Collection <ArrowRight size={14} />
                </div>
              </div>
            </div>
            <div className="md:col-span-5 grid grid-rows-2 gap-6">
              <div className="relative group overflow-hidden rounded-[3rem] bg-gray-900 cursor-pointer">
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070" alt="Secondary" className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Premium <br /> Basics</h3>
                    <p className="text-emerald-400 text-[9px] font-black mt-2 uppercase tracking-[0.2em]">Shop Selected</p>
                  </div>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-[3rem] bg-emerald-900 cursor-pointer">
                <div className="absolute inset-0 bg-emerald-600 mix-blend-multiply opacity-20 group-hover:opacity-0 transition-opacity" />
                <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974" alt="Tertiary" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-white">
                  <h3 className="text-xl font-black uppercase tracking-tighter">Seasonal <br /> Outerwear</h3>
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-emerald-950 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A1A14] py-20 text-white">
        <div className="container mx-auto px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white rotate-6"><Sparkles size={20} fill="currentColor" /></div>
            <span className="text-2xl font-black uppercase">Medusa</span>
          </div>
          <p className="text-emerald-100/20 text-[10px] font-black uppercase tracking-widest">© 2026 Medusa Supply Co.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;