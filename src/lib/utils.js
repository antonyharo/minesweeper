import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];

export const createMatrix = async (rows, cols, bombs) => {
    const matrix = createEmptyMatrix(rows, cols);
    addBombs(matrix, bombs);
    return matrix;
};

const createEmptyMatrix = (rows, cols) => {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
};

const addBombs = (matrix, bombs) => {
    const rows = matrix.length;
    const cols = matrix[0].length;

    let bombsPlaced = 0;
    while (bombsPlaced < bombs) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);

        if (matrix[row][col] !== "x") {
            matrix[row][col] = "x";
            updateAdjacentCells(matrix, row, col);
            bombsPlaced++;
        }
    }
};

const updateAdjacentCells = (matrix, row, col) => {
    const rows = matrix.length;
    const cols = matrix[0].length;

    for (const [dl, dc] of directions) {
        const newRow = row + dl;
        const newCol = col + dc;

        if (
            newRow >= 0 &&
            newRow < rows &&
            newCol >= 0 &&
            newCol < cols &&
            matrix[newRow][newCol] !== "x"
        ) {
            matrix[newRow][newCol] += 1;
        }
    }
};

export const isInBounds = (matrix, row, col) =>
    row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length;

export const deepCopyMatrix = (matrix) => matrix.map((row) => [...row]);

export const matricesEqual = (a, b) =>
    a.length === b.length &&
    a.every((row, i) => row.every((cell, j) => cell === b[i][j]));

export const formatTime = (ms) => {
    const hours = String(Math.floor(ms / 3600000)).padStart(2, "0");
    const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const milliseconds = String(ms % 1000).padStart(3, "0");

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};
