import { Navigate } from "react-router-dom";

function RequireAuth({ user, children }) {
    if (!user) {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default RequireAuth;