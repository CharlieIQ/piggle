import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
// Styles
import "../styles/ManageLevelsPage.css";

/**
 * This is the Manage Levels page
 * @returns {JSX.Element} - The Manage Levels page
 */
export default function ManageLevelsPage() {
    // Firebase authentication and Firestore setup
    const auth = getAuth();
    const user = auth.currentUser;
    // State to hold levels and loading status
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * Fetches the user's levels from Firestore when the component mounts
     * and whenever the user changes.
     * @returns {void}
     */
    useEffect(() => {
        if (!user) return;

        const fetchUserLevels = async () => {
            const q = query(collection(db, "levels"), where("authorId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const userLevels = [];
            querySnapshot.forEach(doc => {
                userLevels.push({ id: doc.id, ...doc.data() });
            });
            setLevels(userLevels);
            setLoading(false);
        };

        fetchUserLevels();
    }, [user]);
    
    /**
     * This function handles the title change of a level.
     * It updates the state with the new title for the specified level.
     * @param {string} id - The ID of the level to update
     * @param {string} newTitle - The new title for the level
     */
    const handleTitleChange = (id, newTitle) => {
        setLevels(levels.map(level => (level.id === id ? { ...level, title: newTitle } : level)));
    };

    /**
     * This function saves the title of a level to Firestore.
     * @param {string} id - The ID of the level to update
     * @param {string} title - The new title for the level
     */
    const saveTitle = async (id, title) => {
        const levelRef = doc(db, "levels", id);
        await updateDoc(levelRef, { title });
    };

    /**
     * This function deleted a level from Firestore.
     * @param {string} id - The ID of the level to delete
     */
    const deleteLevel = async (id) => {
        // Confirm deletion with the user
        if (!window.confirm("Are you sure you want to delete this level?")) return;
        await deleteDoc(doc(db, "levels", id));
        setLevels(levels.filter(level => level.id !== id));
    };

    if (loading) return <p>Loading your levels...</p>;
    if (!user) return <p>Please log in to manage your levels.</p>;

    return (
        <div className="manage-levels-container">
            <h2>Manage Your Levels</h2>
            {levels.length === 0 && <p>You have no levels yet.</p>}
            {levels.map(level => (
                <div key={level.id} className="level-item">
                    <input
                        type="text"
                        value={level.title}
                        onChange={e => handleTitleChange(level.id, e.target.value)}
                        onBlur={() => saveTitle(level.id, level.title)}
                    />
                    <button onClick={() => deleteLevel(level.id)}>Delete</button>
                </div>
            ))}
        </div>

    );
}
