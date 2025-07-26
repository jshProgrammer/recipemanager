import React from "react";

const StarSelector = ({ rating, setRating }) => (
    <div>
        {[1, 2, 3, 4, 5].map((i) => (
            <i
                key={i}
                className={`bi ${i <= rating ? "bi-star-fill" : "bi-star"} me-1`}
                style={{
                    color: "#ffc107",
                    cursor: "pointer",
                    fontSize: "1.2rem"
                }}
                onClick={() => setRating(i)}
            />
        ))}
    </div>
);

export default StarSelector;