import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ✅ BACKEND URL CHANGE - Render deployment
const API_BASE_URL = 'https://backend1-4sym.onrender.com';

export default function Verify() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log('🟢 Verifying email with token:', token);
        
        // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
        const response = await fetch(`${API_BASE_URL}/api/auth/verify/${token}`);
        const html = await response.text();
        
        // Show the response from backend
        document.getElementById('verification-result').innerHTML = html;
        
        // If verification successful, redirect after 3 seconds
        if (response.ok) {
          setTimeout(() => {
            navigate('/login', { 
              state: { message: 'Email verified successfully! You can now login.' } 
            });
          }, 3000);
        }
      } catch (error) {
        console.error('🔴 Verification error:', error);
        document.getElementById('verification-result').innerHTML = `
          <div style="text-align: center; padding: 50px;">
            <h2 style="color: red;">❌ Verification Failed</h2>
            <p>Network error. Please try again.</p>
          </div>
        `;
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div>
      <div id="verification-result" style={{ padding: '20px' }}>
        <h2>Verifying your email...</h2>
        <p>Please wait while we verify your email address.</p>
      </div>
    </div>
  );
}