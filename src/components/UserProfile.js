import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [highscore, setHighscore] = useState(0);
    
    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore();

        // Listen for changes to the authentication state
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                const userRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUsername(userData.username);
                    setHighscore(userData.highscore);
                } else {
                    console.log("User document not found");
                }
            } else {
                console.log("No user signed in");
            }

        });

        return () => unsubscribe();
    }, []);

    return user ? (
        <div>
            <h2>Logged in as: {username}</h2>
            <h2>Current High Score: {highscore}</h2>
        </div>
    ) : (
        <div></div>
    );
};

export default UserProfile;
