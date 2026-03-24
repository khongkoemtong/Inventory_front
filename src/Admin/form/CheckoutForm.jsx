import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, ShoppingBag, ArrowRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Telegram Bot Configuration - Replace with your actual bot token and chat ID
const TELEGRAM_BOT_TOKEN = '7782823698:AAFHcS3nXxsSmN3U'; 
const TELEGRAM_CHAT_ID = '669437449'; 


const sendTelegramNotification = async (orderData) => {
  const { customer_name, phone, address, items, total_amount } = orderData;

  // Build product list message
  const productsList = items.map((item, index) =>
    `${index + 1}. ${item.name || 'Product'} - Qty: ${item.qty} - ${(item.price * item.qty).toFixed(2)}`
  ).join('\n');

  const message = `
🛒 *New Order Received!*

*Customer Info:*
👤 Name: ${customer_name}
📞 Phone: ${phone}
📍 Address: ${address || 'Not provided'}

*Products:*
${productsList}

💰 *Total: ${total_amount}*

_Order time: ${new Date().toLocaleString()}_
  `.trim();

  try {
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await axios.post(telegramUrl, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });
    console.log('Telegram notification sent successfully');
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
};

const CheckoutForm = ({ guestInfo, setGuestInfo, onCheckout, checkoutLoading, total, cartItems, setCartItems }) => {
  const navigate = useNavigate();
  const [loadingUser, setLoadingUser] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Load cart from localStorage if empty
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      const savedCart = localStorage.getItem('checkout_cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (parsedCart && parsedCart.length > 0) {
            setCartItems(parsedCart);
          }
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
        }
      }
    }
  }, [cartItems, setCartItems]);

  // Calculate total from cart items
  const calculatedTotal = cartItems?.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0).toFixed(2) || '0.00';

  // Fetch user info on mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          setLoadingUser(true);
          const user = JSON.parse(userData);
          // Fetch latest user info from API
          const response = await fetch(`${API_BASE_URL}/read/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          });
          const data = await response.json();

          if (data && data.data) {
            setGuestInfo({
              customer_name: data.message.full_name || '',
              phone: data.message.phone || '',
              address: data.message.address || ''
            });
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        } finally {
          setLoadingUser(false);
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleConfirmOrder = async () => {
    if (!guestInfo.customer_name || !guestInfo.phone) {
      alert('Please fill in your name and phone number.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      // Build order payload
      const payload = {
        customer_name: guestInfo.customer_name,
        phone: guestInfo.phone,
        address: guestInfo.address,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.qty,
          price: item.price,
        })),
        total_amount: calculatedTotal,
      };

      // Create order via API
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };

      // Only add Authorization if token exists
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const orderResponse = await axios.post(`${API_BASE_URL}/orders/create`, payload, { headers });

      if (orderResponse.data) {
        setOrderSuccess(true);

        // Send Telegram notification
        await sendTelegramNotification({
          customer_name: guestInfo.customer_name,
          phone: guestInfo.phone,
          address: guestInfo.address,
          items: cartItems,
          total_amount: calculatedTotal
        });

        // Clear cart
        setCartItems([]);
        localStorage.removeItem('checkout_cart');

        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Order error:', error);
      alert(error.response?.data?.message || 'Order failed. Please try again.');
    }
  };

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
                    onChange={(e) => setGuestInfo({ ...guestInfo, customer_name: e.target.value })}
                  />
                </div>

                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="tel"
                    placeholder="PHONE NUMBER"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-5 text-sm outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                  />
                </div>

                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="SHIPPING ADDRESS"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-5 text-sm outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                    value={guestInfo.address}
                    onChange={(e) => setGuestInfo({ ...guestInfo, address: e.target.value })}
                  />
                </div>
              </div>
            </section>

            <button
              onClick={handleConfirmOrder}
              disabled={checkoutLoading || cartItems.length === 0 || orderSuccess}
              className={`w-full py-6 font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] flex items-center justify-center gap-3 transition-all duration-500 shadow-2xl shadow-emerald-500/20 ${orderSuccess
                  ? 'bg-emerald-500/50 text-emerald-950 cursor-default'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 disabled:opacity-20'
                }`}
            >
              {orderSuccess ? (
                <><CheckCircle size={18} /> Order Placed!</>
              ) : checkoutLoading ? (
                "Processing..."
              ) : (
                <>Confirm Order <ArrowRight size={18} /></>
              )}
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
              <span className="text-3xl font-black tracking-tighter text-white">${calculatedTotal}</span>
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