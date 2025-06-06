import React from "react";
import '../styles/App.css';

import introImage from '../assets/introImage.jpg'

export default function IntroSection({user}) {
    return (
        <div>
            {user && user.displayName
            ? <h2 className="green fw-bold mt-5">Welcome back,<br />{user.displayName.split(" ")[0]}</h2>
            : <h2 className="green fw-bold mt-5">Welcome to <br />RecipeManager</h2>}
            <p>Find the most exciting recipes based on your preferences.<br />Easy. Healthy. Fast.</p>
            <a href="#suggestions">
                <button class="btn mb-4 backgroundGreen py-3 rounded">Browse recipes</button>
            </a>
            <img
                className="green"
                src={introImage}
                alt="Intro Bild: Person kocht"
                style={{ width: "100%", maxHeight: "600px", objectFit: "cover" }}
            />

           
        </div>
    )
}