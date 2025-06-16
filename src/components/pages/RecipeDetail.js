import RecipeStep from "../subcomponents/RecipeStep";
import "../../styles/RecipeDetail.css";
import KeyValueTable from "../subcomponents/KeyValueTable";
import {useState} from "react";
import { updateUserHealthScoreInDB } from "../../features/databaseStorage/userStorage";
import { useHealthScoreRefresh } from "../../features/providers/HealthScoreRefreshContext";


function RecipeDetail({ recipe }) {
    const [isShowMoreSteps, setIsShowMoreSteps] = useState(false);
    const { triggerRefresh } = useHealthScoreRefresh();
    

    if (!recipe) {
        return <p>Recipe not found!</p>;
    }

    const updateHealthScore = async () => {
        //TODO: default value and userid just for testing => will be replaced with context API later
        await updateUserHealthScoreInDB({
            userID: "5CZej0NLLfT1s8flXLqWmNpTXKK2", 
            healthScoreOfNewRecipe: recipe.healthScore ?? 100});
        triggerRefresh();
    }

    return (
        <div className="container mt-5">

            <div className="row">
                <div className="col-md-6">
                    <img src={recipe.imageURL} alt={recipe.title} className="img-fluid rounded"/>
                </div>
                <div className="col-md-6">
                    <h2 className="text-green fw-bold ">{recipe.title}</h2>

                    <div className="mb-3">
                        {(recipe.tags || ["Simple", "Recommended", "Dessert"]).map((tag, i) => (
                            <span key={i} className="badge tag-text tag-border me-2">{tag}</span>
                        ))}
                    </div>


                    <p>
                        <strong>${recipe.price || "2.49"}</strong>
                        <i className="green bi bi-clock ms-5"></i> {recipe.time || "30min"}
                    </p>


                    <div className="d-grid gap-2 col-8">
                        <button className="btn btn-dark">
                            <i className="bi bi-heart me-2"></i> Add to favorites
                        </button>

                        <button className="btn btn-secondary">
                            <i className="bi bi-box-arrow-up me-2"></i> Share with friends
                        </button>

                        {/* TODO: only show if recipe has a healthScore */}
                        <button className="btn btn-secondary" onClick={updateHealthScore}>
                            <i className="bi bi-check me-2"></i> Done cooking
                        </button>
                    </div>
                </div>
            </div>


            <div className="row mt-5">
                <div className="col-md-6">
                    
                    <h4 className="text-success fw-bold">Ingredients</h4>
                    <KeyValueTable 
                    headerLeft="Amount"
                    headerRight="Ingredients"
                    rows={(recipe.ingredients || []).map((ing, index) => ({
                        key: ing.amount,
                        value: ing.name
                    }))}/>
                    
                </div>
                <div className="col-md-6">
                    <h4 className="text-success fw-bold">Nutritional Information</h4>
                    <KeyValueTable 
                    rows={Array.isArray(recipe.nutrition) ? recipe.nutrition : []}/>
                    <small className="text-muted">Show more specified information ▼</small>
                </div>
            </div>

            <h4 className="mt-5 text-green fw-bold">StepByStep-Guide</h4>
            { recipe.steps && (isShowMoreSteps? recipe.steps : recipe.steps.slice(0, 2)).map((step, i) => (
                <RecipeStep
                    key={i}
                    stepNumber={i + 1}
                    description={step.description}
                    imageURL={step.imageURL}
                />
            ))}
            {recipe.steps && recipe.steps.length > 2 && (
                <button
                    className="text-green-hover btn p-0"
                    onClick={showMoreSteps}
                >
                    {isShowMoreSteps ? "show less steps..." : "show more steps..."}
                </button>
            )}

        </div>
    );

    function showMoreSteps() {
        setIsShowMoreSteps(!isShowMoreSteps);
    }
}

export default RecipeDetail;