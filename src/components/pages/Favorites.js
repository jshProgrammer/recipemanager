import React, { useState, useEffect } from 'react';
import RecipeList from '../../components/lists/RecipeList'
import { Col } from "react-bootstrap";
import AddNewCollectionPopup from "./AddNewCollectionPopup";
import CollectionList from "../lists/CollectionList";
import RecipeFilters from "../subcomponents/RecipeFilters";
import {useFavorites} from "../../features/providers/FavoriteRecipesContext";

const FavoritesSection = () => {
  const { favoriteRecipes, favoriteCollections, isLoading, error, refreshFavorites } = useFavorites();

  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedIntolerances, setSelectedIntolerances] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxReadyTime, setMaxReadyTime] = useState('');
  const [activeTag, setActiveTag] = useState('');
  
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const [, setCollectionMessage] = useState(null);
  const [, setCollectionMessageType] = useState(null);
  const [isNewCollectionMenuOpen, setIsNewCollectionMenuOpen] = useState(false);

  useEffect(() => {
    setFilteredRecipes(favoriteRecipes);
  }, [favoriteRecipes]);

  const handleCollectionsUpdated = async () => {
    await refreshFavorites();
  };

  const handleSearch = () => {
    console.log("Search clicked! Current filters:", {
      selectedDiet,
      selectedIntolerances,
      selectedIngredients,
      maxPrice,
      maxReadyTime,
      activeTag,
      totalRecipes: favoriteRecipes.length
    });
    
    setIsFiltering(true);
    
    let filtered = [...favoriteRecipes];
    console.log("Initial recipes count:", filtered.length);
    
    const dietFilter = activeTag || selectedDiet;
    if (dietFilter) {
      console.log("Filtering by diet:", dietFilter);
      filtered = filtered.filter(recipe => {
        if (filtered.indexOf(recipe) === 0) {
          console.log("Sample recipe structure:", recipe);
        }
        
        const recipeDiets = recipe.diets || recipe.diet || [];
        const recipeTags = recipe.tags || recipe.dishTypes || [];
        const recipeTitle = recipe.title || recipe.name || '';
        
        const matchesDiet = Array.isArray(recipeDiets) ? 
          recipeDiets.some(diet => diet.toLowerCase().includes(dietFilter.toLowerCase())) :
          recipeDiets.toLowerCase().includes(dietFilter.toLowerCase());
          
        const matchesTags = Array.isArray(recipeTags) ? 
          recipeTags.some(tag => tag.toLowerCase().includes(dietFilter.toLowerCase())) :
          false;
          
        const matchesTitle = recipeTitle.toLowerCase().includes(dietFilter.toLowerCase());
        
        const matchesSpecialTags = (
          (dietFilter.toLowerCase() === 'vegetarian' && (recipe.vegetarian === true || recipeTags.includes('vegetarian'))) ||
          (dietFilter.toLowerCase() === 'vegan' && (recipe.vegan === true || recipeTags.includes('vegan'))) ||
          (dietFilter.toLowerCase() === 'gluten-free' && (recipe.glutenFree === true || recipeTags.includes('gluten free'))) ||
          (dietFilter.toLowerCase() === 'ketogenic' && (recipe.ketogenic === true || recipeTags.includes('ketogenic'))) ||
          (dietFilter.toLowerCase() === 'paleo' && (recipe.paleo === true || recipeTags.includes('paleo'))) ||
          (dietFilter.toLowerCase() === 'healthy' && (recipe.veryHealthy === true || recipeTags.includes('healthy')))
        );
        
        return matchesDiet || matchesTags || matchesTitle || matchesSpecialTags;
      });
      console.log("After diet filter:", filtered.length);
    }
    
    if (selectedIngredients) {
      console.log("Filtering by ingredients:", selectedIngredients);
      filtered = filtered.filter(recipe => {
        const ingredients = recipe.extendedIngredients || recipe.ingredients || [];
        const hasIngredient = ingredients.some(ingredient => {
          const name = ingredient.name || ingredient.original || ingredient.originalName || '';
          return name.toLowerCase().includes(selectedIngredients.toLowerCase());
        });
        
        const titleMatch = recipe.title?.toLowerCase().includes(selectedIngredients.toLowerCase());
        
        return hasIngredient || titleMatch;
      });
      console.log("After ingredients filter:", filtered.length);
    }
    
    if (selectedIntolerances) {
      console.log("Filtering by intolerances:", selectedIntolerances);
      filtered = filtered.filter(recipe => {
        const intolerance = selectedIntolerances.toLowerCase();
        
        switch (intolerance) {
          case 'gluten':
            return recipe.glutenFree === true;
          case 'dairy':
            return recipe.dairyFree === true;
          case 'vegetarian':
            return recipe.vegetarian === true;
          case 'vegan':
            return recipe.vegan === true;
          case 'egg':
            const ingredients = recipe.extendedIngredients || [];
            return !ingredients.some(ingredient => 
              ingredient.name?.toLowerCase().includes('egg') ||
              ingredient.original?.toLowerCase().includes('egg')
            );
          case 'soy':
            const soyIngredients = recipe.extendedIngredients || [];
            return !soyIngredients.some(ingredient => 
              ingredient.name?.toLowerCase().includes('soy') ||
              ingredient.original?.toLowerCase().includes('soy')
            );
          case 'shellfish':
          case 'seafood':
            const seafoodIngredients = recipe.extendedIngredients || [];
            return !seafoodIngredients.some(ingredient => 
              ingredient.name?.toLowerCase().includes('shrimp') ||
              ingredient.name?.toLowerCase().includes('crab') ||
              ingredient.name?.toLowerCase().includes('lobster') ||
              ingredient.name?.toLowerCase().includes('fish') ||
              ingredient.original?.toLowerCase().includes('seafood')
            );
          case 'tree-nut':
          case 'tree nut':
            const nutIngredients = recipe.extendedIngredients || [];
            return !nutIngredients.some(ingredient => 
              ingredient.name?.toLowerCase().includes('almond') ||
              ingredient.name?.toLowerCase().includes('walnut') ||
              ingredient.name?.toLowerCase().includes('pecan') ||
              ingredient.name?.toLowerCase().includes('cashew') ||
              ingredient.name?.toLowerCase().includes('pistachio') ||
              ingredient.original?.toLowerCase().includes('nut')
            );
          case 'peanut':
            const peanutIngredients = recipe.extendedIngredients || [];
            return !peanutIngredients.some(ingredient => 
              ingredient.name?.toLowerCase().includes('peanut') ||
              ingredient.original?.toLowerCase().includes('peanut')
            );
          default:
            return true; 
        }
      });
      console.log("After intolerances filter:", filtered.length);
    }
    
    if (maxPrice) {
      console.log("Filtering by price:", maxPrice);
      const priceLimit = parseFloat(maxPrice);
      filtered = filtered.filter(recipe => {
        const recipePrice = recipe.pricePerServing || recipe.price || 0;
        const normalizedPrice = recipePrice > 100 ? recipePrice / 100 : recipePrice;
        return normalizedPrice <= priceLimit;
      });
      console.log("After price filter:", filtered.length);
    }
    
    if (maxReadyTime) {
      console.log("Filtering by ready time:", maxReadyTime);
      const timeLimit = parseInt(maxReadyTime);
      filtered = filtered.filter(recipe => {
        const readyTime = recipe.readyInMinutes || recipe.cookingTime || recipe.preparationMinutes || 0;
        return readyTime <= timeLimit;
      });
      console.log("After time filter:", filtered.length);
    }
    
    console.log("Final filtered recipes:", filtered.length);
    setFilteredRecipes(filtered);
    setIsFiltering(false);
  };

  const resetFilters = () => {
    setSelectedDiet('');
    setSelectedIntolerances('');
    setSelectedIngredients('');
    setMaxPrice('');
    setMaxReadyTime('');
    setActiveTag('');
    setFilteredRecipes(favoriteRecipes);
  };

  return (
      <div className="main-content">
        <div className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h1 className="h1 fw-bold green mb-4">Your favorites</h1>
            <button 
              className="btn btn-outline-secondary btn-sm" 
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>

          <div className="bgLightGreen p-4 rounded-4 mt-4" id="search-section">
          <RecipeFilters
            selectedDiet={selectedDiet}
            setSelectedDiet={setSelectedDiet}
            selectedIntolerances={selectedIntolerances}
            setSelectedIntolerances={setSelectedIntolerances}
            selectedIngredients={selectedIngredients}
            setSelectedIngredients={setSelectedIngredients}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            maxReadyTime={maxReadyTime}
            setMaxReadyTime={setMaxReadyTime}
            activeTag={activeTag}
            setActiveTag={setActiveTag}
            onSearch={handleSearch}
            isLoading={isFiltering}
          />
          </div>

          {isLoading && <p>Loading your favorites...</p>}
          {error && <p className="text-danger">{error}</p>}
          {!isLoading && !error && favoriteRecipes.length === 0 && (
            <p className="green">You do not have any recipes marked as favorite yet.</p>
          )}
          {!isLoading && !error && favoriteRecipes.length > 0 && (
            <>
              <div className="mb-3">
                <small className="text-muted">
                  Showing {filteredRecipes.length} of {favoriteRecipes.length} recipes
                </small>
              </div>
              <RecipeList recipes={filteredRecipes} transformToSpoonacular={true}/>
            </>
          )}
        </div>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="h1 fw-bold green mb-4">Your collections</h1>
          <button className="btn backgroundGreen d-flex align-items-center" onClick={(e) => {
            e.preventDefault();
            setIsNewCollectionMenuOpen(!isNewCollectionMenuOpen);
          }}>
            <i className="bi bi-collection me-2"></i>
            New collection
          </button>
        </div>

        <CollectionList collections={favoriteCollections} containsOwnRecipes={false}/>

        <AddNewCollectionPopup
            isOpen={isNewCollectionMenuOpen}
            isOwnRecipe={false}
            onClose={() => setIsNewCollectionMenuOpen(false)}
            setParentMessage={setCollectionMessage}
            setParentMessageType={setCollectionMessageType}
            reloadCollections={handleCollectionsUpdated}/>
      </div>
  );
};

export default FavoritesSection;