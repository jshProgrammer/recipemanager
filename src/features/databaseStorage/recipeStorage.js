import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const saveRecipe = async (userID, recipe) => {
  try {
    await addDoc(collection(db, "users", userID, "recipes"), recipe);
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
