import RecipeStep from "../subcomponents/RecipeStep";
import "../../styles/RecipeDetail.css";
import KeyValueTable from "../subcomponents/KeyValueTable";
import {useState, useEffect} from "react";
import { updateUserHealthScoreInDB } from "../../features/databaseStorage/userStorage";
import { useHealthScoreRefresh } from "../../features/providers/HealthScoreRefreshContext";
import {useAuth} from "../../features/providers/AuthContext";
import Breadcrumbs from "../subcomponents/Breadcrumbs";
import { useParams } from "react-router-dom";
import { getRecipeInformation, getRecipeNutrition, getRecipeEquipment } from "../../features/spoonacular";


function RecipeDetail({ recipe: propRecipe }) {
    const { user } = useAuth();
    const { id } = useParams();
    const { triggerRefresh } = useHealthScoreRefresh();
    const [recipe, setRecipe] = useState(propRecipe);
    const [isLoading, setIsLoading] = useState(!propRecipe);
    const [error, setError] = useState(null);
    const [equipment, setEquipment] = useState([]);
    const [equipmentLoading, setEquipmentLoading] = useState(false);
    const [equipmentError, setEquipmentError] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const [toast, setToast] = useState(null);

    const transformRecipeForDetail = (spoonacularRecipe) => {
        return {
            id: spoonacularRecipe.id,
            title: spoonacularRecipe.title,
            imageURL: spoonacularRecipe.image,
            time: spoonacularRecipe.readyInMinutes ? `${spoonacularRecipe.readyInMinutes}min` : "30min",
            price: spoonacularRecipe.pricePerServing ? 
                `$${(spoonacularRecipe.pricePerServing / 100 * (spoonacularRecipe.servings || 1)).toFixed(2)}` : "$2.49",
            tags: [
                ...(spoonacularRecipe.vegetarian ? ["Vegetarian"] : []),
                ...(spoonacularRecipe.vegan ? ["Vegan"] : []),
                ...(spoonacularRecipe.glutenFree ? ["Gluten-Free"] : []),
                ...(spoonacularRecipe.dairyFree ? ["Dairy-Free"] : []),
                ...(spoonacularRecipe.veryHealthy ? ["Healthy"] : []),
                ...(spoonacularRecipe.cheap ? ["Budget-Friendly"] : []),
                ...(spoonacularRecipe.veryPopular ? ["Popular"] : []),
                "Recommended"
            ],
            healthScore: spoonacularRecipe.healthScore,
            ingredients: spoonacularRecipe.extendedIngredients?.map(ing => ({
                amount: `${ing.amount} ${ing.unit}`,
                name: ing.name
            })) || [{ amount: "N/A", name: "Ingredients not available" }],
            nutrition: spoonacularRecipe.nutrition || { main: [], more: [] },
            steps: spoonacularRecipe.analyzedInstructions?.[0]?.steps?.map(step => ({
                description: step.step,
                imageURL: null
            })) || [],
            servings: spoonacularRecipe.servings || 1,
            readyInMinutes: spoonacularRecipe.readyInMinutes,
            summary: spoonacularRecipe.summary
        };
    };

    useEffect(() => {
        const loadRecipe = async () => {
            if (propRecipe) {
                setRecipe(propRecipe);
                setIsLoading(false);
                return;
            }

            if (!id) {
                setError("No recipe ID provided");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const spoonacularRecipe = await getRecipeInformation(id);
                const nutritionData = await getRecipeNutrition(id);

                const mainNutrients = [
                    { name: "Calories", amount: parseFloat(nutritionData.calories), unit: "kcal" },
                    { name: "Carbs", amount: parseFloat(nutritionData.carbs), unit: "g" },
                    { name: "Fat", amount: parseFloat(nutritionData.fat), unit: "g" },
                    { name: "Protein", amount: parseFloat(nutritionData.protein), unit: "g" },
                ];

                const moreNutrients = [
                    ...(nutritionData.bad || []),
                    ...(nutritionData.good || [])
                ].map(n => ({
                    name: n.title,
                    amount: n.amount,
                    daily: n.percentOfDailyNeeds
                }));

                spoonacularRecipe.nutrition = {
                    main: mainNutrients.map(n => ({
                        key: n.name,
                        value: `${n.amount}${n.unit}`
                    })),
                    more: moreNutrients.map(n => ({
                        key: n.name,
                        value: `${n.amount} (${n.daily}% daily)`
                    }))
                }

                const transformedRecipe = transformRecipeForDetail(spoonacularRecipe);
                setRecipe(transformedRecipe);
            } catch (err) {
                console.error("Error loading recipe:", err);
                setError("Failed to load recipe. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        loadRecipe();
    }, [id, propRecipe]);

    // Load equipment data
    useEffect(() => {
        const loadEquipment = async () => {
            if (!recipe?.id) return;

            setEquipmentLoading(true);
            setEquipmentError(null);

            try {
                const equipmentData = await getRecipeEquipment(recipe.id);
                if (equipmentData.equipment) {
                    setEquipment(equipmentData.equipment);
                }
            } catch (err) {
                console.error("Error loading equipment:", err);
                setEquipmentError("Failed to load equipment information");
            } finally {
                setEquipmentLoading(false);
            }
        };

        loadEquipment();
    }, [recipe?.id]);



    const updateHealthScore = async () => {
        if (!user || !recipe?.healthScore) return;
        
        try {
            await updateUserHealthScoreInDB({
                userID: user.uid,
                healthScoreOfNewRecipe: recipe.healthScore
            });
            triggerRefresh();
        } catch (error) {
            console.error("Error updating health score:", error);
        }
    };

    const addToShoppingList = (ingredients) => {
        const names = ingredients.map(i => i.name);

        const current = JSON.parse(localStorage.getItem("shoppingList")) || [];
        const updated = Array.from(new Set([...current, ...names]));
        localStorage.setItem("shoppingList", JSON.stringify(updated));

        setToast("Ingredients added to your shopping list!");
        setTimeout(() => setToast(null), 3000);
    };

    if (isLoading) {
        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border green" role="status">
                        <span className="visually-hidden">Loading recipe...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error</h4>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning" role="alert">
                    <h4 className="alert-heading">Recipe not found</h4>
                    <p>The requested recipe could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <Breadcrumbs overrideNames={{ [recipe.id]: recipe.title }}/>

            <div className="row">
                <div className="col-md-6">
                    <img src={recipe.imageURL} alt={recipe.title} className="img-fluid rounded"/>
                </div>
                <div className="col-md-6">
                    <h2 className="green fw-bold">{recipe.title}</h2>

                    <div className="mb-3">
                        {(recipe.tags || ["Simple", "Recommended", "Dessert"]).map((tag, i) => (
                            <span key={i} className="borderGreen badge tag-text tag-border me-2">{tag}</span>
                        ))}
                    </div>

                    <p>
                        <strong>{recipe.price || "$2.49"}</strong>
                        <i className="green bi bi-clock ms-5"></i> {recipe.time || "30min"}
                        {recipe.servings && (
                            <>
                                <i className="green bi bi-people ms-5"></i> {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}
                            </>
                        )}
                    </p>

                    {recipe.healthScore && (
                        <div className="mb-3 col-8">
                            <h6 className="green fw-bold mb-2">Health Score</h6>
                            <div className="d-flex align-items-center p-3">
                                <div className="progress flex-grow-1 me-3" style={{ height: '24px' }}>
                                    <div
                                        className="progress-bar backgroundGreen"
                                        role="progressbar"
                                        style={{ width: `${recipe.healthScore}%` }}
                                        aria-valuenow={recipe.healthScore}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                    </div>
                                </div>
                                <span className="fw-bold green">{recipe.healthScore}/100</span>
                            </div>
                        </div>
                    )}

                    <div className="d-grid gap-2 col-8">
                        <button className="btn btn-dark">
                            <i className="bi bi-heart me-2"></i> Add to favorites
                        </button>

                        <button
                            className="btn btn-secondary"
                            onClick={() => addToShoppingList(recipe.ingredients)}
                        >
                            <i className="bi bi-cart-plus me-2"></i> Add to shopping list
                        </button>

                        <button className="btn btn-secondary">
                            <i className="bi bi-box-arrow-up me-2"></i> Share with friends
                        </button>

                        {recipe.healthScore && (
                            <button className="btn btn-secondary" onClick={updateHealthScore}>
                                <i className="bi bi-check me-2"></i> Done cooking
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-md-6">
                    <h4 className="green fw-bold">Ingredients</h4>
                    <KeyValueTable 
                        headerLeft="Amount"
                        headerRight="Ingredients"
                        rows={(recipe.ingredients || []).map((ing, index) => ({
                            key: ing.amount,
                            value: ing.name
                        }))}
                    />
                </div>
                <div className="col-md-6">
                    <h4 className="green fw-bold">Nutritional Information</h4>
                    {recipe.nutrition?.main?.length > 0 && (
                        <>
                            <KeyValueTable
                                rows={[
                                    ...recipe.nutrition.main,
                                    ...(showMore ? recipe.nutrition.more : [])
                                ]}
                            />

                            {recipe.nutrition.more?.length > 0 && (
                                <button
                                    className="border-0 bg-transparent"
                                    onClick={() => setShowMore(!showMore)}
                                >
                                    {showMore ? 'Hide additional information ▲' : 'Show more specified information ▼'}
                                </button>
                            )}
                        </>
                    )}

                </div>
            </div>

            {/* Equipment Section */}
            {(equipment.length > 0 || equipmentLoading) && (
                <div className="row mt-4">
                    <div className="col-12">
                        <h4 className="green fw-bold">Equipment</h4>
                        {equipmentLoading ? (
                            <div className="d-flex justify-content-center py-3">
                                <div className="spinner-border spinner-border-sm green" role="status">
                                    <span className="visually-hidden">Loading equipment...</span>
                                </div>
                            </div>
                        ) : equipmentError ? (
                            <div className="alert alert-warning" role="alert">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {equipmentError}
                            </div>
                        ) : (
                            <div className="equipment-scroll-container" style={{
                                overflowX: 'auto',
                                whiteSpace: 'nowrap',
                                padding: '10px 0',
                                border: '1px solid #dee2e6',
                                borderRadius: '0.375rem',
                                backgroundColor: '#f8f9fa'
                            }}>
                                <div className="d-flex gap-2" style={{ minWidth: 'max-content' }}>
                                    {equipment.map((item, index) => (
                                        <div
                                            key={index}
                                            className="equipment-item px-3 py-2 rounded border bg-light text-muted"
                                            style={{
                                                minWidth: '140px',
                                                textAlign: 'center',
                                                fontSize: '0.9rem',
                                                fontWeight: '500',
                                                cursor: 'default',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                            title={item.name}
                                        >
                                            {item.image && (
                                                <img 
                                                    src={`https://spoonacular.com/cdn/equipment_100x100/${item.image}`}
                                                    alt={item.name}
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        objectFit: 'contain'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <i className="bi bi-tools"></i>
                                                <span>{item.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {recipe.summary && (
                <div className="row mt-4">
                    <div className="col-12">
                        <h4 className="green fw-bold">Description</h4>
                        <div
                            className="text-muted"
                            dangerouslySetInnerHTML={{ 
                                __html: recipe.summary.replace(/<[^>]*>/g, '') 
                            }}
                        />
                    </div>
                </div>
            )}

            {recipe.steps && recipe.steps.length > 0 && (
                <div className="mt-5">
                    <h4 className="green fw-bold">Step-by-Step Guide</h4>
                    {recipe.steps.map((step, i) => (
                        <RecipeStep
                            key={i}
                            stepNumber={i + 1}
                            description={step.description}
                            imageURL={step.imageURL}
                        />
                    ))}

                </div>
            )}

            {toast && (
                <div
                    className="toast align-items-center text-white backgroundGreen border-0 position-fixed bottom-0 end-0 m-3 show"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                    style={{ zIndex: 9999 }}
                >
                    <div className="d-flex">
                        <div className="toast-body">{toast}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RecipeDetail;