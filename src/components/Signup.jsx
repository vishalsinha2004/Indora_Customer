import React, { useState } from 'react';
import api from '../api/axios';

const Signup = ({ onSignupSuccess, switchToLogin }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('auth/signup/', formData); 
      alert("✅ Account created! Please login.");
      switchToLogin();
    } catch (error) {
      if (!error.response) {
        alert("❌ Server is offline! Please start your Django backend.");
      } else {
        console.error("Signup Error Details:", error.response.data);
        alert(`❌ Signup failed: ${JSON.stringify(error.response.data)}`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      {/* Main Container with Claymorphism Card Effect */}
      <div className="w-full max-w-md p-10 bg-white/80 backdrop-blur-sm rounded-[40px] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] border border-white/20">
        
        <h2 className="text-3xl font-black text-center mb-8 text-slate-800 tracking-tight">
          🚀 Join Indora
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Username Input with Inner Shadow Effect */}
          <div className="flex flex-col">
            <input 
              name="username" 
              placeholder="Username" 
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
              required 
              className="p-4 rounded-2xl bg-slate-50 border-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:ring-4 ring-blue-100 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col">
            <input 
              name="email" 
              type="email" 
              placeholder="Email" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
              className="p-4 rounded-2xl bg-slate-50 border-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:ring-4 ring-blue-100 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
              className="p-4 rounded-2xl bg-slate-50 border-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:ring-4 ring-blue-100 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Button with Claymorphism "Squishy" Effect */}
          <button 
            type="submit" 
            className="mt-4 p-4 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-[4px_4px_10px_rgba(37,99,235,0.3),inset_-4px_-4px_8px_rgba(0,0,0,0.2),inset_4px_4px_8px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] active:shadow-inner transition-all"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 font-medium">
          Already have an account?{' '}
          <span 
            onClick={switchToLogin} 
            className="text-blue-600 cursor-pointer font-bold hover:underline underline-offset-4"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;