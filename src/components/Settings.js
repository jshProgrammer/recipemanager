import '../styles/Settings.css'

export default function Settings({user}) {
    const dietaryOptions = [
        { id: 'noPreferences', default: 'none', label: 'None'},
        { id: 'vegetarian', value: 'vegetarian', label: 'Vegetarian' },
        { id: 'vegan', value: 'vegan', label: 'Vegan'}
    ];

    const nutritialIntolerances = [
        { id: 'lactoseIntolerance', value: 'lactoseIntolerance', label: 'Lactose Intolerance'},
        { id: 'glutenIntolerance', value: 'glutenIntolerance', label: 'Gluten Intolerance'},
        { id: 'nutAllergy', value: 'nutAllergy', label: 'Nut allergy'},
        { id: 'caffeineSensitivity', value: 'caffeineSensitivity', label: 'Caffeine Sensitivity'},
        { id: 'eggIntolerance', value: 'eggIntolerance', label: 'Egg Intolerance'},
        { id: 'chocolateSensitivity', value: 'chocolateSensitivity', label: 'Chocolate Sensitivity'},
    ];

    return (
        <div>
            <h2>Your profile</h2>
            
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
                        defaultChecked={option.value === 'none'}
                    />
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

                {nutritialIntolerances.map(option => (
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id={option.id} name="nutritialIntolerances" value={option.value} />
                        <label className="form-check-label" htmlFor={option.id}>{option.label}</label>
                    </div>
                ))}
                </div>

            </div>

            <button className="btn mt-4 backgroundGreen" type="submit">Save</button>

           
        </div>
    )
}