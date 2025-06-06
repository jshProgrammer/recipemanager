import RecipeCard from "../cards/RecipeCard";

export default function RecipeList({ recipes }) {
return (
    <div className="d-flex flex-wrap gap-4 justify-content-center">
        {recipes.map((recipe, index) => (
        <RecipeCard key={index} {...recipe} />
        ))}
    </div>
);
}