/**
 * Checks the current game status (win/loss) based on mode, pegs hit, and shots remaining.
 *
 * @param {Object} params - Game state and control functions.
 * @param {boolean} params.isAdventureMode - Whether the game is in adventure mode.
 * @param {Object} params.pegs - Ref object containing all peg states.
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
    if (!isAdventureMode) {
        // Classic mode: win if all pegs are hit
        if (pegs.current.every(peg => peg.hit)) {
            setGameMessage("You Win! Score: " + (currentScore + (shotsLeft * 500)));
            setIsGameDone(1);
        }
        // Lose if no shots remain
        else if (shotsLeft <= 0) {
            setGameMessage("You Lose!");
            setIsGameDone(1);
        }
    } else {
        // Adventure mode: win only if all red pegs are hit
        if (pegs.current.filter(peg => peg.type === "red").every(peg => peg.hit)) {
            setGameMessage("You Win! Score: " + (currentScore + (shotsLeft * 500)));
            // level up
            setCurrentAdventureModeLevel(prev => prev + 1); 
            // persist score
            saveHighScore(currentScore); 
            // move to next stage
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
