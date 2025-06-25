import React, {useState, useEffect} from "react";
import '../../styles/App.css'
import { useNavigate } from "react-router-dom";
import { deleteRecipe } from "../../features/databaseStorage/recipeStorage";
import {loadFavoriteCollectionsOfUser} from "../../features/databaseStorage/favoriteRecipesStorage";
import {useAuth} from "../../features/providers/AuthContext";
import { useFavorites } from "../../features/providers/FavoriteRecipesContext";

function RecipeCard({id, imageURL, title, time, tags=[], isEditable=false, estimatedPrice = null, collectionName = null}) {
    const { user } = useAuth();
    const { isFavorite, addToFavorites, removeFromFavorites, favoriteIds } = useFavorites();

    const hasImage = imageURL && imageURL !== null && imageURL !== "";
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [userCollections, setUserCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState(null);

    const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite(id.toString()));

    useEffect(() => {
        setLocalIsFavorite(isFavorite(id.toString()));
    }, [favoriteIds]);

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

    const handleHeartClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) return;

        try {
            if (isFavorite(id.toString())) {
                await removeFromFavorites(id.toString());
            } else {
                const collections = await loadFavoriteCollectionsOfUser(user.uid);
                setUserCollections(collections);
                setShowCollectionModal(true);
            }
        } catch (error) {
            console.error("Error handling favorite toggle:", error);
        }
    };

    const confirmAddToFavorites = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!selectedCollection) return;

        try {
            await addToFavorites(id.toString(), selectedCollection);
            setShowCollectionModal(false);
            setSelectedCollection(null);
        } catch (error) {
            console.error("Error adding to favorites:", error);
        }
    };

    const handleDeleteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDeleteConfirm(true);
    }

    const confirmDelete = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (isEditable && user != null) {
            setIsDeleting(true);
            try {
                await deleteRecipe(user.uid, id);
                navigate(`/collections/${encodeURIComponent(collectionName)}`, {
                    state: {
                        message: `Recipe ${title} deleted successfully from collection ${collectionName}`,
                        type: 'success'
                    }
                });
            } catch (error) {
                console.error("Error deleting recipe:", error);
                setIsDeleting(false);
            }
        }

        setShowDeleteConfirm(false);
    };

    const cancelDelete = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setShowDeleteConfirm(false);
    };
    return (
        <div className="card rounded-4 shadow-sm overflow-hidden recipe-card position-relative"
             onClick={() => navigate(
                 isEditable
                     ? `/collections/${encodeURIComponent(collectionName)}/${encodeURIComponent(id)}`
                     : `/recipes/${encodeURIComponent(id)}`)}>
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
                        <i className={localIsFavorite ? "bi bi-heart-fill green" : "bi bi-heart"}
                        style={{ fontSize: "1.2rem", fontWeight: "bold", WebkitTextStroke: "1px" }}></i>
                    </div>

                    {isEditable && (
                    <div className="bg-white rounded-circle p-1 shadow-sm d-flex align-items-center justify-content-center"
                        style={{ width: "36px", height: "36px", padding: 0 }}>
                        <i className="bi bi-trash"
                        style={{ fontSize: "1.2rem", fontWeight: "bold", WebkitTextStroke: "1px" }}
                        onClick={handleDeleteClick}></i>
                    </div>)}
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
            {/* TODO: think about extracting confirm dialog */}
            {showDeleteConfirm && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Delete Recipe</h5>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete "<strong>{title}</strong>"?</p>
                                <p className="text-muted small">This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button"
                                    className="btn btn-secondary"
                                    onClick={cancelDelete}
                                    disabled={isDeleting}>
                                    Cancel
                                </button>
                                <button type="button"
                                    className="btn btn-danger"
                                    onClick={confirmDelete}
                                    disabled={isDeleting}>
                                    {isDeleting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete Recipe'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showCollectionModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={(e) => e.stopPropagation()}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Select a Collection</h5>
                            </div>
                            <div className="modal-body">
                                {userCollections.length === 0 ? (
                                    <p>No collections found. Please create one first.</p>
                                ) : (
                                    <select className="form-select"
                                            onChange={(e) => setSelectedCollection(JSON.parse(e.target.value))}
                                            onClick={(e) => e.stopPropagation()} >
                                        <option value="">Choose collection</option>
                                        {userCollections.map((coll) => (
                                            <option key={coll.id} value={JSON.stringify(coll)}>{coll.collectionName}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowCollectionModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn backgroundGreen" disabled={!selectedCollection} onClick={confirmAddToFavorites}>
                                    Add to Collection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
    }

export default RecipeCard;