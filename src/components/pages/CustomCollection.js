import RecipeList from "../lists/RecipeList";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadRecipesOfCollection } from "../../features/databaseStorage/collectionsStorage";
import LoadingIndicator from "../subcomponents/LoadingIndicator";

const CustomCollection = ({user, collectionName}) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            const data = await loadRecipesOfCollection({userID: user.uid, collectionName: collectionName});
            setRecipes(data);
            setLoading(false);
        };
        fetchRecipes();
    }, [user, collectionName]);

    if (loading) {
        return (
            <LoadingIndicator heading={collectionName}/>
        );
    }

    //TODO: RecipeCard should have optional option to edit recipe for custom ones
    //TODO: CreateEditOwnRecipe should display in which collection
    //TODO: update storing recipe with connection to collection
    //TODO: show error/success message when storing recipe and navigate back
    return (
        <div className="main-content">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="green mb-0 fw-bold mt-5" >Your personal recipes</h2>
                <button className="btn backgroundGreen d-flex align-items-center" onClick={() => {
                    navigate(`/collections/${encodeURIComponent(collectionName)}/create`)
                }}>
                    <i className="bi bi-book me-2"></i>
                    New recipe
                </button>
            </div>

            <h2 className="green">{collectionName}</h2>
            <RecipeList recipes={recipes} />
        </div>
    );
}

export default CustomCollection;