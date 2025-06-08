import { setDoc, doc, getDoc, getDocs, collection } from "firebase/firestore";
import {db} from '../firebase.js';

export const storeCollectionInDB = async ({userID, customCollection}) => {
    try{
        await setDoc(doc(db, "users", userID, "collections", customCollection.collectionName), customCollection);
        console.log("Collection gespeichert!");
    } catch(e) {
        console.error("Fehler beim Speichern:", e);
    }
}

export const loadCollectionsOfUser = async (userID) => {
  const querySnapshot = await getDocs(collection(db, "users", userID, "collections"), collection);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push({ id: doc.id, ...doc.data() });
  });
  return result;
};

export const loadRecipesOfCollection = async ({ userID, collectionName }) => {
  if (!userID || !collectionName) {
    throw new Error("userID oder collectionName fehlt!");
  }
  
  try {
    const collectionRef = collection(db, "users", userID, "collections", collectionName, "recipes");
    const querySnapshot = await getDocs(collectionRef);
    
    const recipeIds = [];
    querySnapshot.docs.forEach(doc => {
      recipeIds.push(doc.data().recipeId);
    });
    
    const recipes = [];
    for (const recipeId of recipeIds) {
      const recipeDoc = await getDoc(doc(db, "users", userID, "recipes", recipeId));
      if (recipeDoc.exists()) {
        recipes.push({ id: recipeDoc.id, ...recipeDoc.data() });
      }
    }
    
    return recipes;
  } catch (e) {
    console.error("Fehler beim Laden der Collection:", e);
    return [];
  }
};