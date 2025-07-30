import { Navigate } from "react-router-dom";

/**
 * This component checks if the user is authenticated.
 * @param {Object} props - The component props.
 * @param {Object} props.user - The current user object.
 * @param {React.ReactNode} props.children - The child components to render if authenticated.
 * @returns The rendered component or a redirect to the game page.
 */
function RequireAuth({ user, children }) {
    if (!user) {
        return <Navigate to="/piggle" replace />;
    }
    return children;
}

export default RequireAuth;