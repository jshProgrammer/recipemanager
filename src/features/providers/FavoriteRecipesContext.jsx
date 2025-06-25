// src/features/providers/FavoriteRecipesContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    isRecipeFavorite,
    addRecipeToFavorites,
    removeRecipeFromFavorites,
    loadFavoriteCollectionsOfUser,
    loadFavoriteRecipes
} from '../databaseStorage/favoriteRecipesStorage';
import { useAuth } from './AuthContext';

const FavoriteRecipesContext = createContext();

export const useFavorites = () => useContext(FavoriteRecipesContext);

export const FavoriteRecipesProvider = ({ children }) => {
    const { user } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState(new Set());
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [favoriteCollections, setFavoriteCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllFavorites = async () => {
        if (!user?.uid) {
            setFavoriteIds(new Set());
            setFavoriteRecipes([]);
            setFavoriteCollections([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const [collections, recipes] = await Promise.all([
                loadFavoriteCollectionsOfUser(user.uid),
                loadFavoriteRecipes(user.uid)
            ]);

            setFavoriteCollections(Array.isArray(collections) ? collections : []);
            setFavoriteRecipes(Array.isArray(recipes) ? recipes : []);

            console.log("DEBUG: " + JSON.stringify(recipes));

            const favIds = recipes.map(recipe => recipe.id.toString());
            setFavoriteIds(new Set(favIds));
        } catch (err) {
            console.error('Error fetching favorites:', err);
            setError('Failed to load favorites');
            setFavoriteIds(new Set());
            setFavoriteRecipes([]);
            setFavoriteCollections([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllFavorites();
    }, [user]);

    const isFavorite = (recipeId) => favoriteIds.has(recipeId);

    const addToFavorites = async (recipeId, collection) => {
        try {
            await addRecipeToFavorites(user.uid, recipeId, collection);
            setFavoriteIds(prev => new Set([...prev, recipeId]));
            await fetchAllFavorites();
        } catch (error) {
            console.error('Error adding to favorites:', error);
            throw error;
        }
    };

    const removeFromFavorites = async (recipeId) => {
        try {
            await removeRecipeFromFavorites(user.uid, recipeId);

            setFavoriteIds(prev => {
                const updated = new Set(prev);
                updated.delete(recipeId);
                return updated;
            });

            setFavoriteRecipes(prev => prev.filter(recipe => recipe.id.toString() !== recipeId));

            const collections = await loadFavoriteCollectionsOfUser(user.uid);
            setFavoriteCollections(Array.isArray(collections) ? collections : []);

        } catch (error) {
            console.error('Error removing from favorites:', error);
            throw error;
        }
    };

    const refreshFavorites = () => {
        return fetchAllFavorites();
    };

    return (
        <FavoriteRecipesContext.Provider
            value={{
                isFavorite,
                addToFavorites,
                removeFromFavorites,
                favoriteIds,
                favoriteRecipes,
                favoriteCollections,
                isLoading,
                error,
                refreshFavorites
            }}>
            {children}
        </FavoriteRecipesContext.Provider>
    );
};