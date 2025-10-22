import React from 'react';

const ShareButton = ({ postId, onShare }) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this post!',
          text: 'I found this interesting post...',
          url: `${window.location.origin}/post/${postId}`,
        });
      } else {
        // Fallback: copy to clipboard
        const postUrl = `${window.location.origin}/post/${postId}`;
        await navigator.clipboard.writeText(postUrl);
        alert('Post link copied to clipboard!');
      }
      onShare(postId);
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <button 
      onClick={handleShare}
      style={{
        padding: '8px 16px', 
        border: '1px solid #ddd', 
        borderRadius: '6px',
        background: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}
    >
      🔗 Share
    </button>
  );
};

export default ShareButton;