import React from 'react';
import { User, Phone, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ guestInfo, setGuestInfo, onCheckout, checkoutLoading, total, cartItems }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A1A14] text-white font-sans p-6">
      <div className="max-w-2xl mx-auto pt-10">
        
        {/* Header Section */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-emerald-500/60 hover:text-emerald-400 transition-all mb-8 uppercase text-[10px] font-black tracking-widest"
        >
          <ChevronLeft size={16} /> Back to Shop
        </button>

        <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Checkout</h1>
        <p className="text-emerald-500/50 text-[10px] font-black uppercase tracking-[0.2em] mb-12">Complete your order information</p>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left: Input Form */}
          <div className="space-y-8">
            <section className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500">Customer Details</h3>
              
              <div className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="FULL NAME"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-5 text-sm outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                    value={guestInfo.customer_name}
                    onChange={(e) => setGuestInfo({...guestInfo, customer_name: e.target.value})}
                  />
                </div>

                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input 
                    type="tel" 
                    placeholder="PHONE NUMBER"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-5 text-sm outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                  />
                </div>
              </div>
            </section>

            <button
              onClick={onCheckout}
              disabled={checkoutLoading || cartItems.length === 0}
              className="w-full py-6 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] flex items-center justify-center gap-3 transition-all duration-500 disabled:opacity-20 shadow-2xl shadow-emerald-500/20"
            >
              {checkoutLoading ? "Processing..." : <>Confirm Order <ArrowRight size={18} /></>}
            </button>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 h-fit">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-6 text-center">Order Summary</h3>
            
            <div className="space-y-4 mb-8 max-h-[200px] overflow-y-auto no-scrollbar">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white uppercase">{item.name}</p>
                    <p className="text-[10px] text-white/40">QTY: {item.qty}</p>
                  </div>
                  <p className="text-xs font-black text-emerald-400">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Amount</span>
              <span className="text-3xl font-black tracking-tighter text-white">${total}</span>
            </div>
            
            <div className="mt-8 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <p className="text-[9px] text-emerald-400 font-bold text-center uppercase tracking-widest">
                🚀 Fast delivery to your doorstep
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;