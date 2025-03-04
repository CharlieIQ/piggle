/**
 * Piggle is a game where you hit pegs with balls
 * 
 * @author Charlie McLaughlin
 */
import { useEffect, useRef, useState } from "react";

import * as pegUtils from "./PegUtils.js";
import * as adventureLevels from "./Levels.js";

// Import cannon sprite
import PigCannon from "./GameImages/PigCannon.png";
import piggleBall from "./GameImages/piggleBall.png";
// Import game sounds
import pegHitSound from "./Sounds/pegHitSound.wav";

/**
 * This function is the main game runner for the game
 * @returns The canvas that the game runs in
 */
export default function PiggleGame() {
    // Reference to canvas element
    const canvasRef = useRef(null);
    /* Canvas size constants */
    const CANVAS_HEIGHT = 500;
    const CANVAS_WIDTH = 400;

    /* Constants for game mechanics */
    const BALL_GRAVITY = 0.025;
    const MAX_SHOTS = 10;

    /* Constants for game sprites */
    const cannonImage = useRef(new Image());
    const piggleImage = useRef(new Image());

    // For audio
    // API call to handle peg sound     
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

    // Ball state variables
    const ballRef = useRef({
        x: 200, y: 50, dx: 0, dy: 0, radius: 9, launched: false
    });

    // State for cannon angle
    const [cannonAngle, setCannonAngle] = useState(0);
    // State for remaining shots
    const [shotsLeft, setShotsLeft] = useState(MAX_SHOTS);
    // Current score variable
    // (PROPOSED SCORE EQUATION) currentScore + (numberOfPegsHitThisShot * 100)
    const [currentScore, setCurrentScore] = useState(0);
    const [pegsHitThisShot, setPegsHitThisShot] = useState(0);
    // State for game win or lose
    const [gameMessage, setGameMessage] = useState("");
    // State for game finished (0 for no, 1 for yes)
    const [isGameDone, setIsGameDone] = useState(0);
    // State for if game is adventure mode (0 for no, 1 for yes)
    const [isAdventureMode, setIsAdventureMode] = useState(0)
    const [currentAdventureModeLevel, setCurrentAdventureModeLevel] = useState(1);

    // Peg generation logic inside useEffect
    const pegs = useRef([]);

    /**
    * This will update the score for every peg hit
    */
    useEffect(() => {
        if (pegsHitThisShot > 0) {
            // Correctly update score based on latest pegsHitThisShot
            setCurrentScore(prevScore => prevScore + (pegsHitThisShot * 100));
            // Play peg sounds
            playPegHitSound(0.9 + (pegsHitThisShot * 0.1));
            console.log(currentScore);
            console.log("pitch = " + (0.9 + (pegsHitThisShot * 0.1)));
            // Reset after score updates
            setPegsHitThisShot(prev => prev++);
        }
    }, [pegsHitThisShot]);


    useEffect(() => {
        // Randomize the pegs every time
        const pegGeneration = Math.floor(Math.random() * 5);  // Correct random generation

        let pegGenShape;
        // Generate the pegs based on the result of the random variable
        switch (pegGeneration) {
            case 0:
                pegGenShape = pegUtils.generatePegsRandomly();
                break;
            case 1:
                pegGenShape = pegUtils.generatePegsCircular();
                break;
            case 2:
                pegGenShape = pegUtils.generatePegsHexagonal();
                break;
            case 3:
                pegGenShape = pegUtils.generatePegsTriangular();
                break;
            case 4:
                pegGenShape = pegUtils.generatePegsGrid();
                break;
            default:
                pegGenShape = pegUtils.generatePegsRandomly();
        }
        // Set pegs after generation
        pegs.current = pegGenShape;
    }, []);

    // Game loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        // To load the images for sprites
        cannonImage.current.src = PigCannon;
        piggleImage.current.src = piggleBall;


        /**
         * Method to generate the cannon
         */
        const drawCannon = () => {
            ctx.save();
            // Move pivot point to the cannon base
            ctx.translate(200, 50);
            // Offset the cannon angle by pi/2 to align barrel with mouse position
            ctx.rotate(cannonAngle - (Math.PI / 2));
            // Cannon default size
            const cannonWidth = 80;
            const cannonHeight = 80;
            // Generate cannon with position and size
            ctx.drawImage(cannonImage.current, -(cannonWidth / 2), -(cannonHeight / 3), cannonWidth, cannonHeight);
            ctx.restore();
        };

        /**
        * Method to generate the current ball
        */
        const drawBall = () => {
            var ballSize = 2.5
            // Draw the pig sprite
            if (ballRef.current.launched) {
                ctx.drawImage(
                    // The image reference
                    piggleImage.current,
                    // x position of the ball
                    ballRef.current.x - ballRef.current.radius,
                    // y position of the ball
                    ballRef.current.y - ballRef.current.radius,
                    ballRef.current.radius * ballSize,
                    ballRef.current.radius * ballSize
                );
            }
        };

        /**
         * Method to generate the pegs
         */
        const drawPegs = () => {
            if (pegs.current.length > 0) {
                pegs.current.forEach(peg => {
                    if (!peg.hit) {
                        ctx.beginPath();
                        // Draw peg
                        ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);

                        // Fill color based on peg type
                        ctx.fillStyle = peg.type === "red" ? "red" : "blue";
                        ctx.fill();

                        // Draw peg border
                        ctx.lineWidth = 1.5;
                        ctx.strokeStyle = "black";
                        ctx.stroke();

                        ctx.closePath();
                    }
                });
            }
        };

        /**
         * Logic to handle peg collisions
         */
        const handleCollisions = () => {
            let hitCount = 0;
            // Checks each peg if it was hit
            pegs.current.forEach(peg => {
                // Ignore if peg is hit
                if (peg.hit) return;
                const dx = ballRef.current.x - peg.x;
                const dy = ballRef.current.y - peg.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                // Calculate if peg was hit
                if (distance < ballRef.current.radius + peg.radius) {
                    // Get the direction of the collision by dividing with the distance
                    const normalX = dx / distance;
                    const normalY = dy / distance;
                    // Get the ball speed value by taking the dot product
                    const dotProduct = ballRef.current.dx * normalX + ballRef.current.dy * normalY;
                    ballRef.current.dx -= 2 * dotProduct * normalX;
                    ballRef.current.dy -= 2 * dotProduct * normalY;
                    // Mark the peg as hit
                    peg.hit = true;
                    // Update hit count
                    hitCount++;
                }

            });

            setPegsHitThisShot(prev => prev + hitCount);
        };

        /**
         * Update the ball position
         */
        const updateBall = () => {
            let ball = ballRef.current;
            // For ball launch logic
            if (ball.launched) {
                ball.dy += BALL_GRAVITY;
                ball.x += ball.dx;
                ball.y += ball.dy;

                // For ball hitting walls (flip x speed)
                if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
                    ball.dx *= -1;
                }

                // For ball hitting ceiling (flip y speed)
                if (ball.y + ball.radius < 0) {
                    ball.dy *= -1;
                }

                // If ball goes out of bounds on the bottom of the screen
                if (ball.y + ball.radius > canvas.height) {
                    // Reset Ball position
                    ball.launched = false;
                    ball.x = 200;
                    ball.y = 50;
                    ball.dx = 0;
                    ball.dy = 0;
                    checkGameStatus();
                }
                // Handle Peg collisons
                handleCollisions();
            }
        };

        /**
         * Check if game is won
         */
        const checkGameStatus = () => {
            // For random mode
            if (!isAdventureMode) {
                if (pegs.current.every(peg => peg.hit)) {
                    // Add 500 points for every shot not used
                    setGameMessage("You Win! Score: " + (currentScore + (shotsLeft * 500)));
                    setIsGameDone(1);
                } else if (shotsLeft <= 0) {
                    setGameMessage("You Lose!");
                    setIsGameDone(1);
                }
            } else {
                if (pegs.current.every(peg => peg.hit)) {
                    // Add 500 points for every shot not used
                    setGameMessage("You Win! Score: " + (currentScore + (shotsLeft * 500)));
                    // Change the current adventure mode level
                    setCurrentAdventureModeLevel(prev => prev + 1);
                    changeAdventureModeLevel();
                } else if (shotsLeft <= 0) {
                    setGameMessage("You Lose!");
                    setIsGameDone(1);
                    setCurrentAdventureModeLevel(1);
                }
            }

        };


        /**
         * Draw all of the elements on the canvas
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
    }, [cannonAngle, shotsLeft, currentScore]);

    const launchBall = () => {
        // Ball will not launch is over or if there's no shots left
        if (!ballRef.current.launched && shotsLeft > 0 && gameMessage === "") {
            ballRef.current.dx = Math.cos(cannonAngle) * 3;
            ballRef.current.dy = Math.sin(cannonAngle) * 2;
            ballRef.current.launched = true;
            // Reset pegs hit
            setPegsHitThisShot(0);
            // Update shot count
            setShotsLeft(shotsLeft - 1);
        }
    };
    /**
     * Method that will move the cannon with the mouse position
     */
    const handleMouseMove = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        setCannonAngle(Math.atan2(mouseY - 50, mouseX - 200));
    };

    const resetgameRandom = () => {
        // Reset ball state
        ballRef.current = {
            x: 200, y: 50, dx: 0, dy: 0, radius: 10, launched: false
        };

        // Reset pegs
        const pegGeneration = Math.floor(Math.random() * 5);
        let pegGenShape;
        switch (pegGeneration) {
            case 0: pegGenShape = pegUtils.generatePegsRandomly(); break;
            case 1: pegGenShape = pegUtils.generatePegsCircular(); break;
            case 2: pegGenShape = pegUtils.generatePegsHexagonal(); break;
            case 3: pegGenShape = pegUtils.generatePegsTriangular(); break;
            case 4: pegGenShape = pegUtils.generatePegsGrid(); break;
            default: pegGenShape = pegUtils.generatePegsRandomly();
        }
        pegs.current = pegGenShape;
        // Reset game state
        setIsGameDone(0);
        setIsAdventureMode(0);
        setShotsLeft(MAX_SHOTS);
        setCurrentScore(0);
        setGameMessage("");
    };


    /**
     * Start the adventure mode
     */
    const startAdventureMode = () => {
        setIsGameDone(0);
        // Update adventure mode variables
        setIsAdventureMode(1);
        setCurrentAdventureModeLevel(1);
        // Reset everything
        setShotsLeft(MAX_SHOTS);
        setCurrentScore(0);
        setGameMessage("");

        // Start with level 1
        pegs.current = adventureLevels.LevelOne();
    }

    const changeAdventureModeLevel = () => {
        // Reset ball state
        ballRef.current = {
            x: 200, y: 50, dx: 0, dy: 0, radius: 10, launched: false
        };

        // Change peg layout based on the new level
        let newPegLayout;
        switch (currentAdventureModeLevel + 1) { 
            case 2: newPegLayout = adventureLevels.LevelTwo(); break;
            case 3: newPegLayout = adventureLevels.LevelThree(); break;
            default: newPegLayout = adventureLevels.LevelOne();
        }

        pegs.current = newPegLayout; // Directly update the pegs

        // Reset game state
        setShotsLeft(MAX_SHOTS);
        setGameMessage("");
    };


    /**
     * Return the canvas, game message, and the button to start a new game
     */
    return (
        <div style={{ textAlign: "center" }}>
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
            <button id="adventureModeButton" onClick={startAdventureMode} style={{ marginTop: "10px", padding: "10px", fontSize: "16px" }}>
                Start Adventure Mode!
            </button>
            <button id="newGameButtonRandom" onClick={resetgameRandom} style={{ marginTop: "10px", padding: "10px", fontSize: "16px" }}>
                Start a random new game!
            </button>
        </div>
    );
}
