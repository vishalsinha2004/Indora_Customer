import React, { useState } from 'react';
import api from '../api/axios';

const Login = ({ onLoginSuccess, switchToSignup }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await api.post('/api/auth/login/', {
          username: formData.username, 
          password: formData.password 
      });

      const token = response.data.access; 
      if (token) {
        onLoginSuccess(formData.username, token);
      }
    } catch (error) {
      alert("❌ Invalid credentials. Please check your username and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 p-4 selection:bg-red-200 selection:text-red-900">
      {/* Premium Glassmorphism Card */}
      <div className="w-full max-w-md p-10 bg-white/70 backdrop-blur-2xl rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/60 transition-all duration-400">
        
        <h2 className="text-3xl font-black text-center mb-8 text-zinc-900 tracking-tight">
          👋 Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Sleek Glassy Input */}
          <div className="flex flex-col">
            <input 
              placeholder="Username" 
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required 
              className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:border-red-300 focus:ring-4 focus:ring-red-600/10 outline-none transition-all placeholder:text-zinc-400 font-bold text-zinc-800"
            />
          </div>

          <div className="flex flex-col">
            <input 
              type="password"
              placeholder="Password" 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
              className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:border-red-300 focus:ring-4 focus:ring-red-600/10 outline-none transition-all placeholder:text-zinc-400 font-bold text-zinc-800"
            />
          </div>

          {/* Premium Red Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="mt-4 p-4 rounded-2xl bg-red-600 text-white font-black text-lg shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 tracking-wide"
          >
            {loading ? 'Logging in...' : 'Login to Parceel'}
          </button>
        </form>

        <p className="text-center mt-8 text-zinc-500 font-medium">
          New here?{' '}
          <span 
            onClick={switchToSignup} 
            className="text-red-600 cursor-pointer font-bold hover:text-red-700 transition-colors"
          >
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;