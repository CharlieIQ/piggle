import { useState } from "react";
import * as adventureLevels from "../levels/AdventureLevels.js";

/**
 * This is the useAdventureMode hook
 * @param {Object} pegs - The pegs object
 * @param {number} MAX_SHOTS - The maximum number of shots
 * @param {Function} setShotsLeft - The function to set the shots left
 * @param {Function} setCurrentScore - The function to set the current score
 * @param {Function} setGameMessage - The function to set the game message
 * @param {Function} setIsGameDone - The function to set the game done
 * @param {number} currentScore - The current score
 * @param {number} shotsLeft - The number of shots left
 * @returns {Object} - The useAdventureMode hook
 */
export function useAdventureMode(
    pegs,
    MAX_SHOTS,
    setShotsLeft,
    setCurrentScore,
    setGameMessage,
    setIsGameDone,
    currentScore,
    shotsLeft
) {
    // States for adventure mode
    const [isAdventureMode, setIsAdventureMode] = useState(0);
    const [currentAdventureModeLevel, setCurrentAdventureModeLevel] = useState(1);

    /**
     * Start the adventure mode
     * @returns {void}
     */
    const startAdventureMode = () => {
        // Reset adventure mode state
        pegs.current = [];
        setIsAdventureMode(1);
        setCurrentAdventureModeLevel(1);
        setShotsLeft(MAX_SHOTS);
        setCurrentScore(0);
        if (setGameMessage) setGameMessage("");
        if (setIsGameDone) setIsGameDone(0);
        // Set adventure level pegs
        pegs.current = adventureLevels.LevelOne();
    };

    /**
     * Change the adventure mode level
     * This function updates the current adventure mode level and sets the pegs for the next level.
     * If the current level is less than 5, it increments the level and updates the pegs.
     * If the current level is 5, it sets a win message and ends the adventure mode.
     * @returns {void}
     */
    const changeAdventureModeLevel = () => {
        //  Check if the game is in adventure mode
        setCurrentAdventureModeLevel(prevLevel => {
            // If the current level is less than 5, increment the level and set new pegs
            if (prevLevel < 5) {
                const nextLevel = prevLevel + 1;
                let newPegLayout;
                switch (nextLevel) {
                    case 2: newPegLayout = adventureLevels.LevelTwo(); break;
                    case 3: newPegLayout = adventureLevels.LevelThree(); break;
                    case 4: newPegLayout = adventureLevels.LevelFour(); break;
                    case 5: newPegLayout = adventureLevels.LevelFive(); break;
                    default: newPegLayout = adventureLevels.LevelOne();
                }
                pegs.current = newPegLayout;
                setShotsLeft(MAX_SHOTS);
                if (setGameMessage) setGameMessage("");
                return nextLevel;
            } else {
                // Final win message only after completing all 5 levels
                if (setGameMessage) setGameMessage("You Win! Score: " + (currentScore + (shotsLeft * 500)));
                setIsAdventureMode(0);
                if (setIsGameDone) setIsGameDone(1);
                return prevLevel;
            }
        });
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