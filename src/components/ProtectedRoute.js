import { Navigate } from "react-router-dom";
import { useAuth } from "../features/providers/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        // Zeige optional einen Ladeindikator
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/?login=true" replace />;
    }

    return children;
};

export default ProtectedRoute;
