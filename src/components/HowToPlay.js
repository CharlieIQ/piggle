import React, { useState } from "react";
import "../styles/HowToPlay.css"; 

/**
 * This is the How to Play component
 * @returns {JSX.Element} - The How to Play component
 */
const HowToPlay = () => {
    // State to manage the visibility of the popup
    const [isOpen, setIsOpen] = useState(false); 

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)} 
            >
                How to Play
            </button>

            {isOpen && (
                <div className="overlay">
                    <div className="popup">
                        <h2>How to Play</h2>
                        <p>Aim with your mouse and click to shoot the ball.</p>
                        <p>Hit all of the red pegs to win!</p>
                        <p>Every peg hit scores 100 points</p>
                        <p>The more pegs you hit with a single ball, the more score you'll get.</p>
                        <p>Try to get the highest score possible!</p>
                        <p>Note: Recommended browser is Chrome.<br></br>
                         Other browsers may affect the refresh rate of the game</p>
                        <button onClick={() => setIsOpen(false)} className="close-btn">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default HowToPlay;
