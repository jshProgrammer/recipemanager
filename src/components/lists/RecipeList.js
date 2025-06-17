import RecipeCard from "../cards/RecipeCard";
import { Link } from "react-router-dom";

export default function RecipeList({ recipes, collectionName=null, isOwnRecipe=false, user=null }) {
return (
    <div className="d-flex flex-wrap gap-4 justify-content-center">
        {recipes.map((recipe, index) => (
            <div key={index}>
                <Link to={isOwnRecipe
                    ? `/collections/${encodeURIComponent(collectionName)}/${encodeURIComponent(recipe.id)}` 
                    : `/recipes/${encodeURIComponent(recipe.title)}`}
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                    >
                    <RecipeCard id={recipe.id} {...recipe} isEditable={isOwnRecipe} collectionName={collectionName} user={user} />
                </Link>
        </div>
        ))}
    </div>
);
}