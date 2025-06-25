import React from "react";

function HealthScorePopup({score, amountOfRecipes, onClose}) {
    const percentage = Math.min(Math.max(score, 0), 100);

    const getScoreColor = (score) => {
        if (score >= 70) {
            const factor = (score - 70) / 30;
            const red = Math.round(100 - (100 * factor));
            return `rgb(${red}, 200, 50)`;
        } else if (score >= 40) {
            const factor = (score - 40) / 30;
            const red = Math.round(255 - (155 * factor));
            const green = Math.round(140 + (60 * factor));
            return `rgb(${red}, ${green}, 50)`;
        } else {
            const factor = score / 40;
            const red = Math.round(180 + (75 * factor));
            const green = Math.round(50 + (90 * factor));
            return `rgb(${red}, ${green}, 50)`;
        }
    };

    const scoreColor = getScoreColor(percentage);
    const radius = 45;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
            onClick={handleBackdropClick}>
            <div
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    minWidth: "300px",
                    textAlign: "center",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}>
                <div style={{ margin: "20px 0", position: "relative", display: "inline-block" }}>
                    <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                        {/* Background circle */}
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="#e0e0e0"
                            strokeWidth={strokeWidth}
                            fill="transparent"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke={scoreColor}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{
                                transition: "stroke-dashoffset 1s ease-in-out, stroke 0.5s ease-in-out"
                            }}
                        />
                    </svg>
                    {/* Score text in center */}
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: scoreColor
                        }}
                    >
                        {Math.round(percentage)}
                    </div>
                </div>
                <h2>Health Score</h2>
                <p>Your health score is: {score}</p>
                <p>You have cooked {amountOfRecipes} recipes so far.</p>
                <button onClick={onClose} className="btn rounded border"
                        style={{color: '#16a24a'}}>
                    Close
                </button>
            </div>
        </div>
    )
}

export default HealthScorePopup;