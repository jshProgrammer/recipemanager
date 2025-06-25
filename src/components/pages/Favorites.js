import React, { useState, useEffect } from 'react';
import RecipeList from '../../components/lists/RecipeList'
import { Col } from "react-bootstrap";
import AddNewCollectionPopup from "./AddNewCollectionPopup";
import CollectionList from "../lists/CollectionList";
import {useFavorites} from "../../features/providers/FavoriteRecipesContext";

const FavoritesSection = () => {
  const { favoriteRecipes, favoriteCollections, isLoading, error, refreshFavorites } = useFavorites();

  const [selectedIngredients, setSelectedIngredients] = useState('');
  const [inputBox1, setInputBox1] = useState('');
  const [inputBox2, setInputBox2] = useState('');

  const [, setCollectionMessage] = useState(null);
  const [, setCollectionMessageType] = useState(null);
  const [isNewCollectionMenuOpen, setIsNewCollectionMenuOpen] = useState(false);

  const handleCollectionsUpdated = async () => {
    await refreshFavorites();
  };

  //TODO: extract filtering to individual component
  return (
      <div className="main-content">
        <div className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h1 className="h1 fw-bold green mb-4">Your favorites</h1>
          </div>

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
          {isLoading && <p>Loading your favorites...</p>}
          {error && <p className="text-danger">{error}</p>}
          {!isLoading && !error && favoriteRecipes.length === 0 && <p className="green">You do not have any recipes marked as favorite yet.</p>}
          {!isLoading && !error && favoriteRecipes.length > 0 && <RecipeList recipes={favoriteRecipes} />}
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