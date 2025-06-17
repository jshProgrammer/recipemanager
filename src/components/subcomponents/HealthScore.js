import {useState, useEffect} from "react";
import HealthScorePopup from "./HealthScorePopup";
import { getUserHealthScore } from "../../features/databaseStorage/userStorage";
import {useAuth} from "../../features/providers/AuthContext";

function HealthScore({refreshKey}){
    const { user } = useAuth();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [healthScore, setHealthScore] = useState(null);

    useEffect(() => {
        async function fetchHealthScore() {
        if (!user) return;
        const score = await getUserHealthScore({ user });
        setHealthScore(score);
        }
        fetchHealthScore();
    }, [user, refreshKey]);


    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                className="btn bg-transparent rounded-circle d-flex justify-content-center align-items-center me-4"
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
                {healthScore !== null ? healthScore : "..."}
            </button>

            {isPopupOpen && <HealthScorePopup score={healthScore} onClose={() => setIsPopupOpen(false)}/>}
        </div>
    )
}

export default HealthScore;