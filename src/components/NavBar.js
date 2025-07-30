import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import '../styles/NavBar.css'

/**
 * This is the NavBar component
 * @param {Object} user - The current user object
 * @returns {JSX.Element} - The NavBar component
 */
function NavBar({ user }) {
  const auth = getAuth();
  /**
   * Handles user logout
   */
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/piggle">Home</Link>
        <Link to="/levels">Browse Levels</Link>
        {user && <Link to="/editor">Create Level</Link>}
        {user && <Link to="/managelevels">Manage Levels</Link>}
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <Link to="/profile">Account</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;