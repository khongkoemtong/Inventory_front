// CartOffcanvas.jsx
import React from 'react';
import { ShoppingBag, X, Minus, Plus, Trash2, CheckCircle, ArrowRight } from 'lucide-react';

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
            <p className="text-emerald-500/50 text-[10px] font-black uppercase tracking-widest mt-0.5">{cartItems.length} items</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white/60 hover:text-white transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Items Container */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
           {/* ... paste the mapping logic of cartItems here ... */}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-8 py-8 border-t border-white/5 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Subtotal</span>
              <span className="text-white text-2xl font-black tracking-tighter">${total.toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} className="w-full py-5 bg-emerald-500 text-emerald-950 font-black rounded-2xl flex items-center justify-center gap-3">
               Checkout <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartOffcanvas;