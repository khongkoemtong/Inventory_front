// HomeOffcanvas.jsx
import React from 'react';
import { X, ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react';

const HomeOffcanvas = ({ 
  isOpen, 
  onClose, 
  products, 
  categories, 
  activeCategory, 
  onCategoryChange, 
  onAddToCart, 
  addingId 
}) => {
  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category?.name === activeCategory);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-full max-w-[420px] z-[70] bg-white flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-7 border-b border-gray-100">
          <div>
            <h2 className="text-gray-900 text-xl font-black uppercase tracking-tighter">Shop</h2>
            <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mt-0.5">Browse our collection</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-2xl flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Categories */}
        <div className="px-8 py-4 border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => onCategoryChange('All')}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeCategory === 'All' ? 'bg-emerald-900 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.name)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeCategory === cat.name ? 'bg-emerald-900 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-emerald-400" />
              </div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group">
                  <div className="relative aspect-square mb-3 overflow-hidden rounded-2xl bg-gray-100">
                    <img
                      src={product.image_url ? `http://127.0.0.1:8000${product.image_url.replace(/\\/g, '/')}` : 'https://via.placeholder.com/200'}
                      className="w-full h-full object-cover"
                      alt={product.name}
                    />
                    <button
                      onClick={() => onAddToCart(product)}
                      disabled={addingId === product.id}
                      className={`absolute bottom-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        addingId === product.id
                          ? 'bg-emerald-400 text-emerald-950'
                          : 'bg-white shadow-lg text-gray-900 hover:bg-emerald-900 hover:text-white'
                      }`}
                    >
                      {addingId === product.id ? (
                        <CheckCircle size={14} />
                      ) : (
                        <Plus size={14} />
                      )}
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-black text-emerald-600 uppercase mb-1">{product.category?.name}</p>
                    <h4 className="text-xs font-bold text-gray-900 truncate">{product.name}</h4>
                    <p className="text-sm font-black text-gray-900">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100">
          <button className="w-full py-4 bg-emerald-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2">
            View All Products <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </>
  );
};

// Plus icon component
const Plus = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default HomeOffcanvas;
