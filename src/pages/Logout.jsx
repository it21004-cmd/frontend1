import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('profileName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    
    // Clear user state
    if (setUser) {
      setUser(null);
    }
    
    // Show logout message
    alert('You have been logged out successfully!');
    
    // Redirect to login page
    navigate('/login');
  }, [navigate, setUser]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
      fontSize: '18px',
      color: '#366eea'
    }}>
      Logging out...
    </div>
  );
}

export default Logout;