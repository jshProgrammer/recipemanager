import { showImageFromUrl } from "../../features/databaseStorage/imageStorage";

export default function CollectionCard({imageURL, collectionName}) {
return (
    <div className="card rounded-4 shadow-sm overflow-hidden collection-card">
        <div className="position-relative">
            <div className="card-img-top" style={{ width: "100%", height: "100%" }}>
                {showImageFromUrl(imageURL, "100%")}
            </div>   
                    
            <div className="card-body p-4"
            style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 3,
                    background: "rgba(255,255,255,0.95)",
                }}>
                <h5 className="card-title fw-bold mb-0 text-center">{collectionName}</h5>
            </div>
        </div>        
    </div>
    );
}