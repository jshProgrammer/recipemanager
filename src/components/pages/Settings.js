import { useEffect, useState } from "react";
import '../../styles/Settings.css'
import LoadingIndicator from "../subcomponents/LoadingIndicator.js";
import { writeCustomSettingsToDB, readCustomSettingsFromDB } from '../../features/databaseStorage/customSettingsStorage';

export default function Settings({user}) {
    const [formState, setFormState] = useState({
        dietaryPreference: 'none',
        lactoseIntolerance: false,
        glutenIntolerance: false,
        nutAllergy: false,
        caffeineSensitivity: false,
        eggIntolerance: false,
        chocolateSensitivity: false,
    });

    const [loading, setLoading] = useState(true);
    const [storeMessage, setStoreMessage] = useState(null);
    const [storeMessageType, setStoreMessageType] = useState(null);
    
    const dietaryOptions = [
        { id: 'noPreferences', default: 'none', label: 'None'},
        { id: 'vegetarian', value: 'vegetarian', label: 'Vegetarian' },
        { id: 'vegan', value: 'vegan', label: 'Vegan'}
    ];

    const nutritionalIntolerances = [
        { id: 'lactoseIntolerance', value: 'lactoseIntolerance', label: 'Lactose Intolerance'},
        { id: 'glutenIntolerance', value: 'glutenIntolerance', label: 'Gluten Intolerance'},
        { id: 'nutAllergy', value: 'nutAllergy', label: 'Nut allergy'},
        { id: 'caffeineSensitivity', value: 'caffeineSensitivity', label: 'Caffeine Sensitivity'},
        { id: 'eggIntolerance', value: 'eggIntolerance', label: 'Egg Intolerance'},
        { id: 'chocolateSensitivity', value: 'chocolateSensitivity', label: 'Chocolate Sensitivity'},
    ];

    const [settings, setSettings] = useState(null);

    useEffect(() => {
        if (user?.uid) {
            readCustomSettingsFromDB({ userID: user.uid }).then(data => {
                setSettings(data);
                setLoading(false);
            });
        }
    }, [user]);

    useEffect(() => {
        if (settings) {
            setFormState({
            dietaryPreference: settings.dietaryPreference || 'none',
            lactoseIntolerance: settings.lactoseIntolerance || false,
            glutenIntolerance: settings.glutenIntolerance || false,
            nutAllergy: settings.nutAllergy || false,
            caffeineSensitivity: settings.caffeineSensitivity || false,
            eggIntolerance: settings.eggIntolerance || false,
            chocolateSensitivity: settings.chocolateSensitivity || false,
            });
        }
    }, [settings]);

    async function storeInDB() {
        const dietaryPreference = document.querySelector('input[name="dietaryPreferences"]:checked')?.value || 'none';

        const intolerances = {};
        nutritionalIntolerances.forEach(option => {
            const checked = document.getElementById(option.id)?.checked || false;
            intolerances[option.value] = checked;
        });

        try {
            await writeCustomSettingsToDB({
                userID: user.uid,
                settings: {
                dietaryPreference,
                ...intolerances
                }
            }).then( () => {
                setStoreMessage("Settings stored successfully");
                setStoreMessageType("success");
                setTimeout(() => {
                    setStoreMessage(null);
                    setStoreMessageType(null);
                }, 5000);
            })
        } catch(err) {
            setStoreMessage("Error when storing settings: " + err.message);
            setStoreMessageType("error");
        }
    }

    if(loading) {
        return (
            <LoadingIndicator heading="Your profile"/>
        );
    }

    return (
        <div className="main-content">
            <h2 className="green fw-bold mt-5">Your profile</h2>

            {storeMessage && (
                <div className={`alert ${storeMessageType === "success" ? "alert-success" : "alert-danger"} mt-2 w-100 text-center`} role="alert">
                {storeMessage}
                </div>
            )}

           <div className="d-flex flex-column flex-md-row align-items-start mb-4">
                <p className="fw-bold mb-0 me-4" style={{ minWidth: 0, whiteSpace: "nowrap" }}>
                    Your dietary preferences
                </p>
            <div style={{ flex: 1 }}>
            {dietaryOptions.map(option => (
                <div className="form-check" key={option.id}>
                    <input
                        type="radio"
                        className="form-check-input"
                        id={option.id}
                        name="dietaryPreferences"
                        value={option.value}
                        checked={formState.dietaryPreference === option.value}
                        onChange={() => setFormState(fs => ({ ...fs, dietaryPreference: option.value }))}/>
                    <label className="form-check-label" htmlFor={option.id}>
                        {option.label}
                    </label>
                </div>
            ))}
            </div>

            </div>

            <div className="d-flex flex-column flex-md-row align-items-start mb-4">
                <p className="fw-bold mb-0 me-4" style={{ minWidth: 0, whiteSpace: "nowrap" }}>
                    Nutritional Information
                </p>
                <div style={{ flex: 1 }}>

                {nutritionalIntolerances.map(option => (
                    <div className="form-check">
                        <input className="form-check-input" 
                        type="checkbox" 
                        id={option.id} 
                        name="nutritialIntolerances" 
                        value={option.value}
                        checked={formState[option.value]}
                        onChange={e => setFormState(fs => ({ ...fs, [option.value]: e.target.checked }))}/>
                        <label className="form-check-label" htmlFor={option.id}>{option.label}</label>
                    </div>
                ))}
                </div>

            </div>

            <button className="btn mt-4 backgroundGreen" type="submit" onClick={storeInDB}>Save</button>

           
        </div>
    )
}