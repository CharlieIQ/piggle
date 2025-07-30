import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import GameEngine from "../components/GameEngine";

/**
 * This is the PlayLevelPage component that allows users to play custom levels.
 * It fetches the level data from Firestore based on the levelId from the URL parameters,
 * @returns A page for playing a custom level in the game.
 */
export default function PlayLevelPage() {
    // Get the levelId from the URL parameters
    const { levelId } = useParams();
    // State to hold pegs, loading status, and level title
    const [pegs, setPegs] = useState([]);
    // State to manage loading state and level title
    const [loading, setLoading] = useState(true);
    // State to hold the title of the level
    const [levelTitle, setLevelTitle] = useState("");

    // Load pegs from Firestore on mount or levelId change
    useEffect(() => {
        const fetchLevel = async () => {
            setLoading(true);
            // Fetch the level data from Firestore
            if (!levelId) {
                alert("No level ID provided!");
                setLoading(false);
                return;
            }
            // Attempt to get the document from Firestore
            try {
                const docRef = doc(db, "levels", levelId);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data();
                    setPegs(data.pegs.map(p => ({ ...p, hit: false })));
                    setLevelTitle(data.title);
                } else {
                    alert("Level not found!");
                    setPegs([]);
                }
            } catch (error) {
                console.error("Error loading level:", error);
                alert("Error loading level!");
                setPegs([]);
            }
            setLoading(false);
        };
        // Call the fetchLevel function to load the level data
        fetchLevel();
    }, [levelId]);

    if (loading) return <p>Loading level...</p>;

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Playing: {levelTitle}</h2>
            <GameEngine
                pegs={pegs}
                onPegsChange={setPegs}
                isAdventureMode={false}
                currentShotsFromParent={10}
            />
        </div>
    );
}
