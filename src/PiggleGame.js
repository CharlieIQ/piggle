/**
 * Piggle is a game where you hit pegs with balls
 * 
 * @author Charlie McLaughlin
 */
import { useEffect, useRef, useState } from "react";
// Import cannon sprite
import PigCannon from "./GameImages/PigCannon.png";


/**
 * This function is the main game runner for the game
 * @returns The canvas that the game runs in
 */
export default function PiggleGame() {
    // Reference to canvas element
    const canvasRef = useRef(null);

    // Constants for game mechanics gravity and max shots
    const BALL_GRAVITY = 0.03;
    const MAX_SHOTS = 10;
    const NUMBER_OF_PEGS = 20;
    // Constant for game sprites
    const cannonImage = useRef(new Image());

    // Ball state variables
    const ballRef = useRef({
        x: 200, y: 50, dx: 0, dy: 0, radius: 10, launched: false
    });

    // State for cannon angle
    const [cannonAngle, setCannonAngle] = useState(0);
    // State for remaining shots
    const [shotsLeft, setShotsLeft] = useState(MAX_SHOTS);
    const [gameMessage, setGameMessage] = useState("");

    /**
     * This method will generate the pegs randomly
     * @returns The pegs generated in a random
     */
    const generatePegsRandomly = () => (
        Array.from({ length: NUMBER_OF_PEGS }, () => ({
            x: Math.random() * 380 + 10,
            y: Math.random() * 300 + 100,
            radius: 10,
            hit: false
        }))
    );

    /**
     * This method will generate the pegs in a square grid
     * @returns The pegs in a grid
     */
    const generatePegsGrid = () => {
        // Rows and column number
        const rows = 5;
        const cols = 5;
        // Peg spacing
        const spacing = 50;
        // Starting position for the top left peg
        const startX = 100;
        const startY = 170;

        // Generate the pegs
        let pegs = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                pegs.push({
                    x: startX + col * spacing,
                    y: startY + row * spacing,
                    radius: 10,
                    hit: false
                });
            }
        }
        return pegs;
    };

    /**
     * Generate pegs in a circular shape
     * @returns The pegs in a circle
     */
    const generatePegsCircular = () => {
        const centerX = 200;
        const centerY = 300;
        const radius = 100;
        const angleIncrement = (2 * Math.PI) / NUMBER_OF_PEGS;
        let pegs = [];

        for (let i = 0; i < NUMBER_OF_PEGS; i++) {
            const angle = angleIncrement * i;
            pegs.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
                radius: 10,
                hit: false
            });
        }
        return pegs;
    };

    const generatePegsHexagonal = () => {
        let pegs = [];
        const rows = 4;
        const cols = 4;
        const spacing = 60;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const offsetX = (row % 2 === 0) ? 0 : spacing / 2;
                pegs.push({
                    x: 100 + (col * spacing + offsetX),
                    y: 200 + (row * spacing * Math.sqrt(3) / 2),
                    radius: 10,
                    hit: false
                });
            }
        }
        return pegs;
    };

    /**
     * Generate the pegs in a triangular shape
     * @returns The pegs in a triangle shape
     */
    const generatePegsTriangular = () => {
        let pegs = [];
        const rows = 5;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col <= row; col++) {
                const x = 50 + col * 40;
                const y = 100 + row * 40;
                pegs.push({
                    x: x,
                    y: y,
                    radius: 10,
                    hit: false
                });
            }
        }
        return pegs;
    };

    // Peg generation logic inside useEffect
    const pegs = useRef([]);

    useEffect(() => {
        // Randomize the pegs every time
        const pegGeneration = Math.floor(Math.random() * 5);  // Correct random generation

        let pegGenShape;
        switch (pegGeneration) {
            case 0:
                pegGenShape = generatePegsRandomly();
                break;
            case 1:
                pegGenShape = generatePegsCircular();
                break;
            case 2:
                pegGenShape = generatePegsHexagonal();
                break;
            case 3:
                pegGenShape = generatePegsTriangular();
                break;
            case 4:
                pegGenShape = generatePegsGrid();
                break;
            default:
                pegGenShape = generatePegsRandomly();
        }

        pegs.current = pegGenShape;  // Set pegs after generation
    }, []);

    // Game loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;
        cannonImage.current.src = PigCannon;

        /**
         * Method to generate the cannon
         */
        const drawCannon = () => {
            ctx.save();
            // Move pivot point to the cannon's base
            ctx.translate(200, 50);
            ctx.rotate(cannonAngle);
            // Adjust size & position
            ctx.drawImage(cannonImage.current, -15, -30, 30, 60);
            ctx.restore();
        };

        /** 
         * Method to generate current ball
         */
        const drawBall = () => {
            ctx.beginPath();
            ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2);
            ctx.fillStyle = "purple";
            ctx.fill();
            ctx.closePath();
        };

        /**
         * Method to generate the pegs
         */
        const drawPegs = () => {
            if (pegs.current.length > 0) {
                pegs.current.forEach(peg => {
                    if (!peg.hit) {
                        ctx.beginPath();
                        ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
                        ctx.fillStyle = "blue";
                        ctx.fill();
                        ctx.closePath();
                    }
                });
            }
        };

        /**
         * Logic to handle game collisions
         */
        const handleCollisions = () => {
            // Checks peg if it was hit
            pegs.current.forEach(peg => {
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
                }
            });
        };

        /**
         * Update the ball position
         */
        const updateBall = () => {
            let ball = ballRef.current;
            if (ball.launched) {
                ball.dy += BALL_GRAVITY;
                ball.x += ball.dx;
                ball.y += ball.dy;

                if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width || ball.y + ball.radius <= 0) {
                    ball.dx *= -1;
                }

                if (ball.y + ball.radius > canvas.height) {
                    ball.launched = false;
                    ball.x = 200;
                    ball.y = 50;
                    ball.dx = 0;
                    ball.dy = 0;
                    checkGameStatus();
                }
                handleCollisions();
            }
        };

        /**
         * Check if game is won
         */
        const checkGameStatus = () => {
            if (pegs.current.every(peg => peg.hit)) {
                setGameMessage("You Win!");
            } else if (shotsLeft <= 0) {
                setGameMessage("You Lose!");
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
    }, [cannonAngle, shotsLeft]);

    const launchBall = () => {
        // Ball will not launch is over or if there's no shots left
        if (!ballRef.current.launched && shotsLeft > 0 && gameMessage === "") {
            ballRef.current.dx = Math.cos(cannonAngle) * 3;
            ballRef.current.dy = Math.sin(cannonAngle) * 2;
            ballRef.current.launched = true;
            // Update shot count
            setShotsLeft(shotsLeft - 1);
        }
    };
    /**
     * Method that will move the cannon with the mouse position
     * @param {*} event 
     */
    const handleMouseMove = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        setCannonAngle(Math.atan2(mouseY - 50, mouseX - 200));
    };

    return (
        <div style={{ textAlign: "center" }}>
            <p>Shots Left: {shotsLeft}</p>
            {gameMessage && <h2>{gameMessage}</h2>}
            <canvas
                ref={canvasRef}
                width={400}
                height={500}
                className="border"
                onClick={launchBall}
                onMouseMove={handleMouseMove}
            />
        </div>
    );
}
