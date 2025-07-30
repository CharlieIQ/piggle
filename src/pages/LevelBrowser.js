import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";
// Style import
import '../styles/LevelBrowser.css'

/**
 * LevelBrowserPage component displays a list of public levels
 * fetched from Firestore, allowing users to browse and play levels.
 * It shows a loading spinner while fetching data and handles empty states.
 * Users can navigate to create a new level if no levels are available.
 */
export default function LevelBrowserPage() {
    // State to hold levels and loading status
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    
    /**
     * Fetches public levels from Firestore on component mount.
     * It queries the "levels" collection, orders by creation date,
     * and filters for public levels. The results are stored in state.
     * Handles errors by simply just logging them to the console.
     */
    useEffect(() => {
        // Function to fetch levels from Firestore
        const fetchLevels = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "levels"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const publicLevels = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(level => level.isPublic);
                setLevels(publicLevels);
            } catch (error) {
                console.error("Error fetching levels:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLevels();
    }, []);

    // Render loading state or levels
    if (loading) {
        return (
            <div className="browse-levels-container">
                <h2>Browse Levels</h2>
                <div className="loading-spinner">Loading levels...</div>
            </div>
        );
    }

    return (
        <div className="browse-levels-container">
            <h2>Browse Levels</h2>
            {levels.length === 0 ? (
                <div className="no-levels">
                    <p>No levels available yet. Be the first to create one!</p>
                    <Link to="/create-level">
                        <button className="create-level-btn">Create Level</button>
                    </Link>
                </div>
            ) : (
                <div className="levels-grid">
                    {levels.map(level => (
                        <div key={level.id} className="level-card">
                            <div className="level-info">
                                <h3>{level.title}</h3>
                                <p className="level-stats">
                                    <span>Pegs: {level.pegs?.length || 0}</span>
                                    <span>Created: {level.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}</span>
                                </p>
                            </div>
                            <div className="level-actions">
                                <Link to={`/play/${level.id}`}>
                                    <button className="play-btn">Play Level</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
