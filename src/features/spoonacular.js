const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;

export async function searchRecipes(query) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=10&apiKey=${apiKey}`
  );
  if (!response.ok) throw new Error("Fehler beim Laden der Rezepte");
  return response.json();
}

export async function getRecipeInformation(id) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
  );
  if (!response.ok) throw new Error("Fehler beim Laden der Rezeptdetails");
  return response.json();
}