"use client";

import { useEffect, useState } from "react";
import Tile from "@components/tile";

export default function Board({
    matrix,
    loading,
    win,
    setWin,
    defeat,
    setDefeat,
}) {
    const [hiddenMatrix, setHiddenMatrix] = useState([]);
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

    const isInBounds = (row, col) =>
        row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length;

    useEffect(() => {
        if (matrix && matrix.length > 0) {
            setHiddenMatrix(matrix.map((row) => row.map(() => true)));
        }
    }, [matrix]);

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

    const handleDefeat = () => {
        const revealed = matrix.map((row) => row.map(() => false));
        setHiddenMatrix(revealed);
        setDefeat(true);
    };

    const countAdjacentFlags = (row, col) =>
        directions.reduce((count, [dr, dc]) => {
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
        const newHidden = baseHidden.map((row) => [...row]);

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
                directions.forEach(([dr, dc]) => {
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
        let newHidden = hiddenMatrix.map((row) => [...row]);

        directions.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;

            if (
                !isInBounds(newRow, newCol) ||
                newHidden[newRow][newCol] !== true
            )
                return;

            if (matrix[newRow][newCol] === "x") {
                handleDefeat();
                return;
            }

            if (matrix[newRow][newCol] === 0) {
                newHidden = revealEmptyArea(newRow, newCol, newHidden);
            } else {
                newHidden[newRow][newCol] = false;
            }
        });

        setHiddenMatrix(newHidden);
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

        if (hiddenMatrix[row][col] === false) {
            if (matrix[row][col] > 0) handleNumberClick(row, col);
            return;
        }

        if (matrix[row][col] === "x") {
            handleDefeat();
            return;
        }

        let newHidden = hiddenMatrix.map((row) => [...row]);

        if (matrix[row][col] === 0) {
            newHidden = revealEmptyArea(row, col, newHidden);
        } else {
            newHidden[row][col] = false;
        }

        setHiddenMatrix(newHidden);
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

        const newHidden = hiddenMatrix.map((row) => [...row]);
        newHidden[row][col] = newHidden[row][col] === "flag" ? true : "flag";
        setHiddenMatrix(newHidden);
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
