import React from "react";

function HealthScorePopup({score, onClose}) {
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
        >
            <div
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    minWidth: "300px",
                    textAlign: "center",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}
            >
                <h2>Health Score</h2>
                <p>Your health score is: {score}</p>
                <button onClick={onClose} className="btn rounded border"
                        style={{color: '#16a24a'}}>
                    Close
                </button>
            </div>
        </div>
    )
}

export default HealthScorePopup;