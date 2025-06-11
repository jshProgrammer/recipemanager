import { setDoc, doc, getDoc, getDocs, collection, query, deleteDoc, where } from "firebase/firestore";
import {db} from '../firebase.js';

export const storeCollectionInDB = async ({userID, customCollection}) => {
    try{
        await setDoc(doc(db, "users", userID, "collections", customCollection.collectionName), customCollection);
        console.log("Collection stored successfully");
    } catch(e) {
        console.error("Error while storing collection:", e);
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
    throw new Error("userID or collectionName missing");
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
    console.error("Error while loading collection", e);
    return [];
  }
};

export const removeRecipeFromAllCollections = async (userID, recipeId) => {
  try {
    const collectionsSnapshot = await getDocs(collection(db, "users", userID, "collections"));
    
    for (const collectionDoc of collectionsSnapshot.docs) {
      const collectionName = collectionDoc.id;
      const recipesRef = collection(db, "users", userID, "collections", collectionName, "recipes");
      const recipesQuery = query(recipesRef, where("recipeId", "==", recipeId));
      const recipesSnapshot = await getDocs(recipesQuery);
      
      for (const recipeDoc of recipesSnapshot.docs) {
        await deleteDoc(recipeDoc.ref);
      }
    }
  } catch (e) {
    console.error("Error removing recipe from collections:", e);
  }
};