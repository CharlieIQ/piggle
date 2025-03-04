let NUMBER_OF_PEGS = 20;
const PEG_RADIUS = 10;

/**
 * This method will generate level 1
 */
const LevelOne = () => {
    let redPegCount = 0;
    let bluePegCount = 0;
    
    const rows = 5;
    const cols = 7;
    const spacing = 50;
    const startX = 40;
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
            
            // Shift half of the rows
            let xOffset = 0; 
            if (row % 2 == 0){
                xOffset = 25;
            }

            pegs.push({
                x: startX + xOffset + (col * spacing),
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

    // Define center of the X
    const centerX = 200;
    const centerY = 300;
    
    // X dimensions
    const armLength = 150;
    const pegSpacing = 25;

    // Generate diagonal lines
    for (let i = -armLength; i <= armLength; i += pegSpacing) {
        let pegType = "blue";
        if (Math.random() < 0.3 && redPegCount < bluePegCount) {
            pegType = "red";
            redPegCount++;
        } else {
            bluePegCount++;
        }
        
        // First diagonal (TL to BR)
        pegs.push({ x: centerX + i, y: centerY + i, radius: PEG_RADIUS, hit: false, type: pegType });

        // Second diagonal (TR to BL)
        pegs.push({ x: centerX + i, y: centerY - i, radius: PEG_RADIUS, hit: false, type: pegType });
    }

    return pegs;
};


/**
 * This method will generate level 3
 * Smiley face :)
 */
const LevelThree = () => {
    let pegs = [];
    let redPegCount = 0;
    let bluePegCount = 0;

    // Define center of smiley face
    const centerX = 200;
    const centerY = 300;
    
    // Eye positions
    const eyeRadius = 30;
    const leftEyeX = centerX - 70;
    const rightEyeX = centerX + 70;
    const eyeY = centerY - 60;

    // Generate eye pegs
    const eyePegCount = 8;
    for (let i = 0; i < eyePegCount; i++) {
        let pegType = "blue";
        // Ensure red pegs don't exceed blue pegs
        if (Math.random() < 0.3 && redPegCount < bluePegCount) {
            pegType = "red";
            redPegCount++;
        } else {
            bluePegCount++;
        }
        // Push pegs
        let angle = (Math.PI * 2 * i) / eyePegCount;
        pegs.push({ x: leftEyeX + eyeRadius * Math.cos(angle), y: eyeY + eyeRadius * Math.sin(angle), radius: PEG_RADIUS, hit: false, type: pegType });
        pegs.push({ x: rightEyeX + eyeRadius * Math.cos(angle), y: eyeY + eyeRadius * Math.sin(angle), radius: PEG_RADIUS, hit: false, type: pegType });
    }

    // Generate mouth pegs
    const mouthRadius = 90;
    const mouthY = centerY + 30;
    const mouthPegCount = 9;
    for (let i = 0; i < mouthPegCount; i++) {
        let pegType = "blue";
        // Ensure red pegs don't exceed blue pegs
        if (Math.random() < 0.3 && redPegCount < bluePegCount) {
            pegType = "red";
            redPegCount++;
        } else {
            bluePegCount++;
        }
        // Push pegs
        let angle = Math.PI * (0.2 + (i / mouthPegCount) * 0.6);
        pegs.push({ x: centerX + mouthRadius * Math.cos(angle), y: mouthY + mouthRadius * Math.sin(angle), radius: PEG_RADIUS, hit: false, type: pegType });
    }

    // Create outer face pegs
    const faceRadius = 150;
    const facePegCount = 20; 
    for (let i = 0; i < facePegCount; i++) {
        let pegType = "blue";
        // Ensure red pegs don't exceed blue pegs
        if (Math.random() < 0.3 && redPegCount < bluePegCount) {
            pegType = "red";
            redPegCount++;
        } else {
            bluePegCount++;
        }
        // Push pegs
        let angle = (Math.PI * 2 * i) / facePegCount;
        pegs.push({ x: centerX + faceRadius * Math.cos(angle), y: centerY + faceRadius * Math.sin(angle), radius: PEG_RADIUS, hit: false, type: pegType });
    }

    

    return pegs;
};


export { 
    LevelOne,
    LevelTwo,
    LevelThree
};