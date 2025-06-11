import React, { useState } from 'react';
import RecipeList from '../../components/lists/RecipeList'
import { recipes } from '../../data/SampleData';
import OwnRecipes from './OwnRecipes';
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";


const FavoritesSection = () => {
  const [selectedIngredients, setSelectedIngredients] = useState('');
  const [inputBox1, setInputBox1] = useState('');
  const [inputBox2, setInputBox2] = useState('');

  return (
    <div className="main-content">
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="h1 fw-bold text-dark mb-4">Your favorites</h1>
        </div>

        {/* Fast Select Section */}
        <div className="mb-4">
          <h2 className="h5 fw-semibold text-dark mb-3">Fast Select:</h2>
          <Col md={9}>
                    <div className="mb-3 d-flex flex-wrap gap-2">
                        {["Vegetarian", "Desert", "Fast", "Easy", "Healthy", "Simple"].map((tag) => (
                        <span key={tag} className="badge border borderGreen text-black">
                            {tag}
                        </span>
                        ))}
                    </div>
                </Col>
          <div className="d-flex flex-row align-items-end gap-3 flex-wrap">
            {/* Ingredients Dropdown */}
            <div className="d-flex flex-column">
              <label className="form-label small text-muted mb-2">Ingredients</label>
              <select 
                value={selectedIngredients}
                onChange={(e) => setSelectedIngredients(e.target.value)}
                className="form-select"
                style={{width: '300px'}}
              >
                <option value="">Select desired ingredients</option>
                <option value="chicken">Chicken</option>
                <option value="beef">Beef</option>
                <option value="vegetables">Vegetables</option>
                <option value="pasta">Pasta</option>
              </select>
            </div>

            {/* Input Box 1 */}
            <div className="d-flex flex-column">
              <input
                type="text"
                value={inputBox1}
                onChange={(e) => setInputBox1(e.target.value)}
                placeholder="Maximum Price $"
                className="form-control"
                style={{width: '300px'}}
              />
            </div>

            {/* Input Box 2 */}
            <div className="d-flex flex-column">
              <input
                type="text"
                value={inputBox2}
                onChange={(e) => setInputBox2(e.target.value)}
                placeholder="Maximum Preparation Time (min)"
                className="form-control"
                style={{width: '300px'}}
              />
            </div>
          </div>
        </div>
        <RecipeList recipes={recipes.slice(0, 3)} />
      </div>

      {/* Your collections Section */}
      <div>
        <h1 className="h1 fw-bold text-dark mb-4">Your collections</h1>
        {/* Collections grid would go here - placeholder for existing collection cards */}
      </div>
      <RecipeList recipes={recipes.slice(0, 4)} />
    </div>
  );
};

export default FavoritesSection;