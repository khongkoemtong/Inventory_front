import React, { useState } from 'react';
import { Eye, EyeOff, LayoutGrid } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ១. ប្តូរពី email ទៅជា username ឱ្យត្រូវជាមួយ Laravel Model របស់បង
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', formData);

      // ឆែកមើលក្នុង Console សិនថា តើ response.data ចេញអីខ្លះ?
      console.log("Login Response:", response.data);

      const token = response.data.access_token || response.data.token;
      const userData = response.data.user;

      if (token && userData) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userId', userData.id.toString()); // កែមកត្រង់នេះ

        if (userData.role_id === 1 || userData.role_id === 4) {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
        // សំខាន់៖ បន្ទាប់ពី navigate បងគួរ reload បន្តិចដើម្បីឱ្យ Home ចាប់ state ថ្មី
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
            <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-500">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Username</label>
              <input
                name="username" // ត្រូវប្តូរឈ្មោះ Input ឱ្យត្រូវនឹង Backend (username)
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <label className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
              <input
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
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

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 mr-2 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500" />
                Remember for 30 days
              </label>
              <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Forgot password?</a>
            </div>

            <button
              disabled={loading}
              type="submit"
              className={`w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transform active:scale-[0.98] transition-all shadow-lg shadow-emerald-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <button type="button" className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Sign in with Google
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-600">
            Don't have an account? <Link to="/register" className="font-bold text-emerald-600 hover:underline">Sign up for free</Link>
          </p>

          <div className="mt-20 p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-center text-xs">
            Scroll down to see independent motion
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-center w-1/2 h-full bg-emerald-950 overflow-y-auto py-20 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-lg text-center px-12">
          <div className="mb-8 inline-block p-4 bg-emerald-900/50 backdrop-blur-md rounded-3xl border border-emerald-800">
            <img
              src="/public/image.png"
              alt="Product Preview"
              className="rounded-2xl object-cover shadow-2xl"
            />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Captivating style, delivered.</h2>
          <p className="text-emerald-200/80 text-lg leading-relaxed mb-12">
            Join thousands of shoppers who trust Medusa for the most unique pieces in the market.
          </p>

          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-6 bg-white/5 rounded-2xl border border-white/10 text-left">
                <h4 className="text-white font-semibold">Premium Feature {item}</h4>
                <p className="text-emerald-200/50 text-sm">Experience the best-in-class service with our Medusa Shop pro dashboard.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;