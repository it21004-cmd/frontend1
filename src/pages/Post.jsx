import React, { useState } from 'react';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';
import ShareButton from './ShareButton';

const Post = ({ post, onLike, onComment, onShare }) => {
  const [showCommentSection, setShowCommentSection] = useState(false);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  const handleCommentClick = () => {
    setShowCommentSection(!showCommentSection);
  };

  const handleAddComment = (commentText) => {
    onComment(post._id, commentText);
  };

  return (
    <div style={{
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

      {/* Like, Comment, Share Counts */}
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

      {/* Actions */}
      <div style={{
        marginTop:12,
        display:"flex",
        gap:15,
        alignItems:"center",
        borderTop: '1px solid #e8eaf0',
        paddingTop: '12px'
      }}>
        <LikeButton 
          postId={post._id || post.id}
          likes={post.likes || []}
          onLike={onLike}
        />
        
        <button 
          onClick={handleCommentClick}
          style={{
            padding: '8px 16px', 
            border: '1px solid #ddd', 
            borderRadius: '6px',
            background: showCommentSection ? '#e8f5e8' : 'white',
            cursor: 'pointer'
          }}
        >
          💬 Comment
        </button>
        
        <ShareButton 
          postId={post._id || post.id}
          onShare={onShare}
        />
      </div>

      {/* Comment Section */}
      {showCommentSection && (
        <CommentSection 
          postId={post._id || post.id}
          comments={post.comments || []}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
};

export default Post;