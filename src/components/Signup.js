import { useState } from "react";
import { signUp } from "../auth";

/**
 * This is the Signup component
 * It allows users to create a new account by providing their email, username, and password.
 * It handles form submission and calls the signUp function from the auth module.
 * It also provides basic styling for the form and its elements. (gonna make this into its own css file later)
 * @returns {JSX.Element} - The Signup component
 */
const Signup = () => {
    // States for email, username, and password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); 

    /**
     * Handle the signup form submission
     * @param {Event} e - The form submission event
     * @returns {void}
     */
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
        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                    width: '100%',
                    padding: '12px',
                    margin: '8px 0',
                    border: '3px solid #8B4513',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 220, 81, 0.9)',
                    color: '#4A2200',
                    fontFamily: 'Luckiest Guy, cursive'
                }}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                    width: '100%',
                    padding: '12px',
                    margin: '8px 0',
                    border: '3px solid #8B4513',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 220, 81, 0.9)',
                    color: '#4A2200',
                    fontFamily: 'Luckiest Guy, cursive'
                }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                    width: '100%',
                    padding: '12px',
                    margin: '8px 0',
                    border: '3px solid #8B4513',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 220, 81, 0.9)',
                    color: '#4A2200',
                    fontFamily: 'Luckiest Guy, cursive'
                }}
            />
            <button 
                type="submit"
                style={{
                    width: '100%',
                    marginTop: '15px',
                    fontFamily: 'Luckiest Guy, cursive',
                    background: 'linear-gradient(180deg, #D2691E, #A0522D)',
                    color: '#FFF3CD',
                    border: '3px solid #8B4513',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    boxShadow: '4px 4px 0px #4A2200',
                    transition: 'all 0.2s ease-in-out'
                }}
                onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.background = 'linear-gradient(180deg, #A0522D, #8B4513)';
                    e.target.style.boxShadow = '6px 6px 0px #3A1A00';
                }}
                onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = 'linear-gradient(180deg, #D2691E, #A0522D)';
                    e.target.style.boxShadow = '4px 4px 0px #4A2200';
                }}
            >
                Sign Up
            </button>
        </form>
    );
};

export default Signup;
