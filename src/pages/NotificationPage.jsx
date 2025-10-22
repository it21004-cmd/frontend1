import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Notification() {
  const [notifications, setNotifications] = useState([]);

  // Load notifications from localStorage
  const loadNotifications = () => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  };

  // Mark notification as read
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    // Trigger update for badge count
    window.dispatchEvent(new Event('notificationsUpdated'));
  };

  // Mark all as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    window.dispatchEvent(new Event('notificationsUpdated'));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem('notifications', JSON.stringify([]));
    window.dispatchEvent(new Event('notificationsUpdated'));
  };

  useEffect(() => {
    loadNotifications();

    // Listen for new notifications
    const handleNotificationsUpdated = () => {
      loadNotifications();
    };

    window.addEventListener('notificationsUpdated', handleNotificationsUpdated);
    
    return () => {
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdated);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fc', padding: '20px' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, color: '#304698' }}>Notifications</h1>
          <div>
            <button 
              onClick={markAllAsRead}
              style={{
                background: '#366eea',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                marginRight: '10px',
                cursor: 'pointer'
              }}
            >
              Mark All as Read
            </button>
            <button 
              onClick={clearAllNotifications}
              style={{
                background: '#ff4757',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {notifications.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#666',
            fontSize: '18px'
          }}>
            No notifications yet
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              style={{
                padding: '15px 20px',
                borderBottom: '1px solid #f0f0f0',
                background: notification.read ? 'white' : '#f8fbff',
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: notification.read ? '#ccc' : '#366eea',
                marginRight: '15px'
              }}></div>
              
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: notification.read ? 'normal' : '600',
                  color: notification.read ? '#666' : '#333'
                }}>
                  {notification.message}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#888', 
                  marginTop: '5px' 
                }}>
                  {notification.time}
                </div>
              </div>
              
              {!notification.read && (
                <span style={{
                  background: '#366eea',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '10px'
                }}>
                  New
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Back Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: '#304698',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            ← Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Notification;