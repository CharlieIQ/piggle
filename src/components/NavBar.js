import { Link } from "react-router-dom";
import '../styles/NavBar.css'

function NavBar({ user }) {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/levels">Browse Levels</Link>
      {user && <Link to="/editor">Create Level</Link>}
      {user && <Link to="/managelevels">Manage Levels</Link>}
    </nav>
  );
}

export default NavBar;