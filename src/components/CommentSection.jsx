import React, { useState } from 'react';

const CommentSection = ({ postId, comments, onAddComment }) => {
  const [commentText, setCommentText] = useState('');

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  return (
    <div style={{
      marginTop: '12px',
      padding: '12px',
      background: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e8eaf0'
    }}>
      {/* Comment Input */}
      <form onSubmit={handleSubmit} style={{display: 'flex', gap: '8px', marginBottom: '12px'}}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '20px',
            fontSize: '14px'
          }}
        />
        <button
          type="submit"
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
      </form>

      {/* Comments List */}
      <div style={{maxHeight: '200px', overflowY: 'auto'}}>
        {comments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#999',
            fontSize: '14px'
          }}>
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment, index) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;