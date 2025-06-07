import React, { useRef, useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// Styles
import "../styles/LevelEditor.css"

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;

export default function LevelEditorPage({ user }) {
    const canvasRef = useRef(null);
    const [pegs, setPegs] = useState([]);
    const [selectedColor, setSelectedColor] = useState("blue");
    const [title, setTitle] = useState("");

    // Redraw canvas whenever pegs change
    useEffect(() => {
        draw(pegs);
    }, [pegs]);

    const handleCanvasClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
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
            const newPeg = { x, y, radius: 10, color: selectedColor, hit: false };
            setPegs([...pegs, newPeg]);
        }
    };

    const draw = (pegList) => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        pegList.forEach(peg => {
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
            ctx.fillStyle = peg.color;
            ctx.fill();
            ctx.closePath();
        });
    };

    const clearPegs = () => {
        setPegs([]);
    };

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

    return (
        <div className="level-editor-container">
            <h2>Create a Level</h2>
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Level Title"
            />
            <select onChange={e => setSelectedColor(e.target.value)} value={selectedColor}>
                <option value="blue">Blue</option>
                <option value="red">Red</option>
            </select>
            <br />
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onClick={handleCanvasClick}
                className="border"
            />
            <br />
            <button onClick={saveLevel}>Save Level</button>
            <button onClick={clearPegs} style={{ marginLeft: "10px" }}>Clear Pegs</button>
        </div>
    );
}
