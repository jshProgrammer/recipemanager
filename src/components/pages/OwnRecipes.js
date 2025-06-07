import CollectionList from "../lists/CollectionList";
import { useEffect, useState } from "react";

import {loadCollectionsOfUser} from '../../features/databaseStorage/collectionsStorage.js';
import AddNewCollectionPopup from "./AddNewCollectionPopup.js";
import LoadingIndicator from "../subcomponents/LoadingIndicator.js";

//TODO: always close navbar when clicking on sth
export default function OwnRecipes({user}) {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isNewCollectionMenuOpen, setIsNewCollectionMenuOpen] = useState(false);

    useEffect(() => {
        if (user?.uid) {
            setLoading(true);
            loadCollectionsOfUser(user.uid).then(data => {
                setCollections(Array.isArray(data) ? data : []);
                setLoading(false);
            });
        }
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
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="green mb-0 fw-bold mt-5" >Your personal recipes</h2>
                <button className="btn backgroundGreen d-flex align-items-center" onClick={(e) => {
                    e.preventDefault();
                    switchPopupVisibility();
                  }}>
                    <i className="bi bi-collection me-2"></i>
                    New collection
                </button>
            </div>
            <CollectionList collections={collections}/>

            <AddNewCollectionPopup user={user} isOpen={isNewCollectionMenuOpen} onClose={() => setIsNewCollectionMenuOpen(false)}/>
        </div>
    )
}