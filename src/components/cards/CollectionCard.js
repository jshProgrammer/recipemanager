import { showImageFromUrl } from "../../features/databaseStorage/imageStorage";

//TODO: h5 wird noch unschön angezeigt (card-img-top)

export default function CollectionCard({imageURL, collectionName}) {
return (
    <div className="card rounded-4 shadow-sm overflow-hidden collection-card">
        <div className="position-relative" style={{ height: 200 }}>
        
            <div className="card-img-top" style={{ width: "100%"}}>
            {showImageFromUrl(imageURL, "100%")}
            </div>
                    
            <div className="card-body d-flex align-items-end justify-content-center p-2"
            style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 3,
                    background: "rgba(255,255,255,0.95)",
                    
                }}>
                <h5 className="card-title fw-bold mb-0 w-100 text-center">{collectionName}</h5>
            </div>
        </div>        
    </div>
    );
}