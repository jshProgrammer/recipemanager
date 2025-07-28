import React, { useState, useEffect } from "react";
import { searchRecipesAdvanced, getRecipeInformation, autocompleteRecipeSearch, getRecipeEquipment } from "../features/spoonacular";
import { Form, Button, InputGroup } from "react-bootstrap";
import RecipeList from "../components/lists/RecipeList";
import RecipeFilters from "../components/subcomponents/RecipeFilters"; 
import { useNavigate } from "react-router-dom";
import { readCustomSettingsFromDB } from "../features/databaseStorage/userStorage";
import { useAuth } from "../features/providers/AuthContext";
import { useSearch } from "../features/providers/SearchContext";

function RecipeSearch() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    query, setQuery,
    results, setResults,
    autocompleteResults, setAutocompleteResults,
    showAutocomplete, setShowAutocomplete,
    isLoading, setIsLoading,
    hasSearched, setHasSearched,
    currentOffset, setCurrentOffset,
    totalResults, setTotalResults,
    isLoadingMore, setIsLoadingMore,
    lastSearchOptions, setLastSearchOptions,
    selectedDiet, setSelectedDiet,
    selectedIntolerances, setSelectedIntolerances,
    selectedIngredients, setSelectedIngredients,
    maxPrice, setMaxPrice,
    maxReadyTime, setMaxReadyTime,
    activeTag, setActiveTag,
    useEquipmentFilter, setUseEquipmentFilter,
    resetSearch
  } = useSearch();
  
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
      tags: [
        ...(spoonacularRecipe.vegetarian ? ["Vegetarian"] : []),
        ...(spoonacularRecipe.vegan ? ["Vegan"] : []),
        ...(spoonacularRecipe.glutenFree ? ["Gluten-Free"] : []),
        ...(spoonacularRecipe.dairyFree ? ["Dairy-Free"] : []),
        ...(spoonacularRecipe.veryHealthy ? ["Healthy"] : []),
        ...(spoonacularRecipe.cheap ? ["Budget-Friendly"] : []),
        ...(spoonacularRecipe.veryPopular ? ["Popular"] : []),
        ...(spoonacularRecipe.readyInMinutes <= 30 ? ["Fast"] : [])
      ].slice(0, 3), 
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

  const filterRecipesByEquipment = async (recipes, userEquipment) => {
    if (!useEquipmentFilter || Object.keys(userEquipment).length === 0) {
      return recipes;
    }

    const filteredRecipes = [];
    let checkedCount = 0;
    
    for (const recipe of recipes) {
      try {
        // Add delay to avoid rate limiting (1 second between requests)
        if (checkedCount > 0) {
          console.log(`Waiting 1 second before next equipment request...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const equipmentData = await getRecipeEquipment(recipe.id);
        const recipeEquipment = equipmentData.equipment || [];
        checkedCount++;

        console.log(`Recipe ${recipe.id} (${recipe.title}) equipment:`, recipeEquipment);
        console.log("User equipment:", userEquipment);
        
        // If recipe has no equipment info, include it
        if (recipeEquipment.length === 0) {
          console.log(`Recipe ${recipe.id} has no equipment info - including`);
          filteredRecipes.push(recipe);
        } else {
          // Check if user has ALL required equipment for this recipe
          let hasAllEquipment = true;
          for (const equipment of recipeEquipment) {
            if (userEquipment[equipment.name] !== true) {
              console.log(`Recipe ${recipe.id} - missing equipment: ${equipment.name}`);
              hasAllEquipment = false;
              break;
            }
          }
          
          if (hasAllEquipment) {
            console.log(`Recipe ${recipe.id} - ALL equipment available - including`);
            filteredRecipes.push(recipe);
          } else {
            console.log(`Recipe ${recipe.id} - missing equipment - excluding`);
          }
        }
        
        // After finding 9 recipes, set results immediately and continue in background
        if (filteredRecipes.length === 9) {
          console.log(`Found ${filteredRecipes.length} suitable recipes, setting results and continuing in background...`);
          setResults(filteredRecipes);
          setTotalResults(filteredRecipes.length);
          
          // Continue checking in background but don't wait for it
          // The rest will be available for "Load More"
          continue;
        }
        
      } catch (err) {
        console.warn(`Could not fetch equipment for recipe ${recipe.id}:`, err);
        console.log(`Recipe ${recipe.id} - equipment fetch failed - excluding recipe`);
        checkedCount++;
      }
    }
    
    // Always set results with filtered recipes (whether we found 9 or less)
    setResults(filteredRecipes);
    setTotalResults(filteredRecipes.length);
    console.log(`Final equipment filtering complete: ${filteredRecipes.length} recipes found (checked ${checkedCount})`);
    
    return filteredRecipes;
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    setCurrentOffset(0);
    
    try {
      const searchOptions = buildSearchOptions(50);
      setLastSearchOptions(searchOptions);

      console.log("Search options:", searchOptions);

      const data = await searchRecipesAdvanced(searchOptions);
      
      if (!data.results || data.results.length === 0) {
        setResults([]);
        setTotalResults(0);
        return;
      }

      let allRecipesWithDetails = await processRecipes(data.results);
      
      console.log("######### BEFORE EQUIPMENT FILTERING #########");
      console.log("useEquipmentFilter:", useEquipmentFilter);
      
      if (useEquipmentFilter) {
        console.log("Applying equipment filtering...");
        
        // Load user equipment for filtering
        let currentUserEquipment = {};
        if (user?.uid) {
          console.log("Loading user equipment for filtering...");
          try {
            const settings = await readCustomSettingsFromDB({ userID: user.uid });
            currentUserEquipment = settings?.equipment || {};
            console.log("Loaded user equipment:", currentUserEquipment);
          } catch (err) {
            console.error("Error loading user equipment for filtering:", err);
            currentUserEquipment = {};
          }
        }
        
        console.log("userEquipment:", currentUserEquipment);
        console.log("Recipes before filtering:", allRecipesWithDetails.map(r => ({id: r.id, title: r.title})));
        
        // filterRecipesByEquipment will handle setResults and setTotalResults internally
        allRecipesWithDetails = await filterRecipesByEquipment(allRecipesWithDetails, currentUserEquipment);
        console.log(`Equipment filtering complete: ${allRecipesWithDetails.length} recipes found`);
      } else {
        // Normal flow without equipment filtering
        setResults(allRecipesWithDetails.slice(0, 9));
        setTotalResults(allRecipesWithDetails.length);
        setCurrentOffset(9);
      }
      
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
      console.log("######### LOAD MORE #########");
      console.log("All cached recipes:", allRecipes.map(r => ({id: r.id, title: r.title})));
      console.log("Current offset:", currentOffset);
      
      const nextRecipes = allRecipes.slice(currentOffset, currentOffset + 6);
      console.log("Next recipes to add:", nextRecipes.map(r => ({id: r.id, title: r.title})));
      
      if (nextRecipes.length === 0) {
        return;
      }

      setResults(prevResults => {
        const newResults = [...prevResults, ...nextRecipes];
        console.log("######### UPDATING RESULTS IN LOAD MORE #########");
        console.log("Previous results:", prevResults.map(r => ({id: r.id, title: r.title})));
        console.log("New results:", newResults.map(r => ({id: r.id, title: r.title})));
        return newResults;
      });
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
        useEquipmentFilter={useEquipmentFilter}
        setUseEquipmentFilter={setUseEquipmentFilter}
      />
        {hasSearched && results.length > 0 && (
          <div className="mb-3 text-end">
            <Button variant="outline-secondary" size="sm" onClick={resetSearch}>
              Reset Search
            </Button>
          </div>
        )}

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
                {useEquipmentFilter && ` • equipment filter (strict)`}
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
