export default function Collection({imageUrl, title}) {
return (
    <div className="card rounded-4 shadow-sm overflow-hidden recipe-card">
        <div className="position-relative">
            <img src={imageUrl} className="card-img-top" alt={title} />
            
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
        </div>
        </div>        
    </div>
    );
}