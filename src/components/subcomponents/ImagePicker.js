import { useState, useRef } from "react";
import {showImageFromUrl} from '../../features/databaseStorage/imageStorage.js';

export default function ImagePicker({ 
  image, 
  onImageChange
}) {

    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onImageChange?.(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file');
        }
    };
    
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        onImageChange?.("");
        if (fileInputRef.current) {
        fileInputRef.current.value = "";
        }
    };

    const handleChangeImage = (e) => {
        e.stopPropagation();
        openFileDialog();
    };

    return (
        <div>
            <input ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}/>

            <div className={`col-md-5 card rounded-4 shadow-sm overflow-hidden d-flex flex-column align-items-center justify-content-center text-center position-relative ${
                        isDragOver ? 'border-success border-3' : 'border-light'}`}
                    style={{ 
                        aspectRatio: '1/1', 
                        width: "300px", 
                        cursor: image ? 'default' : 'pointer',
                        backgroundColor: isDragOver ? '#f8f9fa' : 'white',
                        transition: 'all 0.3s ease'
                    }}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={!image ? openFileDialog : undefined}>
                {!image  ? (
                    <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100 p-3">
                        <i className="bi bi-image" style={{ fontSize: "3rem", color: "#ccc" }}></i>
                        <p className="mb-2 text-muted">
                            {isDragOver ? 'Leave the image here' : 'Drag your photo here'}
                        </p>
                        <p className="text-muted small">or click to Select</p>
                    </div>
                ) : (
                    <div>
                        {/*displaying image depends on where it is stored (cloudinary or local pc)*/}
                        {image.startsWith("data:") ? (
                        <img
                            src={image}
                            alt="Preview"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        ) : (
                        showImageFromUrl(image)
                        )}
                        <div className="position-absolute top-0 end-0 p-2">
                            <button className="btn btn-sm btn-secondary me-1"
                                onClick={handleChangeImage}
                                title="Change image">
                                <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-danger"
                                onClick={handleRemoveImage}
                                title="Remove image">
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}