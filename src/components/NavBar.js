import { Link } from "react-router-dom";
import '../styles/NavBar.css'

function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/levels">Browse Levels</Link>
      <Link to="/editor">Create Level</Link>
      <Link to="/managelevels">Manage Levels</Link>
    </nav>
  );
}

export default NavBar;