// all attributes are optional to use this interface for editing as well as creating a user's own personal recipes
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {uploadImage} from '../../features/databaseStorage/imageStorage.js'
import {saveRecipe, updateRecipe, loadRecipeById} from '../../features/databaseStorage/recipeStorage.js'
import ImagePicker from "../subcomponents/ImagePicker.js";
import {loadCollectionsOfUser} from '../../features/databaseStorage/collectionsStorage.js'
import LoadingIndicator from "../subcomponents/LoadingIndicator.js";
import ErrorIndicator from "../subcomponents/ErrorIndicator.js";

export default function CreateEditOwnRecipe({user, collectionName, recipeID}) {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [time, setTime] = useState("");
    const [image, setImage] = useState(null);

    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState(collectionName || "");

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (recipeID && user?.uid) {
            const fetchRecipe = async () => {
                try {
                    setLoading(true);
                    const recipe = await loadRecipeById(user.uid, recipeID);
                    
                    setTitle(recipe.title || "");
                    setPrice(recipe.price || "");
                    setTime(recipe.time || "");
                    setImage(recipe.imageURL || null);
                    setSelectedCollection(recipe.collection || collectionName || "");
                    
                    setError(null);
                } catch (err) {
                    console.error('Error fetching recipe:', err);
                    setError('Failed to load recipe data');
                } finally {
                    setLoading(false);
                }
            };
            fetchRecipe();
        }
    }, [recipeID, user?.uid, collectionName]);

    useEffect(() => {
        if (user?.uid) {
            loadCollectionsOfUser(user.uid).then(data => {
                setCollections(Array.isArray(data) ? data : []);
            });
        }
    }, [user, collectionName]);
    
    const saveCustomRecipeInDB = async () => {
        setSaving(true);
        let finalImageURL = image;
            
        if (image && typeof image !== 'string') {
            finalImageURL = await uploadImage(image);
        }

        if(recipeID != null) {
            await updateRecipe(recipeID, 
                user.uid,
                { title, imageURL: finalImageURL, price, time }, 
                selectedCollection === "" ? null : selectedCollection);
        } else {
            await saveRecipe(
                user.uid,
                { title, imageURL: finalImageURL, price, time }, 
                selectedCollection === "" ? null : selectedCollection);
        }

        if (selectedCollection) {
            navigate(`/collections/${encodeURIComponent(selectedCollection)}`, {
                state: { 
                    message: `Recipe "${title}" was saved successfully!`,
                    type: 'success'
                }
            });
        } else {
            navigate('/ownRecipes', {
                state: { 
                    message: `Recipe "${title}" was saved successfully!`,
                    type: 'success'
                }
            });
        }
        setSaving(false);
    }   

     if (loading) {
        return <LoadingIndicator />;
    }

    if (error) {
        return <ErrorIndicator error={error}/>;
    }

    return (
        <div className="main-content">
            <h2 className="green mb-0 fw-bold mt-5">{recipeID ? 'Edit your recipe' : 'Create your own recipe'}</h2>

            <div className="row">

                <div className="col-md-5">
                    <ImagePicker image={image} onImageChange={setImage}/>
                </div>

                <div className="col-md-1"/>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="collectionSelect" className="form-label green fw-bold">Collection</label>
                        <select
                            id="collectionSelect"
                            className="form-select"
                            value={selectedCollection}
                            onChange={e => setSelectedCollection(e.target.value)}>
                            <option value="">None</option>
                            {collections.map(col => (
                                <option key={col.collectionName} value={col.collectionName}>
                                    {col.collectionName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="recipeName" className="form-label green fw-bold">Recipe name</label>
                        <input type="text"
                            className="form-control"
                            id="recipeName"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Enter your recipe's name"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="estimatedPrice" className="form-label green fw-bold">Estimated cost (€)</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-currency-euro"></i>
                            </span>
                            <input type="number"
                                className="form-control"
                                id="estimatedPrice"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                placeholder="0.00€"
                                step="0.01"
                                min="0"/>
                            </div>
                        </div>
                    <div className="mb-3">
                        <label htmlFor="estimatedTime" className="form-label green fw-bold">Estimated time (Min)</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-clock"></i>
                            </span>
                            <input type="number"
                                className="form-control"
                                id="estimatedTime"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                placeholder="30min"
                                min="1"/>
                        </div>
                    </div>
                </div>
            </div>

            <h4 className="green">Ingredients</h4>
            {/*TODO: ADD!!*/}
            <h4 className="green">Nutritional Information</h4>
            {/*TODO: use table-component by Sebastian */}
            <h4 className="green">Step-by-step guide</h4>
            {/*TODO: use RecipeStep-component by Sebastian */}

            <button className="btn backgroundGreen" type="submit" onClick={() => saveCustomRecipeInDB()}>
                {saving ? (
                    <div className="d-flex align-items-center">
                        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                        Saving...
                    </div>
                ) : (recipeID ? 'Update Recipe' : 'Save Recipe')}
            </button>        
        </div>
    )
}