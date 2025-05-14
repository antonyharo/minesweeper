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

export const createSafeMatrix = async (rows, cols, bombs, safeRow, safeCol) => {
    let matrix;
    let attempts = 0;

    do {
        matrix = createEmptyMatrix(rows, cols);
        addBombs(matrix, bombs);
        attempts++;
    } while (isUnsafe(matrix, safeRow, safeCol) && attempts < 10);

    return matrix;
};

const isUnsafe = (matrix, row, col) => {
    for (let [dr, dc] of directions) {
        const r = row + dr;
        const c = col + dc;
        if (isInBounds(matrix, r, c) && matrix[r][c] === "x") return true;
    }
    return matrix[row][col] === "x";
};

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

export const formatDateTime = (isoString) => {
    if (!isoString) return null;

    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return null; // Verifica se é uma data válida

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês é 0-based
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
        return null;
    }
};
