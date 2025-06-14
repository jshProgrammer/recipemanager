import React from "react";
import '../../styles/App.css'
import { useNavigate } from "react-router-dom";

//TODO: take away default tag value => just for debugging
function RecipeCard({id, imageURL, title, time, tags=["veggie"], isEditable=false, estimatedPrice = null, collectionName = null, user = null }) {
    const hasImage = imageURL && imageURL !== null && imageURL !== "";
    const navigate = useNavigate();

    const handleEditClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isEditable && collectionName != null) {
            navigate(`/collections/${encodeURIComponent(collectionName)}/edit/${encodeURIComponent(id)}`);
        }
        else if(isEditable) {
            navigate(`/own-recipes/edit/${encodeURIComponent(id)}`);
        }
    };

    const handleHeartClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // TODO: Implement favorite functionality
        console.log("Heart clicked for recipe:", title);
    };
    
    return (
        <div className="card rounded-4 shadow-sm overflow-hidden recipe-card position-relative">
                {hasImage ? (
                <div 
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                        backgroundImage: `url(${imageURL})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 1
                    }}
                />) : (
                
                 <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light"
                    style={{
                        backgroundColor: "#f8f9fa",
                        border: "2px dashed #dee2e6",
                        zIndex: 1
                    }}>
                    <div className="text-center text-muted">
                        <i className="bi bi-image" style={{ fontSize: "3rem" }}></i>
                    <div className="mt-2 small">No Image</div>
                    </div>
                </div>
                )}
                

                <div className="position-absolute top-0 end-0 m-2 d-flex gap-2" style={{zIndex: 4}}>
                    {isEditable && (
                    <div className="bg-white rounded-circle p-1 shadow-sm d-flex align-items-center justify-content-center"
                        style={{ width: "36px", height: "36px", padding: 0 }} onClick={handleEditClick} >
                        <i className="bi bi-pencil" style={{ fontSize: "1.2rem", fontWeight: "bold", WebkitTextStroke: "1px" }}></i>
                    </div>)}
                    
                    <div className="bg-white rounded-circle p-1 shadow-sm d-flex align-items-center justify-content-center"
                        style={{ width: "36px", height: "36px", padding: 0 }} onClick={handleHeartClick}>
                        <i className="bi bi-heart" style={{ fontSize: "1.2rem", fontWeight: "bold", WebkitTextStroke: "1px" }}></i>
                    </div>
                </div>

                <div className="position-absolute bottom-0 start-0 end-0 card-body"
                style={{
                    zIndex: 3,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    borderTop: "1px solid rgba(255, 255, 255, 0.2)"
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
    );
    }

export default RecipeCard;