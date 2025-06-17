// all attributes are optional to use this interface for editing as well as creating a user's own personal recipes
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import {uploadImage} from '../../features/databaseStorage/imageStorage.js'
import {saveRecipe, updateRecipe, loadRecipeById} from '../../features/databaseStorage/recipeStorage.js'
import ImagePicker from "../subcomponents/ImagePicker.js";
import {loadCollectionsOfUser} from '../../features/databaseStorage/collectionsStorage.js'
import LoadingIndicator from "../subcomponents/LoadingIndicator.js";
import ErrorIndicator from "../subcomponents/ErrorIndicator.js";
import KeyValueTable from "../subcomponents/KeyValueTable.js";
import RecipeStep from "../subcomponents/RecipeStep.js";

export default function CreateEditOwnRecipe({user, collectionName, recipeID}) {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [time, setTime] = useState("");
    const [image, setImage] = useState(null);
    const [ingredients, setIngredients] = useState([{ key: "", value: "" }]);

    const defaultNutrition = [
        { key: "Calories", value: "" },
        { key: "Fat", value: "" },
        { key: "Protein", value: "" },
        { key: "Sugar", value: "" },
    ];
    const [nutrition, setNutrition] = useState(defaultNutrition);
    
    const [steps, setSteps] = useState([{ id: uuidv4(), description: "", imageURL: "" },]);

    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState(collectionName || "");

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const updateStep = (index, updatedStep) => {
        const newSteps = [...steps];
        newSteps[index] = { ...newSteps[index], ...updatedStep };
        setSteps(newSteps);
    };

    const removeStep = (idToRemove) => {
        const updatedSteps = steps.filter(step => step.id !== idToRemove);
        setSteps(updatedSteps);
    };

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
                    setSteps(
                        (recipe.steps || [{ description: "", imageURL: "" }]).map(step => ({
                            ...step,
                            id: uuidv4()
                        }))
                    );
                    setSelectedCollection(recipe.collection || collectionName || "");
                    setIngredients(recipe.ingredients || [{ key: "", value: "" }]);
                    setNutrition(recipe.nutrition || defaultNutrition);
                    
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
                { title, imageURL: finalImageURL, price, time, ingredients, nutrition, steps }, 
                selectedCollection === "" ? null : selectedCollection);
        } else {
            const transformedIngredients = ingredients.map(({ key, value }) => ({
                amount: key,
                name: value
                }));
            await saveRecipe(
                user.uid,
                { title, imageURL: finalImageURL, price, time, ingredients: transformedIngredients, nutrition, steps }, 
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
            <KeyValueTable rows={ingredients}
            headerLeft="Amount" 
            headerRight="Ingredients" 
            editable={true} 
            onChange={setIngredients}/>

            <h4 className="green">Nutritional Information</h4>
            <KeyValueTable rows={nutrition}
            editable={true} 
            onChange={setNutrition}/>

            <h4 className="green">Step-by-step guide</h4>
            {steps.map((step, i) => (
            <RecipeStep
                key={step.id}
                stepNumber={i + 1}
                description={step.description}
                imageURL={step.imageURL}
                editable={true}
                onChange={(updatedStep) => updateStep(i, updatedStep)}
                onRemove={() => removeStep(step.id)}
            />
            ))}
            <div className="mt-3">
                <div className="mb-2">
                    <button className="btn btn-sm btn-outline-success"
                    style={{ width: "fit-content" }}
                    onClick={() => setSteps([...steps, { id: uuidv4(), description: "", imageURL: "" }])}>
                    + Add Step
                    </button>
                </div>

                <button className="btn backgroundGreen w-100 mt-4" type="submit" onClick={() => saveCustomRecipeInDB()}>
                    {saving ? (
                        <div className="d-flex align-items-center">
                            <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                            Saving...
                        </div>
                    ) : (recipeID ? 'Update Recipe' : 'Save Recipe')}
                </button> 
            </div>       
        </div>
    )
}