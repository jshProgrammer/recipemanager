import './styles/App.css';

import { recipes } from './data/SampleData';
import { AuthProvider, useAuth } from './features/providers/AuthContext.js';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from './components/subcomponents/Header.js';
import MobileTabBar from './components/subcomponents/MobileTabBar.js';
import RecipeList from "./components/lists/RecipeList.js";
import IntroSection from "./components/subcomponents/IntroSection.js";
import LoginSignupMobile from "./components/pages/LoginSignUpMobile.js"
import Settings from './components/pages/Settings.js'
import OwnRecipes from './components/pages/OwnRecipes.js';
import Favorites from './components/pages/Favorites.js'
import Profile from './components/pages/Profile.js'
import NoPage from "./components/pages/NoPage";

import RecipeSearch from "./components/RecipeSearch";

import {
  CustomCollectionWrapper,
  CreateEditOwnRecipeWrapper,
  RecipeDetailWrapper,
  OwnRecipeDetailWrapper
} from './components/RouteWrappers.js';
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";


function App() {

  return (
        <Router>
        <ScrollToTop />
        <div className="container py-4">
          <Header />
          <Routes>
              <Route path="/" element={
                <div>

                  <IntroSection/>

                  <h2 className="green fw-bold mt-5" id="suggestions">Great suggestions</h2>
                  <RecipeList useRandomRecipes={true} numberOfRecipes={4} />

                  <div className="bgLightGreen p-4 rounded-4 mt-4">
                    <RecipeSearch />
                  </div>
                </div>
              }/>

          <Route path="/login" element={<LoginSignupMobile/>} />

          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites/></ProtectedRoute>} />
          <Route path="/favorites/collections/:collectionName" element={<ProtectedRoute><CustomCollectionWrapper isOwnRecipes={false}/></ProtectedRoute>} />

          <Route path="/ownRecipes" element={
            <ProtectedRoute><OwnRecipes/></ProtectedRoute>} />
          <Route path="/ownRecipes/:recipeID" element={
            <ProtectedRoute><OwnRecipeDetailWrapper/></ProtectedRoute>}/>

          {/*separate routes for recipes inside collection and the ones assigned to None */}
          <Route path="/own-recipes/create" element={<ProtectedRoute><CreateEditOwnRecipeWrapper /></ProtectedRoute>}/>
          <Route path="/own-recipes/edit/:recipeID" element={<CreateEditOwnRecipeWrapper />}/>

          <Route path="/collections/:collectionName" element={<ProtectedRoute><CustomCollectionWrapper isOwnRecipes={true} /></ProtectedRoute>}/>
          <Route path="/collections/:collectionName/:recipeID" element={<ProtectedRoute><OwnRecipeDetailWrapper/></ProtectedRoute>}/>
          <Route path="/collections/:collectionName/create" element={<ProtectedRoute><CreateEditOwnRecipeWrapper /></ProtectedRoute>}/>
          <Route path="/collections/:collectionName/edit/:recipeID" element={<ProtectedRoute><CreateEditOwnRecipeWrapper /></ProtectedRoute>}/>


          <Route path="/recipes/:recipeName"
            element={<RecipeDetailWrapper/>}/>

          <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>} />

          <Route path="*" element={<NoPage/>}/>

          </Routes>

          <footer className="text-center mt-5 text-muted">
            <p className="mb-0">RecipeManager</p>
            <p className="small">Impressum • Your first steps with RecipeManager</p>
          </footer>

        </div>
        <MobileTabBar />
      </Router>
  );
}

export default App;
