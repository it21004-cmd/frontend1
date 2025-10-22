import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // ✅ NEW: Import Link

// ✅ BACKEND URL CHANGE - Render deployment
const API_BASE_URL = 'https://backend1-4sym.onrender.com';

function HomePage() {
  const [user, setUser] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [modalType, setModalType] = useState("text");
  const [tempText, setTempText] = useState("");
  const [tempImage, setTempImage] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [tempImagePreview, setTempImagePreview] = useState(null);
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ NEW: Notification count state
  const [notificationCount, setNotificationCount] = useState(0);

  // ✅ NEW: Comment states
  const [commentTexts, setCommentTexts] = useState({});
  const [showCommentSections, setShowCommentSections] = useState({});

  // ✅ NEW: Load notification count
  const loadNotificationCount = () => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const notifications = JSON.parse(savedNotifications);
      const unreadCount = notifications.filter(n => !n.read).length;
      setNotificationCount(unreadCount);
    }
  };

  // ✅ NEW: Add notification function
  const addNotification = (message, type = 'info') => {
    const savedNotifications = localStorage.getItem('notifications');
    let notifications = [];
    
    if (savedNotifications) {
      notifications = JSON.parse(savedNotifications);
    }
    
    const newNotification = {
      id: Date.now(),
      message: message,
      type: type,
      time: new Date().toLocaleString(),
      read: false
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    // Update count
    loadNotificationCount();
    
    // Trigger update for other pages
    window.dispatchEvent(new Event('notificationsUpdated'));
  };

  // ✅ Load user and posts from backend - UPDATED
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('profileName');
    if (token && name) {
      setUser({ name });
    }
    
    loadPostsFromBackend();
    loadNotificationCount(); // ✅ NEW: Load notification count

    // ✅ NEW: Listen for notification updates
    window.addEventListener('notificationsUpdated', loadNotificationCount);
    
    return () => {
      window.removeEventListener('notificationsUpdated', loadNotificationCount);
    };
  }, []);

  // ✅ Function to load posts from backend - UPDATED URL
  const loadPostsFromBackend = async () => {
    try {
      setLoading(true);
      // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
      const response = await axios.get(`${API_BASE_URL}/api/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([
        {
          _id: 1,
          user: { name: "Afsana Mim" },
          createdAt: new Date().toISOString(),
          postType: "text",
          text: "MBSTU conference registration open now!",
          file: null,
          image: null,
          likes: [],
          comments: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Like function - CORRECT URL FORMAT - UPDATED URL
const handleLike = async (postId) => {
  console.log('🟢 DEBUG: Like button clicked!');
  console.log('🟢 DEBUG: Post ID:', postId);
  
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('দয়া করে প্রথমে লগইন করুন!');
      return;
    }

    // ✅ CORRECT: Use URL parameter instead of body - UPDATED URL
    const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
      // ✅ NO body needed - postId is in URL
    });

    const data = await response.json();
    console.log('🟢 DEBUG: API Response:', data);

    if (data.success) {
      // ✅ Update the specific post in state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { ...post, likes: data.likes } 
            : post
        )
      );
      console.log('🟢 DEBUG: Like successful!');
    } else {
      alert(data.message || 'Like failed!');
    }
  } catch (error) {
    console.error('🔴 DEBUG: Like error:', error);
    alert('Network error! Please check if backend is running.');
  }
};

  
// ✅ FIXED: Comment function - UPDATED URL
const handleComment = async (postId) => {
  const commentText = commentTexts[postId] || '';
  if (!commentText.trim()) {
    alert('Please write a comment!');
    return;
  }

  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login to comment!');
      return;
    }

    console.log('🟢 DEBUG: Comment for post:', postId);

    const response = await axios.post(
      // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
      `${API_BASE_URL}/api/posts/${postId}/comment`,
      { text: commentText },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000
      }
    );

    if (response.data.success) {
      // Reload all posts
      await loadPostsFromBackend();
      // Clear comment text
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
      console.log('🟢 DEBUG: Comment added successfully!');
    }
  } catch (error) {
    console.error('🔴 Comment error:', error);
    console.log('🔴 Error response:', error.response?.data);
    alert('Error: ' + (error.response?.data?.message || 'Check console'));
  }
};

  // ✅ NEW: Share function
  const handleShare = async (postId) => {
    try {
      const post = posts.find(p => p._id === postId);
      if (!post) return;

      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.user?.name}`,
          text: post.text || 'Check out this post!',
          url: window.location.href,
        });
        
        // Add notification
        addNotification(`🔗 You shared a post by ${post.user?.name}`, 'share');
      } else {
        // Fallback: copy to clipboard
        const postUrl = `${window.location.href}#post-${postId}`;
        await navigator.clipboard.writeText(postUrl);
        alert('Post link copied to clipboard!');
        
        // Add notification
        addNotification(`🔗 You shared a post by ${post.user?.name}`, 'share');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  // ✅ NEW: Toggle comment section
  const toggleCommentSection = (postId) => {
    setShowCommentSections(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // ✅ NEW: Update comment text
  const updateCommentText = (postId, text) => {
    setCommentTexts(prev => ({
      ...prev,
      [postId]: text
    }));
  };

  // ✅ FIXED: Check if user liked the post
const isPostLikedByUser = (post) => {
  if (!user) return false;
  
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  // Get user ID from token or localStorage
  const userId = localStorage.getItem('userId');
  
  // Check if this user has liked the post
  const userLiked = post.likes?.some(like => {
    // Check both possible formats
    return like.user?._id === userId || 
           like.user?._id === user._id ||
           like.user?.toString() === userId;
  });
  
  return userLiked;
};
  const handleCreatePost = () => {
    if (!user) {
      alert('🔐 PLEASE LOGIN FIRST!\n\nYou need to login to create posts.');
      window.location.href = '/login';
      return;
    }
    setShowPostModal(true);
    setModalType("text");
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempImage(file);
      setTempImagePreview(URL.createObjectURL(file));
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setTempFile(file);
  };

  // ✅ UPDATED: Submit post to backend AND update both pages - NOTIFICATION ADDED - UPDATED URL
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login first!');
      return;
    }

    if (!tempText.trim() && modalType === "text") {
      alert('Please write something for your post!');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('No authentication token found!');
      return;
    }

    try {
      // Prepare post data for backend
      const postData = {
        text: tempText,
        postType: modalType
      };

      // For image posts
      // ✅ FIXED: Use base64 for images (no upload needed)
      if (modalType === "image" && tempImage) {
        const reader = new FileReader();
        
        reader.onload = function() {
          // When image is converted to base64
          postData.image = reader.result; // This is the base64 image data
          
          // Send to backend - UPDATED URL
          fetch(`${API_BASE_URL}/api/posts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData)
          })
          .then(response => response.json())
          .then(data => {
            if (data.post) {
              // ✅ NEW: Notification add করো
              addNotification(`📸 You shared a new photo`, 'success');
              
              alert('✅ Image post created successfully!');
              loadPostsFromBackend(); // Reload posts
              window.dispatchEvent(new Event('postsUpdated')); // Update account page
              resetModal();
            } else {
              alert('Post failed');
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('Network error');
          });
        };
        
        // Convert image to base64
        reader.readAsDataURL(tempImage);
        return; // Important: stop here and wait for conversion
      }

      // For file posts - UPDATED URL
      if (modalType === "file" && tempFile) {
        const fileFormData = new FormData();
        fileFormData.append('file', tempFile);
        
        // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
        const fileResponse = await fetch(`${API_BASE_URL}/api/upload/file`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: fileFormData
        });
        
        if (fileResponse.ok) {
          const fileData = await fileResponse.json();
          postData.file = {
            name: tempFile.name,
            url: fileData.fileUrl
          };
          
          // ✅ NEW: Notification add করো
          addNotification(`📎 You shared a new file: ${tempFile.name}`, 'success');
        }
      }

      // Send to backend (for text posts) - UPDATED URL
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ NEW: Notification add করো (for text posts)
        if (modalType === "text") {
          addNotification(`📝 You created a new post`, 'success');
        }
        
        alert('✅ Post created successfully!');
        
        // ✅ IMPORTANT: Reload posts from backend to show the new post EVERYWHERE
        await loadPostsFromBackend();
        
        // ✅ Trigger global update for Account page
        window.dispatchEvent(new Event('postsUpdated'));
        
        resetModal();
      } else {
        alert('Post failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Post creation error:', error);
      alert('Network error. Please try again.');
    }
  };

  const resetModal = () => {
    setShowPostModal(false);
    setTempText("");
    setTempImage(null);
    setTempFile(null);
    setTempImagePreview(null);
    setModalType("text");
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div style={{minHeight:'100vh', background:'#f8f9fc'}}>
      {/* ✅ NEW: Simple Notification Bell Button */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000
      }}>
        <Link to="/notifications" style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: '#366eea',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '20px',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            🔔
            {/* Notification count badge */}
            {notificationCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {notificationCount}
              </span>
            )}
          </button>
        </Link>
      </div>

      {/* Header */}
      <div style={{
          width: '100%',
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(90deg, #304698 60%, #5a88cc 100%)',
          marginBottom: 28,
          boxShadow: '0 2px 18px #3051a026'
        }}>
        <div style={{
            fontSize: 46,
            fontFamily: 'Times New Roman, Times, serif', 
            color: '#fff',
            fontWeight: 800,
            textAlign: 'center'
          }}>
          Welcome to MBSTU Research Gate
        </div>
        
        {user ? (
          <div style={{color: '#fff', fontSize: '18px', marginTop: '10px'}}>
            Welcome back, <strong>{user.name}</strong>!
          </div>
        ) : (
          <div style={{color: '#ffeb3b', fontSize: '18px', marginTop: '10px', fontWeight: 'bold'}}>
            🔐 Please login to create posts
          </div>
        )}
      </div>

      {/* Post Button */}
      <div style={{display:'flex', justifyContent:'center', marginBottom:36}}>
        <div style={{
          background:'#fff', borderRadius:16, boxShadow:"0 2px 18px #ccd6fa2b",
          minWidth:360, maxWidth:540, width:'70%', padding:'23px 34px'
        }}>
          <button
            style={{
              fontSize:19, 
              color: user ? '#235' : '#d32f2f',
              border: user ? '1.5px solid #d0d6ee' : '2px solid #d32f2f',
              borderRadius:11, 
              padding:'12px 16px', 
              width:'100%',
              textAlign:'left', 
              background: user ? '#f9fbff' : '#ffebee',
              cursor: user ? 'pointer' : 'not-allowed',
              fontWeight: 600
            }}
            onClick={handleCreatePost}
            disabled={!user}
          >
            {user ? "👉 What would you like to share today?" : "🔐 PLEASE LOGIN TO CREATE POSTS"}
          </button>
        </div>
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div style={{
          position:'fixed', left:0,top:0,right:0,bottom:0, background:'#13184266',zIndex:199,
          display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          <div style={{
            minWidth:400, maxWidth:500, borderRadius:17,
            background:'#fff', padding:32, boxShadow:'0 4px 24px #3346a644'
          }}>
            <h3 style={{marginBottom:18, color:'#2a40a0'}}>Create a Post</h3>
            
            {/* Post Type Selection */}
            <div style={{display:'flex',gap:10,marginBottom:20, justifyContent: 'center'}}>
              <button 
                style={{
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: modalType === "text" ? '#e4f4ff' : '#f5f5f5',
                  cursor: 'pointer',
                  fontWeight: modalType === "text" ? 'bold' : 'normal'
                }} 
                onClick={()=>setModalType("text")}
              >
                🖋️ Text
              </button>
              <button 
                style={{
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: modalType === "image" ? '#e4f4ff' : '#f5f5f5',
                  cursor: 'pointer',
                  fontWeight: modalType === "image" ? 'bold' : 'normal'
                }} 
                onClick={()=>setModalType("image")}
              >
                🖼️ Image
              </button>
              <button 
                style={{
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: modalType === "file" ? '#e4f4ff' : '#f5f5f5',
                  cursor: 'pointer',
                  fontWeight: modalType === "file" ? 'bold' : 'normal'
                }} 
                onClick={()=>setModalType("file")}
              >
                📎 File
              </button>
            </div>
            
            <form onSubmit={handlePostSubmit}>
              {/* Text Input */}
              <textarea
                placeholder={modalType === "text" ? "Write your thoughts..." : "Add a caption (optional)..."}
                value={tempText}
                onChange={e=>setTempText(e.target.value)}
                style={{
                  width:'100%', 
                  minHeight:80,
                  marginBottom:12, 
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'vertical'
                }} 
              />
              
              {/* Image Upload */}
              {modalType === "image" && (
                <div style={{marginBottom: 12}}>
                  <input 
                    type='file' 
                    accept='image/*' 
                    onChange={onImageChange} 
                    style={{marginBottom:10, width: '100%'}}
                  />
                  {tempImagePreview && (
                    <img 
                      src={tempImagePreview} 
                      alt="Preview" 
                      style={{
                        width:'100%',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius:8, 
                        marginBottom:8,
                        border: '1px solid #ddd'
                      }} 
                    />
                  )}
                </div>
              )}

              {/* File Upload */}
              {modalType === "file" && (
                <div style={{marginBottom: 12}}>
                  <input 
                    type='file' 
                    onChange={onFileChange} 
                    style={{marginBottom:10, width: '100%'}}
                  />
                  {tempFile && (
                    <div style={{
                      padding: '10px',
                      background: '#f5f7fe', 
                      borderRadius: '8px',
                      marginBottom:8,
                      border: '1px solid #ddd'
                    }}>
                      <strong>Selected File:</strong> {tempFile.name}
                    </div>
                  )}
                </div>
              )}
              
              {/* Buttons */}
              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                <button 
                  type="button" 
                  onClick={resetModal}
                  style={{
                    padding: '10px 20px',
                    background: '#ccc',
                    color: 'black',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: '#366eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts Timeline */}
      <div style={{maxWidth:660, margin:'0 auto', marginTop:8}}>
        <h3 style={{textAlign: 'center', color: '#2a40a0', marginBottom: '20px'}}>
          Recent Posts ({posts.length})
        </h3>
        
        {loading ? (
          <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>
            No posts yet. Be the first to share something!
          </div>
        ) : (
          posts.map(post => (
            <div key={post._id || post.id}
              style={{
                background:'#fff', 
                margin:'18px 0', 
                borderRadius:14,
                boxShadow:'0 2px 12px #d0def92c', 
                padding:'26px 27px',
                border: '1px solid #e8eaf0'
              }}>
              {/* User Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#366eea',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  marginRight: '12px'
                }}>
                  {(post.user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{fontWeight:700, fontSize:18, color:'#1a335a'}}>
                    {post.user?.name || 'Unknown User'}
                  </div>
                  <div style={{color:'#b0b7c2', fontWeight:500, fontSize:14}}>
                    ⏱️ {formatDate(post.createdAt || post.time)}
                  </div>
                </div>
              </div>

              {/* Post Content */}
              {post.text && (
                <div style={{fontSize:17, marginBottom:12, lineHeight: '1.5'}}>
                  {post.text}
                </div>
              )}
              
              {/* Image Post */}
              {(post.postType === "image" || post.type === "image") && post.image && (
                <img 
                  src={post.image} 
                  alt="post" 
                  style={{
                    maxWidth:'100%',
                    borderRadius:8,
                    marginBottom:12,
                    border: '1px solid #e8eaf0'
                  }} 
                />
              )}
              
              {/* File Post */}
              {(post.postType === "file" || post.type === "file") && post.file && (
                <div style={{
                  background:'#f5f7fe', 
                  borderRadius:8, 
                  padding:'12px 16px', 
                  marginBottom:12, 
                  fontSize:16, 
                  display:'flex',
                  alignItems:'center',
                  border: '1px solid #e8eaf0'
                }}>
                  <span role="img" aria-label="file" style={{fontSize:24, marginRight:12}}>📄</span>
                  <div>
                    <div style={{fontWeight: 'bold'}}>{post.file.name}</div>
                    <a 
                      href={post.file.url} 
                      download={post.file.name} 
                      style={{
                        color:'#1d41b8',
                        textDecoration:"underline",
                        fontSize: '14px'
                      }}
                    >
                      Download File
                    </a>
                  </div>
                </div>
              )}

              {/* Post Type Badge */}
              <div style={{
                display: 'inline-block',
                padding: '4px 8px',
                background: '#e4f4ff',
                color: '#366eea',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '12px'
              }}>
                {(post.postType || post.type || 'text').toUpperCase()} POST
              </div>

              {/* ✅ NEW: Like, Comment, Share Counts */}
              <div style={{
                display: 'flex',
                gap: '15px',
                marginBottom: '12px',
                fontSize: '14px',
                color: '#666'
              }}>
                <span>👍 {post.likes?.length || 0} likes</span>
                <span>💬 {post.comments?.length || 0} comments</span>
              </div>

  {/* ✅ FIXED: Real Interactive Buttons */}
<div style={{
  marginTop:12,
  display:"flex",
  gap:15,
  alignItems:"center",
  borderTop: '1px solid #e8eaf0',
  paddingTop: '12px'
}}>
  {/* LIKE BUTTON */}
  <button 
    onClick={() => {
      console.log('🟢 LIKE CLICKED!');
      handleLike(post._id || post.id);
    }}
    style={{
      padding: '10px 20px', 
      border: '2px solid #366eea', 
      borderRadius: '8px',
      background: isPostLikedByUser(post) ? '#366eea' : 'white',
      color: isPostLikedByUser(post) ? 'white' : '#366eea',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '16px',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}
  >
    {isPostLikedByUser(post) ? '❤️ Liked' : '👍 Like'}
  </button>
  
  {/* COMMENT BUTTON */}
  <button 
    onClick={() => {
      console.log('🟢 COMMENT CLICKED!');
      toggleCommentSection(post._id || post.id);
    }}
    style={{
      padding: '10px 20px', 
      border: '2px solid #28a745', 
      borderRadius: '8px',
      background: showCommentSections[post._id || post.id] ? '#28a745' : 'white',
      color: showCommentSections[post._id || post.id] ? 'white' : '#28a745',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '16px',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}
  >
    💬 Comment
  </button>
  
  {/* SHARE BUTTON */}
  <button 
    onClick={() => {
      console.log('🟢 SHARE CLICKED!');
      handleShare(post._id || post.id);
    }}
    style={{
      padding: '10px 20px', 
      border: '2px solid #6c757d', 
      borderRadius: '8px',
      background: 'white',
      color: '#6c757d',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '16px',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}
  >
    🔗 Share
  </button>
</div>
              {/* ✅ NEW: Comment Section */}
              {showCommentSections[post._id || post.id] && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e8eaf0'
                }}>
                  {/* Comment Input */}
                  <div style={{display: 'flex', gap: '8px', marginBottom: '12px'}}>
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentTexts[post._id || post.id] || ''}
                      onChange={(e) => updateCommentText(post._id || post.id, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      onClick={() => handleComment(post._id || post.id)}
                      style={{
                        padding: '8px 16px',
                        background: '#366eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Post
                    </button>
                  </div>

                  {/* Comments List */}
                  <div style={{maxHeight: '200px', overflowY: 'auto'}}>
                    {post.comments?.map((comment, index) => (
                      <div key={index} style={{
                        padding: '8px 12px',
                        background: 'white',
                        borderRadius: '12px',
                        marginBottom: '8px',
                        border: '1px solid #e8eaf0'
                      }}>
                        <div style={{fontWeight: 'bold', fontSize: '14px'}}>
                          {comment.user?.name || 'Unknown User'}
                        </div>
                        <div style={{fontSize: '14px', color: '#333'}}>
                          {comment.text}
                        </div>
                        <div style={{fontSize: '12px', color: '#999', marginTop: '4px'}}>
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;