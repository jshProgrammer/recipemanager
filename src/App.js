import logo from './logo.svg';
import './App.css';

import { recipes } from './data/SampleData';

import Header from './components/Header';
import SearchBar from "./components/SearchBar";
import RecipeList from "./components/RecipeList";
import IntroSection from "./components/IntroSection";


function App() {


return (
<div className="container py-4">
  <Header />

  <IntroSection/>

  <h2 className="green fw-bold mt-5" id="suggestions">Great suggestions</h2>
  <RecipeList recipes={recipes.slice(0, 3)} />
  
  <div class="bgLightGreen p-4 rounded-4 mt-4">
    <SearchBar id="search" />
    <RecipeList recipes={recipes.slice(3)} />
  </div>
  
  <footer className="text-center mt-5 text-muted">
  <p className="mb-0">RecipeManager</p>
  <p className="small">Impressum • Your first steps with RecipeManager</p>
  </footer>
</div>
);
}

export default App;