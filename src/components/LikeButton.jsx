import React from 'react';
import { useState, useEffect } from 'react';

const LikeButton = ({ postId, likes, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    setLikeCount(likes.length);
    
    // Check if current user liked this post
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userLiked = likes.some(like => 
      like.user?._id === user._id || like.user?.name === user.name
    );
    setIsLiked(userLiked);
  }, [likes]);

  const handleLike = () => {
    onLike(postId);
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <button 
      onClick={handleLike}
      style={{
        padding: '8px 16px', 
        border: '1px solid #ddd', 
        borderRadius: '6px',
        background: isLiked ? '#e3f2fd' : 'white',
        color: isLiked ? '#1976d2' : 'inherit',
        cursor: 'pointer',
        fontWeight: isLiked ? 'bold' : 'normal',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}
    >
      {isLiked ? '❤️' : '👍'} Like {likeCount > 0 && `(${likeCount})`}
    </button>
  );
};

export default LikeButton;