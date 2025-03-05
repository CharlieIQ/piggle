import './styles/App.css';
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import PiggleGame from "./PiggleGame";
// Import components
import HowToPlay from "./components/HowToPlay";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserProfile from './components/UserProfile';
import TopScore from './components/TopScore';

// Function for the game
function App() {
  const [user, setUser] = useState(null);
  
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <div className="App">
      <h1 id="mainGameHeader">PIGGLE</h1>
      <PiggleGame />
      <HowToPlay />
      <div className='userInfo'>
        <UserProfile />
        {user ? (
          <div>
            <button onClick={() => auth.signOut()}>Logout</button>
          </div>
        ) : (
          <>
            <Signup />
            <Login />
          </>
        )}
      </div>


      <TopScore />
    </div>
  );
}

export default App;

