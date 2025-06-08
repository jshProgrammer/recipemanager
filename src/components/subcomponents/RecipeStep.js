import "../../styles/RecipeStep.css"

const RecipeStep = ({ stepNumber, description, imageURL }) => {
    return (
        <div className="card mb-3 shadow-sm">
            <div className="row g-0">
                {imageURL && (
                    <div className="col-md-4">
                        <img
                            src={imageURL}
                            className="img-fluid rounded shadow"
                            alt={`Step ${stepNumber}`}
                        />
                    </div>
                )}
                <div className={imageURL ? "col-md-8" : "col-md-12"}>
                    <div className="card-body">
                        <h3 className="card-title text-success fw-bold text-shadow">
                            {stepNumber}
                        </h3>
                        <p className="card-text">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeStep;