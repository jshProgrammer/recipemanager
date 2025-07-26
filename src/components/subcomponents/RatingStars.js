import React, { useEffect, useState } from "react";

const RatingStars = ({ recipeId }) => {
    const [average, setAverage] = useState(0);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("ratings")) || {};
        const ratings = stored[recipeId] || [];

        if (ratings.length > 0) {
            const sum = ratings.reduce((acc, r) => acc + r, 0);
            const avg = sum / ratings.length;
            setAverage(parseFloat(avg.toFixed(1)));
        }
    }, [recipeId]);

    return (
        <div className="mb-3">
            <h6 className="green fw-bold">User Rating</h6>
            {average > 0 ? (
                <div className="d-flex align-items-center">
                    <div className="me-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <i
                                key={i}
                                className={`bi ${i <= Math.round(average) ? "bi-star-fill" : "bi-star"} me-1`}
                                style={{ color: "#ffc107", fontSize: "1.2rem" }}
                            />
                        ))}
                    </div>
                    <div className="text-muted">{average} / 5</div>
                </div>
            ) : (
                <div className="text-muted">No ratings yet</div>
            )}
        </div>
    );
};

export default RatingStars;