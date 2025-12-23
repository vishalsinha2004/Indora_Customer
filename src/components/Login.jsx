import React, { useState } from 'react';
import api from '../api/axios';

const Login = ({ onLoginSuccess, switchToSignup }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('auth/login/', { 
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
    <div style={{ padding: '40px', maxWidth: '350px', margin: '100px auto', background: 'white', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>👋 Welcome Back</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          placeholder="Username" 
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required 
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        <input 
          type="password"
          placeholder="Password" 
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required 
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        <button type="submit" disabled={loading} className="btn-primary" style={{ background: 'black', color: 'white', fontWeight: 'bold' }}>
          {loading ? 'Logging in...' : 'Login to Indora'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        New here? <span onClick={switchToSignup} style={{ color: '#3498db', cursor: 'pointer', fontWeight: 'bold' }}>Create an account</span>
      </p>
    </div>
  );
};

export default Login;