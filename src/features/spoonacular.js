const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;

//TODO: do we need this? (or only searchRecepiesAdvanced())
export async function searchRecipes(query) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=10&apiKey=${apiKey}`
  );
  if (!response.ok) throw new Error("Error when loading recipes " + response);
  return response.json();
}

export async function getRecipeInformation(id) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
  );
  if (!response.ok) throw new Error("Error when loading recipe details");
  return response.json();
}

export async function searchRecipesAdvanced(options = {}) {
  const {
    query = '',
    diet = '', // vegetarian, vegan, gluten-free etc.
    intolerances = '', // dairy, egg, gluten etc.
    type = '', // main course, side dish, dessert etc.
    cuisine = '', // italian, mexican etc.
    maxReadyTime = '', // in minutes
    minProtein = '',
    maxCalories = '',
    sort = 'popularity', // popularity, healthiness, price, time, random
    number = 10
  } = options;

  let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=${number}&sort=${sort}`;
  
  if (query) url += `&query=${encodeURIComponent(query)}`;
  if (diet) url += `&diet=${diet}`;
  if (intolerances) url += `&intolerances=${intolerances}`;
  if (type) url += `&type=${type}`;
  if (cuisine) url += `&cuisine=${cuisine}`;
  if (maxReadyTime) url += `&maxReadyTime=${maxReadyTime}`;
  if (minProtein) url += `&minProtein=${minProtein}`;
  if (maxCalories) url += `&maxCalories=${maxCalories}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Error when searching recipes");
  return response.json();
}

export async function findRecipesByIngredients(ingredients, number = 10) {
  const ingredientsString = Array.isArray(ingredients) ? ingredients.join(',') : ingredients;
  const response = await fetch(
    `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsString)}&number=${number}&apiKey=${apiKey}`
  );
  if (!response.ok) throw new Error("Error when searching recipes by ingredients");
  return response.json();
}

export async function getRandomRecipes(options = {}) { //can be used when user isn't registered yet/ uses app for the first time
  const {
    number = 10,
    tags = '', // vegetarian, dessert, etc.
  } = options;

  let url = `https://api.spoonacular.com/recipes/random?number=${number}&apiKey=${apiKey}`;
  if (tags) url += `&tags=${tags}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Error when loading random recipes");
  return response.json();
}

export async function getSimilarRecipes(id, number = 10) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/${id}/similar?number=${number}&apiKey=${apiKey}`
  );
  if (!response.ok) throw new Error("Error when loading similar recipes");
  return response.json();
}

export async function getRecipeNutrition(id) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json?apiKey=${apiKey}`
  );
  if (!response.ok) throw new Error("Error when loading nutrition information");
  return response.json();
}

export async function getRecipeIngredients(id) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/${id}/ingredientWidget.json?apiKey=${apiKey}`
  );
  if (!response.ok) throw new Error("Error when loading ingredients");
  return response.json();
}

export async function getRecipeEquipment(id) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/${id}/equipmentWidget.json?apiKey=${apiKey}`
  );
  if (!response.ok) throw new Error("Error when loading equipment information");
  return response.json();
}

export async function getRecipeInstructions(id) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${apiKey}`
  );
  if (!response.ok) throw new Error("Error when loading recipe instructions");
  return response.json();
}

export async function searchRecipesByNutrients(options = {}) {
  const {
    minCarbs = '',
    maxCarbs = '',
    minProtein = '',
    maxProtein = '',
    minCalories = '',
    maxCalories = '',
    minFat = '',
    maxFat = '',
    number = 10
  } = options;

  let url = `https://api.spoonacular.com/recipes/findByNutrients?number=${number}&apiKey=${apiKey}`;
  
  if (minCarbs) url += `&minCarbs=${minCarbs}`;
  if (maxCarbs) url += `&maxCarbs=${maxCarbs}`;
  if (minProtein) url += `&minProtein=${minProtein}`;
  if (maxProtein) url += `&maxProtein=${maxProtein}`;
  if (minCalories) url += `&minCalories=${minCalories}`;
  if (maxCalories) url += `&maxCalories=${maxCalories}`;
  if (minFat) url += `&minFat=${minFat}`;
  if (maxFat) url += `&maxFat=${maxFat}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Error when searching recipes by nutrients");
  return response.json();
}

export async function autocompleteRecipeSearch(query, number = 10) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/autocomplete?query=${encodeURIComponent(query)}&number=${number}&apiKey=${apiKey}`
  );
  if (!response.ok) throw new Error("Error when getting autocomplete suggestions");
  return response.json();
}

export async function generateMealPlan(options = {}) { //could be nice to have
  const {
    timeFrame = 'day', // day, week
    targetCalories = '',
    diet = '',
    exclude = ''
  } = options;

  let url = `https://api.spoonacular.com/mealplanner/generate?timeFrame=${timeFrame}&apiKey=${apiKey}`;
  
  if (targetCalories) url += `&targetCalories=${targetCalories}`;
  if (diet) url += `&diet=${diet}`;
  if (exclude) url += `&exclude=${exclude}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Error when generating meal plan");
  return response.json();
}

export async function getRecipeSummary(id) { //maybe could be added to recipe cards
  const response = await fetch(
    `https://api.spoonacular.com/recipes/${id}/summary?apiKey=${apiKey}`
  );
  if (!response.ok) throw new Error("Error when loading recipe summary");
  return response.json();
}

export async function getRecipePriceBreakdown(id) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/${id}/priceBreakdownWidget.json?apiKey=${apiKey}`
  );
  if (!response.ok) throw new Error("Error when loading price information");
  return response.json();
}

//helper functions:
export const availableDiets = [
  'gluten-free',
  'ketogenic',
  'vegetarian',
  'lacto-vegetarian',
  'ovo-vegetarian',
  'vegan',
  'pescetarian',
  'paleo',
  'primal',
  'low-fodmap',
  'whole30'
];

export const availableIntolerances = [
  'dairy',
  'egg',
  'gluten',
  'grain',
  'peanut',
  'seafood',
  'sesame',
  'shellfish',
  'soy',
  'sulfite',
  'tree-nut',
  'wheat'
];

export const availableMealTypes = [
  'main course',
  'side dish',
  'dessert',
  'appetizer',
  'salad',
  'bread',
  'breakfast',
  'soup',
  'beverage',
  'sauce',
  'marinade',
  'fingerfood',
  'snack',
  'drink'
];

export const availableCuisines = [
  'african',
  'american',
  'british',
  'cajun',
  'caribbean',
  'chinese',
  'eastern-european',
  'european',
  'french',
  'german',
  'greek',
  'indian',
  'irish',
  'italian',
  'japanese',
  'jewish',
  'korean',
  'latin-american',
  'mediterranean',
  'mexican',
  'middle-eastern',
  'nordic',
  'southern',
  'spanish',
  'thai',
  'vietnamese'
];