import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";  // Import Firestore functions
import app from "./firebaseConfig";

const auth = getAuth(app);
const db = getFirestore(app);  // Get Firestore instance

// Sign up function
export const signUp = async (email, password, username) => {
    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create a new user document in Firestore with the user's UID
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            username: username,
            highscore: 0,  // Initial highscore (can be updated later)
        });

        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Login function
export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Logout function
export const logout = () => {
    return signOut(auth);
};

