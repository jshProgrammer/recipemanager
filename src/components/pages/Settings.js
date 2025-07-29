import { useEffect, useState } from "react";
import '../../styles/Settings.css'
import LoadingIndicator from "../subcomponents/LoadingIndicator.js";
import { writeCustomSettingsToDB, readCustomSettingsFromDB } from '../../features/databaseStorage/userStorage.js';
import {useAuth} from "../../features/providers/AuthContext";

export default function Settings() {
    const { user } = useAuth();

    const [formState, setFormState] = useState({
        dietaryPreference: 'none',
        lactoseIntolerance: false,
        glutenIntolerance: false,
        nutAllergy: false,
        caffeineSensitivity: false,
        eggIntolerance: false,
        chocolateSensitivity: false,
    });

    const [equipmentState, setEquipmentState] = useState({});
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
        { id: 'eggIntolerance', value: 'eggIntolerance', label: 'Egg Intolerance'},
    ];

    const equipmentList = [
        'skimmer', 'pie form', 'glass baking pan', 'garlic press', 'meat grinder', 'tongs',
        'bread knife', 'tajine pot', 'wire rack', 'mincing knife', 'cherry pitter', 'wooden skewers',
        'kitchen scissors', 'blow torch', 'broiler pan', 'heart shaped silicone form',
        'grill', 'immersion blender', 'baking sheet', 'oven mitt', 'pastry bag', 'palette knife',
        'pizza cutter', 'bottle opener', 'bowl', 'pizza pan', 'candy thermometer', 'rolling pin',
        'frying pan', 'casserole dish', 'plastic wrap', 'salad spinner', 'broiler', 'silicone muffin tray',
        'meat tenderizer', 'edible cake image', 'measuring spoon', 'kitchen thermometer', 'sifter',
        'muffin tray', 'chocolate mold', 'kitchen towels', 'potato ricer', 'silicone kugelhopf pan',
        'offset spatula', 'cheesecloth', 'lemon squeezer', 'cake form', 'mini muffin tray',
        'carving fork', 'egg slicer', 'ice cube tray', 'corkscrew', 'ice cream machine', 'sieve',
        'kugelhopf pan', 'pastry brush', 'popsicle sticks', 'spatula', 'cake server', 'poultry shears',
        'box grater', 'cupcake toppers', 'funnel', 'drinking straws', 'slotted spoon', 'ceramic pie form',
        'pepper grinder', 'mortar and pestle', 'baster', 'melon baller', 'zester', 'pastry cutter',
        'ziploc bags', 'aluminum foil', 'toothpicks', 'pot', 'baking pan', 'ladle', 'apple cutter',
        'fillet knife', 'toaster', 'heart shaped cake form', 'grill pan', 'wooden spoon', 'paper towels',
        'cookie cutter', 'tart form', 'pizza board', 'glass casserole dish', 'madeleine form',
        'metal skewers', 'microplane', 'stand mixer', 'whisk', 'mixing bowl', 'deep fryer', 'canning jar',
        'cheese knife', 'hand mixer', 'butter curler', 'food processor', 'wax paper', 'grater',
        'gravy boat', 'muffin liners', 'butter knife', 'waffle iron', 'double boiler', 'can opener',
        'mandoline', 'kitchen twine', 'juicer', 'wok', 'measuring cup', 'ramekin', 'airfryer',
        'instant pot', 'spoon', 'dough scraper', 'microwave', 'roasting pan', 'pressure cooker',
        'dehydrator', 'baking paper', 'silicone muffin liners', 'loaf pan', 'cake topper', 'dutch oven',
        'baking spatula', 'popsicle molds', 'teapot', 'cocktail sticks', 'cleaver', 'rice cooker',
        'bread machine', 'fork', 'ice cream scoop', 'slow cooker', 'knife', 'kitchen scale', 'griddle',
        'frosting cake topper', 'cutting board', 'cake pop mold', 'oven', 'colander', 'kitchen timer',
        'panini press', 'pasta machine', 'popcorn maker', 'lollipop sticks', 'steamer basket',
        'chopsticks', 'chefs knife', 'blender', 'pizza stone', 'skewers', 'sauce pan', 'peeler',
        'stove', 'pot holder', 'springform pan', 'apple corer', 'potato masher', 'serrated knife'
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
            eggIntolerance: settings.eggIntolerance || false,
            });

            if (settings.equipment) {
                setEquipmentState(settings.equipment);
            } else {
                const defaultEquipmentState = {};
                equipmentList.forEach(equipment => {
                    defaultEquipmentState[equipment] = true;
                });
                setEquipmentState(defaultEquipmentState);
            }
        } else if (!loading) {
            const defaultEquipmentState = {};
            equipmentList.forEach(equipment => {
                defaultEquipmentState[equipment] = true;
            });
            setEquipmentState(defaultEquipmentState);
        }
    }, [settings, loading]);

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
                ...intolerances,
                equipment: equipmentState
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

    const handleEquipmentChange = (equipment, checked) => {
        setEquipmentState(prev => ({
            ...prev,
            [equipment]: checked
        }));
    };

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

            <div className="d-flex flex-column flex-md-row align-items-start mb-4">
                <p className="fw-bold mb-0 me-4" style={{ minWidth: 0, whiteSpace: "nowrap" }}>
                    Available Equipment
                </p>
                <div style={{ flex: 1, maxHeight: '300px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '0.375rem', padding: '1rem' }}>
                    <div className="row">
                        {equipmentList.map((equipment, index) => (
                            <div className="col-md-6 col-lg-4 mb-2" key={equipment}>
                                <div className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id={`equipment-${index}`} 
                                        name="equipment" 
                                        value={equipment}
                                        checked={equipmentState[equipment] || false}
                                        onChange={e => handleEquipmentChange(equipment, e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor={`equipment-${index}`}>
                                        {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button className="btn mt-4 backgroundGreen" type="submit" onClick={storeInDB}>Save</button>

        </div>
    )
}