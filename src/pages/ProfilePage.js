import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

/**
 * This component renders the user's profile page.
 * It fetches user data from Firestore and displays it.
 * The user can view their username, email, and high score.
 * It also provides buttons to play the game, browse levels, and logout.
 * @param {Object} props - The component props.
 * @param {Object} props.user - The authenticated user object.
 * @returns The rendered profile page component.
 */
function ProfilePage({ user }) {
  // State variables to hold user data
  const [username, setUsername] = useState("");
  const [highscore, setHighscore] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  /**
   * Fetches user data from Firestore when the component mounts.
   * If the user is not authenticated, redirects to the login page.
   */
  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate("/login");
      return;
    }
    // Fetch user data from Firestore
    const fetchUserData = async () => {
      // Reset loading state
      try {
        // Get Firestore instance and user document reference
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          // If user document exists, set state with user data
          const userData = docSnap.data();
          setUsername(userData.username);
          setHighscore(userData.highscore);
        }
        setEmail(user.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate("/piggle");
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Account Profile</h1>

        <div className="profile-section">
          <h2>User Information</h2>
          <div className="profile-info">
            <div className="info-row">
              <label>Username:</label>
              <span>{username}</span>
            </div>
            <div className="info-row">
              <label>Email:</label>
              <span>{email}</span>
            </div>
            <div className="info-row">
              <label>High Score:</label>
              <span>{highscore}</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={() => navigate("/piggle")} className="btn-primary">
            Play Game
          </button>
          <button onClick={() => navigate("/levels")} className="btn-secondary">
            Browse Levels
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage; 