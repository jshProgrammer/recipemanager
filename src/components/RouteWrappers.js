import { useState, useEffect } from 'react';
import { loadRecipeById } from '../features/databaseStorage/recipeStorage.js';
import { useParams } from 'react-router-dom';

import CustomCollection from './pages/CustomCollection.js';
import CreateEditOwnRecipe from './pages/CreateEditOwnRecipe.js';
import RecipeDetail from './pages/RecipeDetail.js';
import LoadingIndicator from './subcomponents/LoadingIndicator.js';
import { detailedRecipes } from '../data/DetailedSampleData';
import {useAuth} from "../features/providers/AuthContext";

export function CustomCollectionWrapper({isOwnRecipes, transformToSpoonacular=false}) {
  const { collectionName } = useParams();
  return <CustomCollection collectionName={collectionName} isOwnRecipes={isOwnRecipes} transformToSpoonacular={transformToSpoonacular} />;
}

export function CreateEditOwnRecipeWrapper() {
  const { collectionName, recipeID } = useParams();
  return <CreateEditOwnRecipe collectionName={collectionName} recipeID={recipeID} />;
}

export function RecipeDetailWrapper() {
  const { id } = useParams(); 
  const recipe = detailedRecipes.find(r => r.id === parseInt(id)); 
  return <RecipeDetail recipe={recipe} />;
}

export function OwnRecipeDetailWrapper() {
  const { user } = useAuth();
  const { recipeID } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadOwnRecipe = async () => {
      if (user && recipeID) {
        try {
          const data = await loadRecipeById(user.uid, recipeID);
          setRecipe(data);
        } catch (error) {
          console.error("Error loading recipe:", error);
        }
      }
      setLoading(false);
    };
    loadOwnRecipe();
  }, [user, recipeID]);
  
  if (loading) {
    return <LoadingIndicator />;
  }
  
  if (!recipe) {
    return (
      <div className="main-content">
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Recipe not found
        </div>
      </div>
    );
  }
  
  return <RecipeDetail recipe={recipe} />;
}
