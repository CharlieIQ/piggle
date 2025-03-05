import { useState, useEffect } from "react";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const TopScores = () => {
    const [topScores, setTopScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopScores = async () => {
            const db = getFirestore();

            const usersRef = collection(db, "users");
            const q = query(usersRef, orderBy("highscore", "desc"), limit(5));

            try {
                const querySnapshot = await getDocs(q);
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

    if (loading) return <div>Loading...</div>;

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
