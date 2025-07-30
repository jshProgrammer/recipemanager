export const generateRecipeTags = (spoonacularRecipe) => {
  
  if (!spoonacularRecipe) return [];

  const tags = [
   ...(spoonacularRecipe.vegetarian ? ["Vegetarian"] : []),
        ...(spoonacularRecipe.vegan ? ["Vegan"] : []),
        ...(spoonacularRecipe.glutenFree ? ["Gluten-Free"] : []),
        ...(spoonacularRecipe.dairyFree ? ["Dairy-Free"] : []),
        ...(spoonacularRecipe.veryHealthy ? ["Healthy"] : []),
        ...(spoonacularRecipe.cheap ? ["Budget-Friendly"] : []),
        ...(spoonacularRecipe.veryPopular ? ["Popular"] : []),
        ...(spoonacularRecipe.readyInMinutes <= 30 ? ["Fast"] : [])
  ];

  return tags;
};