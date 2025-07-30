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
        hit: false,
        type: Math.random() < 0.3 ? "red" : "blue"
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
                hit: false,
                type: Math.random() < 0.3 ? "red" : "blue"
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
            hit: false,
            type: Math.random() < 0.3 ? "red" : "blue"
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
                hit: false,
                type: Math.random() < 0.3 ? "red" : "blue"
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
    let pegs = [];
    const rows = 6;
    const spacing = 40;
    const startX = 200;
    const startY = 150;

    for (let row = 0; row < rows; row++) {
        const pegsInRow = row + 1;
        const rowWidth = pegsInRow * spacing;
        const rowStartX = startX - (rowWidth / 2) + (spacing / 2);

        for (let col = 0; col < pegsInRow; col++) {
            pegs.push({
                x: rowStartX + col * spacing,
                y: startY + row * spacing,
                radius: PEG_RADIUS,
                hit: false,
                type: Math.random() < 0.3 ? "red" : "blue"
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