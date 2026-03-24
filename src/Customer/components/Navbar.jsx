// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, Home, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar({ onCartClick, cartCount,isCartOpen,     
  setIsCartOpen }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 px-6 py-4 ${scrolled ? 'pt-4' : 'pt-8'}`}>
            <nav className={`w-full max-w-7xl mx-auto border flex items-center justify-between px-8 py-3 rounded-3xl ${scrolled ? 'bg-white/80 backdrop-blur-2xl shadow-xl' : 'bg-transparent border-transparent'}`}>

                {/* Brand */}
                <div className="flex items-center gap-3">
                    <span className={`text-2xl font-black uppercase ${scrolled ? 'text-gray-900' : 'text-white'}`}>Medusa</span>
                </div>

                {/* Home and Cart Triggers */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                            scrolled 
                                ? 'bg-gray-100 text-gray-900 hover:bg-emerald-100 hover:text-emerald-700' 
                                : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                    >
                        <Home size={20} />
                    </Link>
                    <Link
                        to="/products"
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                            scrolled 
                                ? 'bg-gray-100 text-gray-900 hover:bg-emerald-100 hover:text-emerald-700' 
                                : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                    >
                        <Package size={20} />
                    </Link>
                    <button
                        onClick={onCartClick}
                        className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                            scrolled 
                                ? 'bg-gray-100 text-gray-900 hover:bg-emerald-100 hover:text-emerald-700' 
                                : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                    >
                        <ShoppingBag size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;