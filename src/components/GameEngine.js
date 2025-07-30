import React, { useEffect, useRef, useState, useCallback } from "react";
import { checkGameStatus } from "../utils/gameStatusUtils";

// Import sprites
import PigCannon from "../GameImages/PigCannon.png";
import piggleBall from "../GameImages/piggleBall.png";
// Import game sounds
import pegHitSound from "../Sounds/pegHitSound.wav";

// Game constants
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const BALL_GRAVITY = 0.025;
const MAX_SHOTS = 10;

/**
 * This is the Game Engine component
 * @param {Object} pegs - The pegs object
 * @param {Function} onPegsChange - The function to call when the pegs change
 * @param {boolean} isAdventureMode - Whether the game is in adventure mode
 * @param {number} adventureModeLevel - The current adventure mode level
 * @param {Function} onAdventureModeLevelChange - The function to call when the adventure mode level changes
 * @param {Function} onGameStatusChange - The function to call when the game status changes
 * @param {Function} onScoreChange - The function to call when the score changes
 * @param {Function} onShotsChange - The function to call when the shots change
 * @param {Function} onGameMessageChange - The function to call when the game message changes
 * @param {Function} onGameDoneChange - The function to call when the game is done
 * @param {Function} saveHighScore - The function to call when the high score is saved
 * @param {Function} changeAdventureModeLevel - The function to call when the adventure mode level changes
 * @param {number} currentShotsFromParent - The current shots from the parent
 * @returns {JSX.Element} - The Game Engine component
 */
export default function GameEngine({ 
    pegs, 
    onPegsChange, 
    isAdventureMode = false, 
    adventureModeLevel = 1,
    onAdventureModeLevelChange,
    onGameStatusChange,
    onScoreChange,
    onShotsChange,
    onGameMessageChange,
    onGameDoneChange,
    saveHighScore,
    changeAdventureModeLevel,
    currentShotsFromParent
}) {
    const canvasRef = useRef(null);
    const cannonImage = useRef(new Image());
    const piggleImage = useRef(new Image());
    
    // Ball state
    const ballRef = useRef({
        x: 200, y: 50, dx: 0, dy: 0, radius: 9, launched: false
    });

    // Game states
    const [cannonAngle, setCannonAngle] = useState(0);
    const [shotsLeft, setShotsLeft] = useState(MAX_SHOTS);
    const [currentScore, setCurrentScore] = useState(0);
    const [pegsHitThisShot, setPegsHitThisShot] = useState(0);
    const [gameMessage, setGameMessage] = useState("");
    const [isGameDone, setIsGameDone] = useState(0);

    /**
     * Play the peg hit sound
     * @param {number} pitch - The pitch of the sound
     * @returns {void}
     */
    const playPegHitSound = (pitch) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createBufferSource();
        fetch(pegHitSound)
            .then(response => response.arrayBuffer())
            .then(data => audioContext.decodeAudioData(data))
            .then(buffer => {
                source.buffer = buffer;
                source.playbackRate.value = pitch;
                source.connect(audioContext.destination);
                source.start(0);
            });
    };

    /**
     * Update score when pegs are hit
     * @returns {void}
     */
    useEffect(() => {
        if (pegsHitThisShot > 0) {
            setCurrentScore(prevScore => prevScore + (pegsHitThisShot * 100));
            playPegHitSound(0.9 + (pegsHitThisShot * 0.1));
            setPegsHitThisShot(0);
        }
    }, [pegsHitThisShot]);

    /**
     * Propagate state changes to parent
     * @returns {void}
     */
    useEffect(() => {
        if (onScoreChange) onScoreChange(currentScore);
        if (onShotsChange) onShotsChange(shotsLeft);
        if (onGameMessageChange) onGameMessageChange(gameMessage);
        if (onGameDoneChange) onGameDoneChange(isGameDone);
    }, [currentScore, shotsLeft, gameMessage, isGameDone, onScoreChange, onShotsChange, onGameMessageChange, onGameDoneChange]);

    /**
     * Listen for shots changes from parent (for adventure mode level changes)
     * @returns {void}
     */
    useEffect(() => {
        if (currentShotsFromParent !== undefined && currentShotsFromParent !== shotsLeft) {
            setShotsLeft(currentShotsFromParent);
        }
    }, [currentShotsFromParent]);

    /**
     * Check game status - memoized to avoid dependency issues
     * @returns {void}
     */
    const handleCheckGameStatus = useCallback(() => {
        if (!pegs || pegs.length === 0) return;
        // Check game status
        const status = checkGameStatus({
            isAdventureMode,
            pegs: { current: pegs }, // Wrap pegs in ref-like structure for compatibility
            shotsLeft,
            currentScore,
            setGameMessage,
            setIsGameDone,
            setCurrentAdventureModeLevel: onAdventureModeLevelChange,
            saveHighScore,
            changeAdventureModeLevel: changeAdventureModeLevel || onAdventureModeLevelChange
        });
        
        if (onGameStatusChange) {
            onGameStatusChange(status);
        }
    }, [isAdventureMode, pegs, shotsLeft, currentScore, onAdventureModeLevelChange, saveHighScore, onGameStatusChange, changeAdventureModeLevel]);

    // Main game loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        // Load images
        cannonImage.current.src = PigCannon;
        piggleImage.current.src = piggleBall;

        const drawCannon = () => {
            ctx.save();
            ctx.translate(200, 50);
            ctx.rotate(cannonAngle - (Math.PI / 2));
            const cannonWidth = 80;
            const cannonHeight = 80;
            ctx.drawImage(cannonImage.current, -(cannonWidth / 2), -(cannonHeight / 3), cannonWidth, cannonHeight);
            ctx.restore();
        };

        const drawBall = () => {
            if (ballRef.current.launched) {
                const ballSize = 2.5;
                ctx.drawImage(
                    piggleImage.current,
                    ballRef.current.x - ballRef.current.radius,
                    ballRef.current.y - ballRef.current.radius,
                    ballRef.current.radius * ballSize,
                    ballRef.current.radius * ballSize
                );
            }
        };

        const drawPegs = () => {
            if (pegs && pegs.length > 0) {
                pegs.forEach(peg => {
                    if (!peg.hit) {
                        ctx.beginPath();
                        ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
                        
                        // Handle both color and type properties for compatibility
                        const pegColor = peg.color || (peg.type === "red" ? "red" : "blue");
                        ctx.fillStyle = pegColor;
                        ctx.fill();
                        
                        ctx.lineWidth = 1.5;
                        ctx.strokeStyle = "black";
                        ctx.stroke();
                        ctx.closePath();
                    }
                });
            }
        };

        /**
         * Handle collisions
         * @returns {void}
         */
        const handleCollisions = () => {
            if (!pegs || pegs.length === 0) return;
            
            let hitCount = 0;
            pegs.forEach(peg => {
                if (peg.hit) return;
                const dx = ballRef.current.x - peg.x;
                const dy = ballRef.current.y - peg.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < ballRef.current.radius + peg.radius) {
                    const normalX = dx / distance;
                    const normalY = dy / distance;
                    const dotProduct = ballRef.current.dx * normalX + ballRef.current.dy * normalY;
                    ballRef.current.dx -= 2 * dotProduct * normalX;
                    ballRef.current.dy -= 2 * dotProduct * normalY;
                    peg.hit = true;
                    hitCount++;
                }
            });

            if (hitCount > 0) {
                setPegsHitThisShot(prev => prev + hitCount);
                // Update pegs in parent component
                if (onPegsChange) {
                    onPegsChange([...pegs]);
                }
            }
        };

        /**
         * Update the ball
         * @returns {void}
         */
        const updateBall = () => {
            if (ballRef.current.launched) {
                ballRef.current.dy += BALL_GRAVITY;
                ballRef.current.x += ballRef.current.dx;
                ballRef.current.y += ballRef.current.dy;

                // Wall collisions
                if (ballRef.current.x - ballRef.current.radius < 0 || ballRef.current.x + ballRef.current.radius > canvas.width) {
                    ballRef.current.dx *= -1;
                }

                // Ceiling collision
                if (ballRef.current.y + ballRef.current.radius < 0) {
                    ballRef.current.dy *= -1;
                }

                // Out of bounds
                if (ballRef.current.y + ballRef.current.radius > canvas.height) {
                    ballRef.current.launched = false;
                    ballRef.current.x = 200;
                    ballRef.current.y = 50;
                    ballRef.current.dx = 0;
                    ballRef.current.dy = 0;
                    handleCheckGameStatus();
                }
                
                handleCollisions();
            }
        };

        /**
         * Animate the game
         * @returns {void}
         */
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawCannon();
            drawPegs();
            drawBall();
            updateBall();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, [cannonAngle, pegs, onPegsChange, handleCheckGameStatus]);

    /**
     * Launch the ball
     * @returns {void}
     */
    const launchBall = () => {
        if (!ballRef.current.launched && shotsLeft > 0 && gameMessage === "") {
            ballRef.current.dx = Math.cos(cannonAngle) * 3;
            ballRef.current.dy = Math.sin(cannonAngle) * 2;
            ballRef.current.launched = true;
            setPegsHitThisShot(0);
            setShotsLeft(shotsLeft - 1);
        }
    };

    const handleMouseMove = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        setCannonAngle(Math.atan2(mouseY - 50, mouseX - 200));
    };

    const resetGame = () => {
        ballRef.current = {
            x: 200, y: 50, dx: 0, dy: 0, radius: 9, launched: false
        };
        setShotsLeft(MAX_SHOTS);
        setCurrentScore(0);
        setGameMessage("");
        setIsGameDone(0);
        setPegsHitThisShot(0);
    };

    // Don't render if pegs aren't loaded yet
    if (!pegs || pegs.length === 0) {
        return (
            <div style={{ textAlign: "center" }}>
                <p>Loading game...</p>
            </div>
        );
    }

    return (
        <div style={{ textAlign: "center" }}>
            {isAdventureMode && <h2 id="gameMessage">Adventure Mode Level {adventureModeLevel}</h2>}
            
            {isGameDone === 0 && <p id="shotsLeft">Shots Left: {shotsLeft}</p>}
            
            {gameMessage && <h2 id="gameMessage">{gameMessage}</h2>}
            
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border"
                onClick={launchBall}
                onMouseMove={handleMouseMove}
            />
            
            {isGameDone === 0 && <p id="score">{currentScore}</p>}
            
            <button 
                onClick={resetGame}
                style={{ marginTop: "10px", padding: "10px", fontSize: "16px" }}>
                Reset Game
            </button>
        </div>
    );
} 