/**
 * Piggle is a game where you hit pegs with balls
 * 
 * @author Charlie McLaughlin
 */
import { useEffect, useState, useCallback } from "react";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { usePegs } from "./hooks/usePegs";
import { useAdventureMode } from "./hooks/useAdventureMode";
import GameEngine from "./components/GameEngine";

/**
 * This function is the main game runner for the game
 * @returns The canvas that the game runs in
 */
export default function PiggleGame() {
    // Peg generation logic inside usePegs
    const { pegs, generatePegs } = usePegs();

    // Game state
    const [currentScore, setCurrentScore] = useState(0);
    // Shots left
    const [shotsLeft, setShotsLeft] = useState(10);
    // Game messages and status
    const [gameMessage, setGameMessage] = useState("");
    // Game done status
    const [isGameDone, setIsGameDone] = useState(0);
    // Force re-render when pegs change
    const [pegKey, setPegKey] = useState(0); 

    const {
        isAdventureMode,
        setIsAdventureMode,
        currentAdventureModeLevel,
        startAdventureMode,
        changeAdventureModeLevel
    } = useAdventureMode(
        pegs,
        10, // MAX_SHOTS
        setShotsLeft,
        setCurrentScore,
        setGameMessage,
        setIsGameDone,
        currentScore,
        shotsLeft
    );

    // Function to save the user's high score in adventure mode
    const saveHighScore = async (highScore) => {
        // Firebase setup
        if (!isAdventureMode) return; // Only save high score in adventure mode
        const auth = getAuth();
        const db = getFirestore();
        const user = auth.currentUser;

        if (user) {
            try {
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const currentHighScore = docSnap.data().highscore || 0;
                    if (highScore > currentHighScore) {
                        await updateDoc(userRef, {
                            highscore: highScore,
                        });
                    }
                } else {
                    await setDoc(userRef, {
                        highscore: highScore,
                    });
                }
            } catch (error) {
                console.error("Error saving high score:", error);
            }
        }
    };

    // Generate random pegs on mount
    useEffect(() => {
        generatePegs();
        setPegKey(prev => prev + 1); // Force initial render
    }, [generatePegs]); // Run when generatePegs is available

    // Reset game randomly when not in adventure mode
    const resetGameRandom = useCallback(() => {
        generatePegs();
        setPegKey(prev => prev + 1); // Force re-render
        setIsAdventureMode(0);
        setShotsLeft(10);
        setCurrentScore(0);
        setGameMessage("");
        setIsGameDone(0);
    }, [generatePegs, setIsAdventureMode]);

    // Handle adventure mode level progression
    const handleAdventureModeLevelChange = useCallback(() => {
        changeAdventureModeLevel();
    }, [changeAdventureModeLevel]);

    return (
        <div style={{ textAlign: "center" }}>
            <GameEngine
                key={pegKey}
                pegs={pegs.current}
                onPegsChange={(newPegs) => {
                    pegs.current = newPegs;
                }}
                isAdventureMode={isAdventureMode === 1}
                adventureModeLevel={currentAdventureModeLevel}
                onAdventureModeLevelChange={handleAdventureModeLevelChange}
                onScoreChange={setCurrentScore}
                onShotsChange={setShotsLeft}
                onGameMessageChange={setGameMessage}
                onGameDoneChange={setIsGameDone}
                saveHighScore={saveHighScore}
                changeAdventureModeLevel={changeAdventureModeLevel}
                currentShotsFromParent={shotsLeft}
            />

            <button 
                id="adventureModeButton"
                onClick={() => { startAdventureMode(); setCurrentScore(0); }}
                style={{ marginTop: "10px", padding: "10px", fontSize: "16px" }}>
                Start Adventure Mode!
            </button>

            <button 
                id="newGameButtonRandom"
                onClick={resetGameRandom}
                style={{ marginTop: "10px", padding: "10px", fontSize: "16px" }}>
                Start a random new game!
            </button>
        </div>
    );
}
