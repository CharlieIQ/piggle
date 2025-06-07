import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// Import game
import PiggleGame from "./PiggleGame";
// Import components
import HowToPlay from "./components/HowToPlay";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserProfile from './components/UserProfile';
import TopScore from './components/TopScore';
// Import other pages
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LevelEditorPage from "./pages/LevelEditor";
import LevelBrowserPage from "./pages/LevelBrowser";
import PlayLevelPage from "./pages/PlayLevelPage";
// Import nav bar element
import NavBar from './components/NavBar';
// Style imports
import './styles/App.css';
import ManageLevelsPage from "./pages/ManageLevelsPage";
// Function for the game
function App() {
  // State to track user
  const [user, setUser] = useState(null);
  // Track auth changes
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);
  
  return (
    <Router>
      <NavBar></NavBar>
      <Routes>
        <Route path="/editor" element={<LevelEditorPage user={user} />} />
        <Route path="/levels" element={<LevelBrowserPage />} />
        <Route path="/managelevels" element={<ManageLevelsPage/>}/>
        <Route path="/play/:levelId" element={<PlayLevelPage />} />
        {/* Default home route for main PiggleGame */}
        <Route path="/" element={
          <div className="App">
            <h1 id="mainGameHeader">PIGGLE</h1>
            <PiggleGame />
            <HowToPlay />
            <div className='userInfo'>
              <UserProfile />
              {user ? (
                <button onClick={() => auth.signOut()}>Logout</button>
              ) : (
                <>
                  <Signup />
                  <Login />
                </>
              )}
            </div>
            <TopScore />
          </div>
        } />
      </Routes>
    </Router>

  );
}

export default App;

