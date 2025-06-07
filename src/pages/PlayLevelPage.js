import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
// Sprites
import PigCannon from '../GameImages/PigCannon.png';
import piggleBall from '../GameImages/piggleBall.png';

// Constants
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const BALL_GRAVITY = 0.025;
const MAX_SHOTS = 10;

export default function PlayLevelPage() {
    const { levelId } = useParams();

    const canvasRef = useRef(null);

    // Pegs stored in a ref so we can mutate peg.hit without losing state
    const pegsRef = useRef([]);

    // Track when images are loaded
    const [imagesLoaded, setImagesLoaded] = useState(false);
    // Load images once on mount
    useEffect(() => {
        let loadedCount = 0;
        const onLoad = () => {
            loadedCount++;
            if (loadedCount === 2) setImagesLoaded(true);
        };

        cannonImage.current.src = PigCannon;
        piggleImage.current.src = piggleBall;

        cannonImage.current.onload = onLoad;
        piggleImage.current.onload = onLoad;

        // Optional: handle image loading errors here
    }, []);

    const cannonImage = useRef(new Image());
    const piggleImage = useRef(new Image());

    // Ball state stored in ref to avoid re-renders
    const ballRef = useRef({
        x: 200,
        y: 50,
        dx: 0,
        dy: 0,
        radius: 9,
        launched: false,
    });

    // Cannon angle state for rotation
    const [cannonAngle, setCannonAngle] = useState(0);
    const [shotsLeft, setShotsLeft] = useState(MAX_SHOTS);
    const [loading, setLoading] = useState(true);
    const [gameMessage] = useState("");

    // Load pegs from Firestore on mount or levelId change
    useEffect(() => {
        const fetchLevel = async () => {
            setLoading(true);
            const docRef = doc(db, "levels", levelId);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                const data = snap.data();
                pegsRef.current = data.pegs.map(p => ({ ...p, hit: false }));
            } else {
                alert("Level not found!");
                pegsRef.current = [];
            }
            setLoading(false);
        };
        fetchLevel();
    }, [levelId]);

    // Draw everything each animation frame
    // Main animation loop and drawing
    useEffect(() => {
        if (loading || !imagesLoaded) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const drawCannon = () => {
            ctx.save();
            ctx.translate(200, 50);
            ctx.rotate(cannonAngle - Math.PI / 2);
            const cannonWidth = 80;
            const cannonHeight = 80;
            ctx.drawImage(
                cannonImage.current,
                -cannonWidth / 2,
                -cannonHeight / 3,
                cannonWidth,
                cannonHeight
            );
            ctx.restore();
        };

        const drawBall = () => {
            if (!ballRef.current.launched) return;
            const b = ballRef.current;
            const ballSize = 2.5;
            ctx.drawImage(
                piggleImage.current,
                b.x - b.radius,
                b.y - b.radius,
                b.radius * ballSize,
                b.radius * ballSize
            );
        };

        const drawPegs = () => {
            pegsRef.current.forEach(peg => {
                if (!peg.hit) {
                    ctx.beginPath();
                    ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
                    ctx.fillStyle = peg.color || (peg.type === "red" ? "red" : "blue");
                    ctx.fill();
                    ctx.lineWidth = 1.5;
                    ctx.strokeStyle = "black";
                    ctx.stroke();
                    ctx.closePath();
                }
            });
        };

        const handleCollisions = () => {
            pegsRef.current.forEach(peg => {
                if (peg.hit) return;
                const dx = ballRef.current.x - peg.x;
                const dy = ballRef.current.y - peg.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < ballRef.current.radius + peg.radius) {
                    const normalX = dx / dist;
                    const normalY = dy / dist;
                    const dotProduct = ballRef.current.dx * normalX + ballRef.current.dy * normalY;
                    ballRef.current.dx -= 2 * dotProduct * normalX;
                    ballRef.current.dy -= 2 * dotProduct * normalY;
                    peg.hit = true;
                }
            });
        };

        const updateBall = () => {
            if (!ballRef.current.launched) return;
            ballRef.current.dy += BALL_GRAVITY;
            ballRef.current.x += ballRef.current.dx;
            ballRef.current.y += ballRef.current.dy;

            // Bounce off walls
            if (
                ballRef.current.x - ballRef.current.radius < 0 ||
                ballRef.current.x + ballRef.current.radius > CANVAS_WIDTH
            ) {
                ballRef.current.dx *= -1;
            }
            if (ballRef.current.y + ballRef.current.radius < 0) {
                ballRef.current.dy *= -1;
            }

            // Out of bounds bottom
            if (ballRef.current.y - ballRef.current.radius > CANVAS_HEIGHT) {
                ballRef.current.launched = false;
                ballRef.current.x = 200;
                ballRef.current.y = 50;
                ballRef.current.dx = 0;
                ballRef.current.dy = 0;
                setShotsLeft(s => s - 1);
            }

            handleCollisions();
        };

        let animationFrameId;
        const render = () => {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            drawPegs();
            drawCannon();
            drawBall();
            updateBall();
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [loading, imagesLoaded, cannonAngle, ballRef, setShotsLeft]);

    // Basic mouse move handler to rotate cannon
    useEffect(() => {
        const handleMouseMove = e => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const dx = mouseX - 200; // cannon base x
            const dy = mouseY - 50;  // cannon base y
            const angle = Math.atan2(dy, dx);
            setCannonAngle(angle);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Fire ball on click
    const handleCanvasClick = () => {
        if (ballRef.current.launched || shotsLeft <= 0) return;
        // Launch ball in cannon direction with fixed speed
        const speed = 5;
        ballRef.current.launched = true;
        ballRef.current.dx = speed * Math.cos(cannonAngle);
        ballRef.current.dy = speed * Math.sin(cannonAngle);
    };

    if (loading) return <p>Loading level...</p>;

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Play Level</h2>
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={{ border: "1px solid black" }}
                onClick={handleCanvasClick}
            />
            <p>Shots left: {shotsLeft}</p>
            {shotsLeft <= 0 && <p>Game over! No more shots.</p>}
            <p>{gameMessage}</p>
        </div>
    );
}
