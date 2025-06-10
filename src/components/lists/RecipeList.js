import RecipeCard from "../cards/RecipeCard";
import { Link } from "react-router-dom";

export default function RecipeList({ recipes, isOwnRecipe=false }) {
return (
    <div className="d-flex flex-wrap gap-4 justify-content-center">
        {recipes.map((recipe, index) => (
            <div key={index}>
                <Link to={isOwnRecipe
                    ? `/own-recipes/${encodeURIComponent(recipe.id)}` 
                    : `/recipes/${encodeURIComponent(recipe.title)}`}
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                    >
                    <RecipeCard {...recipe} />
                </Link>
        </div>
        ))}
    </div>
);
}