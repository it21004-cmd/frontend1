import React, { useState, useEffect } from 'react';

// ✅ BACKEND URL CHANGE - Render deployment
const API_BASE_URL = 'https://backend1-4sym.onrender.com';

export default function AccountPage() {
  // Profile States with localStorage default - FIXED: Remove default values
  const [cover, setCover] = useState(localStorage.getItem('coverPic') || '');
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || '');
  const [name, setName] = useState(localStorage.getItem('profileName') || '');
  const [dob, setDob] = useState(localStorage.getItem('profileDob') || '');
  const [gender, setGender] = useState(localStorage.getItem('profileGender') || '');
  const [bio, setBio] = useState(localStorage.getItem('profileBio') || '');
  const [toast, setToast] = useState('');
  const [editMode, setEditMode] = useState(false);

  // ✅ UPDATED: Real posts from backend
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Load user's posts from backend - UPDATED URL
  const loadUserPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
      const response = await fetch(`${API_BASE_URL}/api/posts/my-posts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const posts = await response.json();
        setUserPosts(posts);
      } else {
        console.error('Failed to load user posts');
      }
    } catch (error) {
      console.error('Error loading user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load posts when component mounts AND when posts are updated
  useEffect(() => {
    loadUserPosts();

    // ✅ Listen for post updates from Home page
    const handlePostsUpdated = () => {
      loadUserPosts();
    };

    window.addEventListener('postsUpdated', handlePostsUpdated);
    
    return () => {
      window.removeEventListener('postsUpdated', handlePostsUpdated);
    };
  }, []);

  // ✅ FIXED: Clear existing data when component mounts
  useEffect(() => {
    // Clear localStorage if you want fresh start
    // localStorage.removeItem('profileDob');
    // localStorage.removeItem('profileGender'); 
    // localStorage.removeItem('profileBio');
  }, []);

  function handleCoverChange(e) {
    const file = e.target.files[0];
    if (file && file.size < 5 * 1024 * 1024) {
      const url = URL.createObjectURL(file);
      setCover(url);
      localStorage.setItem('coverPic', url);
      setToast('Cover photo updated!');
    } else {
      setToast('File size too large!');
    }
  }

  function handleProfilePicChange(e) {
    const file = e.target.files[0];
    if (file && file.size < 5 * 1024 * 1024) {
      const url = URL.createObjectURL(file);
      setProfilePic(url);
      localStorage.setItem('profilePic', url);
      setToast('Profile photo updated!');
    } else {
      setToast('File size too large!');
    }
  }

  const handleSaveProfile = async () => {
    try {
      localStorage.setItem('profileName', name);
      localStorage.setItem('profileDob', dob);
      localStorage.setItem('profileGender', gender);
      localStorage.setItem('profileBio', bio);

      const token = localStorage.getItem('authToken');
      
      if (token) {
        // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
        const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name, dob, gender, bio })
        });

        if (!response.ok) throw new Error('Failed to update profile');
      }

      setEditMode(false);
      setToast('Profile updated!');
    } catch (error) {
      setToast(error.message || 'Something went wrong');
    }
  };

  // ❌ REMOVED: handleImageUpload function (was unused)

  React.useEffect(() => {
    if(toast) {
      const t = setTimeout(()=>setToast(''),2000);
      return ()=>clearTimeout(t);
    }
  }, [toast]);

  return (
    <div>
      {/* Cover Section - WITH BORDER */}
      <div style={{
        background: cover
          ? `url(${cover}) center/cover no-repeat`
          : "linear-gradient(90deg,#2256c2 60%,#5795f3 100%)",
        height: 250, 
        width: '100%',
        border: '3px solid #e0e0e0', // ✅ Border added
        borderBottom: 'none',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        position: 'relative',
        marginBottom: '0' // ✅ No margin between cover and profile
      }}>
        {/* Cover camera button */}
        <label style={{
          position: "absolute", 
          top: 20, 
          right: 20, 
          zIndex: 3, 
          background: 'rgba(255,255,255,0.9)',
          color: '#333',
          padding: '8px 16px', 
          borderRadius: 20, 
          cursor: "pointer", 
          fontWeight: 600,
          fontSize: '14px',
          border: '1px solid #ddd'
        }}>
          <span role="img" aria-label="camera">📷</span> Change Cover
          <input type="file" style={{display: 'none'}} accept="image/*" onChange={handleCoverChange}/>
        </label>
      </div>

      {/* Profile Section - WITH BORDER and connected to cover */}
      <div style={{
        background: '#fff',
        border: '3px solid #e0e0e0', // ✅ Same border as cover
        borderTop: 'none', // ✅ Connected to cover
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        padding: '30px 20px 20px 20px',
        marginBottom: '40px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '30px',
          padding: '0 10px'
        }}>
          {/* Profile Photo Area - WITH SEPARATE BORDER */}
          <div style={{
            position: 'relative',
            flexShrink: 0,
            border: '2px solid #007bff', // ✅ Blue border for profile area
            borderRadius: '12px',
            padding: '15px',
            background: '#f8f9fa'
          }}>
            {/* ✅ FIXED: Simplified alt text */}
            <img 
              src={profilePic || "http://ui-avatars.com/api/?name=Profile"} 
              alt={`${name}'s profile`}
              style={{
                width: 120, 
                height: 120, 
                borderRadius: "50%", 
                border: "4px solid #fff",
                objectFit: "cover", 
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}
            />
            <label style={{
              position: "absolute", 
              bottom: 10, 
              right: 10, 
              background: '#fff', 
              borderRadius: '50%',
              padding: 6, 
              cursor: 'pointer', 
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)", 
              border: '1px solid #ddd'
            }}>
              <span role="img" aria-label="edit">✏️</span>
              <input type="file" accept="image/*" style={{display: 'none'}} onChange={handleProfilePicChange} />
            </label>
            <div style={{
              textAlign: 'center',
              marginTop: '10px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#007bff'
            }}>
              Profile Photo
            </div>
          </div>

          {/* Profile Info Area */}
          <div style={{flex: 1}}>
            {editMode ? (
              // Edit Mode: Inputs
              <div style={{maxWidth: '400px'}}>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    fontSize: '24px', 
                    padding: '8px', 
                    marginBottom: 10, 
                    width: '100%',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}
                  aria-label="Edit name"
                />
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  style={{
                    marginBottom: 10, 
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}
                  aria-label="Choose your Date of Birth"
                />
                <select 
                  value={gender} 
                  onChange={e => setGender(e.target.value)} 
                  style={{
                    marginBottom: 10, 
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}
                >
                  <option value="">Select Gender</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
                <input
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Short bio"
                  maxLength={46}
                  style={{
                    marginBottom: 10, 
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}
                  aria-label="Edit bio"
                />
                <div style={{display: 'flex', gap: '10px'}}>
                  <button 
                    onClick={handleSaveProfile} 
                    style={{
                      padding: '8px 16px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setEditMode(false)}
                    style={{
                      padding: '8px 16px',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // ✅ FIXED: View Mode - Show empty state for empty fields
              <div style={{maxWidth: '400px'}}>
                <h2 style={{margin: '0 0 10px 0', fontSize: '28px', color: '#333'}}>
                  {name || 'Your Name'}
                </h2>
                
                {/* ✅ FIXED: Conditional rendering for empty fields */}
                <p style={{margin: '5px 0', fontSize: '16px', color: '#555'}}>
                  <strong>DOB:</strong> {dob ? dob : <span style={{color: '#999', fontStyle: 'italic'}}>Not set</span>}
                </p>
                
                <p style={{margin: '5px 0', fontSize: '16px', color: '#555'}}>
                  <strong>Gender:</strong> {gender ? gender : <span style={{color: '#999', fontStyle: 'italic'}}>Not specified</span>}
                </p>
                
                <p style={{margin: '5px 0 15px 0', fontSize: '16px', color: '#555'}}>
                  <strong>Bio:</strong> {bio ? bio : <span style={{color: '#999', fontStyle: 'italic'}}>No bio added yet</span>}
                </p>
                
                <button 
                  onClick={() => setEditMode(true)}
                  style={{
                    padding: '8px 16px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Edit Profile
                </button>
              </div>
            )}

            <div style={{margin: '18px 0 4px 0', display: 'flex', gap: 10}}>
              <button style={{
                padding: '6px 12px',
                background: '#f8f9fa',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>Settings</button>
              <button style={{
                padding: '6px 12px',
                background: '#f8f9fa',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>Copy Profile Link</button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{
          position: "fixed", 
          top: 17, 
          right: 40, 
          zIndex: 202,
          background: "#f6fff9", 
          color: "#324", 
          padding: "9px 20px",
          borderRadius: 16,
          fontWeight: 600, 
          boxShadow: "0 2px 9px rgba(0,0,0,0.1)"
        }}>{toast}</div>
      )}

      {/* ✅ UPDATED: Post section with real data */}
      <div style={{paddingTop: 20}}>
        <UserPosts userPosts={userPosts} loading={loading} onPostsUpdate={loadUserPosts} />
      </div>
    </div>
  );
}

// UserPosts component remains the same...
function UserPosts({ userPosts, loading, onPostsUpdate }) {
  const [editId, setEditId] = React.useState(null);
  const [editData, setEditData] = React.useState({ text: "" });
  const [toast, setToast] = React.useState('');

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  function startEdit(post) {
    setEditId(post._id);
    setEditData({ text: post.text });
  }

  async function saveEdit() {
    try {
      const token = localStorage.getItem('authToken');
      // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
      const response = await fetch(`${API_BASE_URL}/api/posts/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: editData.text })
      });

      if (response.ok) {
        setToast("Post updated!");
        onPostsUpdate();
      } else {
        setToast("Failed to update post");
      }
    } catch (error) {
      setToast("Error updating post");
    }
    
    setEditId(null);
    setEditData({ text: "" });
  }

  function cancelEdit() { 
    setEditId(null); 
    setEditData({ text: "" }); 
  }

  async function deletePost(id) {
    if(window.confirm("Are you sure?")) {
      try {
        const token = localStorage.getItem('authToken');
        // ✅ CHANGED: http://localhost:5000 → https://backend1-4sym.onrender.com
        const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setToast("Post deleted!");
          onPostsUpdate();
        } else {
          setToast("Failed to delete post");
        }
      } catch (error) {
        setToast("Error deleting post");
      }
    }
  }

  React.useEffect(() => {
    if(toast) { 
      const t = setTimeout(()=>setToast(""),2000); 
      return ()=>clearTimeout(t);
    }
  }, [toast]);

  const [page, setPage] = React.useState(1);
  const perPage = 2;
  const paginated = userPosts.slice(0, page*perPage);

  if (loading) {
    return (
      <div style={{
        marginTop: 40, 
        padding: '1.2em',
        background: '#f9fbff', 
        borderRadius: 10, 
        boxShadow: "0 1px 10px rgba(0,0,0,0.1)",
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{marginBottom: 16, fontWeight: 700}}>Your Posts</h3>
        <div>Loading your posts...</div>
      </div>
    );
  }

  return (
    <div style={{
      marginTop: 40, 
      padding: '1.2em',
      background: '#f9fbff', 
      borderRadius: 10, 
      boxShadow: "0 1px 10px rgba(0,0,0,0.1)",
      border: '1px solid #e0e0e0'
    }}>
      <h3 style={{marginBottom: 16, fontWeight: 700}}>Your Posts ({userPosts.length})</h3>
      {paginated.length === 0 && <div>No posts yet. Create your first post from the Home page!</div>}
      <ul style={{listStyle: 'none', padding: 0}}>
        {paginated.map(post => (
          <li key={post._id} style={{margin: "1em 0", padding: "16px", borderBottom: '1px solid #e2ecfd'}}>
            {editId === post._id
              ? <>
                  <textarea 
                    value={editData.text} 
                    onChange={e=>setEditData({...editData, text:e.target.value})} 
                    style={{width: '92%', marginTop: 5, minHeight: '80px', padding: '8px'}} 
                  />
                  <br/>
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={cancelEdit} style={{marginLeft: 7}}>Cancel</button>
                </>
              : <>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div>
                      <div style={{fontSize: 15, color: "#676976", margin: "6px 0"}}>{post.text}</div>
                      <span style={{fontSize: 13, color: "#359"}}>⏰ {formatDate(post.createdAt)}</span>
                      <div style={{
                        display: 'inline-block',
                        padding: '2px 6px',
                        background: '#e4f4ff',
                        color: '#366eea',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        marginLeft: '8px'
                      }}>
                        {post.postType?.toUpperCase() || 'TEXT'}
                      </div>
                    </div>
                    <div>
                      <button aria-label="Edit" onClick={()=>startEdit(post)} title="Edit post">✏️</button>
                      <button aria-label="Delete" onClick={()=>deletePost(post._id)} title="Delete post" style={{marginLeft: 7}}>🗑️</button>
                    </div>
                  </div>
                  
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt="post" 
                      style={{
                        maxWidth: '200px',
                        borderRadius: '8px',
                        marginTop: '8px',
                        border: '1px solid #e8eaf0'
                      }} 
                    />
                  )}
                  
                  {post.file && post.file.url && (
                    <div style={{
                      background: '#f5f7fe', 
                      borderRadius: 8, 
                      padding: '8px 12px', 
                      marginTop: '8px',
                      fontSize: 14, 
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #e8eaf0'
                    }}>
                      <span role="img" aria-label="file" style={{fontSize: 20, marginRight: 8}}>📄</span>
                      <div>
                        <div style={{fontWeight: 'bold'}}>{post.file.name}</div>
                        <a 
                          href={post.file.url} 
                          download={post.file.name} 
                          style={{
                            color: '#1d41b8',
                            textDecoration: "underline",
                            fontSize: '12px'
                          }}
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  )}
                </>
            }
          </li>
        ))}
      </ul>
      {paginated.length < userPosts.length &&
        <button onClick={()=>setPage(page+1)} style={{marginTop: 10}}>Load more</button>
      }
      {toast && <div style={{marginTop: 14, background: '#eaffee', color: '#183c2f', padding: '7px 20px',
        borderRadius: 10, fontWeight: 600, display: 'inline-block'}}>{toast}</div>}
    </div>
  );
}
