import { useState } from "react";
import * as adventureLevels from "../levels/AdventureLevels.js";

export function useAdventureMode(
    pegs,
    ballRef,
    MAX_SHOTS,
    setShotsLeft,
    setCurrentScore,
    setGameMessage,
    setIsGameDone,
    currentScore,
    shotsLeft
) {
    const [isAdventureMode, setIsAdventureMode] = useState(0);
    const [currentAdventureModeLevel, setCurrentAdventureModeLevel] = useState(1);

    const startAdventureMode = () => {
        // Reset ball
        ballRef.current = { x: 200, y: 50, dx: 0, dy: 0, radius: 10, launched: false };
        setIsGameDone(0);
        setIsAdventureMode(1);
        setCurrentAdventureModeLevel(1);
        setShotsLeft(MAX_SHOTS);
        setCurrentScore(0);
        setGameMessage("");
        pegs.current = adventureLevels.LevelOne();
    };

    const changeAdventureModeLevel = () => {
        ballRef.current = { x: 200, y: 50, dx: 0, dy: 0, radius: 10, launched: false };
        if (currentAdventureModeLevel < 5) {
            let newPegLayout;
            switch (currentAdventureModeLevel + 1) {
                case 2: newPegLayout = adventureLevels.LevelTwo(); break;
                case 3: newPegLayout = adventureLevels.LevelThree(); break;
                case 4: newPegLayout = adventureLevels.LevelFour(); break;
                case 5: newPegLayout = adventureLevels.LevelFive(); break;
                default: newPegLayout = adventureLevels.LevelOne();
            }
            pegs.current = newPegLayout;
            setShotsLeft(MAX_SHOTS);
            setGameMessage("");
            setCurrentAdventureModeLevel(prev => prev + 1);
        } else {
            setGameMessage("You Win! Score: " + (currentScore + (shotsLeft * 500)));
            setIsAdventureMode(0);
            setIsGameDone(1);
        }
    };

    return {
        isAdventureMode,
        setIsAdventureMode,
        currentAdventureModeLevel,
        setCurrentAdventureModeLevel,
        startAdventureMode,
        changeAdventureModeLevel
    };
}