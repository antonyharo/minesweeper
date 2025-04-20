const directions = [
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
