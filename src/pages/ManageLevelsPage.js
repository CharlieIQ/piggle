import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
// Styles
import "../styles/ManageLevelsPage.css";

export default function ManageLevelsPage() {
    const auth = getAuth();
    const user = auth.currentUser;
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleTitleChange = (id, newTitle) => {
        setLevels(levels.map(level => (level.id === id ? { ...level, title: newTitle } : level)));
    };

    const saveTitle = async (id, title) => {
        const levelRef = doc(db, "levels", id);
        await updateDoc(levelRef, { title });
    };

    const deleteLevel = async (id) => {
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
