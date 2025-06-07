import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";
// Style import
import '../styles/LevelBrowser.css'

export default function LevelBrowserPage() {
    const [levels, setLevels] = useState([]);

    useEffect(() => {
        const fetchLevels = async () => {
            const q = query(collection(db, "levels"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const publicLevels = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(level => level.isPublic);
            setLevels(publicLevels);
        };
        fetchLevels();
    }, []);

    return (
        <div className="browse-levels-container">
            <h2>Browse Levels</h2>
            {levels.length === 0 && <p>Loading levels...</p>}
            {levels.map(level => (
                <div key={level.id} className="level-card">
                    <h3>{level.title}</h3>
                    <p>By: {level.authorId}</p>
                    <Link to={`/play/${level.id}`}>
                        <button>Play This Level</button>
                    </Link>
                </div>
            ))}
        </div>

    );
}
