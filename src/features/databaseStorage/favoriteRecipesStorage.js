import { db } from "../firebase";
import {doc, setDoc, deleteDoc, getDocs, getDoc, collection, updateDoc, addDoc} from "firebase/firestore";
import {getRecipeInformation} from "../spoonacular.js";

export const addRecipeToFavorites = async (userID, recipeID, collectionName) => {
    const name = typeof collectionName === "string" ? collectionName : collectionName?.collectionName;

    try {
        await setDoc(doc(db, "users", userID, "favorites", recipeID), {
            recipeId: recipeID,
            timestamp: new Date(),
        });


        if(collectionName != null) {
            await addDoc(collection(db, "users", userID, "favoriteCollections", name, "recipes"), {
                recipeId: recipeID
            });

        }

        console.log(`Recipe ${recipeID} added to favorites and collection ${collectionName}`);
    } catch (e) {
        console.error("Error adding to favorites:", e);
    }
};

export const removeRecipeFromFavorites = async (userID, recipeID) => {
    try {
        await deleteDoc(doc(db, "users", userID, "favorites", recipeID));
        await removeRecipeFromAllCollections(userID, recipeID);
        console.log("Recipe removed from favorites");
    } catch (e) {
        console.error("Error removing from favorites:", e);
    }
};

export const removeRecipeFromAllCollections = async (userID, recipeID) => {
    try {
        const collectionsRef = collection(db, "users", userID, "favoriteCollections");
        const collectionsSnapshot = await getDocs(collectionsRef);

        for (const collectionDoc of collectionsSnapshot.docs) {
            const recipesRef = collection(collectionDoc.ref, "recipes");
            const recipesSnapshot = await getDocs(recipesRef);
            for (const recipeDoc of recipesSnapshot.docs) {
                const recipeData = recipeDoc.data();
                if (recipeData.recipeId === recipeID) {
                    await deleteDoc(recipeDoc.ref);
                    console.log(`Recipe ${recipeID} removed from collection ${collectionDoc.id}`);
                }
            }
        }
        console.log(`Recipe ${recipeID} removed from all collections`);
    } catch (e) {
        console.error("Error removing recipe from all collections:", e);
    }
}

export const loadFavoriteCollectionsOfUser = async (userID) => {
    try {
        const collectionsRef = collection(db, "users", userID, "favoriteCollections");
        const querySnapshot = await getDocs(collectionsRef);

        const collections = [];
        querySnapshot.forEach((doc) => {
            collections.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(`Loaded ${collections.length} collections for user ${userID}`);
        return collections;
    } catch(e) {
        console.error("Error while loading collections:", e);
        return [];
    }
}

export const isRecipeFavorite = async (userID, recipeID) => {
    const docRef = doc(db, "users", userID, "favorites", recipeID);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
};

export const loadFavoriteRecipes = async (userID) => {
    const favSnapshot = await getDocs(collection(db, "users", userID, "favorites"));
    const recipes = await Promise.all(
        favSnapshot.docs.map(doc => getRecipeInformation(doc.data().recipeId))
    );
    console.log(recipes);
    return recipes;
};

export const loadRecipesOfFavoritesCollection = async ({userID, collectionName}) => {
    try {
        const recipesRef = collection(db, "users", userID, "favoriteCollections", collectionName, "recipes");
        const querySnapshot = await getDocs(recipesRef);

        const recipes = [];
        for (const doc of querySnapshot.docs) {
            const recipeData = await getRecipeInformation(doc.data().recipeId);
            recipes.push(recipeData);
        }

        console.log(`Loaded ${recipes.length} recipes from collection ${collectionName}`);
        return recipes;
    } catch(e) {
        console.error("Error while loading recipes from collection:", e);
        return [];
    }
}


export const storeFavoriteCollectionInDB = async ({userID, customCollection}) => {
    try {
        if (!customCollection || !customCollection.collectionName) {
            console.error("Invalid customCollection object:", customCollection);
            return;
        }

        await setDoc(doc(db, "users", userID, "favoriteCollections", customCollection.collectionName), customCollection);
        console.log("Collection stored successfully");
    } catch(e) {
        console.error("Error while storing collection:", e);
    }
}