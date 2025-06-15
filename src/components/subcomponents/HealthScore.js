import React, {useState} from "react";
import HealthScorePopup from "./HealthScorePopup";

function HealthScore(){
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const healthScore = 95;

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                className="btn bg-transparent rounded-circle d-flex justify-content-center align-items-center m-4"
                style={{
                    width: '50px',
                    height: '50px',
                    borderColor: '#16a24a',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    color: '#16a24a',
                    boxSizing: 'border-box',
                    fontWeight: 'bold'
                }}
                onClick={() => setIsPopupOpen(true)}
            >
                {healthScore}
            </button>

            {isPopupOpen && <HealthScorePopup score={healthScore} onClose={() => setIsPopupOpen(false)}/>}
        </div>
    )
}

export default HealthScore;