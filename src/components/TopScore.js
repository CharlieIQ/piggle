import { useState, useEffect } from "react";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

/**
 * This is the Top Scores component
 * It fetches the top 5 scores from the Firestore database
 * @returns {JSX.Element} - The Top Scores component
 */
const TopScores = () => {
    // States for top scores and loading
    const [topScores, setTopScores] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * Fetch the top scores
     * @returns {void}
     */
    useEffect(() => {
        const fetchTopScores = async () => {
            // Get the Firestore database
            const db = getFirestore();

            // Get the users collection
            const usersRef = collection(db, "users");
            const q = query(usersRef, orderBy("highscore", "desc"), limit(5));

            try {
                // Get the query snapshot
                const querySnapshot = await getDocs(q);
                // If the query snapshot is not empty, set the top scores
                if (!querySnapshot.empty) {
                    const scores = querySnapshot.docs.map(doc => ({
                        username: doc.data().username,
                        highscore: doc.data().highscore,
                    }));
                    setTopScores(scores);
                } else {
                    console.log("No users found.");
                }
            } catch (error) {
                console.error("Error fetching top scores:", error);
            }
            setLoading(false);
        };

        fetchTopScores();
    }, []);

    if (loading) return <div>Loading top scores...</div>;

    return (
        <div className="leaderboard">
            <h2>Adventure Mode Top 5 Scores</h2>
            {topScores.length > 0 ? (
                <ol>
                    {topScores.map((user, index) => (
                        <li key={index}>
                            <strong>{user.username}</strong>: {user.highscore}
                        </li>
                    ))}
                </ol>
            ) : (
                <p>Please log in to view top scores</p>
            )}
        </div>
    );
};

export default TopScores;
