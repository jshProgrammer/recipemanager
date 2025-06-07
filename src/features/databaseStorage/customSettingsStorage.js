import { setDoc, doc, getDoc } from "firebase/firestore";
import {db} from '../firebase.js'

// necessary since firebase expects to find an even number of doc segments
const SETTINGS_DOC_ID = "main";

export const writeCustomSettingsToDB = async ({userID, settings}) => {
    try{
        await setDoc(doc(db, "users", userID, "settings", SETTINGS_DOC_ID), settings);
        console.log("Settings gespeichert!");
    } catch(e) {
        console.error("Fehler beim Speichern:", e);
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