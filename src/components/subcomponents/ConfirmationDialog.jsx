import React from 'react';

function ConfirmationDialog({
    show,
    title,
    message,
    subMessage,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonClass = 'btn-danger',
    isLoading = false,
    loadingText = 'Processing...'
    }) {
    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                        {subMessage && <p className="text-muted small">{subMessage}</p>}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={isLoading}>
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            className={`btn ${confirmButtonClass}`}
                            onClick={onConfirm}
                            disabled={isLoading}>
                            {isLoading ? (
                                <div>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    {loadingText}
                                </div>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationDialog;