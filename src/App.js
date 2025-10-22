import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUserPlus, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import ProfileEdit from './pages/ProfileEdit';
import AccountPage from './pages/AccountPage';
import HomePage from './pages/HomePage';
import NotificationPage from './pages/NotificationPage';
import Verify from './pages/Verify';
import Login from './pages/Login';
import Logout from "./pages/Logout";
import React, { useState, useEffect } from "react";
import VerifyEmail from './pages/VerifyEmail';

// ✅ BACKEND URL CHANGE - Render deployment
const API_BASE_URL = 'https://backend1-4sym.onrender.com';

// NavIcon component (unchanged)
function NavIcon({ to, icon: Icon, label }) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <Link 
      to={to}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{
        margin: "0 30px",
        padding: 7,
        color: "#444",
        position: "relative",
        textDecoration: "none",
        fontSize: "28px"
      }}
    >
      <div style={{ display: "inline-block", position: "relative" }}>
        <Icon />
        <span
          style={{
            position: "absolute",
            bottom: "-28px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#222",
            color: "#fff",
            padding: "2px 12px",
            borderRadius: "6px",
            fontSize: "14px",
            whiteSpace: "nowrap",
            zIndex: 10,
            visibility: showTooltip ? "visible" : "hidden"
          }}
          className="icon-tooltip"
        >
          {label}
        </span>
      </div>
    </Link>
  );
}

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  background: '#f8f9fc',
  padding: '18px 0 16px 0',
  borderBottom: '2px solid #e8eaf0',
  justifyContent: 'space-between'
};

// ✅ FIXED: Registration page with proper navigation - UPDATED URL
function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log('🟢 Trying to register...');
      
      // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      console.log('🟢 Response status:', res.status);
      
      const data = await res.json();
      console.log('🟢 Response data:', data);
      
      if (data.success) {
        // ✅ FIXED: Store email for verification and redirect
        localStorage.setItem('pendingVerificationEmail', formData.email);
        
        // ✅ FIXED: Navigate to verification page with email
        navigate('/verify-email', { 
          state: { email: formData.email } 
        });
      } else {
        alert(data.message || 'Registration failed!');
      }
    } catch (error) {
      console.error('🔴 Registration error:', error);
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div style={{ minHeight: "75vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        display: "flex",
        width: 700,
        borderRadius: 22,
        boxShadow: "0 8px 32px 0 rgba(40,60,145,.14)",
        background: "#fff",
        overflow: "hidden"
      }}>
        {/* Left side blue block */}
        <div style={{
          flex: 1,
          background: "linear-gradient(135deg, #366eea 70%, #2f357f 100%)",
          color: "#fff",
          padding: "46px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <h2 style={{ fontWeight: 800, fontSize: "2.3em", margin: 0, textAlign: "center", letterSpacing: ".5px" }}>
            MBSTU Research Gate
          </h2>
        </div>
        {/* Right side form */}
        <div style={{
          flex: 1.16,
          background: "#fff",
          padding: "44px 36px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <h2 style={{
            fontWeight: 700,
            fontSize: "1.4em",
            color: "#2f357f",
            marginBottom: 30,
            textAlign: "center"
          }}>
            Registration
          </h2>
          <form onSubmit={handleRegister} autoComplete="off" style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label htmlFor="name" style={{ minWidth: 65, fontWeight: "bold" }}>Name</label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                required 
                value={formData.name}
                onChange={handleChange}
                autoComplete="off" 
                placeholder="Full Name" 
                style={{ flex: 1 }} 
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label htmlFor="email" style={{ minWidth: 65, fontWeight: "bold" }}>Email</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                value={formData.email}
                onChange={handleChange}
                autoComplete="off" 
                placeholder="your@mbstu.ac.bd" 
                style={{ flex: 1 }} 
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label htmlFor="password" style={{ minWidth: 65, fontWeight: "bold" }}>Password</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                value={formData.password}
                onChange={handleChange}
                autoComplete="off" 
                placeholder="Password" 
                style={{ flex: 1 }} 
              />
            </div>
            <button type="submit" style={{
              background: "linear-gradient(90deg, #366eea, #38befb 85%)",
              color: "#fff",
              border: "none",
              borderRadius: "27px",
              padding: "12px",
              fontSize: "1.1em",
              marginTop: "10px",
              fontWeight: "bold",
              letterSpacing: ".2px",
              cursor: "pointer",
              boxShadow: "0 1px 6px #afd6f3a7"
            }}>
              Register Now
            </button>
            
            {/* ✅ FIXED: Changed <a href> to <Link to> */}
            <p style={{ textAlign: 'center', marginTop: '15px' }}>
              Already have an account? <Link to="/login" style={{ color: '#366eea' }}>Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [showLogoTooltip, setShowLogoTooltip] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const profileName = localStorage.getItem("profileName");
    
    if (token && profileName) {
      setUser({
        name: profileName,
        email: localStorage.getItem('userEmail') || 'user@mbstu.ac.bd'
      });
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#366eea'
      }}>
        Loading MBSTU Research Gate...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* ✅ FIXED: Replaced <a href="#"> with <button> */}
          <button
            className="logo-link"
            onClick={() => { 
              alert('MBSTU Research Gate - Research Collaboration Platform'); 
            }}
            onMouseEnter={() => setShowLogoTooltip(true)}
            onMouseLeave={() => setShowLogoTooltip(false)}
            style={{
              marginRight: "28px",
              display: "flex",
              alignItems: "center",
              position: "relative",
              textDecoration: "none",
              cursor: "pointer",
              background: 'none',
              border: 'none',
              padding: 0
            }}
          >
            <img
              src="/mbstu-logo.jpg"
              alt="MBSTU Logo"
              style={{ height: 44, marginRight: 5, borderRadius: "10px" }}
            />
            <span
              style={{
                position: "absolute",
                bottom: "-28px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#222",
                color: "#fff",
                padding: "2px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                whiteSpace: "nowrap",
                visibility: showLogoTooltip ? "visible" : "hidden",
                zIndex: 1000
              }}
            >
              MBSTU Research Gate
            </span>
          </button>
          
          <NavIcon to="/" icon={FaHome} label="Home" />
          <NavIcon to="/register" icon={FaUserPlus} label="Registration" />
          
          {user ? (
            <>
              <NavIcon to="/account" icon={FaUserCircle} label="My Account" />
              <NavIcon
                to="/notifications"
                icon={() => (
                  <svg height="28" viewBox="0 0 20 20" fill="#000000">
                    <path d="M10 2a6 6 0 0 1 6 6v3.17l.7 2.1A1 1 0 0 1 15.77 15H4.23a1 1 0 0 1-.93-1.73l.7-2.1V8a6 6 0 0 1 6-6zm0 15a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2z"></path>
                  </svg>
                )}
                label="Notifications"
              />
              <NavIcon to="/logout" icon={FaSignOutAlt} label="Logout" />
            </>
          ) : (
            <NavIcon to="/login" icon={FaUserCircle} label="Login" />
          )}

          {/* Search Box */}
          <input
            type="text"
            placeholder="Search..."
            style={{
              width: 180,
              height: 38,
              borderRadius: 8,
              border: '1.5px solid #e8eaf0',
              fontSize: 16,
              padding: '0 16px',
              outline: 'none',
              background: '#f8f9fc',
              marginLeft: 30
            }}
          />
        </div>

        {/* User info display */}
        {user && (
          <div style={{ 
            marginRight: '20px', 
            color: '#2f357f',
            fontWeight: 'bold'
          }}>
            Welcome, {user.name}!
          </div>
        )}
      </nav>

      <div style={{ maxWidth: 650, margin: '32px auto', padding: 24 }}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/verify/:token" element={<Verify />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/logout" element={<Logout setUser={setUser} />} />
          {/* ✅ FIXED: VerifyEmail route */}
          <Route path="/verify-email" element={<VerifyEmail setUser={setUser} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
