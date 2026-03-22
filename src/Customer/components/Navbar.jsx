// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag } from 'lucide-react';

function Navbar({ onCartClick, cartCount }) {
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

                {/* Cart Trigger */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onCartClick}
                        className="..."
                    >
                        <ShoppingBag size={20} />
                        {cartCount > 0 && <span>{cartCount}</span>}
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;