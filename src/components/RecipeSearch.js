import React, { useState, useEffect } from "react";
import { searchRecipesAdvanced, getRecipeInformation, autocompleteRecipeSearch, availableDiets, availableIntolerances } from "../features/spoonacular";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";

function RecipeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  
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

  const handleSearch = async () => {
    setSelectedRecipe(null);
    try {
      const searchOptions = {
        query: query,
        diet: selectedDiet || activeTag.toLowerCase(),
        intolerances: selectedIntolerances,
        maxReadyTime: maxReadyTime,
        sort: 'popularity',
        number: 10
      };

      Object.keys(searchOptions).forEach(key => {
        if (searchOptions[key] === "" || searchOptions[key] === undefined) {
          delete searchOptions[key];
        }
      });

      const data = await searchRecipesAdvanced(searchOptions);
      setResults(data.results);
      setShowAutocomplete(false);
    } catch (err) {
      alert(err.message);
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
    setActiveTag(activeTag === tag ? "" : tag);
  };

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
                        onClick={handleSearch}>
                        <i className="bi bi-search"></i>
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
                                className="p-2 border-bottom cursor-pointer"
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
                 <p>Fast Select:</p>
                </Col>
                <Col md={9}>
                    <div className="mb-3 d-flex flex-wrap gap-2">
                        {["Vegetarian", "Vegan", "Gluten-Free", "Ketogenic", "Paleo", "Healthy"].map((tag) => (
                        <span 
                            key={tag} 
                            className={`badge border text-black ${activeTag === tag ? 'backgroundGreen' : 'borderGreen'}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleTagClick(tag)}
                        >
                            {tag}
                        </span>
                        ))}
                    </div>
                </Col>
            </Row>
        
            <Row className="g-3">
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
                    onChange={e => setSelectedDiet(e.target.value)}
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
                <Button className="w-100 backgroundGreen btn" onClick={handleSearch}>
                    Search
                </Button>
              </Col>  
            </Row>
      <ul>
        {results.map(recipe => (
          <li key={recipe.id}>
            <button onClick={() => handleSelect(recipe.id)}>
              {recipe.title}
            </button>
          </li>
        ))}
      </ul>
      {selectedRecipe && (
        <div style={{marginTop: 20}}>
          <h3>{selectedRecipe.title}</h3>
          {selectedRecipe.image && <img src={selectedRecipe.image} alt={selectedRecipe.title} />}
          <p>{selectedRecipe.summary && <span dangerouslySetInnerHTML={{__html: selectedRecipe.summary}} />}</p>
        </div>
      )}
    </div>
  );
}

export default RecipeSearch;