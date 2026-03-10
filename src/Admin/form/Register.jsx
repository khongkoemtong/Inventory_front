import React, { useState } from 'react';
import { Eye, EyeOff, LayoutGrid } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ១. កែសម្រួល State ឱ្យត្រូវជាមួយ Column ក្នុង UserModel របស់បង
  const [formData, setFormData] = useState({
    username: '',    // បន្ថែម username
    full_name: '',   // ប្តូរពី name មក full_name
    email: '',
    password: '',
    role_id: 2       // Default ជា User
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ២. Function សម្រាប់ចាប់យកការវាយបញ្ចូល
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ៣. Function សម្រាប់ផ្ញើទិន្នន័យទៅ API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // បងអាចប្រើ Route /api/register ដែលយើងបានបង្កើតក្នុង AuthController ពីមុន
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/'); 
      } else {
        // បង្ហាញ Error Message (ឧទាហរណ៍៖ Username ឬ Email មានរួចហើយ)
        setError(data.message || 'ការបង្កើតគណនីមានបញ្ហា! សូមពិនិត្យទិន្នន័យឡើងវិញ។');
      }
    } catch (err) {
      setError('មិនអាចភ្ជាប់ទៅកាន់ Server បានទេ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900">
      
      <div className="w-full lg:w-1/2 h-full overflow-y-auto px-6 py-12 md:px-24 flex flex-col items-center">
        <div className="max-w-md w-full py-10">
          
          <div className="flex items-center gap-2 mb-10 group cursor-pointer">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-12">
              <LayoutGrid size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Medusa<span className="text-emerald-600">Shop</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create an account</h1>
            <p className="text-gray-500">Join the Medusa community today.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* បន្ថែម Input Username */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Username</label>
              <input 
                name="username"
                type="text" 
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Full Name</label>
              <input 
                name="full_name" // កែឱ្យត្រូវនឹង State (full_name)
                type="text" 
                required
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Email address</label>
              <input 
                name="email"
                type="email" 
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <label className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
              <input 
                name="password"
                type={showPassword ? "text" : "password"} 
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-gray-400 hover:text-emerald-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex items-start">
              <input required type="checkbox" className="w-4 h-4 mt-1 mr-2 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500" />
              <span className="text-sm text-gray-600">
                I agree to the <a href="#" className="text-emerald-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-600 font-semibold hover:underline">Privacy Policy</a>.
              </span>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className={`w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transform active:scale-[0.98] transition-all shadow-lg shadow-emerald-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <button type="button" className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Sign up with Google
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="font-bold text-emerald-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-center w-1/2 h-full bg-emerald-950 overflow-y-auto py-20 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-lg text-center px-12">
            <div className="mb-8 inline-block p-4 bg-emerald-900/50 backdrop-blur-md rounded-3xl border border-emerald-800">
                <img 
                    src="/public/image copy.png" 
                    alt="Registration Promo" 
                    className="rounded-2xl shadow-2xl"
                />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Start your journey.</h2>
            <p className="text-emerald-200/80 text-lg leading-relaxed mb-12">
                Create an account to unlock exclusive member pricing, track orders, and get personalized recommendations.
            </p>

            <div className="space-y-4">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-left flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">✓</div>
                    <p className="text-emerald-100 text-sm font-medium">Free shipping on your first 3 orders.</p>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-left flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">✓</div>
                    <p className="text-emerald-100 text-sm font-medium">Early access to seasonal drops.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Register;