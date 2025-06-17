import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { removeRecipeFromAllCollections } from "./collectionsStorage";

export const saveRecipe = async (userID, recipe, collectionName=null) => {
  try {
    const recipeRef = await addDoc(collection(db, "users", userID, "recipes"), recipe);
    if(collectionName != null) {
      await addDoc(collection(db, "users", userID, "collections", collectionName, "recipes"), {recipeId: recipeRef.id});
    }
    console.log("Recipe stored successfully");
  } catch (e) {
    console.error("Error while storing recipe:", e);
  }
};

export const updateRecipe = async (recipeID, userID, recipe, collectionName=null) => {
  try {
    const docRef = doc(db, "users", userID, "recipes", recipeID);
    await updateDoc(docRef, recipe);
    await removeRecipeFromAllCollections(userID, recipeID);
    if (collectionName != null) {
      await addDoc(collection(db, "users", userID, "collections", collectionName, "recipes"), {
        recipeId: recipeID
      });
    }
    console.log("Recipe updated successfully");
  } catch(e) {
    console.error("Error while updating recipe: ", e)
  }
}

export const loadRecipes = async (userID) => {
  const querySnapshot = await getDocs(collection(db, "users", userID, "recipes"));
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push({ id: doc.id, ...doc.data() });
  });
  return result;
};

export const loadRecipeById = async (userID, recipeId) => {
  try {
    const docRef = doc(db, "users", userID, "recipes", recipeId);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      data.nutrition = normalizeNutrition(data.nutrition);
      
      return { id: docSnap.id, ...data };
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error while loading own recipe:", e);
    return null;
  }
};

export const deleteRecipe = async (userID, recipeID) => {
  try {
    await removeRecipeFromAllCollections(userID, recipeID);

    const recipeDocRef = doc(db, "users", userID, "recipes", recipeID);
    await deleteDoc(recipeDocRef);

    console.log("Recipe deleted successfully");
  } catch (e) {
    console.error("Error while deleting recipe: ", e);
  }
};

const normalizeNutrition = (nutrition) => {
  if (Array.isArray(nutrition)) {
    return nutrition;
  } else if (nutrition && typeof nutrition === 'object') {
    return Object.entries(nutrition).map(([key, value]) => ({
      key,
      value
    }));
  }
  return [];
};
