import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutGrid, ShoppingBag, Search, ChevronRight, ChevronLeft,
  ArrowRight, Star, ShieldCheck, Truck, RotateCcw, Zap, X, User, LogOut,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // ប្តូរទៅ IP ឱ្យដូច Backend

const Home = () => {
  const navigate = useNavigate();
  
  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- ដំណោះស្រាយសំខាន់៖ បង្កើត Function ដើម្បីទាញយក ID ពីក្នុង Object 'user' ---
  const getStoredUserId = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.id; // ទាញយក ID ពី Object {id: 8, username: '...', ...}
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userId, setUserId] = useState(getStoredUserId()); // កំណត់ ID តាំងពីចាប់ផ្តើម

  // Data States
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check Auth & Fetch Data
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // បច្ចុប្បន្នភាព State ពេល Page លោតឡើង
    setIsLoggedIn(!!token);
    setUserId(getStoredUserId());

    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/categories/read`),
          axios.get(`${API_BASE_URL}/product/read`)
        ]);
        setCategories(catRes.data || []);
        setProducts(prodRes.data.message || []);
      } catch (error) {
        console.error("Error connecting to Laravel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Logout Handler - លុបឱ្យស្អាតទាំង Token និង User Object
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user'); // លុប Object User ចេញ
    setIsLoggedIn(false);
    setUserId(null);
    navigate('/'); 
    window.location.reload(); 
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">

      {/* --- CART SIDEBAR --- */}
      <div className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isCartOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsCartOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 transform ${isCartOpen ? "translate-x-0" : "translate-x-full"} p-8 flex flex-col`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black italic">YOUR CART</h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X /></button>
          </div>
          <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
            <ShoppingBag size={48} className="mb-4 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest">Your bag is empty.</p>
          </div>
          <button className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all">CHECKOUT NOW</button>
        </div>
      </div>

      {/* --- NAVBAR --- */}
      <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-6">
        <nav className="w-full max-w-6xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl shadow-emerald-900/10 rounded-2xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <LayoutGrid size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight uppercase">Medusa</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
            <a href="#" className="hover:text-emerald-600 transition-colors">Shop</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Trending</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Archive</a>
          </div>

          <div className="flex items-center gap-3">
            <Search size={18} className="text-gray-400 cursor-pointer hover:text-emerald-600 transition-colors" />
            <div className="relative group cursor-pointer" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={20} className="group-hover:text-emerald-600 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-[8px] text-white w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">0</span>
            </div>

            {/* --- AUTH LOGIC --- */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {/* ប្រើ userId ដែលបានទាញមកពី getStoredUserId() */}
                <Link to={`/profile/${userId}`}>
                  <button className="bg-emerald-100 text-emerald-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-200 transition-all flex items-center gap-2">
                    <User size={14} /> PROFILE
                  </button>
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-500 p-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to={'/login'}>
                <button className="bg-emerald-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all shadow-lg">
                  LOG IN
                </button>
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative bg-emerald-950 pt-48 pb-24 overflow-hidden min-h-[85vh] flex items-center">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="text-center ps-9 lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black mb-6 tracking-widest">
              <Zap size={14} /> NEW SEASON AVAILABLE
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9]">
              PURE <br /> <span className="text-emerald-500 italic">STYLE.</span>
            </h1>
            <p className="text-emerald-100/50 text-lg mb-10 max-w-sm mx-auto lg:mx-0 leading-relaxed">
              Curated essentials for the modern minimalist. Designed to last, styled to stand out.
            </p>
            <button className="group bg-white text-emerald-950 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-3 mx-auto lg:mx-0">
              Browse Now <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
            <div className="relative z-10 w-full max-w-[380px] aspect-[4/5] bg-emerald-900 rounded-[3rem] p-4 border border-white/10 shadow-3xl">
              <img src="/image.png" alt="Hero Product" className="w-full h-full object-cover rounded-[2.5rem] brightness-90 shadow-2xl" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;