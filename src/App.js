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
import CustomCollection from './components/pages/CustomCollection.js';
import CreateEditOwnRecipe from './components/pages/CreateEditOwnRecipe.js';
import RecipeDetail from './components/pages/RecipeDetail.js';
import Favorites from './components/pages/Favorites.js'

import { detailedRecipes } from './data/DetailedSampleData';

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
              <RecipeList useRandomRecipes={true} numberOfRecipes={4} />
              
              <div class="bgLightGreen p-4 rounded-4 mt-4">
                <RecipeSearch />
              </div>
            </div>
          }/>

      <Route path="/login" element={<LoginSignupMobile/>} />

      <Route path="/favorites" element={<Favorites/>} />

      <Route path="/ownRecipes" element={<OwnRecipes user={user}/>} />
      <Route path="/ownRecipes/:recipeID" element={<OwnRecipeDetailWrapper user={user}/>} />

      {/*separate routes for recipes inside collection and the ones assigned to None */}
      <Route path="/own-recipes/create" element={<CreateEditOwnRecipeWrapper user={user} />}/>
      <Route path="/own-recipes/edit/:recipeID" element={<CreateEditOwnRecipeWrapper user={user} />}/>

      <Route path="/collections/:collectionName" element={<CustomCollectionWrapper user={user} />}/>
      <Route path="/collections/:collectionName/:recipeID" element={<OwnRecipeDetailWrapper user={user} />}/>
      <Route path="/collections/:collectionName/create" element={<CreateEditOwnRecipeWrapper user={user} />}/>
      <Route path="/collections/:collectionName/edit/:recipeID" element={<CreateEditOwnRecipeWrapper user={user} />}/>
      

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
