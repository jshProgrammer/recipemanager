import {useState, useEffect} from "react";
import HealthScorePopup from "./HealthScorePopup";
import { getUserHealthScore } from "../../features/databaseStorage/userStorage";
import {useAuth} from "../../features/providers/AuthContext";

function HealthScore({refreshKey}){
    const { user } = useAuth();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [healthScore, setHealthScore] = useState(null);
    const [amountOfRecipesCooked, setAmountOfRecipesCooked] = useState(null);

    useEffect(() => {
        async function fetchHealthScore() {
        if (!user) return;
        const [score, amountOfRecipesCooked] = await getUserHealthScore({ user });
        setHealthScore(score);
        setAmountOfRecipesCooked(amountOfRecipesCooked);
        }
        fetchHealthScore();
    }, [user, refreshKey]);


    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                className="btn borderGreen bg-transparent rounded-circle d-flex justify-content-center align-items-center me-4"
                style={{
                    width: '50px',
                    height: '50px',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    boxSizing: 'border-box',
                    fontWeight: 'bold'
                }}
                onClick={() => setIsPopupOpen(true)}
            >
                {healthScore !== null ? healthScore : "..."}
            </button>

            {isPopupOpen && <HealthScorePopup score={healthScore} amountOfRecipes={amountOfRecipesCooked} onClose={() => setIsPopupOpen(false)}/>}
        </div>
    )
}

export default HealthScore;