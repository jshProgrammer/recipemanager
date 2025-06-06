import React from "react";
import RecipeStep from "./RecipeStep";
import "../styles/RecipeDetail.css";

function RecipeDetail({ recipe }) {
    if (!recipe) {
        return <p>Recipe not found!</p>;
    }

    return (
        <div className="container mt-5">

            <div className="row">
                <div className="col-md-6">
                    <img src={recipe.imageUrl} alt={recipe.title} className="img-fluid rounded" />
                </div>
                <div className="col-md-6">
                    <h2 className="text-success fw-bold">{recipe.title}</h2>

                    <div className="mb-3">
                        {(recipe.tags || ["Simple", "Recommended", "Dessert"]).map((tag, i) => (
                            <span key={i} className="badge bg-light text-success border me-2">{tag}</span>
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
                    <h4 className="text-success fw-bold">Ingredients</h4>
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
                    <h4 className="text-success fw-bold">Nutritional Information</h4>
                    <table className="table table-sm border-table">
                        <tbody>
                        <tr><td>Calories</td><td>{recipe.nutrition?.calories || "562kcal"}</td></tr>
                        <tr><td>Fat</td><td>{recipe.nutrition?.fat || "26g"}</td></tr>
                        <tr><td>Protein</td><td>{recipe.nutrition?.protein || "18g"}</td></tr>
                        <tr><td>Sugar</td><td>{recipe.nutrition?.sugar || "25g"}</td></tr>
                        </tbody>
                    </table>
                    <small className="text-muted">Show more specified information ▼</small>
                </div>
            </div>


            <h4 className="mt-5 text-success fw-bold">StepByStep-Guide</h4>
            {(recipe.steps || []).map((step, i) => (
                <RecipeStep
                    key={i}
                    stepNumber={i + 1}
                    description={step.description}
                    imageUrl={step.imageUrl}
                />
            ))}
        </div>
    );
}

export default RecipeDetail;