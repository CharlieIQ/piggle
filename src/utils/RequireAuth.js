import { Navigate } from "react-router-dom";

function RequireAuth({ user, children }) {
    if (!user) {
        return <Navigate to="/piggle" replace />;
    }
    return children;
}

export default RequireAuth;