import './styles/App.css';

import PiggleGame from "./PiggleGame";
import HowToPlay from "./components/HowToPlay";


// Function for the game
function App() {
  return (
    <div className="App">
      <h1>PIGGLE</h1>
      <PiggleGame />
      <HowToPlay />
    </div>
  );
}

export default App;

