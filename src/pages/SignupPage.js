import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Signup from "../components/Signup";
import "../styles/AuthPages.css";

/**
 * This component renders the signup page for the Piggle game.
 * It checks if the user is already logged in and redirects them to the game page if they are.
 * @param {Object} props - The component props.
 * @param {Object} props.user - The current user object.
 * @returns The rendered SignupPage component.
 */
function SignupPage({ user }) {
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
        <h1>Join Piggle!</h1>
        <p>Create an account to start your adventure</p>
        <Signup />
        <div className="auth-footer">
          <p>Already have an account? <button onClick={() => navigate("/login")} className="link-button">Sign in here</button></p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage; 