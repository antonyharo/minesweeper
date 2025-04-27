"use client";

import { useEffect, useState, useRef } from "react";
import Tile from "@/components/tile";

const DIRECTIONS = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];

const deepCopyMatrix = (matrix) => matrix.map((row) => [...row]);
const matricesEqual = (a, b) =>
    a.length === b.length &&
    a.every((row, i) => row.every((cell, j) => cell === b[i][j]));

const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
        2,
        "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    const milliseconds = String(ms % 1000).padStart(3, "0");

    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
};

export default function Board({
    matrix,
    loading,
    win,
    setWin,
    defeat,
    setDefeat,
}) {
    const [hiddenMatrix, setHiddenMatrix] = useState([]);
    const [timerMs, setTimerMs] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (matrix && matrix.length > 0) {
            setHiddenMatrix(matrix.map((row) => row.map(() => true)));
            setTimerMs(0);
            setGameStarted(false);

            if (process.env.NODE_ENV === "development") {
                console.table(matrix);
            }
        }
    }, [matrix]);

    useEffect(() => {
        const shouldRunTimer =
            gameStarted && !loading && !win && !defeat && matrix.length > 0;

        if (shouldRunTimer) {
            if (intervalRef.current === null) {
                intervalRef.current = setInterval(() => {
                    setTimerMs((prev) => prev + 50); // Atualiza a cada 50ms
                }, 50);
            }
        } else {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
    }, [gameStarted, loading, win, defeat, matrix.length]);

    useEffect(() => {
        if (!matrix || hiddenMatrix.length === 0 || loading) return;

        const totalCells = matrix.length * matrix[0].length;
        const bombCount = matrix.flat().filter((cell) => cell === "x").length;
        const revealedCount = hiddenMatrix
            .flat()
            .filter((cell) => cell === false).length;

        if (revealedCount === totalCells - bombCount) {
            const revealed = matrix.map((row) => row.map(() => false));
            setHiddenMatrix(revealed);
            setWin(true);
        }
    }, [hiddenMatrix, loading, matrix, setWin]);

    const isInBounds = (row, col) =>
        row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length;

    const handleDefeat = () => {
        const revealed = matrix.map((row) => row.map(() => false));
        setHiddenMatrix(revealed);
        setDefeat(true);
    };

    const countAdjacentFlags = (row, col) =>
        DIRECTIONS.reduce((count, [dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            return isInBounds(newRow, newCol) &&
                hiddenMatrix[newRow][newCol] === "flag"
                ? count + 1
                : count;
        }, 0);

    const revealEmptyArea = (startRow, startCol, baseHidden) => {
        const queue = [[startRow, startCol]];
        const visited = new Set();
        const newHidden = deepCopyMatrix(baseHidden);

        while (queue.length > 0) {
            const [row, col] = queue.shift();
            const key = `${row},${col}`;

            if (
                !isInBounds(row, col) ||
                newHidden[row][col] === "flag" ||
                visited.has(key)
            )
                continue;

            visited.add(key);
            newHidden[row][col] = false;

            if (matrix[row][col] === 0) {
                DIRECTIONS.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    const newKey = `${newRow},${newCol}`;
                    if (isInBounds(newRow, newCol) && !visited.has(newKey)) {
                        queue.push([newRow, newCol]);
                    }
                });
            }
        }

        return newHidden;
    };

    const clickAdjacentCells = (row, col) => {
        let newHidden = deepCopyMatrix(hiddenMatrix);

        for (const [dr, dc] of DIRECTIONS) {
            const newRow = row + dr;
            const newCol = col + dc;

            if (
                !isInBounds(newRow, newCol) ||
                newHidden[newRow][newCol] !== true
            )
                continue;

            if (matrix[newRow][newCol] === "x") {
                handleDefeat();
                return;
            }

            if (matrix[newRow][newCol] === 0) {
                newHidden = revealEmptyArea(newRow, newCol, newHidden);
            } else {
                newHidden[newRow][newCol] = false;
            }
        }

        if (!matricesEqual(hiddenMatrix, newHidden)) {
            setHiddenMatrix(newHidden);
        }
    };

    const handleNumberClick = (row, col) => {
        const flags = countAdjacentFlags(row, col);
        if (matrix[row][col] === flags) {
            clickAdjacentCells(row, col);
        }
    };

    const handleClick = (row, col) => {
        if (
            !isInBounds(row, col) ||
            hiddenMatrix[row][col] === "flag" ||
            defeat ||
            win
        )
            return;

        if (!gameStarted) {
            setGameStarted(true);
        }

        if (hiddenMatrix[row][col] === false) {
            if (matrix[row][col] > 0) handleNumberClick(row, col);
            return;
        }

        if (matrix[row][col] === "x") {
            handleDefeat();
            return;
        }

        let newHidden = deepCopyMatrix(hiddenMatrix);

        if (matrix[row][col] === 0) {
            newHidden = revealEmptyArea(row, col, newHidden);
        } else {
            newHidden[row][col] = false;
        }

        if (!matricesEqual(hiddenMatrix, newHidden)) {
            setHiddenMatrix(newHidden);
        }
    };

    const handleRightClick = (e, row, col) => {
        e.preventDefault();
        if (
            !isInBounds(row, col) ||
            hiddenMatrix[row][col] === false ||
            defeat ||
            win
        )
            return;

        const newHidden = deepCopyMatrix(hiddenMatrix);
        newHidden[row][col] = newHidden[row][col] === "flag" ? true : "flag";

        if (!matricesEqual(hiddenMatrix, newHidden)) {
            setHiddenMatrix(newHidden);
        }
    };

    if (
        !matrix ||
        matrix.length === 0 ||
        hiddenMatrix.length === 0 ||
        loading
    ) {
        return (
            <div className="font-medium text-zinc-500">
                Carregando tabuleiro...
            </div>
        );
    }

    return (
        <div className="grid gap-2">
            <div className="text-center text-lg font-bold text-zinc-700">
                {formatTime(timerMs)}
            </div>

            {matrix.map((row, i) => (
                <div key={i} className="grid grid-cols-9 gap-2">
                    {row.map((cell, j) => (
                        <Tile
                            key={j}
                            value={cell}
                            hidden={hiddenMatrix[i][j]}
                            win={win}
                            flag={hiddenMatrix[i][j] === "flag"}
                            onClick={() => handleClick(i, j)}
                            onRightClick={(e) => handleRightClick(e, i, j)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
