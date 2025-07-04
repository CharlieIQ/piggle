import { useRef } from "react";
import * as pegUtils from "../levels/RandomLevels.js";

export function usePegs() {
    const pegs = useRef([]);

    const generatePegs = () => {
        const pegGeneration = Math.floor(Math.random() * 5);
        let pegGenShape;
        switch (pegGeneration) {
            case 0: pegGenShape = pegUtils.generatePegsRandomly(); break;
            case 1: pegGenShape = pegUtils.generatePegsCircular(); break;
            case 2: pegGenShape = pegUtils.generatePegsHexagonal(); break;
            case 3: pegGenShape = pegUtils.generatePegsTriangular(); break;
            case 4: pegGenShape = pegUtils.generatePegsGrid(); break;
            default: pegGenShape = pegUtils.generatePegsRandomly();
        }
        pegs.current = pegGenShape;
    };

    return { pegs, generatePegs };
}