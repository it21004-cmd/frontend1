import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VerifyEmail.css';

// ✅ BACKEND URL CHANGE - Render deployment
const API_BASE_URL = 'https://backend1-4sym.onrender.com';

function VerifyEmail({ setUser }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ FIXED: Get email from multiple sources
  const email = location.state?.email || localStorage.getItem('pendingVerificationEmail') || '';

  // ✅ FIXED: Auto-login after verification - UPDATED URL
  const handleAutoLogin = async (userEmail, userPassword) => {
    try {
      console.log('🟢 Attempting auto-login after verification...');
      
      // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          password: userPassword
        }),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        // Store auth data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('profileName', data.user.name);
        localStorage.setItem('userEmail', data.user.email);
        
        // Update user state
        setUser({
          name: data.user.name,
          email: data.user.email
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('🔴 Auto-login error:', error);
      return false;
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      alert('Please enter a valid 6-digit verification code');
      return;
    }

    if (!email) {
      alert('Email not found. Please register again.');
      navigate('/register');
      return;
    }

    setLoading(true);
    
    try {
      console.log('🟢 Verifying email:', email, 'with code:', verificationCode);
      
      // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: verificationCode
        }),
      });

      const data = await response.json();
      console.log('🟢 Verification response:', data);

      if (data.success) {
        alert('✅ ' + data.message);
        
        // ✅ FIXED: Clear pending email
        localStorage.removeItem('pendingVerificationEmail');
        
        // ✅ FIXED: Try to get password from localStorage for auto-login
        const userPassword = localStorage.getItem('pendingPassword');
        if (userPassword) {
          const loginSuccess = await handleAutoLogin(email, userPassword);
          if (loginSuccess) {
            alert('🎉 Verification successful! Auto-login completed.');
            navigate('/');
          } else {
            alert('✅ Verification successful! Please login manually.');
            navigate('/login');
          }
          localStorage.removeItem('pendingPassword');
        } else {
          alert('✅ Verification successful! Please login.');
          navigate('/login');
        }
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('🔴 Verification error:', error);
      alert('❌ Network error during verification!');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      alert('Email not found. Please register again.');
      return;
    }

    try {
      // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ New verification code sent! Please check your email.');
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('🔴 Resend error:', error);
      alert('❌ Failed to resend code!');
    }
  };

  // ✅ FIXED: Show error if no email found
  if (!email) {
    return (
      <div className="verification-page">
        <div className="left-panel">
          <h1>MBSTU Research Gate</h1>
        </div>
        <div className="right-panel">
          <div className="verification-form">
            <h2>Email Not Found</h2>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>No verification email found. Please complete registration first.</p>
              <button 
                onClick={() => navigate('/register')}
                style={{
                  padding: '10px 20px',
                  background: '#2c3e50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '15px'
                }}
              >
                Go to Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-page">
      <div className="left-panel">
        <h1>MBSTU Research Gate</h1>
      </div>
      <div className="right-panel">
        <form className="verification-form" onSubmit={handleVerify}>
          <h2>Verify Your Email</h2>
          
          <div className="email-display">
            <p>We sent a verification code to:</p>
            <strong>{email}</strong>
          </div>

          <div className="form-group">
            <label htmlFor="verificationCode">Enter Verification Code</label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
            />
            <small>Enter the 6-digit code from your email</small>
          </div>

          <button type="submit" disabled={loading || verificationCode.length !== 6}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          <div className="resend-section">
            <p>Didn't receive the code?</p>
            <button type="button" onClick={handleResendCode} className="resend-btn">
              Resend Verification Code
            </button>
          </div>

          <div className="back-link">
            <a href="/register">← Back to Registration</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmail;