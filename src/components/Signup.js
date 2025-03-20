import { useState } from "react";
import { signUp } from "../auth";

const Signup = () => {
    // States for email, username, and password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Pass the username, email, and password to the sign up
            await signUp(email, password, username);
            alert("Account successfully made");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign up to join the leaderboard!</h2>
            <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <br></br>
            <button id="loginSignUpButton" type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
