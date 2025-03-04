let NUMBER_OF_PEGS = 20;
const PEG_RADIUS = 10;

/**
 * This method will generate level 1
 */
const LevelOne = () => {
    let redPegCount = 0;
    let bluePegCount = 0;
    
    const rows = 5;
    const cols = 5;
    const spacing = 50;
    const startX = 100;
    const startY = 170;

    let pegs = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let pegType = "blue";

            // Ensure red pegs don't exceed blue pegs
            if (Math.random() < 0.3 && redPegCount < (bluePegCount / 2)) {
                pegType = "red";
                redPegCount++;
            }
            bluePegCount++; // Increment blue peg count regardless

            pegs.push({
                x: startX + col * spacing,
                y: startY + row * spacing,
                radius: typeof PEG_RADIUS !== "undefined" ? PEG_RADIUS : 10, // Default radius if undefined
                hit: false,
                type: pegType
            });
        }
    }

    return pegs;
};


/**
 * This method will generate level 2
 */
const LevelTwo = () => {
    let pegs = [];
    let redPegCount = 0;
    let bluePegCount = 0;
    const totalPegs = NUMBER_OF_PEGS;

    for (let i = 0; i < totalPegs; i++) {
        let pegType = "blue";

        // Ensure red pegs don't exceed blue pegs
        if (Math.random() < 0.3 && redPegCount < bluePegCount) {
            pegType = "red";
            redPegCount++;
        } else {
            bluePegCount++;
        }

        pegs.push({
            x: (Math.random() * 380) + 10,
            y: (Math.random() * 300) + 100,
            radius: PEG_RADIUS,
            hit: false,
            type: pegType
        });
    };

    return pegs;
}

/**
 * This method will generate level 3
 */
const LevelThree = () => {
    let pegs = [];
    let redPegCount = 0;
    let bluePegCount = 0;
    const totalPegs = NUMBER_OF_PEGS;

    for (let i = 0; i < totalPegs; i++) {
        let pegType = "blue";

        // Ensure red pegs don't exceed blue pegs
        if (Math.random() < 0.3 && redPegCount < bluePegCount) {
            pegType = "red";
            redPegCount++;
        } else {
            bluePegCount++;
        }

        pegs.push({
            x: (Math.random() * 380) + 10,
            y: (Math.random() * 300) + 100,
            radius: PEG_RADIUS,
            hit: false,
            type: pegType
        });
    };

    return pegs;
}


export { 
    LevelOne,
    LevelTwo,
    LevelThree
};