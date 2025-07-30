import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import GameEngine from "../components/GameEngine";
// Styles
import "../styles/LevelEditor.css"

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;

/**
 * This is the Level Editor page
 * @param {Object} user - The current user object
 * @returns {JSX.Element} - The Level Editor page
 */
export default function LevelEditorPage({ user }) {
    const canvasRef = useRef(null);
    const [pegs, setPegs] = useState([]);
    const [selectedColor, setSelectedColor] = useState("blue");
    const [title, setTitle] = useState("");
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    /**
     * Draw pegs on the canvas
     * This effect runs whenever pegs change or when entering/exiting preview mode.
     * @returns {void}
     */
    useEffect(() => {
        if (isPreviewMode) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        pegs.forEach(peg => {
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
            ctx.fillStyle = peg.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.closePath();
        });
    }, [pegs, isPreviewMode]);

    /**
     * This function handles canvas clicks to add or remove pegs.
     * If a peg is clicked, it will be removed; otherwise, a new peg will be added.
     */
    const handleCanvasClick = (e) => {
        // Don't add pegs in preview mode!
        if (isPreviewMode) return; 
        // Get the canvas position relative to the click
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if click hits any existing peg (to delete)
        const pegIndex = pegs.findIndex(peg => {
            const dx = peg.x - x;
            const dy = peg.y - y;
            return Math.sqrt(dx * dx + dy * dy) <= peg.radius;
        });

        if (pegIndex !== -1) {
            // Remove clicked peg
            const newPegs = [...pegs];
            newPegs.splice(pegIndex, 1);
            setPegs(newPegs);
        } else {
            // Add new peg
            const newPeg = { 
                x, 
                y, 
                radius: 10, 
                color: selectedColor, 
                hit: false 
            };
            setPegs([...pegs, newPeg]);
        }
    };

    const clearPegs = () => {
        setPegs([]);
    };

    /**
     * This function saves the current level to the database.
     * It requires a title and at least one peg to be present.
     * If successful, it resets the title and pegs.
     * @returns {Promise<void>}
     */
    const saveLevel = async () => {
        if (!title || pegs.length === 0) return alert("Add a title and at least one peg!");
        await addDoc(collection(db, "levels"), {
            title,
            authorId: user.uid,
            createdAt: serverTimestamp(),
            isPublic: true,
            pegs
        });
        alert("Level saved!");
        setTitle("");
        setPegs([]);
    };

    /**
     * Toggle preview mode
     * @returns {void}
     */
    const togglePreviewMode = () => {
        setIsPreviewMode(!isPreviewMode);
        if (isPreviewMode) {
            // Reset pegs when exiting preview mode
            setPegs(pegs.map(peg => ({ ...peg, hit: false })));
        }
    };

    return (
        <div className="level-editor-container">
            <h2>Create a Level</h2>
            
            <div style={{ marginBottom: "20px" }}>
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Level Title"
                    style={{ marginRight: "10px", padding: "8px" }}
                />
                <select 
                    onChange={e => setSelectedColor(e.target.value)} 
                    value={selectedColor}
                    style={{ marginRight: "10px", padding: "8px" }}
                >
                    <option value="blue">Blue</option>
                    <option value="red">Red</option>
                </select>
                <button 
                    onClick={togglePreviewMode}
                    style={{ 
                        marginRight: "10px", 
                        padding: "8px 16px",
                        backgroundColor: isPreviewMode ? "#ff6b6b" : "#4ecdc4",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    {isPreviewMode ? "Exit Preview" : "Preview Level"}
                </button>
            </div>

            {isPreviewMode ? (
                <div>
                    <p style={{ marginBottom: "10px", fontStyle: "italic" }}>
                        Preview Mode - Test your level! Click to play.
                    </p>
                    <GameEngine
                        pegs={pegs}
                        onPegsChange={setPegs}
                        isAdventureMode={false}
                        currentShotsFromParent={10}
                    />
                </div>
            ) : (
                <div>
                    <p style={{ marginBottom: "10px", fontStyle: "italic" }}>
                        Editor Mode - Click to add/remove pegs
                    </p>
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        onClick={handleCanvasClick}
                        className="border"
                        style={{ cursor: "crosshair" }}
                    />
                    <div style={{ marginTop: "10px" }}>
                        <button onClick={saveLevel} style={{ marginRight: "10px" }}>Save Level</button>
                        <button onClick={clearPegs}>Clear Pegs</button>
                    </div>
                </div>
            )}
        </div>
    );
}
