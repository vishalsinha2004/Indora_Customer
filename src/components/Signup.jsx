import React, { useState } from 'react';
import api from '../api/axios';

const Signup = ({ onSignupSuccess, switchToLogin }) => {
  const [formData, setFormData] = useState({ username: '', email: '', phone_number: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Quick validation
    if (!formData.phone_number || formData.phone_number.length < 10) {
        alert("Please enter a valid phone number (at least 10 digits).");
        return;
    }

    try {
       await api.post('/api/auth/signup/', formData);      
      // Save it locally so the Profile tab can show it immediately after they log in
      localStorage.setItem('parceel_customer_phone', formData.phone_number);
      
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
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 p-4 selection:bg-red-200 selection:text-red-900">
      {/* Main Container with Glassmorphism Card Effect */}
      <div className="w-full max-w-md p-10 bg-white/70 backdrop-blur-2xl rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/60 transition-all duration-400">
        
        <h2 className="text-3xl font-black text-center mb-8 text-zinc-900 tracking-tight">
          🚀 Join Parceel
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <input 
              name="username" 
              placeholder="Username" 
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
              required 
              className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:border-red-300 focus:ring-4 focus:ring-red-600/10 outline-none transition-all placeholder:text-zinc-400 font-bold text-zinc-800"
            />
          </div>

          <div className="flex flex-col">
            <input 
              name="email" 
              type="email" 
              placeholder="Email Address" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
              className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:border-red-300 focus:ring-4 focus:ring-red-600/10 outline-none transition-all placeholder:text-zinc-400 font-bold text-zinc-800"
            />
          </div>

          <div className="flex flex-col">
            <input 
              name="phone_number" 
              type="tel" 
              placeholder="Phone Number (e.g. 9876543210)" 
              onChange={(e) => setFormData({...formData, phone_number: e.target.value})} 
              required 
              className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:border-red-300 focus:ring-4 focus:ring-red-600/10 outline-none transition-all placeholder:text-zinc-400 font-bold text-zinc-800"
            />
          </div>

          <div className="flex flex-col">
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
              className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:border-red-300 focus:ring-4 focus:ring-red-600/10 outline-none transition-all placeholder:text-zinc-400 font-bold text-zinc-800"
            />
          </div>

          {/* Solid Zinc Black Button */}
          <button 
            type="submit" 
            className="mt-4 p-4 rounded-2xl bg-zinc-900 text-white font-black text-lg shadow-[0_10px_25px_rgba(0,0,0,0.2)] hover:bg-black active:scale-95 transition-all tracking-wide"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-8 text-zinc-500 font-medium">
          Already have an account?{' '}
          <span 
            onClick={switchToLogin} 
            className="text-red-600 cursor-pointer font-bold hover:text-red-700 transition-colors"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;  