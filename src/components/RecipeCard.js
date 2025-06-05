import React from "react";
import '../styles/App.css'

function RecipeCard({ imageUrl, title, time, tags }) {
   
return (
    <div className="card rounded-4 shadow-sm overflow-hidden recipe-card">
        <div className="position-relative">
            <img src={imageUrl} className="card-img-top" alt={title} />
            <div className="position-absolute top-0 end-0 m-2 bg-white rounded-circle p-1 shadow-sm d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", padding: 0 }}>
            <i className="bi bi-heart" style={{ fontSize: "1.2rem", fontWeight: "bold", WebkitTextStroke: "1px" }}></i>
            </div>

            <div className="card-body"
            style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 3,
                    background: "rgba(255,255,255,0.95)",
                }}>
            <h5 className="card-title fw-bold">{title}</h5>
            <div className="d-flex align-items-center text-muted mb-2">
                <i className="bi bi-clock me-2 green"></i>
                <span>{time}</span>
            </div>
            <div className="d-flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                <span key={index} className="badge border borderGreen text-black">
                {tag}
                </span>
                ))}
            </div>
        </div>
        </div>

        
    </div>
    );
}

export default RecipeCard;