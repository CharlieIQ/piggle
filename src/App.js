import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// Import game
import PiggleGame from "./PiggleGame";
// Import components
import HowToPlay from "./components/HowToPlay";
import TopScore from './components/TopScore';
// Import pages
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LevelEditorPage from "./pages/LevelEditor";
import LevelBrowserPage from "./pages/LevelBrowser";
import PlayLevelPage from "./pages/PlayLevelPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
// Import nav bar element
import NavBar from './components/NavBar';
// Import utility
import RequireAuth from "./utils/RequireAuth";
// Style imports
import './styles/App.css';
import ManageLevelsPage from "./pages/ManageLevelsPage";

/**
 * This is the main application component that sets up routing and authentication.
 * It initializes the Firebase authentication state and renders the appropriate components based on the user's authentication status.
 * @returns {JSX.Element} The main application component with routing and authentication logic.
 * @description This component uses React Router for navigation and Firebase for user authentication.
 * @returns The main application component that sets up routing and authentication.
 */
function App() {
  // State to track user
  const [user, setUser] = useState(null);
  // Track auth changes
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [auth]);

  return (
    <Router>
      <NavBar user={user} ></NavBar>
      <Routes>
        <Route path="/editor" element={
          <RequireAuth user={user}>
            <LevelEditorPage user={user} />
          </RequireAuth>
        } />
        <Route path="/levels" element={<LevelBrowserPage />} />
        <Route path="/managelevels" element={
          <RequireAuth user={user}>
            <ManageLevelsPage />
          </RequireAuth>
        } />
        <Route path="/play/:levelId" element={<PlayLevelPage />} />
        <Route path="/login" element={<LoginPage user={user} />} />
        <Route path="/signup" element={<SignupPage user={user} />} />
        <Route path="/profile" element={
          <RequireAuth user={user}>
            <ProfilePage user={user} />
          </RequireAuth>
        } />
        {/* Default home route for main PiggleGame */}
        <Route path="/piggle" element={
          <div className="App">
            <h1 id="mainGameHeader">PIGGLE</h1>
            <PiggleGame />
            <HowToPlay />
            <TopScore />
          </div>
        } />
        {/* Redirect root "/" to /piggle */}
        <Route path="/" element={<Navigate to="/piggle" replace />} />

        {/* Redirect all unknown paths to /piggle */}
        <Route path="*" element={<Navigate to="/piggle" replace />} />
      </Routes>
    </Router>

  );
}

export default App;

