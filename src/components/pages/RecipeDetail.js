import RecipeStep from "../subcomponents/RecipeStep";
import "../../styles/RecipeDetail.css";
import {useState} from "react";

function RecipeDetail({ recipe }) {
    const [isShowMoreSteps, setIsShowMoreSteps] = useState(false);

    if (!recipe) {
        return <p>Recipe not found!</p>;
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
                        <button className="btn btn-dark">Add to favorites</button>
                        <button className="btn btn-secondary">Share with friends</button>
                    </div>
                </div>
            </div>


            <div className="row mt-5">
                <div className="col-md-6">
                    <h4 className="text-green fw-bold">Ingredients</h4>
                    <table className="table table-sm border-table">
                        <thead>
                        <tr>
                            <th>Amount</th>
                            <th>Ingredient</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(recipe.ingredients || []).map((ing, i) => (
                            <tr key={i}>
                                <td>{ing.amount}</td>
                                <td>{ing.name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="col-md-6">
                    <h4 className="text-green fw-bold">Nutritional Information</h4>
                    <table className="table table-sm border-table">
                        <tbody>
                        <tr>
                            <td>Calories</td>
                            <td>{recipe.nutrition?.calories || "562kcal"}</td>
                        </tr>
                        <tr>
                            <td>Fat</td>
                            <td>{recipe.nutrition?.fat || "26g"}</td>
                        </tr>
                        <tr>
                            <td>Protein</td>
                            <td>{recipe.nutrition?.protein || "18g"}</td>
                        </tr>
                        <tr>
                            <td>Sugar</td>
                            <td>{recipe.nutrition?.sugar || "25g"}</td>
                        </tr>
                        </tbody>
                    </table>
                    <small className="text-muted">Show more specified information ▼</small>
                </div>
            </div>


            <h4 className="mt-5 text-green fw-bold">StepByStep-Guide</h4>
            {(isShowMoreSteps ? recipe.steps : recipe.steps.slice(0, 2)).map((step, i) => (
                <RecipeStep
                    key={i}
                    stepNumber={i + 1}
                    description={step.description}
                    imageURL={step.imageURL}
                />
            ))}
            {!isShowMoreSteps ? (<button className="text-green-hover btn p-0" onClick={showMoreSteps}>show more steps...</button>)
            : (<button className="text-green-hover btn p-0 " onClick={showMoreSteps}>show less steps...</button>)}
        </div>
    );

    function showMoreSteps() {
        setIsShowMoreSteps(!isShowMoreSteps);
    }
}

export default RecipeDetail;