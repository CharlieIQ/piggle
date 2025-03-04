const NUMBER_OF_PEGS = 20;
const PEG_RADIUS = 10;
/**
 * This method will generate the pegs randomly
 * @returns The pegs generated in a random
 */
const generatePegsRandomly = () => (
    Array.from({ length: NUMBER_OF_PEGS }, () => ({
        x: (Math.random() * 380) + 10,
        y: (Math.random() * 300) + 100,
        radius: PEG_RADIUS,
        hit: false
    }))
);

/**
 * This method will generate the pegs in a square grid
 * @returns The pegs in a grid
 */
const generatePegsGrid = () => {
    // Rows and column number
    const rows = 5;
    const cols = 5;
    // Peg spacing
    const spacing = 50;
    // Starting position for the top left peg
    const startX = 100;
    const startY = 170;

    // Generate the pegs
    let pegs = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            pegs.push({
                x: startX + col * spacing,
                y: startY + row * spacing,
                radius: PEG_RADIUS,
                hit: false
            });
        }
    }
    return pegs;
};

/**
 * Generate pegs in a circular shape
 * @returns The pegs in a circle
 */
const generatePegsCircular = () => {
    const centerX = 200;
    const centerY = 300;
    const radius = 100;
    const angleIncrement = (2 * Math.PI) / NUMBER_OF_PEGS;
    let pegs = [];

    for (let i = 0; i < NUMBER_OF_PEGS; i++) {
        const angle = angleIncrement * i;
        pegs.push({
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            radius: PEG_RADIUS,
            hit: false
        });
    }
    return pegs;
};

/**
 * Generate pegs in a hexagonal formation
 * @returns Pegs generated in a hexagon
 */
const generatePegsHexagonal = () => {
    let pegs = [];
    const rows = 5;
    const cols = 5;
    const spacing = 50;
    const startX = 100;
    const startY = 150;
    const verticalSpacing = spacing * Math.sqrt(3) / 2;

    for (let row = 0; row < rows; row++) {
        const rowOffset = (row % 2 === 0) ? 0 : spacing / 2;

        for (let col = 0; col < cols; col++) {
            pegs.push({
                x: startX + col * spacing + rowOffset, 
                y: startY + row * verticalSpacing, 
                radius: PEG_RADIUS,
                hit: false
            });
        }
    }

    return pegs;
};


/**
 * Generate the pegs in a triangular shape
 * @returns The pegs in a triangle shape
 */
const generatePegsTriangular = () => {
    // Array for pegs
    let pegs = [];
    const numRows = 5;
    // Start x for first row
    const xPos = 200;
    // Start y for first row
    const yPos = 220;
    // Peg spacing
    const pegSpacing = 40;

    for (let row = 0; row < numRows; row++) {
        // Center the row by adjusting the starting x position based on the row number
        const startX = xPos - (row * pegSpacing) / 2;

        for (let col = 0; col <= row; col++) {
            // Calculate the x and y positions for each peg in the current row
            const x = startX + col * pegSpacing;
            const y = yPos + row * pegSpacing;
            pegs.push({
                x: x,
                y: y,
                radius: PEG_RADIUS,
                hit: false
            });
        }
    }
    return pegs;
};


export { 
    generatePegsRandomly, 
    generatePegsGrid, 
    generatePegsCircular, 
    generatePegsHexagonal, 
    generatePegsTriangular 
};