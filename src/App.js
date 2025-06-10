import './styles/App.css';

import { recipes } from './data/SampleData';
import { useAuth } from './features/authentication.js';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from './components/subcomponents/Header.js';
import RecipeList from "./components/lists/RecipeList.js";
import IntroSection from "./components/subcomponents/IntroSection.js";
import LoginSignupMobile from "./components/pages/LoginSignUpMobile.js"
import Settings from './components/pages/Settings.js'
import OwnRecipes from './components/pages/OwnRecipes.js';
import RecipeSearch from "./components/RecipeSearch";

import {
  CustomCollectionWrapper,
  CreateEditOwnRecipeWrapper,
  RecipeDetailWrapper,
  OwnRecipeDetailWrapper
} from './components/RouteWrappers.js';


function App() {
  const { user, isLoading } = useAuth();

  return (
    <Router>
    <div className="container py-4">
      <Header />
      <Routes>
          <Route path="/" element={
            <div>

              <IntroSection user={user}/>

              <h2 className="green fw-bold mt-5" id="suggestions">Great suggestions</h2>
              <RecipeList recipes={recipes.slice(0, 3)} />
              
              <div class="bgLightGreen p-4 rounded-4 mt-4">
                <RecipeSearch />
                <RecipeList recipes={recipes.slice(3)} />
              </div>
            </div>
          }/>

      {/* TODO <Route path="/favorites" element={..} /> */}

      <Route path="/login" element={<LoginSignupMobile/>} />

      <Route path="/ownRecipes" element={<OwnRecipes user={user}/>} />

      <Route path="/own-recipes/:recipeID" element={<OwnRecipeDetailWrapper user={user} />}/>

      <Route path="/collections/:collectionName"
        element={<CustomCollectionWrapper user={user} />}/>

      <Route path="/collections/:collectionName/create"
        element={<CreateEditOwnRecipeWrapper user={user} />}/>

      <Route path="/recipes/:recipeName"
        element={<RecipeDetailWrapper/>}/>

      <Route path="/settings" element={<Settings user={user}/>} />

      </Routes>

      <footer className="text-center mt-5 text-muted">
        <p className="mb-0">RecipeManager</p>
        <p className="small">Impressum • Your first steps with RecipeManager</p>
      </footer>

    </div>
  </Router>
  );
  }

export default App;
