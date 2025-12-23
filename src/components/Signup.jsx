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
      // This handles ERR_CONNECTION_REFUSED
      alert("❌ Server is offline! Please start your Django backend.");
    } else {
      console.error("Signup Error Details:", error.response.data);
      alert(`❌ Signup failed: ${JSON.stringify(error.response.data)}`);
    }
  }
};

  return (
    <div style={{ padding: '40px', maxWidth: '350px', margin: '100px auto', background: 'white', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🚀 Join Indora</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input name="username" placeholder="Username" onChange={(e) => setFormData({...formData, username: e.target.value})} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
        <input name="email" type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
        <input name="password" type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
        <button type="submit" className="btn-primary" style={{ background: 'black', color: 'white', fontWeight: 'bold' }}>Create Account</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Already have an account? <span onClick={switchToLogin} style={{ color: '#3498db', cursor: 'pointer', fontWeight: 'bold' }}>Login</span>
      </p>
    </div>
  );
};

export default Signup;