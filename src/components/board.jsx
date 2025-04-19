"use client";

import { useEffect, useState } from "react";
import Tile from "@components/tile";

export default function Board({ matrix }) {
    const [hiddenMatrix, setHiddenMatrix] = useState([]);
    const [win, setWin] = useState(false);
    const [defeat, setDefeat] = useState(false);

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

    useEffect(() => {
        if (matrix && matrix.length > 0) {
            setHiddenMatrix(matrix.map((row) => row.map(() => true)));
        }
    }, [matrix]);

    const isInBounds = (row, col) =>
        row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length;

    const revealEmptyArea = (startRow, startCol) => {
        const queue = [[startRow, startCol]];
        const visited = new Set();
        const newHidden = hiddenMatrix.map((row) => [...row]);

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

            if (matrix[row][col] === "x") continue; // Nunca revela bomba aqui

            newHidden[row][col] = false;

            // Se for 0, adiciona vizinhos à fila
            if (matrix[row][col] === 0) {
                directions.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    const neighborKey = `${newRow},${newCol}`;

                    if (
                        isInBounds(newRow, newCol) &&
                        !visited.has(neighborKey)
                    ) {
                        queue.push([newRow, newCol]);
                    }
                });
            }
        }

        setHiddenMatrix(newHidden);
    };

    const handleClick = (row, col) => {
        if (
            !isInBounds(row, col) ||
            !hiddenMatrix[row][col] ||
            hiddenMatrix[row][col] === "flag" ||
            defeat ||
            win
        )
            return;

        const value = matrix[row][col];

        if (value === "x") {
            const newHidden = matrix.map((row, i) =>
                row.map((cell, j) =>
                    cell === "x" ? false : hiddenMatrix[i][j]
                )
            );
            setHiddenMatrix(newHidden);
            setDefeat(true);
            return;
        }

        if (value === 0) {
            revealEmptyArea(row, col);
            return;
        }

        const newHidden = hiddenMatrix.map((r) => [...r]);
        newHidden[row][col] = false;
        setHiddenMatrix(newHidden);
    };

    const handleRightClick = (event, row, col) => {
        event.preventDefault();
        if (!isInBounds(row, col) || !hiddenMatrix[row][col] || defeat || win)
            return;

        const newHidden = hiddenMatrix.map((r) => [...r]);

        if (newHidden[row][col] === "flag") {
            newHidden[row][col] = true;
            setHiddenMatrix(newHidden);
            return;
        }

        newHidden[row][col] = "flag";
        setHiddenMatrix(newHidden);
    };

    if (!matrix || matrix.length === 0 || hiddenMatrix.length === 0) {
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
                            flag={hiddenMatrix[i][j] === "flag"}
                            onClick={() => handleClick(i, j)}
                            onRightClick={(event) => {
                                handleRightClick(event, i, j);
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
