import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import "../styles/AuthPages.css";

/**
 * LoginPage component renders the login page for the application.
 * It checks if the user is already logged in and redirects to the main page if so.
 * If not logged in, it displays the login form and a link to sign up.
 * @param {Object} props - Component properties
 * @param {Object} props.user - The current user object, if logged in
 * @returns {JSX.Element} The rendered login page
 */
function LoginPage({ user }) {
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/piggle");
    }
  }, [user, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Welcome Back!</h1>
        <p>Sign in to continue playing Piggle</p>
        <Login />
        <div className="auth-footer">
          <p>Don't have an account? <button onClick={() => navigate("/signup")} className="link-button">Sign up here</button></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 