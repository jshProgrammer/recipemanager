import './styles/App.css';

import { recipes } from './data/SampleData';
import { useAuth } from './features/authentication.js';

import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";

import Header from './components/subcomponents/Header.js';
import SearchBar from "./components/subcomponents/SearchBar.js";
import RecipeList from "./components/lists/RecipeList.js";
import IntroSection from "./components/subcomponents/IntroSection.js";
import LoginSignupMobile from "./components/pages/LoginSignUpMobile.js"

import Settings from './components/pages/Settings.js'
import OwnRecipes from './components/pages/OwnRecipes.js';
import CustomCollection from './components/pages/CustomCollection.js';
import CreateEditOwnRecipe from './components/pages/CreateEditOwnRecipe.js';
import RecipeDetail from './components/pages/RecipeDetail.js';

import { detailedRecipes } from './data/DetailedSampleData';

import RecipeSearch from "./components/RecipeSearch";

function CustomCollectionWrapper({ user }) {
  const { collectionName } = useParams();
  return <CustomCollection user={user} collectionName={collectionName} />;
}

function CreateEditOwnRecipeWrapper({ user }) {
  const { collectionName } = useParams();
  return <CreateEditOwnRecipe user={user} collectionName={collectionName} />;
}

function RecipeDetailWrapper() {
  const { recipeName } = useParams();
  const recipe = detailedRecipes.find(r => r.title === recipeName);
  return <RecipeDetail recipe={recipe} />;
}

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

      <Route path="/collections/:collectionName"
        element={<CustomCollectionWrapper user={user} />}/>

      <Route path="/collections/:collectionName/create"
        element={<CreateEditOwnRecipeWrapper user={user} />}/>

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
