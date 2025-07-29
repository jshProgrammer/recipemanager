import React, { useState } from 'react';

const ShareModal = ({ isOpen, onClose, recipe, url }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    if (!isOpen) return null;

    const shareData = {
        title: recipe?.title || 'Recipe',
        text: `Check out this recipe: ${recipe?.title || 'Recipe'}`,
        url: url || window.location.href
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(url || window.location.href);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // Hide after 2 seconds
        } catch (error) {
            console.error('Failed to copy URL:', error);
            alert('Failed to copy URL. Please copy manually.');
        }
    };

    const handleShare = async (platform) => {
        const currentUrl = url || window.location.href;
        const title = recipe?.title || 'Recipe';
        
        let shareUrl = '';
        
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this recipe: ${title}`)}&url=${encodeURIComponent(currentUrl)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(`Check out this recipe: ${title} ${currentUrl}`)}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=${encodeURIComponent(`Recipe: ${title}`)}&body=${encodeURIComponent(`Check out this recipe: ${title}\n\n${currentUrl}`)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
                break;
            default:
                return;
        }
        
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="modal fade show d-block" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
            onClick={handleBackdropClick}
        >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Share Recipe</h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {recipe && (
                            <div className="text-center mb-4">
                                {recipe.imageURL && (
                                    <img 
                                        src={recipe.imageURL} 
                                        alt={recipe.title} 
                                        className="img-fluid rounded" 
                                        style={{ maxHeight: '120px', objectFit: 'cover' }}
                                    />
                                )}
                                <h6 className="mt-2 mb-0">{recipe.title}</h6>
                            </div>
                        )}
                        
                        <div className="d-grid gap-2 mb-3">
                            <button 
                                className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                                onClick={() => handleShare('facebook')}
                            >
                                <i className="bi bi-facebook me-2"></i>
                                Share on Facebook
                            </button>
                            
                            <button 
                                className="btn btn-outline-dark d-flex align-items-center justify-content-center"
                                onClick={() => handleShare('twitter')}
                            >
                                <i className="bi bi-twitter-x me-2"></i>
                                Share on Twitter
                            </button>
                            
                            <button 
                                className="btn btn-outline-success d-flex align-items-center justify-content-center"
                                onClick={() => handleShare('whatsapp')}
                            >
                                <i className="bi bi-whatsapp me-2"></i>
                                Share on WhatsApp
                            </button>
                            
                            <button 
                                className="btn btn-outline-info d-flex align-items-center justify-content-center"
                                onClick={() => handleShare('email')}
                            >
                                <i className="bi bi-envelope me-2"></i>
                                Share via Email
                            </button>
                            
                            <button 
                                className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                                onClick={() => handleShare('linkedin')}
                            >
                                <i className="bi bi-linkedin me-2"></i>
                                Share on LinkedIn
                            </button>
                        </div>
                        
                        <div className="d-grid">
                            <button 
                                className={`btn ${copySuccess ? 'btn-success' : 'btn-secondary'}`}
                                onClick={handleCopyUrl}
                                disabled={copySuccess}
                            >
                                <i className={`bi ${copySuccess ? 'bi-check-circle' : 'bi-link-45deg'} me-2`}></i>
                                {copySuccess ? 'Link Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal; 