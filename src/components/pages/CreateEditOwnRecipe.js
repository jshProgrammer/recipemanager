// all attributes are optional to use this interface for editing as well as creating a user's own personal recipes
import { useState } from "react";
import {uploadImage} from '../../features/databaseStorage/imageStorage.js'
import {saveRecipe} from '../../features/databaseStorage/recipeStorage.js'
import ImagePicker from "../subcomponents/ImagePicker.js";

export default function CreateEditOwnRecipe({user, recipeName = null, imageURL=null, estimatedPrice=null, estimatedTime=null }) {
    const [name, setName] = useState(recipeName ?? "");
    const [price, setPrice] = useState(estimatedPrice ?? "");
    const [time, setTime] = useState(estimatedTime ?? "");
    const [image, setImage] = useState(imageURL);
   
    
    const saveCustomRecipeInDB = async () => {
        let finalImageURL = imageURL;
        if (!finalImageURL && image) {
            finalImageURL = await uploadImage(image);
        }
        await saveRecipe(
            user.uid,
            {
            name,
            imageURL: finalImageURL,
            price,
            time
        });
    }   

    return (
        <div className="main-content">
            <h2 className="green">Create your own recipe</h2>

            <div className="row">

                <div className="col-md-5">
                    <ImagePicker image={image} onImageChange={setImage}/>
                </div>

                <div className="col-md-1"/>

                <div className="col-md-6">
                    <div className="mb-3">
                        
                        <label htmlFor="recipeName" className="form-label green fw-bold">Recipe name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="recipeName"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter your recipe's name"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="estimatedPrice" className="form-label green fw-bold">Estimated cost (€)</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-currency-euro"></i>
                            </span>
                            <input type="number"
                                className="form-control"
                                id="estimatedPrice"
                                value={estimatedPrice}
                                onChange={e => setPrice(e.target.value)}
                                placeholder="0.00€"
                                step="0.01"
                                min="0"/>
                            </div>
                        </div>
                    <div className="mb-3">
                        <label htmlFor="estimatedTime" className="form-label green fw-bold">Estimated time (Min)</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-clock"></i>
                            </span>
                            <input type="number"
                                className="form-control"
                                id="estimatedTime"
                                value={estimatedTime}
                                onChange={e => setTime(e.target.value)}
                                placeholder="30min"
                                min="1"/>
                        </div>
                    </div>
                </div>
            </div>

            <h4 className="green">Ingredients</h4>
            {/*TODO: ADD!!*/}
            <h4 className="green">Nutritional Information</h4>
            {/*TODO: use table-component by Sebastian */}
            <h4 className="green">Step-by-step guide</h4>
            {/*TODO: use RecipeStep-component by Sebastian */}

            <button className="btn backgroundGreen" type="submit" onClick={() => saveCustomRecipeInDB()}>Save</button>        
        </div>
    )
}