import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { availableDiets, availableIntolerances, availableIngredients } from "../../features/spoonacular";
//TODO: maxprice isn't working yet (in Favorites and Home)

function RecipeFilters({
  selectedDiet,
  setSelectedDiet,
  selectedIntolerances,
  setSelectedIntolerances,
  selectedIngredients,
  setSelectedIngredients,
  maxPrice,
  setMaxPrice,
  maxReadyTime,
  setMaxReadyTime,
  activeTag,
  setActiveTag,
  onSearch,
  isLoading
}) {
  
  const handleTagClick = (tag) => {
    const newActiveTag = activeTag === tag ? "" : tag;
    setActiveTag(newActiveTag);
    
    if (newActiveTag === "") {
      setSelectedDiet("");
    }
  };

  const handleDietChange = (value) => {
    setSelectedDiet(value);
    if (value) {
      setActiveTag("");
    }
  };

  return (
    <div>
      <Row className="mb-4">
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
            value={selectedIngredients} 
            onChange={e => setSelectedIngredients(e.target.value)}
          >
            <option value="">Select desired ingredients</option>
            {availableIngredients.map(ingredient => (
              <option key={ingredient} value={ingredient}>
                {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
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
        <Col md={3}>
          <Form.Select 
            value={selectedDiet} 
            onChange={e => handleDietChange(e.target.value)}
          >
            <option value="">Select diet</option>
            {availableDiets.map(diet => (
              <option key={diet} value={diet}>
                {diet.charAt(0).toUpperCase() + diet.slice(1).replace('-', ' ')}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button 
            className="w-100 backgroundGreen btn" 
            onClick={onSearch}
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

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Form.Control 
            type="number" 
            placeholder="Maximum Price $" 
            min="0"
            step="0.01"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />
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
      </Row>
    </div>
  );
}

export default RecipeFilters;