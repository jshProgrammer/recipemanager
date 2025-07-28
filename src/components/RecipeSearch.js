import React, { useState, useEffect } from "react";
import { searchRecipesAdvanced, getRecipeInformation, autocompleteRecipeSearch } from "../features/spoonacular";
import { Form, Button, InputGroup } from "react-bootstrap";
import RecipeList from "../components/lists/RecipeList";
import RecipeFilters from "../components/subcomponents/RecipeFilters"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/providers/AuthContext";
import { readCustomSettingsFromDB } from "../features/databaseStorage/userStorage";
import { generateRecipeTags } from "../data/RecipeTags";

function RecipeSearch() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastSearchOptions, setLastSearchOptions] = useState({});
  
  const [selectedDiet, setSelectedDiet] = useState("");
  const [selectedIntolerances, setSelectedIntolerances] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxReadyTime, setMaxReadyTime] = useState("");
  const [activeTag, setActiveTag] = useState("");
  
  const [userSettings, setUserSettings] = useState(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      readCustomSettingsFromDB({ userID: user.uid })
        .then(settings => {
          setUserSettings(settings);
          setSettingsLoaded(true);
        })
        .catch(err => {
          console.error("Error loading user settings:", err);
          setSettingsLoaded(true);
        });
    } else {
      setSettingsLoaded(true);
    }
  }, [user]);

  const handleQueryChange = async (value) => {
    setQuery(value);
    
    if (value.length > 2) {
      try {
        const suggestions = await autocompleteRecipeSearch(value, 5);
        setAutocompleteResults(suggestions);
        setShowAutocomplete(true);
      } catch (err) {
        console.error("Autocomplete error:", err);
        setAutocompleteResults([]);
      }
    } else {
      setShowAutocomplete(false);
      setAutocompleteResults([]);
    }
  };

  const handleAutocompleteSelect = (suggestion) => {
    setQuery(suggestion.title);
    setShowAutocomplete(false);
    setAutocompleteResults([]);
  };

  const transformRecipeForCard = (spoonacularRecipe) => {
    return {
      id: spoonacularRecipe.id,
      title: spoonacularRecipe.title,
      imageURL: spoonacularRecipe.image,
      time: spoonacularRecipe.readyInMinutes ? `${spoonacularRecipe.readyInMinutes}min` : "N/A",
      tags: generateRecipeTags(spoonacularRecipe).slice(0, 3), 
      estimatedPrice: spoonacularRecipe.pricePerServing ? 
        Math.round(spoonacularRecipe.pricePerServing / 100 * (spoonacularRecipe.servings || 1)) : null
    };
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  const buildSearchOptions = (number = 9) => {
    const searchOptions = {
      query: query,
      diet: selectedDiet || (activeTag ? activeTag.toLowerCase() : ""),
      intolerances: selectedIntolerances,
      includeIngredients: selectedIngredients,
      maxReadyTime: maxReadyTime,
      maxPricePerServing: maxPrice ? parseFloat(maxPrice) * 100 : undefined,
      sort: 'popularity',
      number: number
    };

    Object.keys(searchOptions).forEach(key => {
      if (searchOptions[key] === "" || searchOptions[key] === undefined) {
        delete searchOptions[key];
      }
    });

    return searchOptions;
  };

  const processRecipes = async (recipes) => {
    return await Promise.all(
      recipes.map(async (recipe) => {
        try {
          const detailedRecipe = await getRecipeInformation(recipe.id);
          return transformRecipeForCard(detailedRecipe);
        } catch (err) {
          console.warn(`Could not fetch details for recipe ${recipe.id}:`, err);
          return transformRecipeForCard(recipe);
        }
      })
    );
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    setCurrentOffset(0);
    
    try {
      const searchOptions = buildSearchOptions(50);
      setLastSearchOptions(searchOptions);

      console.log("Search options:", searchOptions);
      console.log("User settings:", userSettings);

      const data = await searchRecipesAdvanced(searchOptions, userSettings);
      
      if (!data.results || data.results.length === 0) {
        setResults([]);
        setTotalResults(0);
        return;
      }

      const allRecipesWithDetails = await processRecipes(data.results);
      
      setResults(allRecipesWithDetails.slice(0, 9));
      setTotalResults(allRecipesWithDetails.length);
      setCurrentOffset(9);
      
      setLastSearchOptions({...searchOptions, allRecipes: allRecipesWithDetails});
      
      setShowAutocomplete(false);
    } catch (err) {
      console.error("Search error:", err);
      alert("Error searching recipes: " + err.message);
      setResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    
    try {
      const allRecipes = lastSearchOptions.allRecipes || [];
      const nextRecipes = allRecipes.slice(currentOffset, currentOffset + 6);
      
      if (nextRecipes.length === 0) {
        return;
      }

      setResults(prevResults => [...prevResults, ...nextRecipes]);
      setCurrentOffset(prevOffset => prevOffset + nextRecipes.length);
    } catch (err) {
      console.error("Load more error:", err);
      alert("Error loading more recipes: " + err.message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const canLoadMore = currentOffset < totalResults;

  useEffect(() => {
    if (activeTag && (query || hasSearched)) {
      handleSearch();
    }
  }, [activeTag]);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowAutocomplete(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!settingsLoaded) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3>Search recipes</h3>
        <div className="mb-3 position-relative">
          <InputGroup>
            <Form.Control
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              placeholder="What would you like to cook today? :)"
              onClick={e => e.stopPropagation()}
              style={{ paddingRight: "45px" }}
            />
            <Button 
              className="position-absolute top-50 translate-middle-y border-0 bg-transparent"
              style={{ 
                right: "10px", 
                padding: "0.375rem 0.75rem",
                zIndex: 10,
                color: "#6c757d"
              }}
              variant="link"
              tabIndex={-1}
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <i className="bi bi-search"></i>
              )}
            </Button>
          </InputGroup>
          
          {showAutocomplete && autocompleteResults.length > 0 && (
            <div 
              className="position-absolute w-100 bg-white border rounded-bottom shadow-sm"
              style={{ top: '100%', zIndex: 1000 }}
              onClick={e => e.stopPropagation()}
            >
              {autocompleteResults.map((suggestion, index) => (
                <div 
                  key={index}
                  className="p-2 border-bottom cursor-pointer hover-bg-light"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleAutocompleteSelect(suggestion)}
                  onMouseDown={e => e.preventDefault()}
                >
                  {suggestion.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
        isLoading={isLoading}
        userSettings={userSettings}
      />

      {hasSearched && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>
              {isLoading ? "Searching..." : `Search Results ${results.length > 0 ? `(${results.length}${totalResults > results.length ? ` of ${totalResults}` : ""})` : ""}`}
            </h4>
            {results.length > 0 && !isLoading && (
              <small className="text-muted">
                {query && `for "${query}"`}
                {activeTag && ` • ${activeTag}`}
                {selectedDiet && ` • ${selectedDiet}`}
                {maxReadyTime && ` • max ${maxReadyTime}min`}
                {selectedIngredients && ` • with ${selectedIngredients}`}
                {maxPrice && ` • max $${maxPrice}`}
              </small>
            )}
          </div>
          
          {isLoading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading recipes...</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No recipes found matching your criteria. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <RecipeList recipes={results} onRecipeClick={handleRecipeClick} />
              
              {canLoadMore && (
                <div className="d-flex justify-content-center mt-4">
                  <Button 
                    variant="outline-success" 
                    size="lg"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="px-4"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Loading more recipes...
                      </>
                    ) : (
                      <>
                        Load More Recipes
                        <i className="bi bi-arrow-down ms-2"></i>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default RecipeSearch;