import React, { useState } from "react";
import "../styles/HowToPlay.css"; 

const HowToPlay = () => {
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
                        <p>Blue pegs score 100 points, while red pegs score 500 points.</p>
                        <p>The more pegs you hit with a single ball, the more score you'll get.</p>
                        <p>Try to get the highest score possible!</p>
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
