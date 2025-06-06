import { setDoc, doc, getDoc } from "firebase/firestore";
import {db} from '../firebase.js'

export const writeCustomSettingsToDB = async ({userid, settings}) => {
    try{
        await setDoc(doc(db, "settings", userid), settings);
        console.log("Settings gespeichert!");
    } catch(e) {
        console.error("Fehler beim Speichern:", e);
    }
}

export const readCustomSettingsFromDB = async ({userid}) => {
    const docRef = doc(db, "settings", userid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        return null;
    }
}