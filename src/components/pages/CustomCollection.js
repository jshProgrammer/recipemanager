import RecipeList from "../lists/RecipeList";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadRecipesOfCollection } from "../../features/databaseStorage/ownCollectionsStorage";
import LoadingIndicator from "../subcomponents/LoadingIndicator";
import ErrorIndicator from "../subcomponents/ErrorIndicator";
import {useAuth} from "../../features/providers/AuthContext";
import {loadRecipesOfFavoritesCollection} from "../../features/databaseStorage/favoriteRecipesStorage";
import { useFavorites } from "../../features/providers/FavoriteRecipesContext";
import Breadcrumbs from "../subcomponents/Breadcrumbs";

const CustomCollection = ({collectionName, isOwnRecipes, transformToSpoonacular=false}) => {
    const { user } = useAuth();
    const { refreshFavorites, favoriteRecipes, favoriteCollections } = useFavorites();

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            let data;
            if (isOwnRecipes) {
                data = await loadRecipesOfCollection({ userID: user.uid, collectionName: collectionName });
            } else {
                data = await loadRecipesOfFavoritesCollection({ userID: user.uid, collectionName: collectionName });
            }
            setRecipes(data || []);
        } catch (err) {
            console.error('Error fetching recipes:', err);
            setError('Failed to load recipes');
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.uid && collectionName) {
            if (isOwnRecipes) {
                fetchRecipes();
            } else {
                const collection = favoriteCollections.find(col => col.collectionName === collectionName);
                if (collection && collection.recipes) {
                    setRecipes(collection.recipes);
                    setLoading(false);
                } else {
                    fetchRecipes();
                }
            }
        }
    }, [user, collectionName, isOwnRecipes, favoriteCollections]);



    const handleCollectionsUpdated = async () => {
        if (!isOwnRecipes) {
            await refreshFavorites();
        }
        await fetchRecipes();
    };

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
            <Breadcrumbs />
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="green mb-0 fw-bold mt-5" >Your personal recipes</h2>

                {isOwnRecipes && (
                <button className="btn backgroundGreen d-flex align-items-center" onClick={() => {
                    navigate(`/collections/${encodeURIComponent(collectionName)}/create`)
                }}>
                    <i className="bi bi-book me-2"></i>
                    New recipe
                </button>)}
            </div>

            <h2 className="green">{collectionName}</h2>
            {recipes && recipes.length > 0 ? (
                <RecipeList recipes={recipes} collectionName={collectionName} isOwnRecipe={isOwnRecipes} transformToSpoonacular={transformToSpoonacular} />)
                : <p>{isOwnRecipes
                    ? "This collection is empty yet. Just create a new recipe and you are ready to go :)"
                    : "This collection is empty yet. Add some favorite recipes to get started :)"
                }</p>
            }
        </div>
    );
}

export default CustomCollection;