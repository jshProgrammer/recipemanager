import CollectionList from "../lists/CollectionList";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {loadCollectionsOfUser} from '../../features/databaseStorage/ownCollectionsStorage.js';
import AddNewCollectionPopup from "./AddNewCollectionPopup.js";
import LoadingIndicator from "../subcomponents/LoadingIndicator.js";
import {useAuth} from "../../features/providers/AuthContext";

export default function OwnRecipes() {
    const { user } = useAuth();
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    const [collectionMessage, setCollectionMessage] = useState(null);
    const [collectionMessageType, setCollectionMessageType] = useState(null);

    const [isNewCollectionMenuOpen, setIsNewCollectionMenuOpen] = useState(false);

    const navigate = useNavigate();

    const fetchCollections = () => {
        if (user?.uid) {
            setLoading(true);
            loadCollectionsOfUser(user.uid).then(data => {
                setCollections(Array.isArray(data) ? data : []);
                setLoading(false);
            });
        }
    };

    useEffect(() => {
        fetchCollections();
    }, [user]);

    const switchPopupVisibility = () => {
        setIsNewCollectionMenuOpen(!isNewCollectionMenuOpen);
    };

     if (loading) {
        return (
            <LoadingIndicator heading="Your personal recipes"/>
        );
    }
    
    return (
        <div className="main-content">
            <div className="d-none d-sm-flex align-items-center justify-content-between mb-4">
                <h2 className="green mb-0 fw-bold mt-5" >Your personal recipes</h2>
                <div className="d-flex gap-4">
                <button className="btn backgroundGreen d-flex align-items-center" onClick={(e) => {
                    e.preventDefault();
                    navigate(`/own-recipes/create`)
                  }}>
                    <i className="bi bi-book me-2"></i>
                    New recipe
                </button>

                <button className="btn backgroundGreen d-flex align-items-center" onClick={(e) => {
                    e.preventDefault();
                    switchPopupVisibility();
                  }}>
                    <i className="bi bi-collection me-2"></i>
                    New collection
                </button>
                </div>
            </div>

            <div className="d-sm-none mb-4">
                <h2 className="green mb-3 fw-bold mt-5 text-center">Your personal recipes</h2>
                <div className="d-flex flex-column gap-3 align-items-center">
                    <button className="btn backgroundGreen d-flex align-items-center justify-content-center" style={{width: "300px"}} onClick={(e) => {
                        e.preventDefault();
                        navigate(`/own-recipes/create`)
                    }}>
                        <i className="bi bi-book me-2"></i>
                        New recipe
                    </button>

                    <button className="btn backgroundGreen d-flex align-items-center justify-content-center" style={{width: "300px"}} onClick={(e) => {
                        e.preventDefault();
                        switchPopupVisibility();
                    }}>
                        <i className="bi bi-collection me-2"></i>
                        New collection
                    </button>
                </div>
            </div>

            {collectionMessage && (
                <div className={`alert ${collectionMessageType === "success" ? "alert-success" : "alert-danger"} mt-2 w-100 text-center`} role="alert">
                {collectionMessage}
                </div>
            )}

            <CollectionList collections={collections} containsOwnRecipes={true}/>

            <AddNewCollectionPopup
            isOpen={isNewCollectionMenuOpen}
            isOwnRecipe={true}
            onClose={() => setIsNewCollectionMenuOpen(false)}
            setParentMessage={setCollectionMessage}
            setParentMessageType={setCollectionMessageType}
            reloadCollections={fetchCollections}/>
        </div>
    )
}