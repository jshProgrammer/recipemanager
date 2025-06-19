import React, { useState, useEffect } from "react";
import { searchRecipesAdvanced, getRecipeInformation, autocompleteRecipeSearch, availableDiets, availableIntolerances } from "../features/spoonacular";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import RecipeList from "../components/lists/RecipeList";

function RecipeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [selectedDiet, setSelectedDiet] = useState("");
  const [selectedIntolerances, setSelectedIntolerances] = useState("");
  const [maxPrice, setMaxPrice] = useState(""); //TODO: could be added to Fast Select?
  const [maxReadyTime, setMaxReadyTime] = useState("");
  const [activeTag, setActiveTag] = useState("");

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
      //TODO: Always displays N/A??
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
      ].slice(0, 4), 
      estimatedPrice: spoonacularRecipe.pricePerServing ? 
        Math.round(spoonacularRecipe.pricePerServing / 100 * (spoonacularRecipe.servings || 1)) : null
    };
  };

  const handleSearch = async () => {
    setSelectedRecipe(null);
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const searchOptions = {
        query: query,
        diet: selectedDiet || (activeTag ? activeTag.toLowerCase() : ""),
        intolerances: selectedIntolerances,
        maxReadyTime: maxReadyTime,
        sort: 'popularity',
        number: 9
      };

      Object.keys(searchOptions).forEach(key => {
        if (searchOptions[key] === "" || searchOptions[key] === undefined) {
          delete searchOptions[key];
        }
      });

      const data = await searchRecipesAdvanced(searchOptions);
      
      const recipesWithDetails = await Promise.all(
      data.results.map(async (recipe) => {
        try {
          const detailedRecipe = await getRecipeInformation(recipe.id);
          return transformRecipeForCard(detailedRecipe);
        } catch (err) {
          console.warn(`Could not fetch details for recipe ${recipe.id}:`, err);
          return transformRecipeForCard(recipe);
        }
      })
    );
    
    setResults(recipesWithDetails);
    setShowAutocomplete(false);
  } catch (err) {
    console.error("Search error:", err);
    alert("Error searching recipes: " + err.message);
    setResults([]);
  } finally {
    setIsLoading(false);
  }
  };

  const handleSelect = async (id) => {
    try {
      const data = await getRecipeInformation(id);
      setSelectedRecipe(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTagClick = (tag) => {
    const newActiveTag = activeTag === tag ? "" : tag;
    setActiveTag(newActiveTag);
    
    if (newActiveTag === "") {
      setSelectedDiet("");
    }
  };

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

      <Row>
        <Col md={3}>
          <p className="fw-semibold">Fast Select:</p>
        </Col>
        <Col md={9}>
          <div className="mb-3 d-flex flex-wrap gap-2">
            {["Vegetarian", "Vegan", "Gluten-Free", "Ketogenic", "Paleo", "Healthy"].map((tag) => (
              <span 
                key={tag} 
                className={`badge border text-black ${activeTag === tag ? 'backgroundGreen' : 'borderGreen'}`}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </Col>
      </Row>
      
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Form.Select 
            value={selectedIntolerances} 
            onChange={e => setSelectedIntolerances(e.target.value)}
          >
            <option value="">Select food intolerances</option>
            {availableIntolerances.map(intolerance => (
              <option key={intolerance} value={intolerance}>
                {intolerance.charAt(0).toUpperCase() + intolerance.slice(1).replace('-', ' ')}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select 
            value={selectedDiet} 
            onChange={e => {
              setSelectedDiet(e.target.value);
              if (e.target.value) {
                setActiveTag("");
              }
            }}
          >
            <option value="">Select diet</option>
            {availableDiets.map(diet => (
              <option key={diet} value={diet}>
                {diet.charAt(0).toUpperCase() + diet.slice(1).replace('-', ' ')}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Control 
            type="number" 
            placeholder="Maximum Preparation Time (min)" 
            min="0"
            value={maxReadyTime}
            onChange={e => setMaxReadyTime(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Button 
            className="w-100 backgroundGreen btn" 
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </Col>  
      </Row>

      {hasSearched && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>
              {isLoading ? "Searching..." : `Search Results ${results.length > 0 ? `(${results.length})` : ""}`}
            </h4>
            {results.length > 0 && !isLoading && (
              <small className="text-muted">
                {query && `for "${query}"`}
                {activeTag && ` • ${activeTag}`}
                {selectedDiet && ` • ${selectedDiet}`}
                {maxReadyTime && ` • max ${maxReadyTime}min`}
              </small>
            )}
          </div>
          
          {isLoading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading recipes...</span>
              </div>
            </div>
          ) : (
            <RecipeList recipes={results} />
          )}
        </div>
      )}

      {selectedRecipe && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
             onClick={() => setSelectedRecipe(null)}>
          <div className="bg-white rounded p-4 m-3" 
               style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}
               onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h3>{selectedRecipe.title}</h3>
              <Button variant="close" onClick={() => setSelectedRecipe(null)}></Button>
            </div>
            {selectedRecipe.image && (
              <img 
                src={selectedRecipe.image} 
                alt={selectedRecipe.title} 
                className="img-fluid rounded mb-3"
                style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
              />
            )}
            {selectedRecipe.summary && (
              <div className="mb-3">
                <h5>Summary</h5>
                <div dangerouslySetInnerHTML={{__html: selectedRecipe.summary}} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeSearch;