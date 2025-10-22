import React, { useState } from 'react';
import './Register.css';

// ✅ BACKEND URL CHANGE - Render deployment
const API_BASE_URL = 'https://backend1-4sym.onrender.com';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('register'); // 'register' or 'verify'
  const [registeredEmail, setRegisteredEmail] = useState('');

  // ✅ FIXED: Registration handler - UPDATED URL
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log('🟢 Sending registration request...');
      
      // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      console.log('🟢 Response status:', response.status);
      
      const data = await response.json();
      console.log('🟢 Response data:', data);

      if (data.success) {
        // ✅ FIXED: Always go to verify page
        setRegisteredEmail(email);
        setStep('verify');
        console.log('✅ Redirecting to verification page...');
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('🔴 Fetch error:', error);
      alert('❌ Network error! Please check if backend server is running.');
    }
  };

  // ✅ FIXED: Verification handler - UPDATED URL
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      console.log('🟢 Verifying email:', registeredEmail);
      console.log('🟢 Verification code:', verificationCode);
      
      // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: registeredEmail, 
          code: verificationCode 
        })
      });

      const data = await response.json();
      console.log('🟢 Verification response:', data);
      
      if (data.success) {
        alert('✅ ' + data.message);
        window.location.href = '/login';
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('🔴 Verification error:', error);
      alert('❌ Network error during verification!');
    }
  };

  // ✅ FIXED: Resend code handler - UPDATED URL
  const handleResendCode = async () => {
    try {
      console.log('🟢 Resending code to:', registeredEmail);
      
      // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: registeredEmail })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ New verification code sent! Check your email.');
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('🔴 Resend error:', error);
      alert('❌ Failed to resend code!');
    }
  };

  // Verify Page
  if (step === 'verify') {
    return (
      <div className="registration-page">
        <div className="left-panel">
          <h1>MBSTU Research Gate</h1>
        </div>
        <div className="right-panel">
          <form className="registration-form" onSubmit={handleVerify}>
            <h2>Verify Email</h2>
            <p style={{textAlign: 'center', marginBottom: '20px'}}>
              We sent a verification code to:<br/>
              <strong>{registeredEmail}</strong>
            </p>
            
            <div className="form-group">
              <label htmlFor="code">Verification Code</label>
              <input 
                type="text" 
                id="code"
                value={verificationCode} 
                onChange={e => setVerificationCode(e.target.value)} 
                placeholder="Enter 6-digit code"
                required 
              />
            </div>
            
            <button type="submit">Verify Email</button>
            
            <p style={{textAlign: 'center', marginTop: '15px'}}>
              Didn't receive code?{' '}
              <button 
                type="button" 
                onClick={handleResendCode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2c3e50',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Resend Code
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  }

  // Register Page
  return (
    <div className="registration-page">
      <div className="left-panel">
        <h1>MBSTU Research Gate</h1>
      </div>
      <div className="right-panel">
        <form className="registration-form" onSubmit={handleRegister}>
          <h2>Register</h2>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">MBSTU Email</label>
            <input 
              type="email" 
              id="email"
              pattern="[a-z0-9._%+-]+@mbstu.ac.bd$"
              title="Only MBSTU email addresses are allowed"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit">Register</button>
          
          <p style={{textAlign: 'center', marginTop: '15px'}}>
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;