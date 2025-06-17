import RecipeList from "../lists/RecipeList";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadRecipesOfCollection } from "../../features/databaseStorage/collectionsStorage";
import LoadingIndicator from "../subcomponents/LoadingIndicator";
import ErrorIndicator from "../subcomponents/ErrorIndicator";

const CustomCollection = ({user, collectionName}) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const navigate = useNavigate(); 
    const location = useLocation();

    const fetchRecipes = async () => {
        setLoading(true);
        const data = await loadRecipesOfCollection({userID: user.uid, collectionName: collectionName});
        console.log(data);
        setRecipes(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchRecipes();
    }, [user, collectionName]);

    useEffect(() => {
        if (location.state?.message) {
        setMessage({
            text: location.state.message,
            type: location.state.type || 'info'
        });
        
        const timer = setTimeout(() => {
            setMessage(null);
        }, 5000);

        if (location.state.type === 'success') {
            fetchRecipes();
        }

        window.history.replaceState({}, document.title);
        
        return () => clearTimeout(timer);
        }
    }, [location.state]);

    if (loading) {
        return (
            <LoadingIndicator heading={"Your personal recipes"}/>
        );
    }

    if (error) {
        return <ErrorIndicator error={error}/>;
    }

    return (
        <div className="main-content">
            {message && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'info'} alert-dismissible fade show d-flex align-items-center`} role="alert">
                <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-info-circle'} me-2`}></i>
                {message.text}
                    <button type="button" className="btn-close" 
                        onClick={() => setMessage(null)} aria-label="Close"></button>
                </div>
            )}

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
            {recipes && recipes.length > 0 ? (
                <RecipeList recipes={recipes} collectionName={collectionName} isOwnRecipe="true" user={user} />)
                : <p>This collection is empty yet. Just create a new recipe and you are ready to go :)</p>
            }
        </div>
    );
}

export default CustomCollection;