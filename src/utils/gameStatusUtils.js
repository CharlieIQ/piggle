/**
 * Checks the current game status (win/loss) based on mode, pegs hit, and shots remaining.
 *
 * @param {Object} params - Game state and control functions.
 * @param {boolean} params.isAdventureMode - Whether the game is in adventure mode.
 * @param {Object|Array} params.pegs - Ref object or array containing all peg states.
 * @param {number} params.shotsLeft - Number of shots remaining.
 * @param {number} params.currentScore - Current player score.
 * @param {function} params.setGameMessage - Function to display game outcome messages.
 * @param {function} params.setIsGameDone - Function to mark the game as finished.
 * @param {function} params.setCurrentAdventureModeLevel - Updates the current adventure level.
 * @param {function} params.saveHighScore - Persists the current score if it's a high score.
 * @param {function} params.changeAdventureModeLevel - Advances to the next adventure level.
 */
export function checkGameStatus({
    isAdventureMode,
    pegs,
    shotsLeft,
    currentScore,
    setGameMessage,
    setIsGameDone,
    setCurrentAdventureModeLevel,
    saveHighScore,
    changeAdventureModeLevel
}) {
    // Handle both ref structure and array structure
    const pegArray = pegs.current || pegs;
    
    if (!pegArray || pegArray.length === 0) {
        return;
    }

    // Check for red pegs
    const redPegs = pegArray.filter(peg => peg.type === "red" || peg.color === "red");
    const hasRedPegs = redPegs.length > 0;

    if (!isAdventureMode) {
        // Non-adventure mode: win based on red peg logic
        if (hasRedPegs) {
            // If there are red pegs, win by hitting all red pegs
            if (redPegs.every(peg => peg.hit)) {
                setGameMessage("You Win! Score: " + (currentScore + (shotsLeft * 500)));
                setIsGameDone(1);
            }
        } else {
            // If all pegs are blue, win by hitting all pegs
            if (pegArray.every(peg => peg.hit)) {
                setGameMessage("You Win! Score: " + (currentScore + (shotsLeft * 500)));
                setIsGameDone(1);
            }
        }
        
        // Lose if no shots remain
        if (shotsLeft <= 0) {
            setGameMessage("You Lose!");
            setIsGameDone(1);
        }
    } else {
        // Adventure mode: win only if all red pegs are hit
        if (redPegs.length > 0 && redPegs.every(peg => peg.hit)) {
            // persist score
            saveHighScore(currentScore); 
            // move to next stage (this will handle level progression)
            changeAdventureModeLevel(); 
        }
        // Lose if out of shots; reset to level 1
        else if (shotsLeft <= 0) {
            setGameMessage("You Lose!");
            setIsGameDone(1);
            // reset adventure progress
            setCurrentAdventureModeLevel(1); 
        }
    }
}
