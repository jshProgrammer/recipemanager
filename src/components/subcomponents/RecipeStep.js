import "../../styles/RecipeStep.css"
import { useState } from "react";
import ImagePicker from "./ImagePicker";

const RecipeStep = ({ stepNumber, description, imageURL, editable=false, onChange, onRemove }) => {
    
    const [desc, setDesc] = useState(description || "");
    const [image, setImage] = useState(imageURL || "");

    const handleDescChange = (e) => {
        setDesc(e.target.value);
        onChange && onChange({ description: e.target.value, imageURL: image });
    };

    const handleImageChange = (newImage) => {
        setImage(newImage);
        onChange && onChange({ description: desc, imageURL: newImage });
    };
    
    return (
        <div className="card mb-3 shadow-sm p-3">
            {editable ? (
                <div>
                    <div className="d-flex flex-row gap-3">
                        <ImagePicker image={image} onImageChange={handleImageChange} />
                        <h3 className="card-title green fw-bold text-shadow">
                                {stepNumber}
                            </h3>
                        <textarea
                            className="form-control"
                            value={desc}
                            onChange={handleDescChange}
                            rows={4}
                            placeholder="Add your description"/>
                    </div>

                    {onRemove && (
                        <div className="text-end mt-3">
                            <button
                                className="btn btn-sm btn-outline-danger"
                                style={{ bottom: "10px", right: "10px" }}
                                onClick={onRemove}
                                title="Remove step">
                                <i className="bi bi-trash"></i> Remove
                            </button>
                        </div>
                    )}
                </div>
            ) : (
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
                <div className={image ? "col-md-8" : "col-md-12"}>
                    <div className="card-body">
                        <h3 className="card-title green fw-bold text-shadow fs-1">
                            {stepNumber}
                        </h3>
                        {editable ? (
                        <textarea
                            className="form-control"
                            value={desc}
                            onChange={handleDescChange}
                            rows={3}
                            placeholder="Describe this step..."
                        />
                        ) : (
                        <p className="card-text">{desc}</p>
                        )}
                    </div>
                </div>
            </div>)}
        </div>
    );
};

export default RecipeStep;