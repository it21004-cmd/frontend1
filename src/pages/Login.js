import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // ✅ Link import করুন

// ✅ BACKEND URL CHANGE - Render deployment
const API_BASE_URL = 'https://backend1-4sym.onrender.com';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams(); // ✅ এখন no error
  const verified = searchParams.get('verified');

  // ✅ useEffect properly use করুন
  useEffect(() => {
    if (verified === 'true') {
      alert('✅ Email verified successfully! You can now login.');
    } else if (verified === 'false') {
      alert('❌ Email verification failed. Please try again.');
    }
  }, [verified]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('profileName', data.user.name);
        localStorage.setItem('userEmail', data.user.email);

        if (setUser) {
          setUser({
            name: data.user.name,
            email: data.user.email
          });
        }

        window.location.href = '/';
      } else {
        alert(data.message || 'Login failed!');
      }
    } catch (error) {
      alert('Fetch error: ' + error.message);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '30px',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#2f357f', marginBottom: '20px' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="MBSTU Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(90deg, #366eea, #38befb 85%)',
            color: 'white',
            border: 'none',
            borderRadius: '27px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>
      {/* ✅ FIXED: Changed <a href> to <Link to> */}
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
