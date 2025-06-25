import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import {db} from '../firebase.js'

// necessary since firebase expects to find an even number of doc segments
const SETTINGS_DOC_ID = "main";

export const writeCustomSettingsToDB = async ({userID, settings}) => {
    try{
        await setDoc(doc(db, "users", userID, "settings", SETTINGS_DOC_ID), settings);
        console.log("Settings stored successfully");
    } catch(e) {
        console.error("Error while storing settings:", e);
    }
}

export const readCustomSettingsFromDB = async ({userID}) => {
    const docRef = doc(db, "users", userID, "settings", SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        return null;
    }
}

export const getUserHealthScore = async ({ user }) => {
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return [data.healthScore ?? null, data.amountOfRecipes ?? null]
  } else {
    return [null, null];
  }
};

export const updateUserHealthScoreInDB = async ({ userID, healthScoreOfNewRecipe }) => {
  const docRef = doc(db, "users", userID);
  try {
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error("User document does not exist");
      return false;
    }

    const data = docSnap.data();

    const newAmountOfRecipes = data.amountOfRecipes + 1;
    const newHealthScoreTotal = data.healthScoreTotal + healthScoreOfNewRecipe;
    const newHealthScore = Math.round(newHealthScoreTotal / newAmountOfRecipes);

    await updateDoc(docRef, {
      amountOfRecipes: newAmountOfRecipes,
      healthScoreTotal: newHealthScoreTotal,
      healthScore: newHealthScore
    });

    return true;
  } catch (error) {
    console.error("Failed to update health score:", error);
    return false;
  }
};


export const initializeUserDocument = async (userID) => {
  const userDocRef = doc(db, "users", userID);

  try {
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      await setDoc(userDocRef, {
        healthScore: 0,
        amountOfRecipes: 0,
        healthScoreTotal: 0,
      });
    }
  } catch (error) {
    console.error("Error checking or initializing user document:", error);
  }
};