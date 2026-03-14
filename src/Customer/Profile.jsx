import React, { useState, useEffect, useRef } from 'react';
import {
  User, Settings, Package, MapPin, CreditCard,
  LogOut, ChevronRight, Bell, Shield, Star, Heart, Camera, Check, X
} from 'lucide-react';
import { useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for Editing
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:8000/api/read/${id}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
        });
        const data = await res.json();
        
        if (data && data.message) {
          setUser(data.message);
          setFullName(data.message.full_name || "");
          setEmail(data.message.email || "");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  const handleImageClick = () => {
    if (isEditing) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
const handleSave = async () => {
  if (!fullName || !email) {
    alert("Please fill in your name and email.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    
    // Your route uses {id} in the URL, but appending it to FormData doesn't hurt
    formData.append("full_name", fullName);
    formData.append("email", email);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // IMPORTANT: Changed URL to match your api.php: Route::post('/update/{id}', ...)
    // Note: We use the 'id' from useParams() here
    const res = await fetch(`http://127.0.0.1:8000/api/user/update/${id}`, {
      method: "POST", 
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      },
      body: formData
    });

    const result = await res.json();

   if (res.ok) {
  // បង្កើត Function សម្រាប់ទាញទិន្នន័យឡើងវិញ (អ្នកអាច Copy ពី useEffect មក)
  const fetchUpdatedUser = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://127.0.0.1:8000/api/read/${id}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    });
    const data = await response.json();
    if (data && data.message) {
      setUser(data.message); // កំណត់ទិន្នន័យថ្មីដែលបានមកពី Database
    }
  };

  await fetchUpdatedUser(); 
  setIsEditing(false);
  setPreviewUrl(null);
  setImageFile(null);

}else {
      console.error("Server Error:", result);
      alert(`Update failed: ${result.message || "Check your permissions"}`);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Check your connection or console for errors.");
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <div className="bg-emerald-950 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          
          {/* Profile Image with Upload capability */}
          <div className="relative group" onClick={handleImageClick}>
            <div className={`w-32 h-32 rounded-[2.5rem] bg-emerald-500 flex items-center justify-center text-white border-4 border-emerald-900 shadow-2xl overflow-hidden ${isEditing ? 'cursor-pointer' : ''}`}>
              {previewUrl || user?.image ? (
                <img src={previewUrl || user.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={60} />
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
            
            <div 
              onClick={(e) => { e.stopPropagation(); setIsEditing(!isEditing); }}
              className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-transform"
            >
              {isEditing ? <X size={16} className="text-red-500" /> : <Settings size={16} className="text-emerald-900" />}
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-emerald-900/30 border border-emerald-500/30 text-white text-2xl font-black rounded-lg px-2 w-full focus:outline-none focus:border-emerald-400"
                />
                <input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-emerald-900/30 border border-emerald-500/30 text-emerald-100/60 font-medium rounded-lg px-2 w-full focus:outline-none"
                />
                <button onClick={handleSave} className="mt-2 flex items-center gap-2 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400">
                  <Check size={12} /> Save Changes
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">
                  {user?.full_name || 'User'}
                </h1>
                <p className="text-emerald-100/60 font-medium mb-4">
                  {user?.email}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-widest uppercase">
                  {user?.role_id === 1 ? 'Admin' : 'Member'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10 pb-24">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Orders", value: user?.orders_count || "0", icon: <Package size={18} /> },
            { label: "Points", value: "0", icon: <Star size={18} /> },
            { label: "Wishlist", value: "0", icon: <Heart size={18} /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="text-emerald-600 mb-2">{stat.icon}</div>
              <span className="text-2xl font-black text-gray-900">{stat.value}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-3">
            {[
              { icon: <Package size={18} />, label: "My Orders", active: true },
              { icon: <MapPin size={18} />, label: "Shipping Address", active: false },
              { icon: <CreditCard size={18} />, label: "Payment Methods", active: false },
              { icon: <Shield size={18} />, label: "Security", active: false },
              { icon: <Bell size={18} />, label: "Notifications", active: false },
            ].map((item, i) => (
              <button key={i} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${item.active ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/20' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                <ChevronRight size={16} opacity={item.active ? 1 : 0.3} />
              </button>
            ))}

            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 font-bold text-sm hover:bg-red-50 transition-all mt-6">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black mb-6 uppercase italic">Recent Orders</h3>
              <p className="text-gray-400 text-sm italic text-center py-10">No recent orders found.</p>
              <button className="w-full mt-6 py-4 border-2 border-dashed border-gray-100 rounded-2xl text-xs font-black text-gray-400 uppercase tracking-widest hover:border-emerald-200 hover:text-emerald-600 transition-all">
                View All Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;