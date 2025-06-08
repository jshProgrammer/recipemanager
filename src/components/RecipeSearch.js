import React, { useState } from "react";
import { searchRecipes, getRecipeInformation } from "../features/spoonacular";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";

function RecipeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSearch = async () => {
    setSelectedRecipe(null);
    try {
      const data = await searchRecipes(query);
      setResults(data.results);
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

  return (
    <div>
        <div className="mb-4">
            <h3>Search recepies</h3>
            <div className="mb-3 position-relative">
                <InputGroup style={{  }}>
                    <Form.Control
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                        placeholder="What would you like to cook today? :)"
                    />
                    <Button 
                        className="position-absolute top-50 translate-middle-y"
                        style={{ right: "10px", padding: "0.375rem 0.75rem" }}
                        variant="link"
                        tabIndex={-1}
                        onClick={handleSearch}>

                        <i className="bi bi-search"></i>
                    </Button>
                </InputGroup>
            </div>
        </div>
        <Row>
                <Col md={3}>
                 <p>Fast Select:</p>
                </Col>
                <Col md={9}>
                    <div className="mb-3 d-flex flex-wrap gap-2">
                        {["Vegetarian", "Desert", "Fast", "Easy", "Healthy", "Simple"].map((tag) => (
                        <span key={tag} className="badge border borderGreen text-black">
                            {tag}
                        </span>
                        ))}
                    </div>
                </Col>
            </Row>
        
            <Row className="g-3">
                <Col md={4}>
                <Form.Select>
                    <option>Select desired ingredients</option>
                </Form.Select>
                </Col>
                <Col md={2}>
                <Form.Control type="number" placeholder="Maximum Price $" min="0" />
                </Col>
                <Col md={3}>
                <Form.Control type="number" placeholder="Maximum Preparation Time (min)" min="0" />
                </Col>
                <Col md={3}>
                <Button className="w-100 backgroundGreen btn">
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