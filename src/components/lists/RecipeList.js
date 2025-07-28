import React, { useState, useEffect } from "react";
import RecipeCard from "../cards/RecipeCard";
import { Link } from "react-router-dom";
import { getRandomRecipes, searchRecipesAdvanced } from "../../features/spoonacular";
import { generateRecipeTags } from "../../data/RecipeTags";

let globalRandomRecipesCache = null;
let globalRandomRecipesLoaded = false;

export default function RecipeList({
    recipes = null,
    collectionName = null,
    isOwnRecipe = false,
    searchOptions = null,
    useRandomRecipes = false,
    numberOfRecipes = 10,
    onRecipeClick = null,
    transformToSpoonacular = false
}) {
    const [apiRecipes, setApiRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const transformSpoonacularRecipe = (spoonacularRecipe) => {
        return {
            id: spoonacularRecipe.id,
            title: spoonacularRecipe.title,
            imageURL: spoonacularRecipe.image,
            time: spoonacularRecipe.readyInMinutes ? `${spoonacularRecipe.readyInMinutes}min` : "N/A",
            tags: generateRecipeTags(spoonacularRecipe).slice(0, 3),
            estimatedPrice: spoonacularRecipe.pricePerServing ?
                Math.round(spoonacularRecipe.pricePerServing / 100 * spoonacularRecipe.servings) : null
        };
    };

    const fetchRecipes = async (forceRefresh = false) => {
        if (recipes) return;

        if (useRandomRecipes && globalRandomRecipesLoaded && !forceRefresh) {
            setApiRecipes(globalRandomRecipesCache || []);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let response;

            if (useRandomRecipes) {
                response = await getRandomRecipes({
                    number: numberOfRecipes
                });
                const transformedRecipes = response.recipes.map(transformSpoonacularRecipe);
                setApiRecipes(transformedRecipes);
                globalRandomRecipesCache = transformedRecipes;
                globalRandomRecipesLoaded = true;
            } else if (searchOptions) {
                response = await searchRecipesAdvanced({
                    ...searchOptions,
                    number: numberOfRecipes
                });

                const recipesWithDetails = await Promise.all(
                    response.results.map(async (recipe) => {
                        try {
                            return {
                                id: recipe.id,
                                title: recipe.title,
                                imageURL: recipe.image,
                                time: recipe.readyInMinutes ? `${recipe.readyInMinutes}min` : "N/A",
                                tags: generateRecipeTags(recipe).slice(0, 4)
                            };
                        } catch (err) {
                            console.warn(`Could not fetch details for recipe ${recipe.id}:`, err);
                            return {
                                id: recipe.id,
                                title: recipe.title,
                                imageURL: recipe.image,
                                time: "N/A",
                                tags: ["Recipe"]
                            };
                        }
                    })
                );

                setApiRecipes(recipesWithDetails);
            } else {
                response = await searchRecipesAdvanced({
                    sort: 'popularity',
                    number: numberOfRecipes
                });

                const recipesWithDetails = response.results.map(recipe => ({
                    id: recipe.id,
                    title: recipe.title,
                    imageURL: recipe.image,
                    time: recipe.readyInMinutes ? `${recipe.readyInMinutes}min` : "N/A",
                    tags: generateRecipeTags(recipe).slice(0, 4)
                }));

                setApiRecipes(recipesWithDetails);
            }
           
        } catch (err) {
            console.error("Error fetching recipes:", err);
            setError("Failed to load recipes. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

     const handleRefreshRecipes = () => {
        if (useRandomRecipes) {
            globalRandomRecipesLoaded = false;
            globalRandomRecipesCache = null;
        }
        fetchRecipes(true);
    };

    useEffect(() => {
        if (!useRandomRecipes) {
            fetchRecipes();
        } else {
            fetchRecipes();
        }
    }, [searchOptions, useRandomRecipes, numberOfRecipes]);

    const displayRecipes = recipes || apiRecipes;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading recipes...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
                <button
                    className="btn btn-outline-danger ms-3"
                    onClick={fetchRecipes}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!displayRecipes || displayRecipes.length === 0) {
        return (
            <div className="text-center text-muted py-5">
                <i className="bi bi-search" style={{ fontSize: "3rem" }}></i>
                <div className="mt-3">
                    <h5>No recipes found</h5>
                    <p>Try adjusting your search criteria or check back later.</p>
                </div>
            </div>
        );
    }

    return (
         <div>
            {useRandomRecipes && (
                <div className="d-flex justify-content-center mb-4">
                    <button
                        className="btn borderGreen"
                        onClick={handleRefreshRecipes}
                        disabled={loading}
                    >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Refresh Recipes
                    </button>
                </div>
            )}

        <div className="d-flex flex-wrap gap-4 justify-content-center">
            {displayRecipes.map((recipe, index) => (
                <div key={recipe.id || index}>
                    {onRecipeClick ? (
                        <div
                            onClick={() => onRecipeClick(recipe.id)}
                            style={{ cursor: "pointer" }}
                        >
                            <RecipeCard
                                id={recipe.id}
                                {...(transformToSpoonacular ? transformSpoonacularRecipe(recipe) : recipe)}
                                isEditable={isOwnRecipe}
                                collectionName={collectionName}
                            />
                        </div>
                    ) : (

                    <RecipeCard
                        id={recipe.id}
                        {...(transformToSpoonacular ? transformSpoonacularRecipe(recipe) : recipe)}
                        isEditable={isOwnRecipe}
                        collectionName={collectionName}
                    />

                    )}
                </div>
            ))}
        </div>
        </div>
    );
}