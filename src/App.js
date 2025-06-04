import logo from './logo.svg';
import './App.css';

import { recipes } from './data/SampleData';

import RecipeList from "./components/RecipeList";
import IntroSection from "./components/IntroSection";


function App() {


return (
<div className="container py-4">
  

  <IntroSection/>

  <h2 className="green fw-bold mt-5">Great suggestions</h2>
  <RecipeList recipes={recipes.slice(0, 3)} />
  
 
  
  <footer className="text-center mt-5 text-muted">
  <p className="mb-0">RecipeManager</p>
  <p className="small">Impressum • Your first steps with RecipeManager</p>
  </footer>
</div>
);
}

export default App;