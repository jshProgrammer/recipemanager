import { collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export const saveRecipe = async (userID, recipe, collectionName=null) => {
  try {
    const recipeRef = await addDoc(collection(db, "users", userID, "recipes"), recipe);
    if(collectionName != null) {
      await addDoc(collection(db, "users", userID, "collections", collectionName, "recipes"), {recipeId: recipeRef.id});
    }
    console.log("Rezept gespeichert!");
  } catch (e) {
    console.error("Fehler beim Speichern:", e);
  }
};

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
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error while loading own recipe:", e);
    return null;
  }
};